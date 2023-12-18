// upload item
import usersData from "../data/users.js";
import items from "../data/items.js";
import { users } from "../config/mongoCollections.js";
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
let item7 = {};
let item8 = {};
let item9 = {};
let item10 = {};
let item11 = {};

let user1;
let user2;
let user3;

const currentFilePath = fileURLToPath(import.meta.url);
const currentDirPath = path.dirname(currentFilePath);
const uploadDirPath = path.join(currentDirPath, "..", "img");

try {
  user1 = await usersData.addUser(
    "user1FirstName",
    "user1LastName",
    "user1",
    "test@gmail.com",
    "K@123456",
    "testStreet",
    "Hoboken",
    "NJ",
    "07030",
    26,
  );
  console.log(user1);
} catch (e) {
  console.log(e);
}

try {
  user2 = await usersData.addUser(
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
  console.log(user2);
} catch (e) {
  console.log(e);
}

try {
  user3 = await usersData.addUser(
    "user3FirstName",
    "user3LastName",
    "user3",
    "user3@gmail.com",
    "K@123456",
    "test3Street",
    "Brooklyn",
    "NY",
    "07036",
    50,
  );
  console.log(user3);
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
    "900 Madison St, Hoboken, NJ 07030",
    "meetup",
    "new",
    user1._id.toString(),
  );
  await usersData.getItemToItemsForSale(
    user1._id.toString(),
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
    "1423Clinton St, Hoboken, NJ 07030",
    "shipping",
    "new",
    user1._id.toString(),
  );
  await usersData.getItemToItemsForSale(
    user1._id.toString(),
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
    30,
    "828 Broadway, New York, NY 10003",
    "shipping",
    "new",
    user1._id.toString(),
  );
  await usersData.getItemToItemsForSale(
    user1._id.toString(),
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
    5,
    "26th St, New York, NY 10010",
    "meetup",
    "new",
    user2._id.toString(),
  );
  await usersData.getItemToItemsForSale(
    user2._id.toString(),
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
    20,
    "117MacDougal St, New York, NY 10012",
    "shipping",
    "new",
    user2._id.toString(),
  );
  await usersData.getItemToItemsForSale(
    user2._id.toString(),
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
    10,
    "235Bowery, New York, NY 10002",
    "meetup",
    "new",
    user2._id.toString(),
  );
  await usersData.getItemToItemsForSale(
    user2._id.toString(),
    item6.insertedId.toString(),
  );
  console.log(item6);
} catch (e) {
  console.error(e);
}

try {
  let imagePathList = [];
  let imagesList = [];
  let imagePath = path.join(uploadDirPath, "chair.jpg");
  let binaryImage = fs.readFileSync(imagePath);
  imagePathList.push(imagePath);
  imagesList.push(binaryImage);
  imagePath = path.join(uploadDirPath, "chair2.jpg");
  binaryImage = fs.readFileSync(imagePath);
  imagesList.push(binaryImage);
  imagePath = path.join(uploadDirPath, "chair3.jpg");
  binaryImage = fs.readFileSync(imagePath);
  imagesList.push(binaryImage);
  item7 = await items.uploadItem(
    "chair",
    250,
    "kitchen chairs",
    imagesList,
    12,
    "10007, New York",
    "meetup",
    "new",
    user3._id.toString(),
  );
  await usersData.getItemToItemsForSale(
    user3._id.toString(),
    item7.insertedId.toString(),
  );
  console.log(item7);
} catch (e) {
  console.error(e);
}

try {
  let imagePathList = [];
  let imagesList = [];
  let imagePath = path.join(uploadDirPath, "Dartboard.jpg");
  let binaryImage = fs.readFileSync(imagePath);
  imagePathList.push(imagePath);
  imagesList.push(binaryImage);
  item8 = await items.uploadItem(
    "Dartboard",
    2500,
    "Dartboard(with Dart)",
    imagesList,
    13,
    "420 Grand St, Jersey City, NJ 07302",
    "shipping",
    "new",
    user3._id.toString(),
  );
  await usersData.getItemToItemsForSale(
    user3._id.toString(),
    item8.insertedId.toString(),
  );
  console.log(item8);
} catch (e) {
  console.error(e);
}

try {
  let imagePathList = [];
  let imagesList = [];
  let imagePath = path.join(uploadDirPath, "shoes.jpg");
  let binaryImage = fs.readFileSync(imagePath);
  imagePathList.push(imagePath);
  imagesList.push(binaryImage);
  item9 = await items.uploadItem(
    "shoes",
    2500,
    "shoes(8.5 sport)",
    imagesList,
    30,
    "176Palisade Ave, Jersey City, NJ 07306",
    "shipping",
    "new",
    user3._id.toString(),
  );
  await usersData.getItemToItemsForSale(
    user3._id.toString(),
    item9.insertedId.toString(),
  );
  console.log(item9);
} catch (e) {
  console.error(e);
}

try {
  let imagePathList = [];
  let imagesList = [];
  let imagePath = path.join(uploadDirPath, "scooter.jpg");
  let binaryImage = fs.readFileSync(imagePath);
  imagePathList.push(imagePath);
  imagesList.push(binaryImage);
  imagePath = path.join(uploadDirPath, "scooter2.jpg");
  binaryImage = fs.readFileSync(imagePath);
  imagesList.push(binaryImage);
  item10 = await items.uploadItem(
    "scooter",
    300,
    "scooter(with locker))",
    imagesList,
    30,
    "376 Central Ave, Jersey City, NJ 07037",
    "meetup",
    "new",
    user3._id.toString(),
  );
  await usersData.getItemToItemsForSale(
    user3._id.toString(),
    item10.insertedId.toString(),
  );
  console.log(item10);
} catch (e) {
  console.error(e);
}

try {
  let imagePathList = [];
  let imagesList = [];
  let imagePath = path.join(uploadDirPath, "trash_can.jpg");
  let binaryImage = fs.readFileSync(imagePath);
  imagePathList.push(imagePath);
  imagesList.push(binaryImage);
  imagePath = path.join(uploadDirPath, "trash_can2.jpg");
  binaryImage = fs.readFileSync(imagePath);
  imagesList.push(binaryImage);
  item11 = await items.uploadItem(
    "trash_can",
    300,
    "trash_can",
    imagesList,
    10,
    "714Summit Avenue Entrance on, 8th St, Union City, NJ 07087",
    "shipping",
    "new",
    user3._id.toString(),
  );
  await usersData.getItemToItemsForSale(
    user3._id.toString(),
    item11.insertedId.toString(),
  );
  console.log(item11);
} catch (e) {
  console.error(e);
}

// shopping cart and checkout test casse

//user1
try {
  await usersData.getItemToCart(
    user1._id.toString(),
    item4.insertedId.toString(),
    4,
  );
} catch (e) {
  console.log(e);
}
try {
  await usersData.getItemToCart(
    user1._id.toString(),
    item5.insertedId.toString(),
    2,
  );
} catch (e) {
  console.log(e);
}
try {
  await usersData.getItemToCart(
    user1._id.toString(),
    item10.insertedId.toString(),
    1,
  );
} catch (e) {
  console.log(e);
}
try {
  await usersData.getItemToCart(
    user1._id.toString(),
    item11.insertedId.toString(),
    1,
  );
} catch (e) {
  console.log(e);
}
try {
  await usersData.checkOutItems(user1._id.toString());
} catch (e) {
  console.log(e);
}
try {
  await usersData.getItemToCart(
    user1._id.toString(),
    item6.insertedId.toString(),
    3,
  );
} catch (e) {
  console.log(e);
}
try {
  await usersData.getItemToCart(
    user1._id.toString(),
    item7.insertedId.toString(),
    3,
  );
} catch (e) {
  console.log(e);
}
try {
  await usersData.getItemToCart(
    user1._id.toString(),
    item8.insertedId.toString(),
    1,
  );
} catch (e) {
  console.log(e);
}

//      user2
try {
  await usersData.getItemToCart(
    user2._id.toString(),
    item1.insertedId.toString(),
    7,
  );
} catch (e) {
  console.log(e);
}
try {
  await usersData.getItemToCart(
    user2._id.toString(),
    item3.insertedId.toString(),
    4,
  );
} catch (e) {
  console.log(e);
}
try {
  await usersData.getItemToCart(
    user2._id.toString(),
    item8.insertedId.toString(),
    2,
  );
} catch (e) {
  console.log(e);
}
try {
  await usersData.getItemToCart(
    user2._id.toString(),
    item9.insertedId.toString(),
    6,
  );
} catch (e) {
  console.log(e);
}
try {
  await usersData.checkOutItems(user2._id.toString());
} catch (e) {
  console.log(e);
}
try {
  await usersData.getItemToCart(
    user2._id.toString(),
    item2.insertedId.toString(),
    4,
  );
} catch (e) {
  console.log(e);
}
try {
  await usersData.getItemToCart(
    user2._id.toString(),
    item9.insertedId.toString(),
    4,
  );
} catch (e) {
  console.log(e);
}
try {
  await usersData.getItemToCart(
    user2._id.toString(),
    item10.insertedId.toString(),
    7,
  );
} catch (e) {
  console.log(e);
}
try {
  await usersData.getItemToCart(
    user2._id.toString(),
    item11.insertedId.toString(),
    7,
  );
} catch (e) {
  console.log(e);
}

//          user3
try {
  await usersData.getItemToCart(
    user3._id.toString(),
    item5.insertedId.toString(),
    7,
  );
} catch (e) {
  console.log(e);
}
try {
  await usersData.getItemToCart(
    user3._id.toString(),
    item6.insertedId.toString(),
    1,
  );
} catch (e) {
  console.log(e);
}
try {
  await usersData.checkOutItems(user3._id.toString());
} catch (e) {
  console.log(e);
}
try {
  await usersData.getItemToCart(
    user3._id.toString(),
    item1.insertedId.toString(),
    1,
  );
} catch (e) {
  console.log(e);
}
try {
  await usersData.getItemToCart(
    user3._id.toString(),
    item1.insertedId.toString(),
    1,
  );
} catch (e) {
  console.log(e);
}

//add Rating and Comment

// user1

try {
  await usersData.submitComment(
    item5.insertedId.toString(),
    "2 stars",
    "NOT SO GOOD",
    user1._id.toString(),
  );
} catch (e) {
  console.log(e);
}

try {
  await usersData.submitComment(
    item11.insertedId.toString(),
    "3 stars",
    "Not so BAD",
    user1._id.toString(),
  );
} catch (e) {
  console.log(e);
}

//    user2
try {
  await usersData.submitComment(
    item3.insertedId.toString(),
    "1 stars",
    "Broken items!!!",
    user2._id.toString(),
  );
} catch (e) {
  console.log(e);
}

try {
  await usersData.submitComment(
    item8.insertedId.toString(),
    "1 stars",
    "Waste my money",
    user2._id.toString(),
  );
} catch (e) {
  console.log(e);
}
try {
  await usersData.submitComment(
    item9.insertedId.toString(),
    "1 stars",
    "DOG SHIT",
    user2._id.toString(),
  );
} catch (e) {
  console.log(e);
}

//    user3

try {
  await usersData.submitComment(
    item5.insertedId.toString(),
    "4 stars",
    "SUPERRRRRRRR!!!",
    user3._id.toString(),
  );
} catch (e) {
  console.log(e);
}

try {
  const usersDataCollection = await users();
  let transactionInfo = await usersDataCollection.findOne(
    {
      $and: [
        { _id: user3._id },
        { "timeToBeDetermined.itemId": item6.insertedId.toString() },
      ],
    },
    { projection: { _id: 0, "timeToBeDetermined.$": 1 } },
  );
  if (transactionInfo) {
    transactionInfo = transactionInfo.timeToBeDetermined[0];
    await usersData.submitMeetUpTimeToSeller(
      user3._id.toString(),
      transactionInfo.transactionId.toString(),
      "2024-12-28T16:23",
    );

    let sellTransactionInfo = await usersDataCollection.findOne(
      {
        $and: [
          { _id: user2._id },
          { "confirmMeetUpTime.itemId": item6.insertedId.toString() },
        ],
      },
      { projection: { _id: 0, "confirmMeetUpTime.$": 1 } },
    );
    sellTransactionInfo = sellTransactionInfo.confirmMeetUpTime[0];
    await usersData.confirmMeetUpTime(
      sellTransactionInfo.transactionId.toString(),
      user2._id.toString(),
      user3._id.toString(),
    );
  }
} catch (e) {
  console.log(e);
}

try {
  await usersData.submitComment(
    item6.insertedId.toString(),
    "2 stars",
    "NOT SO GOOD",
    user3._id.toString(),
  );
} catch (e) {
  console.log(e);
}

console.log("Done");
