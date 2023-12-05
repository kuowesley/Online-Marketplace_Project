import express from "express";
import constructorMethod from "./routes/index.js";
import cookieParser from "cookie-parser";
import exphbs from "express-handlebars";
import session from "express-session";
import { fileURLToPath } from "url";
import { dirname } from "path";
import multer from "multer";

// set up express server
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const staticDir = express.static(__dirname + "/public");
import handlebarsHelpers from "handlebars-helpers";

const hbs = exphbs.create({
  helpers: {
    ...handlebarsHelpers(),
  },
});

hbs.handlebars.registerHelper("mod", function (num, mod) {
  return num % mod;
});

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
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const staticDir = express.static(__dirname + "/public");
app.use("/public", staticDir);

// config views
app.engine("handlebars", exphbs.engine({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

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
// ---------------------------------------------

/**
TODO: Middleware
 */

constructorMethod(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000");
});
