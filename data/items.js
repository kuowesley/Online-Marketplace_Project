import validation from "./validation.js";
import { items } from "../config/mongoCollections.js";
import { Binary, ObjectId } from "mongodb";
// import multer from "multer";
// import { GridFsStorage } from "multer-gridfs-storage";
import { mongoConfig } from "../config/settings.js";

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
    item = validation.checkString(item);
    price = validation.checkNumber(price);
    description = validation.checkString(description);
    if (Array.isArray(picture)) {
      for (let image in picture) {
        picture[image] = validation.checkString(picture[image]);
      }
    }
    quantity = validation.checkNumber(quantity);
    location = validation.checkString(location);
    deliveryMethod = validation.checkString(deliveryMethod);
    condition = validation.checkString(condition);

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
    if (!eventList) throw "Could not get all items";
    itemList = itemList.map((element) => {
      element._id = element._id.toString();
      return element;
    });
    return itemList;
  },
};

export default itemsMethods;
