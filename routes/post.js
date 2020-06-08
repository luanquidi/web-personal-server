const express = require("express");
const PostController = require("../controllers/post");

// Middleware
const md_auth = require("../middleware/authenticated");

// Api Router
const api = express.Router();

// Newsletter's routing
api.post("/add-post", [md_auth.ensureAuth], PostController.addPost);
api.put("/update-post/:id", [md_auth.ensureAuth], PostController.updatePost);
api.delete("/delete-post/:id", [md_auth.ensureAuth], PostController.deletePost);
api.get("/get-posts", PostController.getPosts);
api.get("/get-post/:url", PostController.getPost);

// Export api
module.exports = api;
