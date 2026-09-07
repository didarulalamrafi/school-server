// routes/students.js
import express from "express";
import {
  getMe,
  updateMe,
  getResults,
} from "../controllers/studentController.js";
import { requireAuth } from "../middleware/requireStaff.js";

const router = express.Router();

router.get("/me", requireAuth, getMe);
router.patch("/me", requireAuth, updateMe);
router.get("/results", requireAuth, getResults);

export default router;
