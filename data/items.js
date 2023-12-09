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
    item = validation.checkItemName(item, "item");
    price = validation.checkPrice(price, "price");
    description = validation.checkDescription(description, "description");

    // Validate buffer when route pass in picture buffer
    if (!Array.isArray(picture)) {
      throw `Pictures should be array all multiple image`;
    } else {
      for (let i in picture) {
        if (!Buffer.isBuffer(picture[i])) {
          throw `image should be buffer`;
        }
      }
    }

    // check input type
    quantity = validation.checkQuantity(quantity, "quantity");
    location = validation.checkLocation(location, "location");
    deliveryMethod = validation.checkDeliveryMethod(
      deliveryMethod,
      "deliveryMethod",
    );
    condition = validation.checkCondition(condition, "condition");
    seller_id = validation.checkId(seller_id, "seller_id");

    // TODO: picture would be convert to binary but could not exceed 16 MB, if the file need to be
    // over 16MB, use https://www.mongodb.com/docs/manual/core/gridfs/
    // https://www.bezkoder.com/node-js-upload-store-images-mongodb/

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
    };

    // insert to database
    const itemsCollection = await items();
    const insertInfo = await itemsCollection.insertOne(newItem);
    console.log(`insertInfo: ${insertInfo}`);
    if (!insertInfo) {
      throw `Fail to create new item`;
    } else {
      console.log(`Upload Success`);
      return insertInfo;
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
    id = validation.checkId(id, "itemId");
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
