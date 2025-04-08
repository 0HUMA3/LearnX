import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./database/db.js";
import userRoute from "./routes/user.route.js";
import courseRoute from "./routes/course.route.js";
import mediaRoute from "./routes/media.route.js";

// ✅ Load environment variables from .env file
dotenv.config();

// ✅ Connect to MongoDB or your database
connectDB();

// ✅ Initialize Express app
const app = express();
const PORT = process.env.PORT || 8080;

// ✅ Enable and Configure CORS
app.use(
  cors({
    origin: "http://localhost:5173", // Allow frontend origin
    credentials: true,              // Send cookies (if any)
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ Handle Preflight (OPTIONS) requests globally
app.options("*", cors());

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

// ✅ Start Express Server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
