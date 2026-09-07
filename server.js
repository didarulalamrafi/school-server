// server.js — সবার আগে, একদম প্রথম লাইনে
import "dotenv/config";

import express from "express";
import cors from "cors";
import helmet from "helmet";
import { MongoClient, ServerApiVersion } from "mongodb";
import { toNodeHandler } from "better-auth/node";

import { auth } from "./lib/auth.js";
import noticeRoutes from "./routes/notices.js";

// ...বাকি কোড অপরিবর্তিত

const app = express();

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let dbPromise;
function connectDB() {
  if (!dbPromise) {
    dbPromise = client.connect().then(() => {
      console.log("Connected to MongoDB!");
      return client.db("SchoolWebsite"); // ⚠️ lib/auth.js এর db নামের সাথে মিলিয়ে রেখো
    });
  }
  return dbPromise;
}

// ✅ প্রতিটা রিকোয়েস্টে req.db বসিয়ে দেওয়া, যাতে কন্ট্রোলারে বারবার connectDB() কল করা না লাগে
app.use(async (req, res, next) => {
  req.db = await connectDB();
  next();
});

app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  }),
);

// Better Auth handler — express.json() এর *আগে* বসাতে হবে
app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(express.json());

app.get("/", (req, res) => {
  res.send("School website backend চলছে!");
});

app.use("/api/notices", noticeRoutes);

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "সার্ভারে একটা সমস্যা হয়েছে" });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`School backend listening on port ${port}`);
});

export default app;
