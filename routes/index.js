import users from "./users.js";

const constructorMethod = (app) => {
  app.use("/users", users);

  app.use("*", (req, res) => {
    return res.status(404).json({ error: "Not found" });
  });
};

export default constructorMethod;
