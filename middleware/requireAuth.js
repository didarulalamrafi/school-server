// middleware/requireAuth.js
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../lib/auth.js";

/**
 * শুধু চেক করে ইউজার লগইন করা আছে কিনা — role যাই হোক না কেন।
 * Student নিজের প্রোফাইল/রেজাল্ট দেখার জন্য এটা ব্যবহার হবে।
 */
export async function requireAuth(req, res, next) {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session || !session.user) {
      return res.status(401).json({ error: "লগইন করা আবশ্যক" });
    }

    req.user = {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
      role: session.user.role,
    };

    next();
  } catch (err) {
    console.error("requireAuth error:", err);
    res.status(500).json({ error: "সার্ভারে একটা সমস্যা হয়েছে" });
  }
}

/**
 * শুধু teacher বা admin হলে পরবর্তী ধাপে যেতে দেয়।
 * অবশ্যই requireAuth-এর পরে রুটে বসাতে হবে, যাতে req.user পাওয়া যায়।
 */
export function requireStaff(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: "লগইন করা আবশ্যক" });
  }

  if (req.user.role !== "teacher" && req.user.role !== "admin") {
    return res
      .status(403)
      .json({ error: "এই কাজের জন্য teacher অথবা admin অনুমতি প্রয়োজন" });
  }

  next();
}

/**
 * শুধু admin হলে পরবর্তী ধাপে যেতে দেয়।
 * অবশ্যই requireAuth-এর পরে রুটে বসাতে হবে।
 */
export function requireAdmin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: "লগইন করা আবশ্যক" });
  }

  if (req.user.role !== "admin") {
    return res
      .status(403)
      .json({ error: "এই কাজের জন্য admin অনুমতি প্রয়োজন" });
  }

  next();
}
