import { Router } from "express";
import validation from "../data/validation.js";
import { usersData } from "../data/index.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    return res.send("success");
  } catch (e) {
    return res.send(e);
  }
});

router.get("/login", async (req, res) => {
  res.render("login", { title: "Login" });
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

    return res.status(200).render("home", { title: "Home" });
  } catch (e) {
    return res.status(400).render("error", { errorMessage: e, title: "Error" });
  }
});

router.get("/signup", async (req, res) => {
  res.render("signup", { title: "Sign Up" });
});

router.post("/signup", async (req, res) => {
  const data = req.body;
  let firstName = data.firstNameInput;
  let lastName = data.lastNameInput;
  let userName = data.userNameInput;
  let email = data.emailAddressInput;
  let password = data.passwordInput;
  let confirmPassword = data.confirmPasswordInput;

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
    console.log(e);
    return res
      .status(400)
      .render("signup", { title: "Signup", errorCode: 400, errorMessage: e });
  }
});

export default router;
