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
    const usersCollection = await users();
    const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
    if (!user) {
      throw `User not found`;
    }
    let shopping_cart = user.shopping_cart;
    let newItem = {
      itemId: itemId,
      quantity: quantity,
    };
    shopping_cart.push(newItem);
    const userUpdate = usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { shopping_cart: shopping_cart } },
    );

    const itemsCollection = await items();
    const item = await itemsCollection.findOneAndUpdate(
      { _id: new ObjectId(itemId) },
      { $inc: { quantity: -quantity } },
      { returnDocument: "after" },
    );
    if (!item) {
      throw `Item not found`;
    }
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
};

export default usersMethods;
