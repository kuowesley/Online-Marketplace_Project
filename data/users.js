import validation from "./validation.js";
import { users } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";

const usersMethods = {
  async addUser(firstName, lastName, userName, email, password) {
    firstName = validation.checkString(firstName, "firstName");
    lastName = validation.checkString(lastName, "lastName");
    userName = validation.checkString(userName, "userName");
    email = validation.checkEmail(email);
    password = validation.checkString(password, "password");

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

  async getUserById(id) {
    id = validation.checkId(id);

    const usersCollection = await users();
    const user = await usersCollection.findOne({ _id: new ObjectId(id) });
    if (!user) {
      throw `Error : user not found`;
    }
    return user;
  },
};

export default usersMethods;
