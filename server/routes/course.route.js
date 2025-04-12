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
  togglePublishCourse,
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

router.route("/").post(isAuthenticated,createCourse);
router.route("/published-courses").get(isAuthenticated, getPublishedCourse);
router.route("/").get(isAuthenticated,getCreatorCourses);
router.route("/:courseId").put(isAuthenticated,upload.single("courseThumbnail"),editCourse);
router.route("/:courseId").get(isAuthenticated,getCourseById);
router.route("/:courseId/lecture").post(isAuthenticated, createLecture);
router.route("/:courseId/lecture").get(isAuthenticated, getCourseLecture);
router.route("/:courseId/lecture/:lectureId").post(isAuthenticated, editLecture);
router.route("/lecture/:lectureId").delete(isAuthenticated, removeLecture);
router.route("/lecture/:lectureId").get(isAuthenticated, getLectureById);
router.route("/:courseId").patch(isAuthenticated, togglePublishCourse);

export default router;
