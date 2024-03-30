import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import { createPost, deletePosts, getPosts, updatePosts } from "../controllers/post.controller.js";

const router = express.Router();

router.post('/create', verifyToken, createPost);
router.get('/getposts', getPosts);
router.delete('/deleteposts/:postId/:userId', verifyToken, deletePosts);
router.put('/updateposts/:postId/:userId', verifyToken, updatePosts);


export default router;