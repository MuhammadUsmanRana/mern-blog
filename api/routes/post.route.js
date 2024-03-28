import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import { createPost, deleteposts, getposts } from "../controllers/post.controller.js";

const router = express.Router();

router.post('/create', verifyToken, createPost);
router.get('/getposts', getposts);
router.delete('/deleteposts/:postId/:userId', verifyToken, deleteposts);



export default router;