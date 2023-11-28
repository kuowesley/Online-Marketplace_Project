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

router.post("/login", async (req, res) => {});

router.get("/signup", async (req, res) => {
  res.render("signup", { title: "Sign Up" });
});

router.post("/signup", async (req, res) => {
  const data = req.body;
  let firstName = data.firstName;
  let lastName = data.lastName;
  let userName = data.userName;
  let email = data.email;
  let password = data.password;

  try {
    firstName = validation.checkString(firstName, "firstName");
    lastName = validation.checkString(lastName, "lastName");
    userName = validation.checkString(userName, "userName");
    email = validation.checkEmail(email);
    password = validation.checkString(password, "password");
    const newUser = await usersData.addUser(
      firstName,
      lastName,
      userName,
      email,
      password,
    );
    return res.send(newUser);
  } catch (e) {
    console.log(e);
    return res.send(e);
  }
});

export default router;
