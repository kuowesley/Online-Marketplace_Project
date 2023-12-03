import users from "./users.js";
import items from "./items.js";

const constructorMethod = (app) => {
  app.use("/users", users);
  app.use("/items", items);

  app.use("*", (req, res) => {
    return res.status(404).json({ error: "Not found" });
  });
};

export default constructorMethod;
