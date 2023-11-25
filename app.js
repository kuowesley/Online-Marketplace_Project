import express from "express";
import constructorMethod from "./routes/index.js";
import exphbs from "express-handlebars";
import { fileURLToPath } from "url";
import { dirname } from "path";
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const staticDir = express.static(__dirname + "/public");

// For parsing application/json
app.use("/img", express.static(__dirname + "/img"));
app.use("/public", staticDir);
app.use(express.json());
// For parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
app.engine("handlebars", exphbs.engine({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

constructorMethod(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000");
});
