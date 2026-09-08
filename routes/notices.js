import express from "express";
import * as noticeController from "../controllers/noticeController.js";
import { requireAuth, requireStaff } from "../middleware/requireAuth.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// পাবলিক — সবাই পড়তে পারবে
router.get("/", noticeController.list);
router.get("/:id", noticeController.getOne);

// শুধু teacher/admin — নোটিশ ম্যানেজ করতে (PDF অপশনাল)
router.post("/", requireStaff, upload.single("pdf"), noticeController.create);
router.put("/:id", requireStaff, noticeController.update);
router.delete("/:id", requireStaff, noticeController.remove);

export default router;
