import { Course } from "../models/course.model.js";
import { Lecture } from "../models/lecture.model.js";
import { uploadMedia, deleteMediaFromCloudinary, deleteVideoFromCloudinary } from "../utils/cloudinary.js";
import mongoose from "mongoose";

// CREATE COURSE
export const createCourse = async (req, res) => {
    try {
        const { title, category } = req.body;
        const courseImage = req.file;

        if (!title?.trim() || !category?.trim()) {
            return res.status(400).json({
                success: false,
                message: "All fields are required."
            });
        }

        const existingCourse = await Course.findOne({ title });
        if (existingCourse) {
            return res.status(400).json({
                success: false,
                message: "A course with this title already exists."
            });
        }

        let courseImageUrl = "";
        if (courseImage) {
            const uploadResponse = await uploadMedia(courseImage.path);
            courseImageUrl = uploadResponse.secure_url;
        }

        const newCourse = await Course.create({
            courseTitle: title,
            category,
            courseThumbnail: courseImageUrl,
            creator: new mongoose.Types.ObjectId("67eee64efa26d34cb81a0684") // Replace with dynamic ID if needed
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

// GET CREATOR COURSES
export const getCreatorCourses = async (req, res) => {
    try {
        const userId = req.id;
        const courses = await Course.find({ creator: userId });

        if (!courses || courses.length === 0) {
            return res.status(404).json({
                courses: [],
                message: "No courses found for this creator."
            });
        }

        return res.status(200).json({
            success: true,
            courses
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch courses."
        });
    }
};

// EDIT COURSE
export const editCourse = async (req, res) => {
    try {
        const courseId = req.params.courseId;
        const { courseTitle, subTitle, description, category, courseLevel, coursePrice } = req.body;
        const thumbnail = req.file;

        let course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found!"
            });
        }

        let courseThumbnail;
        if (thumbnail) {
            if (course.courseThumbnail) {
                const publicId = course.courseThumbnail.split("/").pop().split(".")[0];
                await deleteMediaFromCloudinary(publicId);
            }
            courseThumbnail = await uploadMedia(thumbnail.path);
        }

        const updateData = {
            courseTitle,
            subTitle,
            description,
            category,
            courseLevel,
            coursePrice
        };

        if (courseThumbnail?.secure_url) {
            updateData.courseThumbnail = courseThumbnail.secure_url;
        }

        course = await Course.findByIdAndUpdate(courseId, updateData, { new: true });

        return res.status(200).json({
            success: true,
            message: "Course updated successfully.",
            course
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to update course."
        });
    }
};

export default createCourse;

export const getCourseById = async (req,res) => {
    try {
        const {courseId} = req.params;

        const course = await Course.findById(courseId);

        if(!course){
            return res.status(404).json({
                message:"Course not found!"
            })
        }
        return res.status(200).json({
            course
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to get course by id"
        });
    }
}

export const createLecture = async (req,res) => {
    try {
        const {lectureTitle} = req.body;
        const {courseId} = req.params;

        if(!lectureTitle || !courseId){
            return res.status(400).json({
                message:"Lecture title is required"
            })
        };

        const lecture = await Lecture.create({lectureTitle});

        const course = await Course.findById(courseId);
        if(course){
            course.lectures.push(lecture._id);
            await course.save();
        }

        return res.status(201).json({
            lecture,
            message:"Lecture created successfully."
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Failed to create lecture"
        })
    }
}
export const getCourseLecture = async (req, res) => {
    try {
        const {courseId} = req.params;
        const course = await Course.findById(courseId).populate("lectures");
        if(!course){
            return res.status(404).json({
                message:"Course not found"
            })
        }
        return res.status(200).json({
            lectures: course.lectures
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Failed to get lectures"
        })
    }
}
export const editLecture = async (req, res) => {
    try {
        const {lectureTitle, videoInfo, isPreviewFree} = req.body;
        const {courseId, lectureId} = req.params;
        const lecture = await Lecture.findById(lectureId);
        if(!lecture){
            return res.status(404).json({
                message:"Lecture not found!"
            })
        }

        if(lectureTitle) lecture.lectureTitle = lectureTitle;
        if(videoInfo?.videoUrl) lecture.videoUrl = videoInfo.videoUrl;
        if(videoInfo?.publicId) lecture.publicId = videoInfo.publicId;
        lecture.isPreviewFree = isPreviewFree;

        await lecture.save();

        const course = await Course.findById(courseId);
        if(course && !course.lectures.includes(lecture._id)){
            course.lectures.push(lecture._id);
            await course.save();
        };
        return res.status(200).json({
            lecture,
            message:"Lecture updated successfully."
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Failed to edit lectures"
        })
    }
}
export const removeLecture = async (req,res) => {
    try {
        const {lectureId} = req.params;
        const lecture = await Lecture.findByIdAndDelete(lectureId);
        if(!lecture){
            return res.status(404).json({
                message:"Lecture not found!"
            });
        }
        // delete the lecture from couldinary as well
        if(lecture.publicId){
            await deleteVideoFromCloudinary(lecture.publicId);
        }

        await Course.updateOne(
            {lectures:lectureId}, // find the course that contains the lecture
            {$pull:{lectures:lectureId}} // Remove the lectures id from the lectures array
        );

        return res.status(200).json({
            message:"Lecture removed successfully."
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Failed to remove lecture"
        })
    }
}
export const getLectureById = async (req,res) => {
    try {
        const {lectureId} = req.params;
        const lecture = await Lecture.findById(lectureId);
        if(!lecture){
            return res.status(404).json({
                message:"Lecture not found!"
            });
        }
        return res.status(200).json({
            lecture
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Failed to get lecture by id"
        })
    }
}