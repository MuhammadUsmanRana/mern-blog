import { Avatar, Button, Dropdown, Navbar, TextInput } from "flowbite-react"
import { useLocation } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { AiOutlineSearch } from 'react-icons/ai'
import { FaSun, FaMoon } from "react-icons/fa"
import { useSelector, useDispatch } from "react-redux"
import { toggleTheme } from '../redux/theme/themeSlice'
import axios from "axios"
import { signoutSuccess } from "../redux/user/userSlice"

const Header = () => {
    const dispatch = useDispatch();
    const path = useLocation().pathname;
    const currentUser = useSelector(state => state.user)
    const theme = useSelector(state => state.theme)

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
        <Navbar className='border-b-2'>
            <Link to={"/"}
                className='self-center whitespace-nowrap text-sm sm:text-xl font-semibold data:text-white'>
                <span
                    className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white'
                >
                    Usman's
                </span>
                Blogs
            </Link>
            <form>
                <TextInput
                    type='text'
                    placeholder='Search...'
                    rightIcon={AiOutlineSearch}
                    className='hidden lg:inline'
                />
            </form>
            <Button className="w-12 h-10 lg:hidden" color="gray" pill>
                <AiOutlineSearch />
            </Button>
            <div className='flex gap-2 md:order-2'>
                <Button
                    className='w-12 h-10 hidden sm:inline'
                    color='gray'
                    pill
                    onClick={() => {
                        dispatch(toggleTheme())
                    }}
                >
                    {theme.theme === "light" ? <FaSun /> : <FaMoon />}
                </Button>
                {
                    currentUser.currentState ? (
                        <Dropdown
                            arrowIcon={false}
                            inline
                            label={
                                <Avatar
                                    alt='user'
                                    img={currentUser.currentState.profilePicture}
                                    rounded
                                />
                            }
                        >
                            <Dropdown.Header>
                                <span className='block text-sm'>@{currentUser.currentState.username}</span>
                                <span className='block text-sm font-medium truncate'>{currentUser.currentState.email}</span>
                            </Dropdown.Header>
                            <Link to="/dashboard?tab=profile">
                                <Dropdown.Item>Profile</Dropdown.Item>
                            </Link>
                            <Dropdown.Divider />
                            <Dropdown.Item onClick={() => signOut()}>Sign Out</Dropdown.Item>
                        </Dropdown>
                    ) : (
                        <Link to={"/sign-up"}>
                            <Button gradientDuoTone='purpleToBlue' outline>
                                Sign In
                            </Button>
                        </Link>

                    )
                }
                <Navbar.Toggle />
            </div >
            <Navbar.Collapse>
                <Navbar.Link active={path === '/'} as={"div"}>
                    <Link to={"/"}>
                        Home
                    </Link>
                </Navbar.Link>
                <Navbar.Link active={path === '/aboute'} as={"div"}>
                    <Link to={"/aboute"}>
                        Aboute
                    </Link>
                </Navbar.Link>
                <Navbar.Link active={path === '/projects'} as={"div"}>
                    <Link to={"/projects"}>
                        Projects
                    </Link>
                </Navbar.Link>

            </Navbar.Collapse>
        </Navbar >
    )
}

export default Header