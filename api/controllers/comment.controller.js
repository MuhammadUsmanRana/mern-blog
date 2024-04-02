import { errorHandler } from "../utils/error.js"
import Comment from "../models/commite.model.js";

export const createComment = async (req, res, next) => {
    try {
        const { content, postId, userId } = req.body;
        if (userId !== req.user.id) {
            return next(errorHandler(403, "You are not allow to create this comment"))
        }
        const newComment = new Comment({
            content,
            userId,
            postId
        })
        await newComment.save()
        res.status(200).json({ success: true, data: newComment })
    } catch (error) {
        next(error);
    }
}

export const getPostComment = async (req, res, next) => {
    try {
        const comments = await Comment.find({ postId: req.params.postId }).sort({
            createdAt: - 1,
        });
        res.status(200).json({ success: true, data: comments })
    } catch (error) {

    }
}