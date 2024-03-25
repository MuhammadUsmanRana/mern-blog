import { Button, Label, Spinner, TextInput } from 'flowbite-react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { OAuth } from '../components/OAuth.jsx';

export default function SignUp() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const onSubmit = async (formData) => {
        try {
            setLoading(true);
            const res = await axios.post('/api/auth/signup', formData);
            if (res.data.success === true) {
                navigate('/sign-in');
            } else {
                toast.error(res.data.message);
            }
        } catch (error) {
            toast.error(error.message);
            setLoading(false);
        }
    };

    return (
        <div className='min-h-screen mt-20'>
            <div className='flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5'>
                {/* left */}
                <div className='flex-1'>
                    <Link to='/' className='font-bold dark:text-white text-4xl'>
                        <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white'>
                            Usman's
                        </span>
                        Blog
                    </Link>
                    <p className='text-sm mt-5'>
                        This is a demo project. You can sign up with your email and password
                        or with Google.
                    </p>
                </div>
                {/* right */}

                <div className='flex-1'>
                    <form className='flex flex-col gap-4' onSubmit={handleSubmit(onSubmit)}>
                        <div>
                            <Label value='Your username' />
                            <TextInput
                                type='text'
                                placeholder='Username'
                                id='username'
                                {...register('username', { required: true })}
                            />
                            {errors.username && <span className='text-red-700'>This field is required</span>}
                        </div>
                        <div>
                            <Label value='Your email' />
                            <TextInput
                                type='email'
                                placeholder='name@company.com'
                                id='email'
                                {...register('email', { required: true })}
                            />
                            {errors.email && <span className='text-red-700'>This field is required</span>}
                        </div>
                        <div>
                            <Label value='Your password' />
                            <TextInput
                                type='password'
                                placeholder='Password'
                                id='password'
                                {...register('password', { required: true })}
                            />
                            {errors.password && <span className='text-red-700'>This field is required</span>}
                        </div>
                        <Button
                            gradientDuoTone='purpleToPink'
                            type='submit'
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Spinner size='sm' />
                                    <span className='pl-3'>Loading...</span>
                                </>
                            ) : (
                                'Sign Up'
                            )}
                        </Button>
                        <OAuth />
                    </form>
                    <div className='flex gap-2 text-sm mt-5'>
                        <span>Have an account?</span>
                        <Link to='/sign-in' className='text-blue-500'>
                            Sign In
                        </Link>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
}
