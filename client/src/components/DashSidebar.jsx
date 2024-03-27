import { Sidebar } from "flowbite-react"
import { useEffect, useState } from "react";
import { HiUser, HiArrowSmRight, HiDocumentText } from "react-icons/hi"
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signoutSuccess } from "../redux/user/userSlice";
import axios from "axios";

const DashSidebar = () => {
    const currentState = useSelector((state) => state.user);
    const dispatch = useDispatch()
    const location = useLocation();
    const [tab, setTab] = useState('')
    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const tabFromUrl = urlParams.get('tab')
        if (tabFromUrl) {
            setTab(tabFromUrl)
        }
    }, [location.search]);
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
        <Sidebar className="w-full md:w-56">
            <Sidebar.Items>
                <Sidebar.ItemGroup className="flex flex-col gap-1">
                    <Link to="/dashboard?tab=profile">
                        <Sidebar.Item
                            active={tab === 'profile'}
                            icon={HiUser}
                            label={currentState.currentState.isAdmin ? "Admin" : "User"}
                            labelColor='dark'
                            as='div'
                        >
                            Profile
                        </Sidebar.Item>
                    </Link>
                    {
                        currentState.currentState.isAdmin && (
                            <Link to="/dashboard?tab=posts">
                                <Sidebar.Item
                                    active={tab === 'posts'}
                                    icon={HiDocumentText}
                                    as='div'
                                >
                                    Posts
                                </Sidebar.Item>
                            </Link>
                        )
                    }
                    <Sidebar.Item className="cursor-pointer" icon={HiArrowSmRight} onClick={() => signOut()}>
                        Sign Out
                    </Sidebar.Item>
                </Sidebar.ItemGroup>
            </Sidebar.Items>
        </Sidebar>
    )
}

export default DashSidebar