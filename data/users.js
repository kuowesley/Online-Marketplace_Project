import validation from "./validation.js";
import { users } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import bcrypt from "bcryptjs";
import { items } from "../config/mongoCollections.js";
import fs from "fs";
import { fileURLToPath } from "url";
import path from "path";

const saltRounds = 16;
var imageCount = 1;
const usersMethods = {
  async addUser(
    firstName,
    lastName,
    userName,
    email,
    password,
    street,
    city,
    state,
    zipcode,
    age,
  ) {
    firstName = validation.checkString(firstName, "firstName");
    lastName = validation.checkString(lastName, "lastName");
    userName = validation.checkString(userName, "userName");
    userName = userName.toLowerCase();
    email = validation.checkEmail(email);
    password = validation.checkPassword(password, "password");
    password = await bcrypt.hash(password, saltRounds);
    street = validation.checkStreet(street, "street");
    city = validation.checkCity(city, "city");
    state = validation.checkState(state, "state");
    zipcode = validation.checkZipcode(zipcode, "zipcode");
    age = validation.checkNumber(age, "age");

    const usersCollection = await users();
    const user = await usersCollection.findOne({ userName: userName });
    if (user) {
      throw `userName already exits`;
    }

    let newUser = {
      firstName: firstName,
      lastName: lastName,
      userName: userName,
      email: email,
      password: password,
      street: street,
      city: city,
      state: state,
      zipcode: zipcode,
      age: age,
      shopping_cart: [],
      items_for_sale: [],
      historical_sold_item: [],
      historical_purchased_item: [],
      browserHistory: [],
      confirmMeetUpTime: [],
      timeToBeDetermined: [],
    };

    const insertInfo = await usersCollection.insertOne(newUser);
    if (!insertInfo) {
      throw `Fail to create new user`;
    }
    const insertedId = insertInfo.insertedId.toString();
    const insertedUser = this.getUserById(insertedId);
    return insertedUser;
  },

  async loginUser(userName, password) {
    userName = validation.checkString(userName, "userName");
    userName = userName.toLowerCase();
    password = validation.checkPassword(password, "password");

    const usersCollection = await users();
    const findUser = await usersCollection.findOne({ userName: userName });
    if (!findUser) {
      throw `Either the userName or password is invalid`;
    }
    let comparePwd = false;
    comparePwd = await bcrypt.compare(password, findUser.password);
    if (!comparePwd) {
      throw `Either the userName or password is invalid`;
    }

    return findUser;
  },

  async getUserById(id) {
    id = validation.checkId(id, "userId");

    const usersCollection = await users();
    const user = await usersCollection.findOne({ _id: new ObjectId(id) });
    if (!user) {
      throw `Error : user not found`;
    }
    return user;
  },

  async getUserHistoricalPurchase(id) {
    id = validation.checkId(id, "userId");
    const usersCollection = await users();
    const user = await usersCollection.findOne({ _id: new ObjectId(id) });
    if (!user) {
      throw "Error : user not found";
    }
    if (user.historical_purchased_item.length === 0) {
      throw "Error : historical purchase not found";
    }
    let res = [];
    for (let i of user.historical_purchased_item) {
      res.push(i);
    }
    return res;
  },

  async getUserItemsForSale(id) {
    id = validation.checkId(id, "userId");
    const usersCollection = await users();
    const user = await usersCollection.findOne({ _id: new ObjectId(id) });
    if (!user) {
      throw "Error : user not found";
    }
    if (user.items_for_sale.length === 0) {
      throw "Error : item for sale not found";
    }
    let res = [];
    for (let i of user.items_for_sale) {
      res.push(i);
    }
  },

  async getUserHistoricalSold(id) {
    id = validation.checkId(id, "userId");
    const usersCollection = await users();
    const user = await usersCollection.findOne({ _id: new ObjectId(id) });
    if (!user) {
      throw "Error : user not found";
    }
    if (user.historical_sold_item.length === 0) {
      throw "Error : historical sold item not found";
    }
    let res = [];
    for (let i of user.historical_sold_item) {
      res.push(i);
    }
  },

  async getItemToCart(userId, itemId, quantity) {
    userId = validation.checkId(userId, "userId");
    itemId = validation.checkId(itemId, "itemId");
    quantity = validation.checkNumber(parseInt(quantity), "quantity");

    const itemsCollection = await items();
    const item = await itemsCollection.findOne({ _id: new ObjectId(itemId) });
    if (!item) {
      throw `Item not found`;
    }
    if (item.seller_id === userId) {
      throw "You cannot purchase items you posted";
    }

    const usersCollection = await users();
    const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
    if (!user) {
      throw `User not found`;
    }

    let shopping_cart = user.shopping_cart;
    for (let currentItem of shopping_cart) {
      if (currentItem.itemId === itemId) {
        quantity += currentItem.quantity;
        if (item.quantity < quantity) {
          quantity = item.quantity;
        }
        const userUpdate = usersCollection.findOneAndUpdate(
          {
            $and: [
              { _id: new ObjectId(userId) },
              { "shopping_cart.itemId": itemId },
            ],
          },
          { $set: { "shopping_cart.$.quantity": parseInt(quantity) } },
        );
        if (!userUpdate) {
          throw `Add to cart fail`;
        }
        return;
      }
    }

    let newItem = {
      itemId: itemId,
      quantity: quantity,
    };
    shopping_cart.push(newItem);
    const userUpdate = usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { shopping_cart: shopping_cart } },
    );
  },

  async getShoppingCart(userId) {
    userId = validation.checkId(userId, "userId");
    const usersCollection = await users();
    const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
    if (!user) {
      throw `User not found`;
    }

    const itemsCollection = await items();
    let cartItems = [];
    for (let item of user.shopping_cart) {
      let itemInfo = await itemsCollection.findOne({
        _id: new ObjectId(item.itemId),
      });
      if (!itemInfo) {
        throw `itemInfo not found`;
      } else {
        let picturesPath;
        const currentFilePath = fileURLToPath(import.meta.url);
        const currentDirPath = path.dirname(currentFilePath);
        const uploadDirPath = path.join(currentDirPath, "..", "public", "img");
        const filePath = path.join(
          uploadDirPath,
          imageCount.toString() + ".png",
        );
        picturesPath = "/public/img/" + imageCount.toString() + ".png";
        imageCount += 1;
        fs.writeFile(filePath, itemInfo.picture[0].buffer, (err) => {
          if (err) {
            console.error("Error writing file:", err);
          } else {
            console.log("File written successfully");
            // Here you can further process or serve the image file as needed
          }
        });
        itemInfo.picture = picturesPath;

        cartItems.push({ item: itemInfo, quantity: item.quantity });
      }
    }
    return cartItems;
  },

  async checkOutItems(userId) {
    userId = validation.checkId(userId, "userId");
    const usersCollection = await users();
    const itemsCollection = await items();
    const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
    if (!user) {
      throw `user not found`;
    }
    let shopping_cart = user.shopping_cart;
    try {
      for (let item of shopping_cart) {
        await this.checkItemAvaliable(item.itemId, item.quantity);
        // Make sure user can't purchase items they posted
        const seller = await usersCollection.findOne(
          {
            items_for_sale: item.itemId,
          },
          {
            projection: { _id: 1 },
          },
        );
        if (seller._id.toString() === userId) {
          throw `You cannot purchase items you posted`;
        }
      }
    } catch (e) {
      throw `${e}`;
    }
    // for (let item of shopping_cart) {
    //   this.checkItemAvaliable(item.itemId, item.quantity)
    // }
    let meetUpItems = [];
    let shippingItems = [];
    for (let shoppingItem of shopping_cart) {
      const item = await itemsCollection.findOne({
        _id: new ObjectId(shoppingItem.itemId),
      });
      if (!item) {
        throw `item:${shoppingItem.itemId} not found`;
      }
      if (item.deliveryMethod === "meetup") {
        meetUpItems.push({
          transactionId: new ObjectId(),
          itemId: shoppingItem.itemId,
          quantity: shoppingItem.quantity,
        });
      } else {
        shippingItems.push({
          itemId: shoppingItem.itemId,
          quantity: shoppingItem.quantity,
        });
      }
    }

    for (let shoppingItem of shippingItems) {
      const item = await itemsCollection.findOneAndUpdate(
        { _id: new ObjectId(shoppingItem.itemId) },
        { $inc: { quantity: -parseInt(shoppingItem.quantity) } },
        { returnDocument: "after" },
      );
      if (!item) {
        throw `Item not found`;
      }
      // Add to itemId to historical_sold_item of the seller
      let soldItemId = item._id.toString();
      let sellerId = item.seller_id;
      const updateResult = await usersCollection.updateOne(
        { _id: new ObjectId(sellerId) },
        { $addToSet: { historical_sold_item: soldItemId } }, // prevent duplicate item IDs
      );
      if (!updateResult) {
        throw "Failed to update historical_sold_item for the seller.";
      }

      let purchaseedItem = {
        itemId: soldItemId,
        quantity: parseInt(shoppingItem.quantity),
      };
      const update_historical_purchased_item =
        await usersCollection.findOneAndUpdate(
          { _id: new ObjectId(userId) },
          { $push: { historical_purchased_item: purchaseedItem } },
        );
      if (!update_historical_purchased_item) {
        throw `Update historical_purchased_item fail`;
      }
    }
    const cleanShoppingCart = await usersCollection.findOneAndUpdate(
      { _id: new ObjectId(userId) },
      { $set: { shopping_cart: [] } },
    );
    if (!cleanShoppingCart) {
      throw `Fail to clean Shopping Cart`;
    }

    for (let meetUpItem of meetUpItems) {
      const user = await usersCollection.findOneAndUpdate(
        { _id: new ObjectId(userId) },
        { $push: { timeToBeDetermined: meetUpItem } },
      );
      if (!user) {
        throw `update timeToBeDetermined fail`;
      }
    }

    // add items to historical_purchased_item
    //let historical_purchased_item = user.historical_purchased_item;
    //let itemIdsFromCart = shopping_cart.map((cartItem) => cartItem.itemId);
    // const uniqueItemIds = new Set([
    //   ...historical_purchased_item,
    //   ...itemIdsFromCart,
    // ]); // prevent duplicate IDs
    //historical_purchased_item = Array.from(uniqueItemIds);
  },

  async checkItemAvaliable(itemId, quantity) {
    const itemsCollection = await items();
    const itemInStorage = await itemsCollection.findOne({
      _id: new ObjectId(itemId),
    });
    if (!itemInStorage) {
      throw `Item not found`;
    }
    if (quantity > itemInStorage.quantity) {
      if (itemInStorage.quantity === 0) {
        throw `Item : ${itemInStorage.item} is not currently in stock for purchase`;
      } else if (itemInStorage.quantity === 1) {
        throw `There is only ${itemInStorage.quantity} left in stock of item:${itemId}`;
      } else {
        throw `There are only ${itemInStorage.quantity} left in stock of item:${itemId}`;
      }
    }
  },

  async removeCartItem(userId, itemId) {
    itemId = validation.checkId(itemId, "itemId");
    userId = validation.checkId(userId, "userId");
    const usersCollection = await users();
    const removeItem = await usersCollection.findOneAndUpdate(
      {
        $and: [
          { _id: new ObjectId(userId) },
          { "shopping_cart.itemId": itemId },
        ],
      },
      { $pull: { shopping_cart: { itemId: itemId } } },
      { returnDocument: "after" },
    );
    if (!removeItem) {
      throw `removeItem Fail`;
    }
  },

  async removeListItem(userId, itemId) {
    itemId = validation.checkId(itemId, "itemId");
    userId = validation.checkId(userId, "userId");
    const usersCollection = await users();
    const removeItem = await usersCollection.findOneAndUpdate(
      { _id: new ObjectId(userId) },
      { $pull: { items_for_sale: itemId } },
      { returnDocument: "after" },
    );
    if (!removeItem) {
      throw `removeItem Fail`;
    }

    // const addToHistorical = await usersCollection.findOneAndUpdate(
    //   { _id: new ObjectId(userId) },
    //   { $push: { historical_sold_item: itemId } },
    // );
    // if (!addToHistorical) {
    //   throw `Add item from items_for_sale to historical_sold_item fail`;
    // }

    const itemsCollection = await items();
    const setQuantityZero = await itemsCollection.findOneAndUpdate(
      { _id: new ObjectId(itemId) },
      { $set: { quantity: 0 } },
      { returnDocument: "after" },
    );
    if (!setQuantityZero) {
      throw `set item quantity zero fail`;
    }
  },

  async getItemToItemsForSale(userId, itemId) {
    itemId = validation.checkId(itemId, "itemId");
    userId = validation.checkId(userId, "userId");
    const usersCollection = await users();
    const pushNewItem = await usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $push: { items_for_sale: itemId } },
    );
    if (!pushNewItem) {
      throw `update item to ItemsForSale fail`;
    }
  },

  async getItemsForSale(userId) {
    userId = validation.checkId(userId, "userId");
    const usersCollection = await users();
    const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
    if (!user) {
      throw `user not found`;
    }
    let itemsForSale = user.items_for_sale;

    let AllItems = [];
    const itemsCollection = await items();
    for (let itemId of itemsForSale) {
      const itemInfo = await itemsCollection.findOne({
        _id: new ObjectId(itemId),
      });
      if (!itemInfo) {
        throw `Item: ${itemId} not found`;
      } else {
        let picturesPath;
        const currentFilePath = fileURLToPath(import.meta.url);
        const currentDirPath = path.dirname(currentFilePath);
        const uploadDirPath = path.join(currentDirPath, "..", "public", "img");
        const filePath = path.join(
          uploadDirPath,
          imageCount.toString() + ".png",
        );
        picturesPath = "/public/img/" + imageCount.toString() + ".png";
        imageCount += 1;
        fs.writeFile(filePath, itemInfo.picture[0].buffer, (err) => {
          if (err) {
            console.error("Error writing file:", err);
          } else {
            console.log("File written successfully");
            // Here you can further process or serve the image file as needed
          }
        });
        itemInfo.picture = picturesPath;
      }
      AllItems.push(itemInfo);
    }

    return AllItems;
  },

  async getHistoricalSoldItems(userId) {
    userId = validation.checkId(userId, "userId");
    const usersCollection = await users();
    const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
    if (!user) {
      throw `user not found`;
    }
    let soldItems = user.historical_sold_item;

    let AllItems = [];
    const itemsCollection = await items();
    for (let itemId of soldItems) {
      const itemInfo = await itemsCollection.findOne({
        _id: new ObjectId(itemId),
      });
      if (!itemInfo) {
        throw `Item: ${itemId} not found`;
      } else {
        let picturesPath;
        const currentFilePath = fileURLToPath(import.meta.url);
        const currentDirPath = path.dirname(currentFilePath);
        const uploadDirPath = path.join(currentDirPath, "..", "public", "img");
        const filePath = path.join(
          uploadDirPath,
          imageCount.toString() + ".png",
        );
        picturesPath = "/public/img/" + imageCount.toString() + ".png";
        imageCount += 1;
        fs.writeFile(filePath, itemInfo.picture[0].buffer, (err) => {
          if (err) {
            console.error("Error writing file:", err);
          } else {
            console.log("File written successfully");
            // Here you can further process or serve the image file as needed
          }
        });
        itemInfo.picture = picturesPath;
      }
      AllItems.push(itemInfo);
    }

    return AllItems;
  },

  async getHistoricalPurchase(userId) {
    userId = validation.checkId(userId, "userId");
    const usersCollection = await users();
    const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
    if (!user) {
      throw `user not found`;
    }
    let purchasedItems = user.historical_purchased_item;

    let AllItems = [];
    const itemsCollection = await items();
    for (let item of purchasedItems) {
      const itemInfo = await itemsCollection.findOne({
        _id: new ObjectId(item.itemId),
      });
      if (!itemInfo) {
        throw `Item: ${item.itemId} not found`;
      } else {
        let picturesPath;
        const currentFilePath = fileURLToPath(import.meta.url);
        const currentDirPath = path.dirname(currentFilePath);
        const uploadDirPath = path.join(currentDirPath, "..", "public", "img");
        const filePath = path.join(
          uploadDirPath,
          imageCount.toString() + ".png",
        );
        picturesPath = "/public/img/" + imageCount.toString() + ".png";
        imageCount += 1;
        fs.writeFile(filePath, itemInfo.picture[0].buffer, (err) => {
          if (err) {
            console.error("Error writing file:", err);
          } else {
            console.log("File written successfully");
            // Here you can further process or serve the image file as needed
          }
        });
        itemInfo.picture = picturesPath;
      }
      AllItems.push({ item: itemInfo, quantity: item.quantity });
    }

    return AllItems;
  },

  async submitComment(itemId, rating, comment, userId) {
    itemId = validation.checkId(itemId, "itemId");
    rating = validation.checkRating(rating, "rating");
    comment = validation.checkString(comment, "comment");
    userId = validation.checkCity(userId, "userId");
    const itemsCollection = await items();
    // Check if the user has already submitted a comment for the item
    const existingComment = await itemsCollection.findOne({
      _id: new ObjectId(itemId),
      "comments.userId": userId,
    });
    if (existingComment) {
      throw "You have already submitted a comment for this item";
    }

    // //check if the user bought the item or not
    // const usersCollection = await users()
    // const userPurchase = usersCollection.findOne(
    //   {
    //     _id: new ObjectId(userId),

    //   }
    // )

    const comment_submission = await itemsCollection.findOneAndUpdate(
      { _id: new ObjectId(itemId) },
      {
        $push: {
          comments: { rating: rating, comment: comment, userId: userId },
        },
      },
    );
    if (!comment_submission) {
      throw `Update item comment fail`;
    }
  },

  async getComment(itemId, userId) {
    itemId = validation.checkId(itemId, "itemId");
    userId = validation.checkCity(userId, "userId");
    const itemsCollection = await items();
    const existingComment = await itemsCollection.findOne(
      { $and: [{ _id: new ObjectId(itemId) }, { "comments.userId": userId }] },
      { projection: { _id: 0, "comments.$": 1 } },
    );
    if (!existingComment) {
      throw "You haven't submitted a comment for this item";
    }
    return existingComment.comments[0];
  },

  async editComment(itemId, rating, comment, userId) {
    itemId = validation.checkId(itemId, "itemId");
    rating = validation.checkRating(rating, "rating");
    comment = validation.checkString(comment, "comment");
    userId = validation.checkCity(userId, "userId");
    const itemsCollection = await items();
    // Check if the user has already submitted a comment for the item
    const existingComment = await itemsCollection.findOne({
      _id: new ObjectId(itemId),
      "comments.userId": userId,
    });
    if (!existingComment) {
      throw "You haven't submitted a comment for this item";
    }
    const comment_submission = await itemsCollection.updateOne(
      {
        _id: new ObjectId(itemId),
        "comments.userId": userId,
      },
      {
        $set: {
          "comments.$.rating": rating,
          "comments.$.comment": comment,
        },
      },
    );
    if (!comment_submission) {
      throw `Update item comment fail`;
    }
  },

  async checkDuplicateComment(itemId, userId) {
    itemId = validation.checkId(itemId, "itemId");
    userId = validation.checkId(userId, "userId");
    const itemsCollection = await items();
    const existingComment = await itemsCollection.findOne({
      _id: new ObjectId(itemId),
      "comments.userId": userId,
    });
    if (existingComment) {
      return true;
    } else {
      return false;
    }
  },

  async getSellerInformation(id) {
    id = validation.checkId(id, "userId");
    const usersCollection = await users();
    const seller = await usersCollection.findOne(
      // hide password and username
      { _id: new ObjectId(id) },
      {
        projection: {
          firstName: 1,
          lastName: 1,
          historical_sold_item: 1,
          _id: 0,
        },
      },
    );
    if (!seller) {
      throw `Seller with id ${id} not found`;
    }
    return seller;
  },

  async addBrowserHistory(userId, itemId) {
    //to do check itemId limit 5
    userId = validation.checkId(userId, "UserId");
    itemId = validation.checkId(itemId, "ItemId");
    const usersCollection = await users();
    const user = await usersCollection.findOne({ _id: new ObjectId(userId) });

    if (!user) {
      throw "User is not registerd to add browse history";
    }
    // if not browserhistory field create one

    if (!user.browserHistory) {
      await usersCollection.updateOne(
        { _id: new ObjectId(userId) },
        { $set: { browserHistory: [itemId] } },
      );
    }
    if (!user.browserHistory.includes(itemId)) {
      if (user.browserHistory.length < 5) {
        await usersCollection.updateOne(
          { _id: new ObjectId(userId) },
          { $push: { browserHistory: itemId } },
        );
      } else if (user.browserHistory.length == 5) {
        await usersCollection.updateOne(
          { _id: new ObjectId(userId) },
          { $pop: { browserHistory: -1 } },
        );
        await usersCollection.updateOne(
          { _id: new ObjectId(userId) },
          { $push: { browserHistory: itemId } },
        );
      } else if (user.browserHistory.length > 5) {
        for (let i = 0; i < user.browserHistory.length - 4; i++) {
          await usersCollection.updateOne(
            { _id: new ObjectId(userId) },
            { $pop: { browserHistory: -1 } },
          );
        }
        await usersCollection.updateOne(
          { _id: new ObjectId(userId) },
          { $push: { browserHistory: itemId } },
        );
      }
    }
  },

  async getBrowserHistory(userId) {
    // to do
    userId = validation.checkId(userId, "UserId");
    const usersCollection = await users();
    const user = await usersCollection.findOne({ _id: new ObjectId(userId) });

    if (!user) {
      throw "User is not registed to generate browse history";
    }

    if (user.browserHistory.length === 0) {
      return;

    }
    if (user.browserHistory) {
      return user.browserHistory;
    }
  },

  async getTimeToBeDetermined(userId) {
    const usersCollection = await users();
    let user = await usersCollection.findOne({ _id: new ObjectId(userId) });
    if (!user) {
      throw `user not found`;
    }
    let timeToBeDeterminedItems = user.timeToBeDetermined;
    let itemsCollection = await items();
    let allItems = [];
    for (let obj of timeToBeDeterminedItems) {
      let itemInfo = await itemsCollection.findOne({
        _id: new ObjectId(obj.itemId),
      });
      if (!itemInfo) {
        throw `Item not found`;
      }
      let picturesPath;
      const currentFilePath = fileURLToPath(import.meta.url);
      const currentDirPath = path.dirname(currentFilePath);
      const uploadDirPath = path.join(currentDirPath, "..", "public", "img");
      const filePath = path.join(uploadDirPath, imageCount.toString() + ".png");
      picturesPath = "/public/img/" + imageCount.toString() + ".png";
      imageCount += 1;
      fs.writeFile(filePath, itemInfo.picture[0].buffer, (err) => {
        if (err) {
          console.error("Error writing file:", err);
        } else {
          console.log("File written successfully");
          // Here you can further process or serve the image file as needed
        }
      });
      itemInfo.picture = picturesPath;
      obj.transactionId = obj.transactionId.toString();
      allItems.push({ item: itemInfo, transactionInfo: obj });
    }
    return allItems;
  },

  async submitMeetUpTimeToSeller(buyerId, transactionId, meetUpTime) {
    buyerId = validation.checkId(buyerId, "buyerId");
    transactionId = validation.checkId(transactionId, "transactionId");
    meetUpTime = validation.checkTime(meetUpTime, "meetUpTime");
    const itemsCollection = await items();
    const usersCollection = await users();

    let transactionInfo = await usersCollection.findOne(
      { "timeToBeDetermined.transactionId": new ObjectId(transactionId) },
      { projection: { _id: 0, "timeToBeDetermined.$": 1 } },
    );
    if (!transactionInfo) {
      throw `fail to find transactionInfo`;
    }
    let itemId = transactionInfo.timeToBeDetermined[0].itemId;

    const item = await itemsCollection.findOne({ _id: new ObjectId(itemId) });
    if (!item) {
      throw `item not found`;
    }
    let sellerId = item.seller_id;
    let confirmMeetUpTime = {
      transactionId: new ObjectId(),
      itemId: itemId,
      meetUpTime: meetUpTime,
      quantity: transactionInfo.timeToBeDetermined[0].quantity,
      buyerId: buyerId,
    };
    let seller = await usersCollection.findOneAndUpdate(
      { _id: new ObjectId(sellerId) },
      { $push: { confirmMeetUpTime: confirmMeetUpTime } },
      { returnDocument: "after" },
    );
    if (!seller) {
      throw `update confirmMeetUpTime to seller fail`;
    }

    let buyer = await usersCollection.findOneAndUpdate(
      { "timeToBeDetermined.transactionId": new ObjectId(transactionId) },
      {
        $pull: {
          timeToBeDetermined: { transactionId: new ObjectId(transactionId) },
        },
      },
    );
    if (!buyer) {
      throw `remove item from timeToBeDetermined fail`;
    }
  },

  async checkTimeToBeDetermined(userId) {
    const usersCollection = await users();
    const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
    if (!user) {
      throw `user not found`;
    }
    if (user.timeToBeDetermined.length === 0) {
      return false;
    }
    return true;
  },

  async getConfirmMeetUpTime(userId) {
    userId = validation.checkId(userId, "userId");
    const usersCollection = await users();
    const itemsCollection = await items();
    let user = await usersCollection.findOne({ _id: new ObjectId(userId) });
    if (!user) {
      throw `user not found`;
    }
    let allItems = [];
    let confirmMeetUpTime = user.confirmMeetUpTime;
    for (let obj of confirmMeetUpTime) {
      let itemInfo = await itemsCollection.findOne({
        _id: new ObjectId(obj.itemId),
      });
      if (!itemInfo) {
        throw `item not found`;
      }
      let picturesPath;
      const currentFilePath = fileURLToPath(import.meta.url);
      const currentDirPath = path.dirname(currentFilePath);
      const uploadDirPath = path.join(currentDirPath, "..", "public", "img");
      const filePath = path.join(uploadDirPath, imageCount.toString() + ".png");
      picturesPath = "/public/img/" + imageCount.toString() + ".png";
      imageCount += 1;
      fs.writeFile(filePath, itemInfo.picture[0].buffer, (err) => {
        if (err) {
          console.error("Error writing file:", err);
        } else {
          console.log("File written successfully");
          // Here you can further process or serve the image file as needed
        }
      });
      itemInfo.picture = picturesPath;

      let buyer = await usersCollection.findOne({
        _id: new ObjectId(obj.buyerId),
      });
      if (!buyer) {
        throw `buyer not found`;
      }
      let buyerName = buyer.userName;
      obj.meetUpTime = obj.meetUpTime.split("T").join(" ");
      allItems.push({ item: itemInfo, meetUpInfo: obj, buyerName: buyerName });
    }
    return allItems;
  },

  async confirmMeetUpTime(transactionId, sellerId, buyerId) {
    transactionId = validation.checkId(transactionId, "transactionId");
    sellerId = validation.checkId(sellerId, "sellerId");
    buyerId = validation.checkId(buyerId, "buyerId");
    const usersCollection = await users();
    const itemsCollection = await items();
    let transactionInfo = await usersCollection.findOne(
      { "confirmMeetUpTime.transactionId": new ObjectId(transactionId) },
      { projection: { _id: 0, "confirmMeetUpTime.$": 1 } },
    );
    if (!transactionInfo) {
      throw `transactionInfo not found`;
    }
    transactionInfo = transactionInfo.confirmMeetUpTime[0];

    let removeTransaction = await usersCollection.findOneAndUpdate(
      { "confirmMeetUpTime.transactionId": new ObjectId(transactionId) },
      {
        $pull: {
          confirmMeetUpTime: { transactionId: new ObjectId(transactionId) },
        },
      },
    );
    if (!removeTransaction) {
      throw `removeTransaction from confirmMeetUpTime fail`;
    }
  },
};
export default usersMethods;
