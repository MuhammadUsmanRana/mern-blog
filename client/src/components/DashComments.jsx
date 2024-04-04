import React, { useEffect, useState } from 'react'
import axios from "axios"
import { useSelector } from "react-redux"
import { Button, Modal, Table } from "flowbite-react"
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import 'react-toastify/dist/ReactToastify.css';

const DashComments = () => {

    const [comments, setComments] = useState([]);
    const [showMore, setShowMore] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [commentIdToDelete, setCommentIdToDelete] = useState("");
    const currentState = useSelector((state) => state.user)

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const res = await axios.get("/api/comment/getcomments", {
                    withCredentials: true
                })
                if (res.data.comments) {
                    setComments(res.data.comments)
                }
                if (res.data.comments.length < 5) {
                    setShowMore(false)
                }
            } catch (error) {
                console.log(error.message)
            }
        }
        if (currentState.currentState.isAdmin) {
            fetchComments();
        }
    }, [currentState.currentState._id]);

    const handleShowMore = async () => {
        const startIndex = comments.length;
        try {
            const res = await axios.get(`/api/comment/getpostcomment?startIndex=${startIndex}`, { withCredentials: true });
            if (res.data.comments) {
                setComments((preComment) => [...preComment, ...res.data.comments]);
            }
            if (res.data.comments.length < 9) {
                setShowMore(false)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleDeleteComment = async () => {
        setShowModal(false);
        try {
            const res = await axios.delete(`/api/comment/deletecomment/${commentIdToDelete}`, {
                withCredentials: true
            });
            if (res.data.success === true) {
                setComments((preComment) => preComment.filter((comment) => comment._id !== commentIdToDelete));
            }
        } catch (error) {
            console.log(error)
        }

    }
    return (
        <div className='w-full table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
            {
                currentState.currentState.isAdmin && comments.length > 0 ? (
                    <>
                        <Table hoverable className='shadow-md'>
                            <Table.Head>
                                <Table.HeadCell>Date Updated</Table.HeadCell>
                                <Table.HeadCell>Comment content</Table.HeadCell>
                                <Table.HeadCell>Number of likes</Table.HeadCell>
                                <Table.HeadCell>PostId</Table.HeadCell>
                                <Table.HeadCell>UserId</Table.HeadCell>
                                <Table.HeadCell>Delete</Table.HeadCell>
                            </Table.Head>
                            {
                                comments?.map((comment, index) => {
                                    return (
                                        <Table.Body key={index} className='divide-y'>
                                            <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                                                <Table.Cell>{new Date(comment.updatedAt).toLocaleDateString()}</Table.Cell>
                                                <Table.Cell>
                                                    {comment.content}
                                                </Table.Cell>
                                                <Table.Cell>
                                                    {comment.numberOfLikes}
                                                </Table.Cell>
                                                <Table.Cell>{comment.postId}</Table.Cell>
                                                <Table.Cell>{comment.userId}</Table.Cell>
                                                <Table.Cell>
                                                    <span className='text-red-500 hover:underline cursor-pointer' onClick={() => {
                                                        setShowModal(true)
                                                        setCommentIdToDelete(comment._id)
                                                    }}>Delete </span>
                                                </Table.Cell>
                                            </Table.Row>
                                        </Table.Body>
                                    )
                                })
                            }
                        </Table>
                        {
                            showMore && (
                                <button onClick={handleShowMore} className='w-full text-teal-500 self-center text-sm py-7'>
                                    show more
                                </button>
                            )
                        }
                    </>
                ) : (
                    <p>You have no comments yet!</p>
                )
            }
            <Modal show={showModal} size="md" onClose={() => setShowModal(false)} popup>
                <Modal.Header />
                <Modal.Body>
                    <div className="text-center">
                        <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
                        <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                            Are you sure you want to delete this Comment?
                        </h3>
                        <div className="flex justify-center gap-4">
                            <Button color="failure" onClick={() => handleDeleteComment()}>
                                {"Yes, I'm sure"}
                            </Button>
                            <Button color="gray" onClick={() => setShowModal(false)}>
                                No, cancel
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div >
    )
}

export default DashComments;