import express from "express";
import { register, login, getUserProfile, logout, updateProfile, getCurrentUser } from "../controllers/user.controller.js"; // Import login
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { uploadMedia } from "../utils/cloudinary.js";
import upload from "../utils/multer.js";

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login); // Now login is properly defined
router.route("/logout").get(logout);
router.route("/profile").get(isAuthenticated, getUserProfile);
router.route("/profile/update").put(isAuthenticated, upload.single("profilePhoto"), updateProfile);
router.route("/me").get(isAuthenticated, getCurrentUser);

export default router;
