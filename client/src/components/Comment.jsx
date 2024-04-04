import React, { useState, useEffect } from 'react';
import axios from "axios";
import moment from "moment";
import { FaThumbsUp } from "react-icons/fa";
import { useSelector } from 'react-redux';
import { Button, Textarea } from "flowbite-react"

const Comment = ({ comment, onLike, onEdit, onDelete }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(comment.content);
    const { currentState } = useSelector((state) => state.user);
    const [user, setUser] = useState({});

    useEffect(() => {
        const getUser = async () => {
            try {
                const res = await axios.get(`/api/user/${comment.userId}`);
                if (res.data.success === true) {
                    setUser(res.data.data)
                }
            } catch (error) {
                console.log(error.message)
            }
        }
        getUser();
    }, [comment])

    const handleEdit = () => {
        setIsEditing(true);
        setEditedContent(comment.content);
    }

    const handleSave = async () => {
        try {
            axios.defaults.withCredentials = true;
            const res = await axios.put(`/api/comment/editcomment/${comment._id}`, {
                content: editedContent
            });
            console.log(res.data)
            if (res.data.success === true) {
                setIsEditing(false);
                console.log(comment, editedContent)
                onEdit(comment, editedContent)
            }
        } catch (error) {
            console.log(error.message)
        }
    }
    return (
        <div className='flex p-4 border-b dark:border-gray-600 text-sm'>
            <div className='flex shrink-0 mr-3'>
                <img className='w-10 h-10 rounded-full bg-gray-200' src={user.profilePicture} alt={user.username} />
            </div>
            <div className='flex-1'>
                <div className='flex items-center mb-1'>
                    <span className='font-bold mr-1 text-xs truncate'>
                        {user ? `@${user.username}` : "ananomouse user"}
                    </span>
                    <span className='text-gray-500 text-xs'>
                        {moment(comment.createdAt).fromNow()}
                    </span>
                </div>
                {
                    isEditing ? (
                        <>
                            <Textarea className='mb-2'
                                value={editedContent}
                                onChange={(e) => setEditedContent(e.target.value)}
                            />
                            <div className='flex justify-end gap-2 text-xs'>
                                <Button onClick={() => handleSave()} type='button' size={"sm"} gradientDuoTone={"purpleToBlue"}>
                                    Save
                                </Button>
                                <Button onClick={() => setIsEditing(false)} type='button' size={"sm"} gradientDuoTone={"purpleToBlue"} outline>
                                    Cancel
                                </Button>
                            </div>
                        </>
                    ) : (
                        <>
                            <p className='text-gray-500 pb-2'>
                                {comment.content}
                            </p>
                            <div className='flex items-center pt-2 text-xs border-t dark:border-gray-700 max-w-fit gap-2'>
                                <button type='button' className={`text-gray-400 hover:text-blue-500 ${currentState &&
                                    comment.likes.includes(currentState._id) && '!text-blue-500'}`}
                                    onClick={() => onLike(comment._id)}>
                                    <FaThumbsUp className='text-sm' />
                                </button>
                                <p>
                                    {
                                        comment.numberOfLikes > 0 && comment.numberOfLikes + " " + (comment.numberOfLikes === 1 ? "like" : "likes")
                                    }
                                </p>
                                {
                                    currentState && (currentState._id === comment.userId || currentState.isAdmin) && (
                                        <>
                                            <button onClick={handleEdit} type='button' className='text-gray-400 hover:text-blue-500'>
                                                Edit
                                            </button>
                                            <button onClick={() => onDelete(comment._id)} type='button' className='text-gray-400 hover:text-red-500'>
                                                Delete
                                            </button>
                                        </>
                                    )
                                }
                            </div>
                        </>
                    )
                }
            </div>
        </div >
    )
}

export default Comment;