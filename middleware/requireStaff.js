import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../lib/auth.js";

/**
 * শুধু logged-in teacher/admin কে পাস করতে দেয় — নোটিশ যোগ/এডিট/ডিলিট করার জন্য।
 * সাধারণ ভিজিটর/guest হলে 403 রিটার্ন করবে।
 */
export async function requireStaff(req, res, next) {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session || !session.user) {
      return res.status(401).json({ error: "লগইন করা আবশ্যক" });
    }

    if (!["teacher", "admin"].includes(session.user.role)) {
      return res
        .status(403)
        .json({ error: "শুধু শিক্ষক/এডমিন এই কাজ করতে পারবেন" });
    }

    req.user = {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
      role: session.user.role,
    };

    next();
  } catch (err) {
    console.error("requireStaff error:", err);
    res.status(500).json({ error: "সার্ভারে একটা সমস্যা হয়েছে" });
  }
}
