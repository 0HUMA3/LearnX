import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import {
  createCourse,
  editCourse,
  getCourseById,
  getCreatorCourses,
} from "../controllers/course.controller.js";
import upload from "../utils/multer.js";

const router = express.Router();

// POST /api/v1/course — Create a course (with thumbnail upload)
router.post(
  "/",
  isAuthenticated,
  upload.single("courseThumbnail"), // Make sure your form field is named "courseThumbnail"
  createCourse
);

// GET /api/v1/course — Get all courses by creator
router.get("/", isAuthenticated, getCreatorCourses);

// PUT /api/v1/course/:courseId — Update course (with optional new thumbnail)
router.put(
  "/:courseId",
  isAuthenticated,
  upload.single("courseThumbnail"),
  editCourse
);

router.route("/:courseId").get(isAuthenticated,getCourseById);

export default router;
