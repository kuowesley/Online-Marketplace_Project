import { Router } from "express";
import fs from "fs";
import path from "path";
import multer from "multer";
import validation from "../data/validation.js";
import items from "../data/items.js";
import { Binary, ObjectId } from "mongodb";
import { fileURLToPath } from "url";
import { usersData } from "../data/index.js";
import xss from "xss";
import sellers from "../data/users.js";

const router = Router();

// upload file
const currentFilePath = fileURLToPath(import.meta.url);
const currentDirPath = path.dirname(currentFilePath);
const uploadDirPath = path.join(currentDirPath, "..", "upload");

router
  .route("/")
  .get(async (req, res) => {
    res.render("home", { title: "Home", user: req.session.user });
  })
  .post(async (req, res) => {});

router
  .route("/upload")
  .get(async (req, res) => {
    return res.render("uploadItem", { user: req.session.user });
  })
  .post(async (req, res) => {
    // https://blog.logrocket.com/multer-nodejs-express-upload-file/
    let uploadPostData = req.body;
    uploadPostData.itemName = xss(uploadPostData.itemName);
    uploadPostData.description = xss(uploadPostData.description);
    uploadPostData.price = xss(uploadPostData.price);
    uploadPostData.quantity = xss(uploadPostData.quantity);
    uploadPostData.transaction_date = xss(uploadPostData.transaction_date);
    uploadPostData.location = xss(uploadPostData.location);
    uploadPostData.deliveryMethod = xss(uploadPostData.deliveryMethod);
    uploadPostData.condition = xss(uploadPostData.condition);

    let files = req.files;
    let errors = [];

    // login check
    if (!req.session.user) {
      return res.send("Please login first");
    }
    let seller_id = req.session.user.userId;

    // TODO input validation
    // check array
    try {
      // check string input
      uploadPostData.itemName = validation.checkItemName(
        uploadPostData.itemName,
        `itemName`,
      );
      uploadPostData.description = validation.checkDescription(
        uploadPostData.description,
        `description`,
      );
      uploadPostData.transaction_date = validation.checkTransactionDate(
        uploadPostData.transaction_date,
        `transaction_date`,
      );
      uploadPostData.location = validation.checkLocation(
        uploadPostData.location,
        `location`,
      );
      uploadPostData.deliveryMethod = validation.checkDeliveryMethod(
        uploadPostData.deliveryMethod,
        `deliveryMethod`,
      );
      uploadPostData.condition = validation.checkCondition(
        uploadPostData.condition,
        `condition`,
      );

      // check price, quantity
      // check string first
      uploadPostData.price = validation.checkString(
        uploadPostData.price,
        `price`,
      );
      uploadPostData.quantity = validation.checkString(
        uploadPostData.quantity,
        `quantity`,
      );

      // change to Number
      uploadPostData.price = validation.checkRoutePriceQuantity(
        uploadPostData.price,
        `price`,
      );
      uploadPostData.quantity = validation.checkRoutePriceQuantity(
        uploadPostData.quantity,
        `quantity`,
      );

      // check price, quantity
      uploadPostData.price = validation.checkPrice(
        uploadPostData.price,
        `price`,
      );
      uploadPostData.quantity = validation.checkQuantity(
        uploadPostData.quantity,
        `quantity`,
      );

      // TODO file validation
    } catch (e) {
      errors.push(e);
    }

    // You can access the uploaded file details using req.file
    let imagesList = [];
    let imagePathList = [];

    // get file path and image

    try {
      for (let i in files) {
        for (let i in files) {
          let imagePath = path.join(uploadDirPath, files[i].filename);
          let binaryImage = fs.readFileSync(imagePath);
          imagePathList.push(imagePath);
          imagesList.push(binaryImage);
        }
      }
    } catch (e) {
      errors.push(e);
    }

    // if no errors start uploading
    let itemsInfo;
    if (errors.length === 0) {
      try {
        itemsInfo = await items.uploadItem(
          uploadPostData.itemName, // item Name
          uploadPostData.price, // Price
          uploadPostData.description, // Description
          imagesList, // Item Picture Array of buffer
          uploadPostData.quantity, // Quantity
          uploadPostData.location, // Location
          uploadPostData.deliveryMethod, // DeliveryMethod
          uploadPostData.condition, // Condition
          seller_id,
        );
        console.log(itemsInfo);

        await usersData.getItemToItemsForSale(
          seller_id,
          itemsInfo.insertedId.toString(),
        );
      } catch (e) {
        errors.push(e);
      }
    }

    // remove local file no matter how
    try {
      for (let i in imagePathList) {
        if (fs.existsSync(imagePathList[i])) {
          fs.unlinkSync(imagePathList[i]);
        }
      }
    } catch (e) {
      errors.push(e);
    }

    // if errors
    if (errors.length > 0) {
      // do this with return
      console.log(`errors:${errors}`);
      return res.render("uploadItem", {
        user: req.session.user,
        itemName: uploadPostData.itemName,
        description: uploadPostData.description,
        price: uploadPostData.price,
        quantity: uploadPostData.quantity,
        transaction_date: uploadPostData.transaction_date,
        location: uploadPostData.location,
        deliveryMethod: uploadPostData.deliveryMethod,
        condition: uploadPostData.condition,
        errors: errors,
        hasErrors: true,
      });
    }

    return res.redirect(`/`);
    // TODO: redirect to item page
    // return res.redirect(`/items/${itemsInfo.insertedId.toString()}`)
  });

router.route("/items").get(async (req, res) => {
  try {
    let myItems = await items.getAll();
    res.render("allItems", {
      title: "Items",
      user: req.session.user,
      items: myItems,
    });
  } catch (e) {
    res.status(500).render("error", { errorMessage: e });
  }
});

router.route("/items/:id").get(async (req, res) => {
  try {
    let id = req.params.id;
    id = validation.checkId(id, "itemId");
    let thisItem = await items.getById(id);
    if (!thisItem) {
      res.status(404).render("error", { errorMessage: e });
    }
    res.render("itemById", { item: thisItem, user: req.session.user });
  } catch (e) {
    res.status(500).render("error", { errorMessage: e });
  }
});

router.route("/items/purchase").post(async (req, res) => {
  const body = req.body;
  let itemId = xss(body.itemId);
  let quantity = xss(body.quantity);
  if (!req.session.user) {
    return res.status(403).json({ message: false });
  }
  try {
    await items.purchaseItem(req.session.user.userId, itemId, quantity);
    return res.status(200).json({ message: "Purchase successful!" });
  } catch (e) {
    return res.status(400).json({ message: e });
  }
});

router.route("/items/search/:searchTerm").get(async (req, res) => {
  try {
    let searchTerm = xss(req.params.searchTerm);
    searchTerm = validation.checkString(searchTerm, "search entry");
    let result = await items.searchByDescription(searchTerm);
    if (!result) {
      res.status(404).render("error", { errorMessage: e });
    }
    res.status(200).json(result);
  } catch (e) {
    res.status(500).render("error", { errorMessage: e });
  }
});

export default router;
