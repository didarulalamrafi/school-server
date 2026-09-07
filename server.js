// server.js — সবার আগে, একদম প্রথম লাইনে
import "dotenv/config";

import express from "express";
import cors from "cors";
import helmet from "helmet";
import { toNodeHandler } from "better-auth/node";

import { auth } from "./lib/auth.js";
import { connectDB } from "./lib/db.js";
import noticeRoutes from "./routes/notices.js";
import studentRoutes from "./routes/students.js";

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "https://scmschool.vercel.app",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"], // 👈 PATCH যোগ করলাম, নাহলে profile update ব্লক হতো
  }),
);

// Better Auth handler — express.json() এর *আগে* বসাতে হবে
app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(express.json());

app.get("/", (req, res) => {
  res.send("School website backend চলছে!");
});

app.use("/api/notices", noticeRoutes);
app.use("/api/students", studentRoutes);

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "সার্ভারে একটা সমস্যা হয়েছে" });
});

const port = process.env.PORT || 5000;

// আগে DB connect করে নিয়ে তারপর server চালু — Better Auth ও controller দুটোই একই db ব্যবহার করবে
connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`School backend listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB কানেক্ট করতে ব্যর্থ:", err);
    process.exit(1);
  });
