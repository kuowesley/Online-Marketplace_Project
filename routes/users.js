import { Router } from "express";
import validation from "../data/validation.js";
import { usersData } from "../data/index.js";

const router = Router();

router.get("/login", async (req, res) => {
  return res.status(200).render("login", { title: "Login" });
});

router.post("/login", async (req, res) => {
  const data = req.body;
  let userName = data.usernameInput;
  let password = data.passwordInput;
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
  let firstName = data.firstNameInput;
  let lastName = data.lastNameInput;
  let userName = data.userNameInput;
  let email = data.emailAddressInput;
  let password = data.passwordInput;
  let confirmPassword = data.confirmPasswordInput;
  let street = data.streetInput;
  let city = data.cityInput;
  let state = data.stateInput;
  let zipcode = data.zipcodeInput;
  let age = data.ageInput;

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
  let itemId = body.itemId;
  let quantity = body.quantity;
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
    return res.status(403).json({ message: false });
  }
  try {
    await usersData.checkOutItems(req.session.user.userId);
    return res.status(200).json({ message: "Check out successful!" });
  } catch (e) {
    return res.status(400).json({ message: e });
  }
});

router.route("/removCartItem").post(async (req, res) => {
  if (!req.session.user) {
    return res.status(403).json({ message: false });
  }
  const body = req.body;
  let itemId = body.itemId;
  try {
    itemId = validation.checkId(itemId, "itemId");
    await usersData.removeCartItem(req.session.user.userId, itemId);
    return res.status(200).json({ message: "remove successful" });
  } catch (e) {
    return res.status(400).json({ message: e });
  }
});

export default router;
