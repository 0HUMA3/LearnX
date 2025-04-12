import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./database/db.js";
import userRoute from "./routes/user.route.js";
import courseRoute from "./routes/course.route.js";
import mediaRoute from "./routes/media.route.js";
import purchaseRoute from "./routes/purchaseCourse.route.js"
import courseProgressRoute from "./routes/courseProgress.route.js"

// ✅ Load environment variables from .env file
dotenv.config();

// ✅ Connect to MongoDB or your database
connectDB();

// ✅ Initialize Express app
const app = express();
const PORT = process.env.PORT || 8080;

// ✅ Enable and Configure CORS before routes/middleware
const corsOptions = {
  origin: "http://localhost:5173",  // Frontend origin
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // Handle preflight requests globally

// ✅ Middleware for JSON and URL parsing (increase payload limit if needed)
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));

// ✅ Enable Cookie Parsing
app.use(cookieParser());

// ✅ API Routes
app.use("/api/v1/media", mediaRoute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/course", courseRoute);

// ✅ Default Root Route
app.get("/", (req, res) => {
  res.send("✅ API is running...");
});

// ✅ Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("🔥 Error:", err.message);
  res.status(500).json({ message: err.message });
});

app.use("/api/v1/purchase",purchaseRoute);

app.use("/api/v1/progress",courseProgressRoute);

// ✅ Start Express Server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
