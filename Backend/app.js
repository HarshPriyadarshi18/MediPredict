import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.routes.js";
import predRouter from "./routes/prediction.routes.js";
import pdfRouter from "./routes/pdf.routes.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// ✅ CORS Setup (single, correct version)
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",")
  : ["http://localhost:5173", "http://localhost:3000"];

  
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // Allow requests like Postman
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log("❌ Blocked by CORS:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
); 

// ✅ Parse JSON and cookies
app.use(express.json({ limit: "20kb" }));
app.use(express.urlencoded({ extended: true, limit: "20kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// ✅ Routes declaration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/predict", predRouter);
app.use("/api/pdf", pdfRouter);

// ✅ Test route
app.get("/", (req, res) => {
  res.json({ message: "🚀 Backend running & CORS configured correctly!" });
});

export { app };
