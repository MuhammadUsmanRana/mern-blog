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

export const likeComment = async (req, res, next) => {
    try {
        const comment = await Comment.findById(req.params.commentId);
        if (!comment) {
            return next(errorHandler(403, "Comment not found"))
        }
        const userIndex = comment.likes.indexOf(req.user.id);
        if (userIndex === -1) {
            comment.numberOfLikes += 1;
            comment.likes.push(req.user.id);
        } else {
            comment.numberOfLikes -= 1;
            comment.likes.splice(userIndex, 1);
        }
        await comment.save();
        res.status(200).json({ data: comment, success: true })
    } catch (error) {
        next(error)
    }
}

export const editComment = async (req, res, next) => {
    try {
        const comment = await Comment.findById(req.params.commentId);
        if (!comment) {
            return next(errorHandler(403, "Comment not found"))
        }
        if (comment.userId !== req.user.id && !req.user.isAdmin) {
            return next(errorHandler(403, "you are not allowed edit this comment"))
        }
        console.log(req.body, "req.body")
        console.log(req.user, "req.user")
        console.log(req.params, "req.body.id")
        const editComment = await Comment.findByIdAndUpdate(req.params.commentId, {
            content: req.body.content
        }, { new: true });
        console.log(editComment,"editComment")
        res.status(200).json({ success: true, data: editComment })
    } catch (error) {
        next(error)
    }
}