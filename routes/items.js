import { Router } from "express";
import fs from "fs";
import path from "path";
import multer from "multer";
import validation from "../data/validation.js";
import items from "../data/items.js";
import { Binary, ObjectId } from "mongodb";
import { fileURLToPath } from "url";

const router = Router();

// upload file
const currentFilePath = fileURLToPath(import.meta.url);
const currentDirPath = path.dirname(currentFilePath);
const uploadDirPath = path.join(currentDirPath, "..", "upload");

router
  .route("/")
  .get(async (req, res) => {
    res.render("home", { title: "Home" });
  })
  .post(async (req, res) => {});

router
  .route("/upload")
  .get(async (req, res) => {
    return res.render("uploadItem");
  })
  .post(async (req, res) => {
    // https://blog.logrocket.com/multer-nodejs-express-upload-file/
    let uploadPostData = req.body;
    let files = req.files;
    let errors = [];

    // change to correct type
    uploadPostData.price = Number(uploadPostData.price);
    uploadPostData.quantity = Number(uploadPostData.quantity);

    // TODO input validation

    // You can access the uploaded file details using req.file
    console.log("File uploaded:", files);
    console.log(uploadPostData);

    let imagesList = [];
    let imagePathList = [];
    try {
      for (let i in files) {
        let imagePath = path.join(uploadDirPath, files[i].filename);
        let binaryImage = fs.readFileSync(imagePath);
        imagePathList.push(imagePath);
        imagesList.push(binaryImage);
      }
      console.log(imagePathList);
      const itemsInfo = await items.uploadItem(
        uploadPostData.itemName,
        uploadPostData.price,
        uploadPostData.description,
        imagesList,
        uploadPostData.quantity,
        uploadPostData.location,
        uploadPostData.deliveryMethod,
        uploadPostData.condition,
      );

      for (let i in imagePathList) {
        fs.unlinkSync(imagePathList[i]);
      }
    } catch (e) {
      errors.push(e);
    }

    // if errors
    if (errors.length > 0) {
      return res.send(errors);
    }

    return res.send(req.body);
  });

router.route("/items").get(async (req, res) => {
  try {
    let myItems = await items.getAll();
    res.render("allItems", { items: myItems });
  } catch (e) {
    res.status(500).render("error", { errorMessage: e });
  }
});

router.route("/items/:id").get(async (req, res) => {
  try {
    let id = req.params.id;
    id = validation.checkId(id);
    let thisItem = await items.getById(id);
    if (!thisItem) {
      res.status(404).render("error", { errorMessage: e });
    }
    res.render("itemById", { item: thisItem });
  } catch (e) {
    res.status(500).render("error", { errorMessage: e });
  }
});

export default router;
