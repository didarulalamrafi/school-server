import express from "express";
import * as noticeController from "../controllers/noticeController.js";
import { requireStaff } from "../middleware/requireStaff.js";

const router = express.Router();

// পাবলিক — সবাই পড়তে পারবে
router.get("/", noticeController.list);
router.get("/:id", noticeController.getOne);

// শুধু teacher/admin — নোটিশ ম্যানেজ করতে
router.post("/", requireStaff, noticeController.create);
router.put("/:id", requireStaff, noticeController.update);
router.delete("/:id", requireStaff, noticeController.remove);

export default router;
