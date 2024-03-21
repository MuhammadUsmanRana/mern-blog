import { Alert, Button, TextInput } from "flowbite-react"
import { useEffect, useRef, useState } from "react"
import { useSelector } from "react-redux"
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage"
import { app } from "../firebase";
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';


const DashProfile = () => {
  const currentUser = useSelector((state) => state.user)
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUploadProcess, setImageFileUploadProcess] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  console.log(imageFileUploadProcess, imageFileUploadError, "data")
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
        setImageFileUploadError("Could not upload image (File must be less then 2MB)", error)
        setImageFileUploadProcess(null)
        setImageFile(null)
        setImageFileUrl(null)
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloaUrl) => {
          setImageFileUrl(downloaUrl)
        })
      }
    )
  }

  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
      <form className="flex flex-col gap-4">
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
        <TextInput type="text" id="username" placeholder="username" defaultValue={currentUser.currentState.username} />
        <TextInput type="text" id="email" placeholder="email" defaultValue={currentUser.currentState.email} />
        <TextInput type="text" id="password" placeholder="**********" />
        <Button type="submit" gradientDuoTone='purpleToBlue' outline>
          Submit
        </Button>
      </form>
      <div className="text-red-500 flex justify-between mt-5">
        <span className="cursor-pointer">Delete Acount</span>
        <span className="cursor-pointer">Sign Out</span>
      </div>
    </div>
  )
}

export default DashProfile