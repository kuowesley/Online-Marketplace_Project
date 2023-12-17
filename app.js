import express from "express";
import constructorMethod from "./routes/index.js";
import cookieParser from "cookie-parser";
import exphbs from "express-handlebars";
import session from "express-session";
import { fileURLToPath } from "url";
import { dirname } from "path";
import multer from "multer";
import fs from "fs";
import path from "path";

// set up express server
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const staticDir = express.static(__dirname + "/public");
// -------------------------------
import handlebarsHelpers from "handlebars-helpers";

const hbs = exphbs.create({
  helpers: {
    ...handlebarsHelpers(),
    length: function (array) {
      return array.length;
    },
  },
});

hbs.handlebars.registerHelper("mod", function (num, mod) {
  return num % mod;
});

hbs.handlebars.registerHelper("range", function (value) {
  return new Array(value).fill().map((_, index) => index + 1);
});

hbs.handlebars.registerHelper("min", function (val1, val2) {
  return Math.min(val1, val2);
});

hbs.handlebars.registerHelper("checkBoolean", function (value) {
  if (value) {
    return false;
  } else {
    return true;
  }
});

// clean pictrues from public/img
function cleanImageFolder() {
  const currentFilePath = fileURLToPath(import.meta.url);
  const currentDirPath = path.dirname(currentFilePath);
  const imgPath = path.join(currentDirPath, "public", "img");
  fs.readdir(imgPath, (err, files) => {
    if (err) throw err;

    for (const file of files) {
      fs.unlink(path.join(imgPath, file), (err) => {
        if (err) throw err;
      });
    }
  });
}
// -------------------------------

// For parsing application/json
app.use("/img", express.static(__dirname + "/img"));
app.use("/public", staticDir);
app.use(express.json());

// For parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
app.engine("handlebars", exphbs.engine({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// config cookie
app.use(cookieParser());

// config for image, Set up Multer
let upload = multer({ dest: "upload/" });
let type = upload.array("fileInput");

// set up static file path
app.use("/public", staticDir);

// TODO: Set up session, Cookie expire time
app.use(
  session({
    name: "AuthState",
    secret: "some secret string!",
    resave: false,
    saveUninitialized: false,
  }),
);

// ---------------------------------------------
// TODO Log out method and url for debugging, remove after complete
// set up varible
let currentTimestamp, requestMethod, requestRoute;
// middleware start
// every requests
app.use("/", type, async (req, res, next) => {
  // Current Timestamp: new Date().toUTCString()
  currentTimestamp = new Date().toUTCString();
  // Request Method: req.method
  requestMethod = req.method;
  // Request Route: req.originalUrl
  requestRoute = req.originalUrl;
  console.log(`[${currentTimestamp}]: ${requestMethod} ${requestRoute}`);
  next();
});

app.use("/users/login", async (req, res, next) => {
  if (req.method === "GET") {
    if (req.session.user) {
      return res.redirect("/");
    }
  }
  next();
});

app.use("/users/signup", async (req, res, next) => {
  if (req.method === "GET") {
    if (req.session.user) {
      return res.redirect("/");
    }
  }
  next();
});

app.use("/users/logout", async (req, res, next) => {
  if (req.method === "GET") {
    if (!req.session.user) {
      return res.render("home", { title: "Home" });
    }
  }
  next();
});

app.use("/users/shoppingCart", async (req, res, next) => {
  if (req.method === "GET") {
    if (!req.session.user) {
      return res.redirect("/users/login");
    }
  }
  next();
});

app.use("/users/profile", async (req, res, next) => {
  if (req.method === "GET") {
    if (!req.session.user) {
      return res.redirect("/users/login");
    }
  }
  next();
});

app.use("/upload", async (req, res, next) => {
  if (req.method === "GET") {
    if (!req.session.user) {
      return res.redirect("/users/login");
    }
  }
  next();
});

// ---------------------------------------------

/**
TODO: Middleware
 */

cleanImageFolder();
constructorMethod(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000");
});
