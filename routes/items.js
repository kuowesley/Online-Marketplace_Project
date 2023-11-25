import { Router } from "express";
const router = Router();
import itemsFunction from "../data/items.js";

router.route("/").get(async (req, res) => {
  res.render("home", { title: "Home" });
});

router.route("/items").get(async (req, res) => {
  try {
    let myItems = await itemsFunction.getAll();
    res.render("allItems", { items: myItems });
  } catch (e) {
    res.status(400).render("error", { errorMessage: e });
  }
});

export default router;
