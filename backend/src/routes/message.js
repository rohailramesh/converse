import express from "express";
import {
  getMessages,
  sendMessage,
  getUsersForSidebar,
} from "../controllers/message.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
const router = express.Router();
router.post("/send/:id", protectRoute, sendMessage);
router.get("/users", protectRoute, getUsersForSidebar);
router.get("/:id", protectRoute, getMessages);

export default router;
