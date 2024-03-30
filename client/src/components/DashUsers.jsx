import React, { useEffect, useState } from 'react'
import axios from "axios"
import { useSelector } from "react-redux"
import { Button, Modal, Table } from "flowbite-react"
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { FaCheck, FaTimes } from "react-icons/fa"


const DashUsers = () => {

  const [users, setUsers] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState("");

  console.log("users", users)
  const currentState = useSelector((state) => state.user)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/user/getusers", {
          withCredentials: true
        })
        console.log(res.data.users)
        if (res.data.users) {
          setUsers(res.data.users)
        }
        if (res.data.users.length < 5) {
          setShowMore(false)
        }
      } catch (error) {
        console.log(error.message)
      }
    }
    if (currentState.currentState.isAdmin) {
      fetchUsers();
    }
  }, [currentState.currentState._id]);

  const handleShowMore = async () => {
    const startIndex = users.length;
    try {
      const res = await axios.get(`http://localhost:3000/api/user/getusers?startIndex=${startIndex}`, { withCredentials: true });

      if (res.data.users) {
        setUsers((preUser) => [...preUser, ...res.data.users]);
      }
      if (res.data.users.length < 9) {
        setShowMore(false)
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
      {
        currentState.currentState.isAdmin && users.length > 0 ? (
          <>
            <Table hoverable className='shadow-md'>
              <Table.Head>
                <Table.HeadCell>Date Craeted</Table.HeadCell>
                <Table.HeadCell>User Image</Table.HeadCell>
                <Table.HeadCell>Username</Table.HeadCell>
                <Table.HeadCell>Email</Table.HeadCell>
                <Table.HeadCell>Admin</Table.HeadCell>
                <Table.HeadCell>Delete</Table.HeadCell>
              </Table.Head>
              {
                users?.map((user, index) => {
                  return (
                    <Table.Body key={index} className='divide-y'>
                      <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                        <Table.Cell>{new Date(user.createdAt).toLocaleDateString()}</Table.Cell>
                        <Table.Cell>
                          <img src={user.profilePicture} alt={user.username} className='w-10 h-10 object-cover bg-gray-500 rounded-full' />
                        </Table.Cell>
                        <Table.Cell>
                          {user.username}
                        </Table.Cell>
                        <Table.Cell>{user.email}</Table.Cell>
                        <Table.Cell>{user.isAdmin ? <FaCheck className="text-green-500" /> : <FaTimes className="text-red-500" />}</Table.Cell>
                        <Table.Cell>
                          <span className='text-red-500 hover:underline cursor-pointer' onClick={() => {
                            setShowModal(true)
                            setUserIdToDelete(user._id)
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
          <p>You have no users yet!</p>
        )
      }
      <Modal show={showModal} size="md" onClose={() => setShowModal(false)} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this User?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={() => handleDeleteUser()}>
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

export default DashUsers;