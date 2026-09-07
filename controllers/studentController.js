// controllers/studentController.js
import { db } from "../lib/db.js";

export async function getMe(req, res) {
  try {
    const student = await db
      .collection("students")
      .findOne({ userId: req.user.id });

    if (!student) {
      return res.json({
        student: {
          name: req.user.name,
          email: req.user.email,
          phone: "",
          class: "",
          roll: "",
        },
      });
    }

    res.json({ student });
  } catch (err) {
    console.error("getMe error:", err);
    res.status(500).json({ error: "সার্ভার এরর" });
  }
}

export async function updateMe(req, res) {
  try {
    const { name, email, phone, class: className, roll } = req.body;

    const result = await db.collection("students").findOneAndUpdate(
      { userId: req.user.id },
      {
        $set: { name, email, phone, class: className, roll },
        $setOnInsert: { userId: req.user.id, createdAt: new Date() },
      },
      { upsert: true, returnDocument: "after" },
    );

    res.json({ student: result.value || result });
  } catch (err) {
    console.error("updateMe error:", err);
    res.status(500).json({ error: "আপডেট করতে সমস্যা হয়েছে" });
  }
}

export async function getResults(req, res) {
  try {
    const results = await db
      .collection("results")
      .find({ studentId: req.user.id })
      .sort({ createdAt: -1 })
      .toArray();

    res.json({ results });
  } catch (err) {
    console.error("getResults error:", err);
    res.status(500).json({ error: "সার্ভার এরর" });
  }
}
