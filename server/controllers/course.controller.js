import { Course } from "../models/course.model.js";
import { uploadMedia } from "../utils/cloudinary.js";
import mongoose from "mongoose";


export const createCourse = async (req, res) => {
    try {
        const { title, category} = req.body;
        const courseImage = req.file; // Uploaded file (if any)

        // Validate input fields
        if (!title || !category) {
            return res.status(400).json({
                success: false,
                message: "All fields are required."
            });
        }

        // Check if course already exists
        const existingCourse = await Course.findOne({ title });
        if (existingCourse) {
            return res.status(400).json({
                success: false,
                message: "A course with this title already exists."
            });
        }

        let courseImageUrl = "";

        // Upload course image if provided
        if (courseImage) {
            const uploadResponse = await uploadMedia(courseImage.path);
            courseImageUrl = uploadResponse.secure_url;
        }

        // Create a new course
        const newCourse = await Course.create({
            courseTitle:title,
            category,
            creator:new mongoose.Types.ObjectId("67eee64efa26d34cb81a0684") 
        });

        return res.status(201).json({
            success: true,
            message: "Course created successfully.",
            course: newCourse
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to create course."
        });
    }
};

export default createCourse;

export const getCreatorCourses = async (req, res) => {
        try {
            const userId = req.id;
        const courses = await Course.find({creator:userId});
        if(!courses){
            return res.status(404).json({
                courses:[],
                message:"Course not found"
            })
        };
        return res.status(200).json({
            courses,
        })
        } catch (error) {
            console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to create course."
        });
        }
}
