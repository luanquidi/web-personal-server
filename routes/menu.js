const express = require("express");
const MenuController = require("../controllers/menu");

// Middleware
const md_auth = require("../middleware/authenticated");

// Api Router
const api = express.Router();

// User's routing
api.post("/add-menu", [md_auth.ensureAuth], MenuController.addMenu);
api.put("/update-menu/:id", [md_auth.ensureAuth], MenuController.updateMenu);
api.delete("/delete-menu/:id", [md_auth.ensureAuth], MenuController.deleteMenu);
api.put(
  "/activate-menu/:id",
  [md_auth.ensureAuth],
  MenuController.activateAndDeactivateMenu
);
api.get("/get-menus", MenuController.getMenus);

// Export api
module.exports = api;
