// upload item
import users from "../data/users.js";
import items from "../data/items.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dbConnection, closeConnection } from "../config/mongoConnection.js";
const db = await dbConnection();
await db.dropDatabase();

let item1 = {};
let item2 = {};
let item3 = {};
let item4 = {};
let item5 = {};
let item6 = {};

let res;
let user2;

const currentFilePath = fileURLToPath(import.meta.url);
const currentDirPath = path.dirname(currentFilePath);
const uploadDirPath = path.join(currentDirPath, "..", "img");

try {
  res = await users.addUser(
    "testFirstName",
    "testLastName",
    "test",
    "test@gmail.com",
    "K@123456",
    "testStreet",
    "Hoboken",
    "NJ",
    "07030",
    26,
  );
  console.log(res);
} catch (e) {
  console.log(e);
}

try {
  user2 = await users.addUser(
    "user2FirstName",
    "user2LastName",
    "user2",
    "user2@gmail.com",
    "K@123456",
    "test2Street",
    "Hoboken",
    "NJ",
    "07036",
    88,
  );
  console.log(res);
} catch (e) {
  console.log(e);
}

try {
  let imagePathList = [];
  let imagesList = [];
  let imagePath = path.join(uploadDirPath, "couch.jpg");
  let binaryImage = fs.readFileSync(imagePath);
  imagePathList.push(imagePath);
  imagesList.push(binaryImage);
  item1 = await items.uploadItem(
    "Cozy counch",
    20,
    "Light grey counch",
    imagesList,
    10,
    "Brooklyn, NY",
    "Meetup",
    "Like New",
    res._id.toString(),
  );
  await users.getItemToItemsForSale(
    res._id.toString(),
    item1.insertedId.toString(),
  );
  console.log(item1);
} catch (e) {
  console.error(e);
}

try {
  let imagePathList = [];
  let imagesList = [];
  let imagePath = path.join(uploadDirPath, "drawer.jpg");
  let binaryImage = fs.readFileSync(imagePath);
  imagePathList.push(imagePath);
  imagesList.push(binaryImage);
  item2 = await items.uploadItem(
    "Drawer",
    10,
    "White grey counch",
    imagesList,
    15,
    "Union City, NJ",
    "Meetup",
    "Good",
    res._id.toString(),
  );
  await users.getItemToItemsForSale(
    res._id.toString(),
    item2.insertedId.toString(),
  );
  console.log(item2);
} catch (e) {
  console.error(e);
}

try {
  let imagePathList = [];
  let imagesList = [];
  let imagePath = path.join(uploadDirPath, "iphone.jpg");
  let binaryImage = fs.readFileSync(imagePath);
  imagePathList.push(imagePath);
  imagesList.push(binaryImage);
  item3 = await items.uploadItem(
    "iPhone",
    399,
    "iPhone 12, Black",
    imagesList,
    3,
    "Jersey City, NJ",
    "Meetup",
    "Good",
    res._id.toString(),
  );
  await users.getItemToItemsForSale(
    res._id.toString(),
    item3.insertedId.toString(),
  );
  console.log(item3);
} catch (e) {
  console.error(e);
}

try {
  let imagePathList = [];
  let imagesList = [];
  let imagePath = path.join(uploadDirPath, "mattress.jpg");
  let binaryImage = fs.readFileSync(imagePath);
  imagePathList.push(imagePath);
  imagesList.push(binaryImage);
  item4 = await items.uploadItem(
    "Mattress",
    70,
    "Gel Memory Foam",
    imagesList,
    1,
    "West New York, NJ",
    "Meetup",
    "Good",
    res._id.toString(),
  );
  await users.getItemToItemsForSale(
    res._id.toString(),
    item4.insertedId.toString(),
  );
  console.log(item4);
} catch (e) {
  console.error(e);
}

try {
  let imagePathList = [];
  let imagesList = [];
  let imagePath = path.join(uploadDirPath, "ricecooker.jpg");
  let binaryImage = fs.readFileSync(imagePath);
  imagePathList.push(imagePath);
  imagesList.push(binaryImage);
  item5 = await items.uploadItem(
    "Rice Cooker",
    30,
    "ZOJIRUSHI 10-cup rice cooker",
    imagesList,
    1,
    "Union City, NJ",
    "Meetup",
    "Very Good",
    res._id.toString(),
  );
  await users.getItemToItemsForSale(
    res._id.toString(),
    item5.insertedId.toString(),
  );
  console.log(item5);
} catch (e) {
  console.error(e);
}

try {
  let imagePathList = [];
  let imagesList = [];
  let imagePath = path.join(uploadDirPath, "table.jpg");
  let binaryImage = fs.readFileSync(imagePath);
  imagePathList.push(imagePath);
  imagesList.push(binaryImage);
  item6 = await items.uploadItem(
    "table",
    25,
    "Computer Desk",
    imagesList,
    1,
    "Hoboken, NJ",
    "Meetup",
    "Good",
    res._id.toString(),
  );
  await users.getItemToItemsForSale(
    res._id.toString(),
    item6.insertedId.toString(),
  );
  console.log(item6);
} catch (e) {
  console.error(e);
}
