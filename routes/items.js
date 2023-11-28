import { Router } from "express";
const router = Router();
import itemsFunction from "../data/items.js";
import validation from "../data/validation.js";
import { items } from "../config/mongoCollections.js";

router.route("/").get(async (req, res) => {
  res.render("home", { title: "Home" });
});

router.route("/items").get(async (req, res) => {
  try {
    let myItems = await itemsFunction.getAll();
    res.render("allItems", { items: myItems });
  } catch (e) {
    res.status(500).render("error", { errorMessage: e });
  }
});

router.route("/items/:id").get(async (req, res) => {
  let id = req.params.id;
  id = validation.checkId(id);
  try {
    let thisItem = await itemsFunction.getById(id);
    if (!thisItem) {
      res.status(404).render("error", { errorMessage: e });
    }
    res.render("itemById", { item: thisItem });
  } catch (e) {
    res.status(500).render("error", { errorMessage: e });
  }
});

export default router;
