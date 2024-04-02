import React, { useState, useEffect } from 'react';
import axios from "axios";
import moment from "moment"

const Comment = ({ comment }) => {
    // console.log(comment)
    const [user, setUser] = useState({})
    // console.log(user)
    useEffect(() => {
        const getUser = async () => {
            try {
                const res = await axios.get(`http://localhost:3000/api/user/${comment.userId}`);
                // console.log(res.data.data, "res")
                if (res.data.success === true) {
                    setUser(res.data.data)
                }
            } catch (error) {

            }
        }
        getUser();
    }, [comment])
    return (
        <div className='flex p-4 border-b dark:border-gray-600 text-sm'>
            <div className='flex shrink-0 mr-3'>
                <img className='w-10 h-10 rounded-full bg-gray-200' src={user.profilePicture} alt={user.username} />
            </div>
            <div>
                <div className='flex-1'>
                    <span className='font-bold mr-1 text-xs truncate'>{user ? `@${user.username}` : "ananomouse user"}</span>
                    <span className='text-gray-500 text-xs'>{moment(comment.createdAt).fromNow()}</span>
                </div>
                <p className='text-gray-500 pb-2'>{comment.content}</p>
            </div>
        </div>
    )
}

export default Comment