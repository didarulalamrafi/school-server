import multer from "multer";

// Vercel-এর ফাইল সিস্টেম ephemeral, তাই ডিস্কে না লিখে মেমোরিতে রেখে
// সরাসরি Cloudinary-তে পাঠানো হবে।
const storage = multer.memoryStorage();

function fileFilter(req, file, cb) {
  if (file.mimetype !== "application/pdf") {
    return cb(new Error("শুধু PDF ফাইল আপলোড করা যাবে"), false);
  }
  cb(null, true);
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 4 * 1024 * 1024 }, // ৪MB
});

export default upload;
