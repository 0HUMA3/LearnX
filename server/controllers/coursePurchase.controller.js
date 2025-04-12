import Stripe from "stripe";
import { Course } from "../models/course.model.js";
import { CoursePurchase } from "../models/coursePurchase.model.js";
import { Lecture } from "../models/lecture.model.js";
import { User } from "../models/user.model.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create Stripe checkout session
export const createCheckoutSession = async (req, res) => {
    try {
        const userId = req.id;
        const { courseId } = req.body;

        const course = await Course.findById(courseId);
        if (!course) return res.status(404).json({ message: "Course not found!" });

        const newPurchase = new CoursePurchase({
            courseId,
            userId,
            amount: course.coursePrice,
            status: "pending"
        });

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: "inr",
                        product_data: {
                            name: course.courseTitle,
                            images: [course.courseThumbnail],
                        },
                        unit_amount: course.coursePrice * 100,
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            success_url: `http://localhost:5173/course-progress/${courseId}`,
            cancel_url: `http://localhost:5173/course-detail/${courseId}`,
            metadata: {
                courseId,
                userId,
            },
            shipping_address_collection: {
                allowed_countries: ["IN"],
            },
        });

        if (!session.url) {
            return res.status(400).json({ success: false, message: "Error creating Stripe session" });
        }

        newPurchase.paymentId = session.id;
        await newPurchase.save();

        return res.status(200).json({
            success: true,
            url: session.url,
        });
    } catch (error) {
        console.error("Stripe session error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// Stripe Webhook for payment confirmation
export const stripeWebhook = async (req, res) => {
    let event;

    try {
        const payload = JSON.stringify(req.body, null, 2);
        const secret = process.env.WEBHOOK_ENDPOINT_SECRET;

        const signature = req.headers["stripe-signature"];
        event = stripe.webhooks.constructEvent(payload, signature, secret);
    } catch (error) {
        console.error("Webhook error:", error.message);
        return res.status(400).send(`Webhook error: ${error.message}`);
    }

    if (event.type === "checkout.session.completed") {
        try {
            const session = event.data.object;

            const purchase = await CoursePurchase.findOne({
                paymentId: session.id,
            }).populate("courseId");

            if (!purchase) {
                return res.status(404).json({ message: "Purchase not found" });
            }

            purchase.status = "completed";
            if (session.amount_total) {
                purchase.amount = session.amount_total / 100;
            }

            // Make all lectures available
            if (purchase.courseId?.lectures?.length > 0) {
                await Lecture.updateMany(
                    { _id: { $in: purchase.courseId.lectures } },
                    { $set: { isPreviewFree: true } }
                );
            }

            await purchase.save();

            // Enroll user
            await User.findByIdAndUpdate(
                purchase.userId,
                { $addToSet: { enrolledCourses: purchase.courseId._id } },
                { new: true }
            );

            await Course.findByIdAndUpdate(
                purchase.courseId._id,
                { $addToSet: { enrolledStudents: purchase.userId } },
                { new: true }
            );
        } catch (error) {
            console.error("Error handling Stripe event:", error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }

    res.status(200).send();
};

// Get course details with purchase status
export const getCourseDetailWithPurchaseStatus = async (req, res) => {
    try {
        const { courseId } = req.params;
        const userId = req.id;

        const course = await Course.findById(courseId)
            .populate({ path: "creator" })
            .populate({ path: "lectures" });

        const purchased = await CoursePurchase.findOne({ userId, courseId });

        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }


        return res.status(200).json({
            course,
            purchased: !!purchased,
        });
    } catch (error) {
        console.log(error);
    }
};

// Get all purchased courses (for admin or stats)
export const getAllPurchasedCourse = async (_, res) => {
    try {
        const purchasedCourse = await CoursePurchase.find({ status: "completed" }).populate("courseId");

        if (!purchasedCourse) {
            return res.status(404).json({
                purchasedCourse: []
            });
        }
        return res.status(200).json({
            purchasedCourse,
        });
    } catch (error) {
        console.log(error);
    }
};
