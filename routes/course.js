const express = require("express");
const CourseController = require("../controllers/course");

// Middleware
const md_auth = require("../middleware/authenticated");

// Api Router
const api = express.Router();

// Course's routing

api.post("/create-course", [md_auth.ensureAuth], CourseController.createCurse);
api.delete(
  "/delete-course/:id",
  [md_auth.ensureAuth],
  CourseController.deleteCourse
);

api.put(
  "/update-course/:id",
  [md_auth.ensureAuth],
  CourseController.updateCourse
);
api.get("/get-courses", CourseController.getCourses);

// Export api
module.exports = api;
