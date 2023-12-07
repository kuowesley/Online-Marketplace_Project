// upload item
import items from "../data/items.js";
import users from "../data/users.js";
import { dbConnection, closeConnection } from "../config/mongoConnection.js";
const db = await dbConnection();
await db.dropDatabase();

let item1 = {};
let item2 = {};
let item3 = {};
let item4 = {};
let item5 = {};
let item6 = {};

try {
  item1 = await items.uploadItem(
    "Cozy counch",
    20,
    "Light grey counch",
    ["http://localhost:3000/img/couch.jpg"],
    10,
    "Brooklyn, NY",
    "Meetup",
    "Like New",
  );
  console.log(item1);
} catch (e) {
  console.error(e);
}

try {
  item2 = await items.uploadItem(
    "Drawer",
    10,
    "White grey counch",
    ["http://localhost:3000/img/drawer.jpg"],
    15,
    "Union City, NJ",
    "Meetup",
    "Good",
  );
  console.log(item2);
} catch (e) {
  console.error(e);
}

try {
  item3 = await items.uploadItem(
    "iPhone",
    399,
    "iPhone 12, Black",
    ["http://localhost:3000/img/iphone.jpg"],
    3,
    "Jersey City, NJ",
    "Meetup",
    "Good",
  );
  console.log(item3);
} catch (e) {
  console.error(e);
}

try {
  item4 = await items.uploadItem(
    "Mattress",
    0,
    "Gel Memory Foam",
    ["http://localhost:3000/img/mattress.jpg"],
    1,
    "West New York, NJ",
    "Meetup",
    "Good",
  );
  console.log(item4);
} catch (e) {
  console.error(e);
}

try {
  item5 = await items.uploadItem(
    "Rice Cooker",
    30,
    "ZOJIRUSHI 10-cup rice cooker",
    ["http://localhost:3000/img/ricecooker.jpg"],
    1,
    "Union City, NJ",
    "Meetup",
    "Very Good",
  );
  console.log(item5);
} catch (e) {
  console.error(e);
}

try {
  item6 = await items.uploadItem(
    "table",
    25,
    "Computer Desk",
    ["http://localhost:3000/img/table.jpg"],
    1,
    "Hoboken, NJ",
    "Meetup",
    "Good",
  );
  console.log(item6);
} catch (e) {
  console.error(e);
}

let res;
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
