import { Button, TextInput } from "flowbite-react"
import { useSelector } from "react-redux"

const DashProfile = () => {
  const currentUser = useSelector((state) => state.user)
  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
      <form className="flex flex-col gap-4">
        <div className="w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full">
          <img src={currentUser.currentState.profilePicture} alt="user" className="rounded-full w-full h-full border-8 border-[lightgray] object-cover" />
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