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
      status: "pending",
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
      return res
        .status(400)
        .json({ success: false, message: "Error creating Stripe session" });
    }

    newPurchase.paymentId = session.id;
    await newPurchase.save();

    return res.status(200).json({
      success: true,
      url: session.url,
    });
  } catch (error) {
    console.error("Stripe session error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Stripe Webhook for payment confirmation

  // Always respond with 200 to acknowledge receipt
  export const stripeWebhook = async (req, res) => {

    //changes 
    console.log("✅ Stripe Webhook triggered");


    let event;
  
    try {
      const signature = req.headers["stripe-signature"];
      const secret = process.env.WEBHOOK_ENDPOINT_SECRET;
  
      // req.body is raw buffer/string because of middleware
      event = stripe.webhooks.constructEvent(req.body, signature, secret);
    } catch (error) {
      console.error("Webhook signature verification failed:", error.message);
      return res.status(400).send(`Webhook error: ${error.message}`);
    }
  
    if (event.type === "checkout.session.completed") {
      try {
        const session = event.data.object;
  
        const purchase = await CoursePurchase.findOne({
          paymentId: session.id,
        }).populate("courseId");
  
        if (!purchase) {
          console.error("Purchase not found for paymentId:", session.id);
          return res.status(200).send(); // acknowledge to avoid retries
        }


        //changes
    console.log(
        "Updating user:",
        purchase.userId,
        "with course:",
        purchase.courseId._id
      );
  
        purchase.status = "completed";
        if (session.amount_total) {
          purchase.amount = session.amount_total / 100;
        }
  
        if (purchase.courseId?.lectures?.length > 0) {
          await Lecture.updateMany(
            { _id: { $in: purchase.courseId.lectures } },
            { $set: { isPreviewFree: true } }
          );
        }
  
        await purchase.save();
  
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
  
        res.status(200).send(); // Acknowledge Stripe event success
      } catch (error) {
        console.error("Error handling Stripe event:", error);
        // Acknowledge Stripe anyway to prevent retries
        return res.status(200).send();
      }
    } else {
      res.status(200).send(); // acknowledge other events
    }

  };
  
// Get course details with purchase status
export const getCourseDetailWithPurchaseStatus = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.id;

    const course = await Course.findById(courseId)
      .populate({ path: "creator" })
      .populate({ path: "lectures" });

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const purchased = await CoursePurchase.findOne({ userId, courseId });

    return res.status(200).json({
      course,
      purchased: !!purchased,
    });
  } catch (error) {
    console.error("Error in getCourseDetailWithPurchaseStatus:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Get all purchased courses (for admin or stats)
export const getAllPurchasedCourse = async (_, res) => {
  try {
    const purchasedCourse = await CoursePurchase.find({
      status: "completed",
    }).populate("courseId");

    return res.status(200).json({
      purchasedCourse: purchasedCourse || [],
    });
  } catch (error) {
    console.error("Error in getAllPurchasedCourse:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
