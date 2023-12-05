import validation from "./validation.js";
import { users } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import bcrypt from "bcryptjs";
const saltRounds = 16;
const usersMethods = {
  async addUser(firstName, lastName, userName, email, password) {
    firstName = validation.checkString(firstName, "firstName");
    lastName = validation.checkString(lastName, "lastName");
    userName = validation.checkString(userName, "userName");
    email = validation.checkEmail(email);
    password = validation.checkPassword(password, "password");
    password = await bcrypt.hash(password, saltRounds);

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
    id = validation.checkId(id);

    const usersCollection = await users();
    const user = await usersCollection.findOne({ _id: new ObjectId(id) });
    if (!user) {
      throw `Error : user not found`;
    }
    return user;
  },

  async getUserHistoricalPurchase(id) {
    id = validation.checkId(id);
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
    id = validation.checkId(id);
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
    id = validation.checkId(id);
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
};

export default usersMethods;
