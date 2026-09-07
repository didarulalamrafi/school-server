// lib/db.js
import { MongoClient, ServerApiVersion } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// MongoDB driver ৩.৬+ এ explicit connect() ছাড়াই db() ব্যবহার করা যায়
// (driver নিজে থেকেই lazy connection handle করে) — তাই এটা synchronous এক্সপোর্ট
export const db = client.db("SchoolWebsite"); // ⚠️ সব জায়গায় এই একই নাম ব্যবহার হবে

// server.js এ শুরুতে একবার কল করে connection নিশ্চিত করা ও লগ দেখার জন্য
export async function connectDB() {
  await client.connect();
  console.log("Connected to MongoDB!");
}
