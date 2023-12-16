import validation from "./validation.js";
import { items } from "../config/mongoCollections.js";
import { users } from "../config/mongoCollections.js";
import { Binary, ObjectId } from "mongodb";
import usersData from "./users.js";
import fs from "fs";
import { fileURLToPath } from "url";
import path from "path";

// import multer from "multer";
// import { GridFsStorage } from "multer-gridfs-storage";
// import { mongoConfig } from "../config/settings.js";
var imageCount = 1;

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
      uploadTime: new Date(), // Add the current timestamp
      comments: [], // Initialize comments as an empty array
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
    let itemList = await itemCollection
      .find({ quantity: { $gt: 0 } })
      .toArray();
    if (!itemList) throw "Could not get all items";
    itemList = itemList.map((element) => {
      element._id = element._id.toString();

      const currentFilePath = fileURLToPath(import.meta.url);
      const currentDirPath = path.dirname(currentFilePath);
      const uploadDirPath = path.join(currentDirPath, "..", "public", "img");
      const filePath = path.join(uploadDirPath, imageCount.toString() + ".png");
      fs.writeFile(filePath, element.picture[0].buffer, (err) => {
        if (err) {
          console.error("Error writing file:", err);
        } else {
          console.log("File written successfully");
          // Here you can further process or serve the image file as needed
        }
      });
      element.picture = "/public/img/" + imageCount.toString() + ".png"; // only the first picture would be displayed
      imageCount += 1;
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
    let picturesPath = [];
    for (let img of item.picture) {
      const currentFilePath = fileURLToPath(import.meta.url);
      const currentDirPath = path.dirname(currentFilePath);
      const uploadDirPath = path.join(currentDirPath, "..", "public", "img");
      const filePath = path.join(uploadDirPath, imageCount.toString() + ".png");
      picturesPath.push("/public/img/" + imageCount.toString() + ".png");
      imageCount += 1;
      fs.writeFile(filePath, img.buffer, (err) => {
        if (err) {
          console.error("Error writing file:", err);
        } else {
          console.log("File written successfully");
          // Here you can further process or serve the image file as needed
        }
      });
    }
    item.picture = picturesPath;
    item._id = item._id.toString();
    return item;
  },

  async searchByDescription(description) {
    description = validation.checkString(description, "search entry");
    const itemCollection = await items();
    let itemList = await itemCollection
      .find({
        $and: [
          {
            $or: [
              { description: { $regex: description, $options: "i" } },
              { item: { $regex: description, $options: "i" } },
            ],
          },
          { quantity: { $gt: 0 } },
        ],
      })
      .toArray();
    if (!itemList) throw "Could not get items";
    itemList = itemList.map((element) => {
      element._id = element._id.toString();
      const currentFilePath = fileURLToPath(import.meta.url);
      const currentDirPath = path.dirname(currentFilePath);
      const uploadDirPath = path.join(currentDirPath, "..", "public", "img");
      const filePath = path.join(uploadDirPath, imageCount.toString() + ".png");
      fs.writeFile(filePath, element.picture[0].buffer, (err) => {
        if (err) {
          console.error("Error writing file:", err);
        } else {
          console.log("File written successfully");
          // Here you can further process or serve the image file as needed
        }
      });
      element.picture = "/public/img/" + imageCount.toString() + ".png"; // only the first picture would be displayed
      imageCount += 1;

      return element;
    });
    return itemList;
  },

  async purchaseItem(userId, itemId, quantity) {
    userId = validation.checkId(userId, "userId");
    itemId = validation.checkId(itemId, "itemId");
    const usersCollection = await users();
    const itemsCollection = await items();
    const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
    if (!user) {
      throw `user not found`;
    }
    const item1 = await itemsCollection.findOne({ _id: new ObjectId(itemId) });
    if (!item1) {
      throw "item not found";
    }

    // Make sure user can't purchase items they posted & check item availability
    try {
      const seller = await usersCollection.findOne(
        {
          items_for_sale: itemId,
        },
        {
          projection: { _id: 1 },
        },
      );
      if (seller._id.toString() === userId) {
        throw `You cannot purchase items you posted`;
      }
      await usersData.checkItemAvaliable(itemId, item1.quantity);
    } catch (e) {
      throw `${e}`;
    }

    // update item quantity
    const item = await itemsCollection.findOneAndUpdate(
      { _id: new ObjectId(itemId) },
      { $inc: { quantity: -parseInt(quantity) } },
      { returnDocument: "after" },
    );
    if (!item) {
      throw `Item not found`;
    }

    // Add itemId to historical_sold_item of the seller
    let soldItemId = item._id.toString();
    let sellerId = item.seller_id;
    const updateResult = await usersCollection.updateOne(
      { _id: new ObjectId(sellerId) },
      { $addToSet: { historical_sold_item: soldItemId } }, // prevent duplicate item IDs
    );
    if (!updateResult) {
      throw "Failed to update historical_sold_item for the seller.";
    }

    // Add itemId to historical_purchased_item of the user
    let purchaseedItem = {
      itemId: soldItemId,
      quantity: quantity,
    };
    const update_historical_purchased_item =
      await usersCollection.findOneAndUpdate(
        { _id: new ObjectId(userId) },
        { $push: { historical_purchased_item: purchaseedItem } },
      );
    if (!update_historical_purchased_item) {
      throw `Update historical_purchased_item fail`;
    }
  },
};

export default itemsMethods;
