// lib/auth.js
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { db } from "./db.js";

export const auth = betterAuth({
  database: mongodbAdapter(db),

  secret: process.env.BETTER_AUTH_SECRET, // .env এ আছে কিনা নিশ্চিত করো
  baseURL:
    process.env.BETTER_AUTH_URL || "https://school-server-beige.vercel.app",

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  },

  trustedOrigins: [
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    "https://scmschool.vercel.app",
  ],

  // 👇 এই অংশটাই মিসিং ছিল — cross-domain (দুই আলাদা vercel.app) কুকির জন্য জরুরি
  advanced: {
    defaultCookieAttributes: {
      sameSite: "none", // cross-site রিকোয়েস্টেও কুকি পাঠাতে দেবে
      secure: true, // sameSite: none হলে secure: true বাধ্যতামূলক (HTTPS ছাড়া কাজ করবে না)
      partitioned: true, // নতুন ব্রাউজার (Chrome CHIPS) পলিসির জন্য সাপোর্ট
    },
  },
});
