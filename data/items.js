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
  ) {
    // check input type
    item = validation.checkString(item, "item");
    price = validation.checkNumber(price, "price");
    description = validation.checkString(description, "description");

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
    };

    // insert to database
    const itemsCollection = await items();
    const insertInfo = await itemsCollection.insertOne(newItem);
    if (!insertInfo) {
      throw `Fail to create new user`;
    } else {
      console.log(`Upload Success`);
      return `Upload Success`;
    }
  },

  async getAll() {
    const itemCollection = await items();
    let itemList = await itemCollection.find({}).toArray();
    if (!itemList) throw "Could not get all items";
    itemList = itemList.map((element) => {
      element._id = element._id.toString();
      return element;
    });
    return itemList;
  },

  async getById(id) {
    id = validation.checkId(id);
    const itemCollection = await items();
    const item = await itemCollection.findOne({ _id: new ObjectId(id) });
    if (!item) {
      throw `Item with id ${id} not found`;
    }
    item._id = item._id.toString();
    return item;
  },
};

export default itemsMethods;
