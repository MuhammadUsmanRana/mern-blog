import express from "express";
import { verifyToken } from "../utils/verifyUser.js"
import { createComment, getPostComment } from "../controllers/comment.controller.js";

const router = express.Router();

router.post("/create", verifyToken, createComment);
router.get("/getpostcomment/:postId", verifyToken, getPostComment);


export default router;