import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form';
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SignUp = () => {
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm();
    const onsubmit = async (data) => {
        setLoading(true)
        try {
            const response = await axios.post('/api/auth/signup', data);
            if (response.data) {
                toast.success("Sign Up Successfully!")
                navigate('/sign-in')
                reset()
                setLoading(false)
            }
        } catch (error) {
            setLoading(false)
        }
    }
    return (
        <div className='min-h-screen mt-20'>
            <div className='flex p-3 max-w-3xl mx-auto flex-col md:flex-row gap-5'>
                {/* left */}
                <div className='flex-1'>
                    <Link to={"/"}
                        className='font-bold derk:text-white text-4xl'>
                        <span
                            className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white'
                        >
                            Sahand's
                        </span>
                        Blogs
                    </Link>
                    <p className='text-sm mt-5'>
                        This is a demo project you can sign up with your email and password or with google
                    </p>
                </div>
                {/* right  */}

                <div className='flex-1'>
                    <form action="" className='flex flex-col gap-4' onSubmit={handleSubmit(onsubmit)}>
                        <div className=''>
                            <Label value='Your username' />
                            <TextInput type='text' placeholder='Username' id="username" {...register('username', { required: true })}
                            />
                            {
                                errors.username && (
                                    <Alert className='mt-5' color={'failure'}>Please fill out this field</Alert>
                                )
                            }
                        </div>
                        <div className=''>
                            <Label value='Your email' />
                            <TextInput type='email' placeholder='name@company.com' id="email" {...register('email', { required: true })}
                            />
                            {
                                errors.email && (
                                    <Alert className='mt-5' color={'failure'}>Please fill out this field</Alert>
                                )
                            }
                        </div>
                        <div className=''>
                            <Label value='Your password' />
                            <TextInput type='password' placeholder='Password' id="password" {...register('password', { required: true })}
                            />
                            {
                                errors.password && (
                                    <Alert className='mt-5' color={'failure'}>Please fill out this field</Alert>
                                )
                            }
                        </div>
                        <Button gradientDuoTone={"purpleToPink"} type='submit'>
                            {
                                loading ? (<>
                                    <Spinner size='sm' />
                                    <span className='pl-3'>Loading...</span>
                                </>) :
                                    (
                                        "Sign Up"
                                    )}</Button>
                    </form>
                    <div className='flex gap-2 text-sm mt-5'>
                        <span>
                            Have an account?
                        </span>
                        <Link to={"/sign-in"} className='text-blue-500'>
                            Sign In
                        </Link>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    )
}

export default SignUp