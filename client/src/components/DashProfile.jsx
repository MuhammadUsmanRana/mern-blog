import { Alert, Button, TextInput } from "flowbite-react"
import { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage"
import { app } from "../firebase";
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { updateStart, updateSuccess, updateFailure } from "../redux/user/userSlice";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const DashProfile = () => {
  const currentUser = useSelector((state) => state.user)
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUploadProcess, setImageFileUploadProcess] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [imageFileUploading, setImageFileUploading] = useState(false);


  const [formData, setFormData] = useState({});
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

    if (imageFileUploading) {
      return;
    }

    try {
      dispatch(updateStart());
      const res = await axios.put(`/api/user/update/${currentUser.currentState._id}`, formData)
      console.log(res, "res")
      if (res.data.success === true) {
        dispatch(updateSuccess(res.data.rest))
        toast.success("update Profile Successfull")
      } else {
        dispatch(updateFailure(res.data.message));
        toast.error(res.data.message)
      } 
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input type="file" accept="image/*" onChange={handleImageChange} ref={filePickerRef} hidden />
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
          <img src={imageFileUrl || currentUser.currentState.profilePicture}
            alt="user"
            className={`rounded-full w-full h-full object-cover border-8 border-[lightgray] ${imageFileUploadProcess &&
              imageFileUploadProcess < 100 &&
              'opacity-60'
              }`} />
          {
            imageFileUploadError && <Alert color="failure">{imageFileUploadError}</Alert>
          }
        </div>
        <TextInput type="text" id="username" placeholder="username" defaultValue={currentUser.currentState.username} onChange={handleChange} />
        <TextInput type="text" id="email" placeholder="email" defaultValue={currentUser.currentState.email} onChange={handleChange} />
        <TextInput type="text" id="password" placeholder="**********" onChange={handleChange} />
        <Button type="submit" gradientDuoTone='purpleToBlue' outline>
          Submit
        </Button>
      </form>
      <div className="text-red-500 flex justify-between mt-5">
        <span className="cursor-pointer">Delete Acount</span>
        <span className="cursor-pointer">Sign Out</span>
      </div>
      <ToastContainer />
    </div>
  )
}

export default DashProfile