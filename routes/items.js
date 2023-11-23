import { Router } from "express";
const router = Router();
import itemsFunction from "../data/items.js";

router.route("/").get(async (req, res) => {
  res.render("home", { title: "Home" });
});

router.route("/items").get(async (req, res) => {
  try {
    return res.send("success");
  } catch (e) {
    return res.send(e);
  }
});

export default router;
