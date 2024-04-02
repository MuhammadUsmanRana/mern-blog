import express from "express";
import { verifyToken } from "../utils/verifyUser.js"
import { createComment, getPostComment,likeComment } from "../controllers/comment.controller.js";

const router = express.Router();

router.post("/create", verifyToken, createComment);
router.get("/getpostcomment/:postId", verifyToken, getPostComment);
router.put("/likecomment/:commentId", verifyToken, likeComment);


export default router;