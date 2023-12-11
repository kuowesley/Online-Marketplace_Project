import validation from "./validation.js";
import { users } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import bcrypt from "bcryptjs";
import { items } from "../config/mongoCollections.js";

const saltRounds = 16;

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
      if (itemInfo) {
        cartItems.push({ item: itemInfo, quantity: item.quantity });
      }
    }
    return cartItems;
  },

  async checkOutItems(userId) {
    // TODO: make sure user can't purchase items they posted
    userId = validation.checkId(userId, "userId");
    const usersCollection = await users();
    const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
    if (!user) {
      throw `user not found`;
    }
    let shopping_cart = user.shopping_cart;
    try {
      for (let item of shopping_cart) {
        await this.checkItemAvaliable(item.itemId, item.quantity);
      }
    } catch (e) {
      throw `${e}`;
    }
    // for (let item of shopping_cart) {
    //   this.checkItemAvaliable(item.itemId, item.quantity)
    // }

    const itemsCollection = await items();
    for (let shoppingItem of shopping_cart) {
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
    }
    const cleanShoppingCart = await usersCollection.findOneAndUpdate(
      { _id: new ObjectId(userId) },
      { $set: { shopping_cart: [] } },
    );
    if (!cleanShoppingCart) {
      throw `Fail to clean Shopping Cart`;
    }

    // add items to historical_purchased_item
    let historical_purchased_item = user.historical_purchased_item;
    let itemIdsFromCart = shopping_cart.map((cartItem) => cartItem.itemId);
    const uniqueItemIds = new Set([
      ...historical_purchased_item,
      ...itemIdsFromCart,
    ]); // prevent duplicate IDs
    historical_purchased_item = Array.from(uniqueItemIds);
    const update_historical_purchased_item =
      await usersCollection.findOneAndUpdate(
        { _id: new ObjectId(userId) },
        { $set: { historical_purchased_item: historical_purchased_item } },
      );
    if (!update_historical_purchased_item) {
      throw `Update historical_purchased_item fail`;
    }
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

    const addToHistorical = await usersCollection.findOneAndUpdate(
      { _id: new ObjectId(userId) },
      { $push: { historical_sold_item: itemId } },
    );
    if (!addToHistorical) {
      throw `Add item from items_for_sale to historical_sold_item fail`;
    }

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
    for (let itemId of purchasedItems) {
      const itemInfo = await itemsCollection.findOne({
        _id: new ObjectId(itemId),
      });
      if (!itemInfo) {
        throw `Item: ${itemId} not found`;
      }
      AllItems.push(itemInfo);
    }

    return AllItems;
  },

  async submitComment(itemId, rating, comment) {
    itemId = validation.checkId(itemId, "itemId");
    rating = validation.checkRating(rating, "rating");
    comment = validation.checkString(comment, "comment");
    const itemsCollection = await items();
    const comment_submission = await itemsCollection.findOneAndUpdate(
      { _id: new ObjectId(itemId) },
      { $push: { comments: { rating: rating, comment: comment } } },
    );
    if (!comment_submission) {
      throw `Update item comment fail`;
    }
  },

  async getSellerInformation(id) {
    id = validation.checkId(id, "itemId");
    const usersCollection = await users();
    const seller = await usersCollection.findOne(
      // hide password and username
      { _id: new ObjectId(id) },
      {
        projection: {
          firstName: 1,
          lastName: 1,
          historical_purchased_item: 1,
          _id: 0,
        },
      },
    );
    if (!seller) {
      throw `Seller with id ${id} not found`;
    }
    return seller;
  },
};

export default usersMethods;
