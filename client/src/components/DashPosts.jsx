import React, { useEffect, useState } from 'react'
import axios from "axios"
import { useSelector } from "react-redux"
import { Table } from "flowbite-react"
import { Link } from 'react-router-dom';


const DashPosts = () => {
  const [userPosts, setUserPosts] = useState([]);
  const [showMore, setShowMore] = useState(true);

  const currentState = useSelector((state) => state.user)

  console.log(userPosts)
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/post/getposts?userId=${currentState.currentState._id}`)
        console.log(res.data.posts)
        if (res.data.posts) {
          setUserPosts(res.data.posts)
        }
        if (res.data.posts.length < 9) {
          setShowMore(false)
        }
      } catch (error) {
        console.log(error.message)
      }
    }
    if (currentState.currentState.isAdmin) {
      fetchPosts()
    }
  }, [currentState.currentState._id]);

  const handleShowMore = async () => {
    const startIndex = userPosts.length;
    try {
      const res = await axios.get(`http://localhost:3000/api/post/getposts?userId=${currentState.currentState._id}&startIndex=${startIndex}`);

      if (res.data.posts) {
        setUserPosts((prePost) => [...prePost, ...res.data.posts]);
      }
      if (res.data.posts.length < 9) {
        setShowMore(false)
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
      {
        currentState.currentState.isAdmin && userPosts.length > 0 ? (
          <>
            <Table hoverable className='shadow-md'>
              <Table.Head>
                <Table.HeadCell>Date Updated</Table.HeadCell>
                <Table.HeadCell>Post Image</Table.HeadCell>
                <Table.HeadCell>Post Title</Table.HeadCell>
                <Table.HeadCell>Category</Table.HeadCell>
                <Table.HeadCell>Delete</Table.HeadCell>
                <Table.HeadCell>
                  <span>Edit</span>
                </Table.HeadCell>
              </Table.Head>
              {
                userPosts?.map((post, index) => {
                  return (
                    <Table.Body key={index} className='divide-y'>
                      <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                        <Table.Cell>{new Date(post.updatedAt).toLocaleDateString()}</Table.Cell>
                        <Table.Cell>
                          <Link to={`/post/${post.slug}`}>
                            <img src={post.image} alt={post.title} className='w-20 h-10 object-cover bg-gray-500' />
                          </Link>
                        </Table.Cell>
                        <Table.Cell>
                          <Link className='font-medium text-gray-900 dark:text-white'
                            to={`/post/${post.slug}`}>
                            {post.title}
                          </Link>
                        </Table.Cell>
                        <Table.Cell>{post.category}</Table.Cell>
                        <Table.Cell>
                          <Link className='text-red-500 hover:underline cursor-pointer'
                            to={`/update-post/${post._id}`}><span>Delete </span>
                          </Link>
                        </Table.Cell>
                        <Table.Cell>
                          <Link className='text-teal-500 hover:underline cursor-pointer'
                            to={`/delete-post/${post._id}`}>
                            <span>Edit </span>
                          </Link>
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
          <p>You have no post yet!</p>
        )
      }
    </div >
  )
}

export default DashPosts