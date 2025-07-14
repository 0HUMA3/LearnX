import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";
import { deleteMediaFromCloudinary, uploadMedia } from "../utils/cloudinary.js";

export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required."
            });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists with this email."
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            name,
            email,
            password: hashedPassword
        });

        return res.status(201).json({
            success: true,
            message: "Account created successfully."
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to register."
        });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required."
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Incorrect email or password."
            });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                success: false,
                message: "Incorrect email or password."
            });
        }

        generateToken(res, user); // Set token in cookie

        return res.status(200).json({
            success: true,
            message: `Welcome back, ${user.name}!`,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                photoUrl: user.photoUrl, // <--- Add this line
                role: user.role
            }
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to login."
        });
    }
};

export const logout = async (_, res) => {
    try {
        res.cookie("token", "", {
            httpOnly: true,
            expires: new Date(0)
        });

        return res.status(200).json({
            success: true,
            message: "Logged out successfully."
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to logout."
        });
    }
};

export const getUserProfile = async (req, res) => {
    try {
        const userId = req.id; // Assuming authentication middleware adds this
        const user = await User.findById(req.id).select("-password").populate("enrolledCourses");


//  console.log("Loaded user:", user);


        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Profile not found."
            });
        }

        return res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to load user profile."
        });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const userId = req.id;
        const { name } = req.body;
        const profilePhoto = req.file;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        let photoUrl = user.photoUrl;

        if (profilePhoto) {
            if (user.photoUrl) {
                const parts = user.photoUrl.split("/");
                const publicId = parts[parts.length - 1].split(".")[0];
                await deleteMediaFromCloudinary(publicId);
            }

            const cloudResponse = await uploadMedia(profilePhoto.path);
            photoUrl = cloudResponse.secure_url;
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { name, photoUrl },
            { new: true }
        ).select("-password");

        return res.status(200).json({
            success: true,
            user: updatedUser,
            message: "Profile updated successfully."
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to update profile."
        });
    }
};

// ✅ GET CURRENT USER (used in MyLearning)
export const getCurrentUser = async (req, res) => {
    try {
      const user = await User.findById(req.id).populate("enrolledCourses");
      console.log("User enrolledCourses:", user.enrolledCourses);


      if (!user) return res.status(404).json({ message: "User not found" });
  
      res.status(200).json({ user });
    } catch (error) {
      console.error("Error loading user:", error);
      res.status(500).json({ message: "Server error" });
    }
  };