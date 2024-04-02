import { Alert, Button, Textarea } from 'flowbite-react';
import React, { useState, useEffect } from 'react';
import { useSelector } from "react-redux"
import { Link } from 'react-router-dom';
import { useForm } from "react-hook-form";
import axios from "axios"
import Comment from './Comment';

const CommentSection = ({ postId }) => {
    const [commentError, setCommentError] = useState(null);
    const [comments, setComments] = useState([]);
    console.log(comments)
    const { handleSubmit, register, reset } = useForm();
    const { currentState } = useSelector((state) => state.user);

    const onSubmit = async (data) => {
        console.log(data);
        if (data.comment.length > 200) {
            return;
        }
        try {
            const res = await axios.post("http://localhost:3000/api/comment/create", {
                content: data.comment,
                postId,
                userId: currentState._id
            }, { withCredentials: true });
            console.log(res.data);
            if (res.data.success === true) {
                setComments("");
                setCommentError(null);
                setComments([res.data.data, ...comments]);
                reset();
            }
        } catch (error) {
            setCommentError(error.message);
        }
    }

    useEffect(() => {
        const gitComment = async () => {
            try {
                const res = await axios.get(`http://localhost:3000/api/comment/getpostcomment/${postId}`,
                    { withCredentials: true });
                if (res.data.success === true) {
                    setComments(res.data.data)
                    setCommentError(null)
                }
            } catch (error) {
                console.log(error.message);
            }
        }
        gitComment()
    }, [postId])


    return (
        <div className='max-w-2xl mx-auto w-full  p-3'>
            {
                currentState ? (
                    <div className='flex items-center gap-1 my-5 text-gray-500 text-sm'>
                        <p>Sign in as:</p>
                        <img className='h-5 w-5 object-cover rounded-full' src={currentState.profilePicture} alt="commentImage" />
                        <Link to={"/dashboard?tab=profile"} className='text-xs text-cyan-500 hover:underline'>
                            @{currentState.username}
                        </Link>
                    </div>
                ) : (
                    <div className='text-sm text-teal-500 my-5 flex gap-1'>
                        You must be SignIn to comment
                        <Link className='text-blue-500 hover:underline' to={"/sign-in"}>Sign In </Link>
                    </div>
                )
            }
            {
                currentState && (
                    <form className='border border-teal-500 rounded-md p-3' onSubmit={handleSubmit(onSubmit)}>
                        <Textarea
                            placeholder='Add a commite...'
                            rows={3}
                            maxLength={200}
                            {...register('comment')}
                        />
                        <div className='flex justify-between items-center mt-5'>
                            <p className='text-gray-500 text-xs'>200 charactors remaining</p>
                            <Button outline gradientDuoTone={'purpleToBlue'} type='submit'>
                                Submit
                            </Button>
                        </div>
                        {
                            commentError &&
                            <Alert color={"failure"} className='mt-5'>{commentError}</Alert>
                        }
                    </form>
                )}
            {
                comments.length === 0 ? (
                    <p className='text-sm my-5'>No comments yet</p>
                ) : (
                    <>
                        <div className='text-sm my-5 flex items-center gap-1'>
                            <p className=''>Comments</p>
                        </div>
                        {
                            comments.map((comment, index) => (
                                <Comment key={index} comment={comment} />
                            ))
                        }
                    </>
                )
            }
        </div>
    )
}

export default CommentSection;