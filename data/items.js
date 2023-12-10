import validation from "./validation.js";
import { items } from "../config/mongoCollections.js";
import { Binary, ObjectId } from "mongodb";
// import multer from "multer";
// import { GridFsStorage } from "multer-gridfs-storage";
// import { mongoConfig } from "../config/settings.js";

const itemsMethods = {
  async uploadItem(
    item, // Item Name
    price, // Item Price
    description, // Item Description
    picture, //Item Picture Array
    quantity, // Item Quantity
    location,
    deliveryMethod,
    condition,
    seller_id,
  ) {
    // check input type
    item = validation.checkString(item, "item");
    price = validation.checkNumber(price, "price");
    description = validation.checkString(description, "description");
    seller_id = validation.checkId(seller_id, "seller_id");
    // TODO Validate buffer when route pass in picture buffer
    // if (Array.isArray(picture)) {
    //   for (let image in picture) {
    //     picture[image] = validation.checkString(picture[image],'picture');
    //   }
    // }

    quantity = validation.checkNumber(quantity, "quantity");
    location = validation.checkString(location, "location");
    deliveryMethod = validation.checkString(deliveryMethod, "deliveryMethod");
    condition = validation.checkString(condition, "condition");

    // TODO: picture would be convert to binary but could not exceed 16 MB, if the file need to be
    // over 16MB, use https://www.mongodb.com/docs/manual/core/gridfs/
    // https://www.bezkoder.com/node-js-upload-store-images-mongodb/

    // convert picture to binary
    // for (let image in picture) {
    //   picture[image] = {
    //     id: new ObjectId(),
    //     image: new Binary(picture[image]),
    //   };
    // }

    // config item
    let newItem = {
      item: item,
      price: price,
      description: description,
      picture: picture,
      quantity: quantity,
      location: location,
      deliveryMethod: deliveryMethod,
      condition: condition,
      seller_id: seller_id,
      uploadTime: new Date(), // Add the current timestamp
    };

    // insert to database
    const itemsCollection = await items();
    const insertInfo = await itemsCollection.insertOne(newItem);
    if (!insertInfo) {
      throw `Fail to create new user`;
    } else {
      console.log(`Upload Success`);
      //return `Upload Success`;
      return insertInfo;
    }
  },

  async getAll() {
    const itemCollection = await items();
    let itemList = await itemCollection
      .find({ quantity: { $gt: 0 } })
      .toArray();
    if (!itemList) throw "Could not get all items";
    itemList = itemList.map((element) => {
      element._id = element._id.toString();
      element.picture = element.picture[0]; // only the first picture would be displayed
      return element;
    });
    return itemList;
  },

  async getById(id) {
    id = validation.checkId(id, "itemId");
    const itemCollection = await items();
    const item = await itemCollection.findOne({ _id: new ObjectId(id) });
    if (!item) {
      throw `Item with id ${id} not found`;
    }
    item._id = item._id.toString();
    return item;
  },

  async searchByDescription(description) {
    description = validation.checkString(description, "search entry");
    const itemCollection = await items();
    let itemList = await itemCollection
      .find({
        $or: [
          { description: { $regex: description, $options: "i" } },
          { item: { $regex: description, $options: "i" } },
        ],
      })
      .toArray();
    if (!itemList) throw "Could not get items";
    itemList = itemList.map((element) => {
      element._id = element._id.toString();
      element.picture = element.picture[0];
      return element;
    });
    return itemList;
  },
};

export default itemsMethods;
