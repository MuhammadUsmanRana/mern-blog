import { Alert, Button, FileInput, Select, TextInput } from 'flowbite-react'
import React, { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage"
import { app } from "../firebase";
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import axios from "axios"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux"

const UpdatePost = () => {
    const [file, setFile] = useState(null);
    const [formData, setFormData] = useState({});
    const [imageUploadError, setImageUploadError] = useState(null);
    const [imageUploadProgress, setImageUploadProgress] = useState(null);

    console.log(formData)
    const currentState = useSelector((state) => state.user)
    const postId = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch()

    useEffect(() => {
        try {
            const fetchPosts = async () => {
                const res = await axios.get(`http://localhost:3000/api/post/getposts?userId/${postId}`);
                console.log(res.data.posts)
                if (res.data.posts) {
                    setFormData(res.data.posts[0])
                }
            }
            fetchPosts()
        } catch (error) {
            console.log(error)
        }
    }, [postId])

    const handleUploadImage = async () => {
        try {
            if (!file) {
                setImageUploadError('please select an image');
                return;
            }
            setImageUploadError(null)
            const storage = getStorage(app);
            const fileName = new Date().getTime() + '-' + file.name;
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, file);
            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setImageUploadProgress(progress.toFixed(0));
                },
                (error) => {
                    setImageUploadError('image not uploaded')
                    setImageUploadProgress(null)
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        setImageUploadError(null)
                        setImageUploadProgress(null)
                        setFormData({ ...formData, image, downloadURL })
                    });
                }
            )

        } catch (error) {
            setImageUploadError('image uploaded error');
            setImageUploadProgress(null);
            console.log("error", error);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.put(`http://localhost:3000/api/post/updateposts/${formData._id}/${currentState.currentState._id}`, formData, {
                withCredentials: true
            });
            if (res.data.success === true) {
                toast.success("post created successfull");
                navigate(`/post/${res.data.data.slug}`);
            } else if (!res.data.success === true) {
                toast.error("post edit error");
            }
        } catch (error) {
            console.log("error", error);
        }
    }
    return (
        <div className='p-3 max-w-3xl mx-auto min-h-screen'>
            <h1 className='text-center text-3xl my-7 font-semibold'> Update Post</h1>
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                <div className="flex flex-col gap-4 sm:flex-row justify-between" >
                    <TextInput type='text' placeholder='Title' required id='title' className='flex-1'
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        value={formData.title}
                    />
                    <Select
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        value={formData.category}
                    >
                        <option value="uncategorized"> Select a category</option>
                        <option value="javascript">JavaScript</option>
                        <option value="reactjs">ReactJs</option>
                        <option value="nextjs">NextJs</option>
                    </Select>
                </div>
                <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
                    <FileInput type="button" accept='image/.*' onChange={(e) => setFile(e.target.files[0])} />
                    <Button
                        type='button'
                        gradientDuoTone={"purpleToBlue"}
                        size={"sm"}
                        onClick={() => handleUploadImage()}
                        disabled={imageUploadProgress}
                    >
                        {
                            imageUploadProgress ? (
                                <div className='w-16 h-16'>
                                    <CircularProgressbar value={imageUploadProgress} text={`${imageUploadProgress || 0}`} />
                                </div>
                            ) : (
                                "Upload Image"
                            )
                        }
                    </Button>
                </div>
                {
                    imageUploadError && <Alert color={"failure"}>{imageUploadError}</Alert>
                }
                {
                    formData.image && (
                        <img src={formData.image} alt="uploaded" className='w-full h-72 object-cover' />
                    )
                }
                <ReactQuill theme="snow" placeholder="Write Something..." className="h-72 mb-12"
                    required
                    onChange={(value) => setFormData({ ...formData, content: value })}
                    value={formData.content}
                />
                <Button type='submit' gradientDuoTone={'purpleToPink'}>Update Post</Button>
            </form>
            <ToastContainer />
        </div>
    )
}

export default UpdatePost