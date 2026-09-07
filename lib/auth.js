// lib/auth.js
// Better Auth সার্ভার কনফিগ — এই ফাইলটা প্রজেক্টের root বা lib/ ফোল্ডারে রাখবে

import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI);
const db = client.db(); // .env এ MONGODB_URI এর ভেতর db name দেওয়া থাকলে এটাই কাজ করবে

export const auth = betterAuth({
  database: mongodbAdapter(db),

  emailAndPassword: {
    enabled: true,
    // চাইলে ইমেইল ভেরিফিকেশন বাধ্যতামূলক করতে পারো
    requireEmailVerification: false,
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  },

  // Next.js এ session cookie ঠিকমতো কাজ করার জন্য
  trustedOrigins: [process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"],
});
