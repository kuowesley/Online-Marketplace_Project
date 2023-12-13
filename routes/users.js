import { Router } from "express";
import validation from "../data/validation.js";
import { usersData } from "../data/index.js";
import xss from "xss";
import { itemData } from "../data/index.js";

const router = Router();

router.get("/login", async (req, res) => {
  return res.status(200).render("login", { title: "Login" });
});

router.post("/login", async (req, res) => {
  const data = req.body;
  let userName = xss(data.usernameInput);
  let password = xss(data.passwordInput);
  try {
    userName = validation.checkString(userName, "userName");
    password = validation.checkPassword(password, "password");
    const userInfo = await usersData.loginUser(userName, password);
    req.session.user = {
      userId: userInfo._id.toString(),
      firstName: userInfo.firstName,
      lastName: userInfo.lastName,
      userName: userInfo.userName,
      email: userInfo.email,
    };

    return res
      .status(200)
      .render("home", { title: "Home", user: req.session.user });
  } catch (e) {
    return res.status(400).render("error", { errorMessage: e, title: "Error" });
  }
});

router.get("/signup", async (req, res) => {
  return res.render("signup", { title: "Sign Up" });
});

router.post("/signup", async (req, res) => {
  const data = req.body;
  let firstName = xss(data.firstNameInput);
  let lastName = xss(data.lastNameInput);
  let userName = xss(data.userNameInput);
  let email = xss(data.emailAddressInput);
  let password = xss(data.passwordInput);
  let confirmPassword = xss(data.confirmPasswordInput);
  let street = xss(data.streetInput);
  let city = xss(data.cityInput);
  let state = xss(data.stateInput);
  let zipcode = xss(data.zipcodeInput);
  let age = xss(data.ageInput);

  try {
    firstName = validation.checkString(firstName, "firstName");
    lastName = validation.checkString(lastName, "lastName");
    userName = validation.checkString(userName, "userName");
    email = validation.checkEmail(email);
    password = validation.checkPassword(password, "password");
    confirmPassword = validation.checkPassword(
      confirmPassword,
      "confirmPassword",
    );
    street = validation.checkStreet(street, "street");
    city = validation.checkCity(city, "city");
    state = validation.checkState(state, "state");
    zipcode = validation.checkZipcode(zipcode, "zipcode");
    age = validation.checkNumber(parseInt(age), "age");
    if (confirmPassword !== password) {
      return res.status(400).render("signup", {
        title: "Signup",
        errorMessage: "confirmPasswordInput does not match passwordInput",
        errorCode: 400,
      });
    }
    const newUser = await usersData.addUser(
      firstName,
      lastName,
      userName,
      email,
      password,
      street,
      city,
      state,
      zipcode,
      age,
    );
    if (!newUser) {
      return res.status(500).render("signup", {
        title: "Signup",
        errorMessage: "Internal Server Error",
        errorCode: 500,
      });
    }
    return res.redirect("/users/login");
  } catch (e) {
    return res
      .status(400)
      .render("signup", { title: "Signup", errorCode: 400, errorMessage: e });
  }
});

router.get("/logout", async (req, res) => {
  req.session.destroy();
  return res.status(200).render("home", { title: "Home" });
});

router.get("/shoppingCart", async (req, res) => {
  try {
    const items = await usersData.getShoppingCart(req.session.user.userId);
    return res.status(200).render("shoppingCart", {
      title: "ShoppingCart",
      user: req.session.user,
      items: items,
    });
  } catch (e) {
    return res.status(404).render("error", { errorMessage: e });
  }
});

router.route("/addToCart").post(async (req, res) => {
  const body = req.body;
  let itemId = xss(body.itemId);
  let quantity = xss(body.quantity);
  if (!req.session.user) {
    return res.status(403).json({ message: false });
  }
  try {
    itemId = validation.checkId(itemId, "itemId");
    await usersData.getItemToCart(req.session.user.userId, itemId, quantity);
    return res.status(200).json({ message: "Add to cart successful!" });
  } catch (e) {
    return res.status(400).json({ message: e });
  }
});

router.route("/checkOutShoppingCart").post(async (req, res) => {
  if (!req.session.user) {
    return res.status(403).json({ message: "Error, please try again" });
  }
  try {
    await usersData.checkOutItems(req.session.user.userId);
    return res.status(200).json({ message: "Check out successful!" });
  } catch (e) {
    return res.status(400).json({ message: e });
  }
});

router.route("/removeCartItem").post(async (req, res) => {
  if (!req.session.user) {
    return res.status(403).json({ message: false });
  }
  const body = req.body;
  let itemId = xss(body.itemId);
  try {
    itemId = validation.checkId(itemId, "itemId");
    await usersData.removeCartItem(req.session.user.userId, itemId);
    return res.status(200).json({ message: "Remove Successful" });
  } catch (e) {
    return res.status(400).json({ message: e });
  }
});

router.route("/removeListItem").post(async (req, res) => {
  if (!req.session.user) {
    return res.status(403).json({ message: false });
  }
  const body = req.body;
  let itemId = xss(body.itemId);
  try {
    itemId = validation.checkId(itemId, "itemId");
    await usersData.removeListItem(req.session.user.userId, itemId);
    return res.status(200).json({ message: "Remove Successful" });
  } catch (e) {
    return res.status(400).json({ message: e });
  }
});

router.get("/profile", async (req, res) => {
  return res.status(200).render("userProfile", { user: req.session.user });
});

router.get("/historicalPurchase", async (req, res) => {
  if (!req.session.user) {
    return res.redirect("/users/login");
  }
  try {
    const items = await usersData.getHistoricalPurchase(
      req.session.user.userId,
    );
    return res
      .status(200)
      .render("historicalPurchase", { user: req.session.user, items: items });
  } catch (e) {
    return res.status(404).render("error", { errorMessage: e });
  }
});

router.get("/historicalSoldItems", async (req, res) => {
  if (!req.session.user) {
    return res.redirect("/users/login");
  }
  try {
    const items = await usersData.getHistoricalSoldItems(
      req.session.user.userId,
    );
    return res
      .status(200)
      .render("historicalSoldItems", { user: req.session.user, items: items });
  } catch (e) {
    return res.status(404).render("error", { errorMessage: e });
  }
});

router.route("/submitComment").post(async (req, res) => {
  if (!req.session.user) {
    return res.status(403).json({ message: false });
  }
  const body = req.body;
  let itemId = xss(body.itemId);
  let rating = xss(body.rating);
  let comment = xss(body.comment);
  try {
    itemId = validation.checkId(itemId, "itemId");
    rating = validation.checkRating(rating, "rating");
    comment = validation.checkString(comment, "comment");
    await usersData.submitComment(itemId, rating, comment);
    return res.status(200).json({ message: "Comment Submitted" });
  } catch (e) {
    return res.status(400).json({ message: e });
  }
});

router.get("/itemsForSale", async (req, res) => {
  if (!req.session.user) {
    return res.redirect("/users/login");
  }
  try {
    const items = await usersData.getItemsForSale(req.session.user.userId);
    return res
      .status(200)
      .render("itemsForSale", { user: req.session.user, items: items });
  } catch (e) {
    return res.status(404).render("error", { errorMessage: e });
  }
});

router.get("/getSellerInformation/:id", async (req, res) => {
  try {
    let id = xss(req.params.id);
    id = validation.checkId(id, "itemId");
    let thisSeller = await usersData.getSellerInformation(id);
    if (!thisSeller) {
      res.status(404).render("error", { errorMessage: e });
    }
    let items = [];
    for (let i = 0; i < thisSeller.historical_sold_item.length; i++) {
      let itemId = thisSeller.historical_sold_item[i];
      let currentItem = await itemData.getById(itemId);
      if (!currentItem) {
        res.status(404).render("error", { errorMessage: e });
      }
      items.push(currentItem);
    }
    res.render("sellerInformation", {
      seller: thisSeller,
      items: items,
      user: req.session.user,
    });
  } catch (e) {
    res.status(500).render("error", { errorMessage: e });
  }
});

export default router;
