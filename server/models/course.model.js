import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
    {
        courseTitle: {
            type: String,
            required: true,
            trim: true
        },
        subTitle: {
            type: String,
            default: ""  // Avoids undefined issues
        },
        description: {
            type: String,
            default: ""
        },
        category: {
            type: String,
            required: true,
            trim: true
        },
        courseLevel: {
            type: String,
            enum: ["Beginner", "Medium", "Advanced"], // Fixed typo: "Advance" -> "Advanced"
            default: "Beginner"
        },
        coursePrice: {
            type: Number,
            required: true,
            default: 0  // Avoids undefined issues
        },
        courseThumbnail: {
            type: String,
            default: ""
        },
        enrolledStudents: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ],
        lectures: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Lecture"
            }
        ],
        creator: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        isPublished: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
);

// Export Model
export const Course = mongoose.model("Course", courseSchema);
