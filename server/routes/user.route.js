import express from "express";
import { register, login } from "../controllers/user.controller.js"; // Import login

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login); // Now login is properly defined

export default router;
