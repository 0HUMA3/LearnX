import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import {
  createCourse,
  createLecture,
  editCourse,
  editLecture,
  getCourseById,
  getCourseLecture,
  getCreatorCourses,
  getLectureById,
  getPublishedCourse,
  removeLecture,
  searchCourse,
  togglePublishCourse,
} from "../controllers/course.controller.js";
import upload from "../utils/multer.js";

const router = express.Router();

// 🔒 Create course
router.post(
  "/",
  isAuthenticated,
  upload.single("courseThumbnail"),
  createCourse
);

// 🔍 Search courses — define BEFORE dynamic routes
router.get("/search", isAuthenticated, searchCourse);

// ✅ Get all published courses
router.get("/published-courses",getPublishedCourse);

// 📚 Get all courses by creator
router.get("/", isAuthenticated, getCreatorCourses);

// 📘 Get course by ID
router.get("/:courseId", isAuthenticated, getCourseById);

// ✏️ Edit course
router.put(
  "/:courseId",
  isAuthenticated,
  upload.single("courseThumbnail"),
  editCourse
);

// 🔀 Toggle publish status
router.patch("/:courseId", isAuthenticated, togglePublishCourse);

// 🎥 Lecture routes
router.post("/:courseId/lecture", isAuthenticated, createLecture);
router.get("/:courseId/lecture", isAuthenticated, getCourseLecture);
router.post("/:courseId/lecture/:lectureId", isAuthenticated, editLecture);
router.get("/lecture/:lectureId", isAuthenticated, getLectureById);
router.delete("/lecture/:lectureId", isAuthenticated, removeLecture);

export default router;
