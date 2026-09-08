import { ObjectId } from "mongodb";
import cloudinary from "../lib/cloudinary.js";

// GET /api/notices — সবাই দেখতে পাবে, নতুন আগে
export async function list(req, res) {
  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const limit = Math.min(parseInt(req.query.limit) || 20, 50);

  const [notices, total] = await Promise.all([
    req.db
      .collection("notices")
      .find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray(),
    req.db.collection("notices").countDocuments(),
  ]);

  res.json({
    notices,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  });
}

// GET /api/notices/:id — একটা নোটিশের ডিটেইলস
export async function getOne(req, res) {
  const { id } = req.params;
  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ error: "সঠিক Notice ID না" });
  }

  const notice = await req.db
    .collection("notices")
    .findOne({ _id: new ObjectId(id) });

  if (!notice) {
    return res.status(404).json({ error: "নোটিশ পাওয়া যায়নি" });
  }
  res.json(notice);
}

// POST /api/notices — শুধু teacher/admin (requireStaff middleware দিয়ে সুরক্ষিত)
// PDF অপশনাল — router-এ upload.single("pdf") মিডলওয়্যার দিয়ে req.file আসে
export async function create(req, res) {
  const { title, content, important } = req.body;

  if (!title || !title.trim() || !content || !content.trim()) {
    return res.status(400).json({ error: "শিরোনাম ও বিস্তারিত দুটোই আবশ্যক" });
  }

  const notice = {
    title: title.trim().slice(0, 200),
    content: content.trim().slice(0, 5000),
    important: Boolean(important),
    postedBy: { id: req.user.id, name: req.user.name },
    createdAt: new Date(),
  };

  // PDF আপলোড করা থাকলে Cloudinary-তে পাঠানো হচ্ছে
  if (req.file) {
    try {
      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { resource_type: "raw", folder: "school-notices" },
          (error, result) => (error ? reject(error) : resolve(result)),
        );
        stream.end(req.file.buffer);
      });

      notice.pdfUrl = uploadResult.secure_url;
      notice.fileName = req.file.originalname;
    } catch (err) {
      console.error("Cloudinary upload failed:", err);
      return res.status(500).json({ error: "PDF আপলোড করা যায়নি" });
    }
  }

  const result = await req.db.collection("notices").insertOne(notice);
  res.status(201).json({ _id: result.insertedId, ...notice });
}

// PUT /api/notices/:id — শুধু teacher/admin
export async function update(req, res) {
  const { id } = req.params;
  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ error: "সঠিক Notice ID না" });
  }

  const { title, content, important } = req.body;
  const updateData = {};
  if (typeof title === "string") updateData.title = title.trim().slice(0, 200);
  if (typeof content === "string")
    updateData.content = content.trim().slice(0, 5000);
  if (important !== undefined) updateData.important = Boolean(important);
  updateData.updatedAt = new Date();

  const result = await req.db
    .collection("notices")
    .updateOne({ _id: new ObjectId(id) }, { $set: updateData });

  if (result.matchedCount === 0) {
    return res.status(404).json({ error: "নোটিশ পাওয়া যায়নি" });
  }
  res.json({ message: "নোটিশ আপডেট হয়েছে" });
}

// DELETE /api/notices/:id — শুধু teacher/admin
export async function remove(req, res) {
  const { id } = req.params;
  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ error: "সঠিক Notice ID না" });
  }

  const result = await req.db
    .collection("notices")
    .deleteOne({ _id: new ObjectId(id) });

  if (result.deletedCount === 0) {
    return res.status(404).json({ error: "নোটিশ পাওয়া যায়নি" });
  }
  res.json({ message: "নোটিশ ডিলিট হয়েছে" });
}
