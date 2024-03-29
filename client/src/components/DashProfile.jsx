import { Alert, Button, TextInput, Modal } from "flowbite-react"
import { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage"
import { app } from "../firebase";
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import {
  updateStart,
  updateSuccess,
  updateFailure,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signoutSuccess
} from "../redux/user/userSlice";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { Link } from "react-router-dom"


const DashProfile = () => {
  const currentState = useSelector((state) => state.user)
  const [formData, setFormData] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUploadProcess, setImageFileUploadProcess] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const filePickerRef = useRef();
  const handleImageChange = (e) => {
    e.preventDefault()
    const file = e.target.files[0]
    setImageFile(file);
    setImageFileUrl(URL.createObjectURL(file))
  }

  useEffect(() => {
    if (imageFile) {
      uploadImage()
    }
  }, [imageFile])

  const uploadImage = async () => {
    // service firebase.storage {
    //   match /b/{bucket}/o {
    //     match /{allPaths=**} {
    //       allow read, write: if 
    //       request.resource.size < 2 * 1024 * 1024 && 
    //       request.resource.contentType.matches('image/.*')
    //     }
    //   }
    // }
    setImageFileUploading(true)
    setImageFileUploadError(null)
    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile)
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageFileUploadProcess(progress.toFixed(0));
      },
      (error) => {
        setImageFileUploadError("Could not upload image (File must be less then 2MB)")
        setImageFileUploadProcess(null)
        setImageFile(null)
        setImageFileUrl(null)
        setImageFileUploading(false)
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloaUrl) => {
          setImageFileUrl(downloaUrl);
          setFormData({ ...formData, profilePicture: downloaUrl })
          setImageFileUploading(false)
        })
      }
    )
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.keys(formData).length === 0) {
      toast.info("No Changes made");
      return;
    }
    setLoading(true)
    if (imageFileUploading) {
      return;
    }
    try {
      dispatch(updateStart());
      const res = await axios.put(`/api/user/update/${currentState.currentState._id}`, formData)
      if (res.data.success === true) {
        dispatch(updateSuccess(res.data.rest))
        toast.success("update Profile Successfull")
        setLoading(false)
      } else {
        dispatch(updateFailure(res.data.message));
        toast.error(res.data.message)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart())
      const res = await axios.delete(`http://localhost:3000/api/user/delete/${currentState.currentState._id}`, { withCredentials: true })
      if (res.data.success === true) {
        dispatch(deleteUserSuccess(res.data));
        toast.success(res.data.message)
        setShowModal(false);
      } else {
        dispatch(deleteUserFailure(res.data.message))
        toast.error(res.data.message)
      }
    } catch (error) {
      dispatch(deleteUserFailure(res.data.message))
    }
  }

  const signOut = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/user/signout');
      if (res.data.success === true) {
        dispatch(signoutSuccess(res.data.message));
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input type="file" accept='image/.*' onChange={handleImageChange} ref={filePickerRef} hidden />
        <div className="relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full"
          onClick={() => filePickerRef.current.click()}
        >
          {
            imageFileUploadProcess && (
              <CircularProgressbar value={imageFileUploadProcess || 0} text={`${imageFileUploadProcess}%`} strokeWidth={5} styles={{
                root: {
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  top: 0,
                  left: 0,
                },
                path: {
                  stroke: `rgba(62, 152, 199), ${imageFileUploadProcess / 100}`
                }
              }} />
            )
          }
          <img src={imageFileUrl || currentState.currentState.profilePicture}
            alt="user"
            className={`rounded-full w-full h-full object-cover border-8 border-[lightgray] ${imageFileUploadProcess &&
              imageFileUploadProcess < 100 &&
              'opacity-60'
              }`} />
          {
            imageFileUploadError && <Alert color="failure">{imageFileUploadError}</Alert>
          }
        </div>
        <TextInput type="text" id="username" placeholder="username" defaultValue={currentState.currentState.username} onChange={handleChange} />
        <TextInput type="text" id="email" placeholder="email" defaultValue={currentState.currentState.email} onChange={handleChange} />
        <TextInput type="text" id="password" placeholder="**********" onChange={handleChange} />
        <Button type="submit" gradientDuoTone='purpleToBlue' outline disabled={loading}>
          {loading ? "loading..." : "Update"}
        </Button>
        {
          currentState.currentState.isAdmin === true && (
            <Link to='/create-post'>
              <Button type="button" gradientDuoTone="purpleToPink" className="w-full">
                Create a Post
              </Button>
            </Link>
          )
        }
      </form>
      <div className="text-red-500 flex justify-between mt-5">
        <span onClick={() => setShowModal(true)} className="cursor-pointer">Delete Acount</span>
        <span onClick={() => signOut()} className="cursor-pointer">Sign Out</span>
      </div>
      <ToastContainer />
      <Modal show={showModal} size="md" onClose={() => setShowModal(false)} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this Account?
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
    </div>
  )
}

export default DashProfile;