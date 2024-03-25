import { Button, Label, Spinner, TextInput } from 'flowbite-react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux"
import { signInFailure, signInStart, signInSuccess } from '../redux/user/userSlice';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { OAuth } from '../components/OAuth.jsx';


export default function SignIn() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const loading = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onSubmit = async (formData) => {
    try {
      dispatch(signInStart());
      const res = await axios.post('/api/auth/signin', formData);
      if (res.data.success === true) {
        dispatch(signInSuccess(res.data))
        navigate('/');
      } else {
        toast.error('user not found')
        dispatch(signInFailure(data.message));
      }
    } catch (error) {
      dispatch(signInFailure(error.message))
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
              <Label value='Your email' />
              <TextInput
                type='email'
                placeholder='name@company.com'
                id='email'
                {...register('email', { required: true })}
              />
              {errors.email && <span>This field is required</span>}
            </div>
            <div>
              <Label value='Your password' />
              <TextInput
                type='password'
                placeholder='*******'
                id='password'
                {...register('password', { required: true })}
              />
              {errors.password && <span>This field is required</span>}
            </div>
            <Button
              gradientDuoTone='purpleToPink'
              type='submit'
              disabled={loading.loading}
            >
              {loading.loading ? (
                <>
                  <Spinner size='sm' />
                  <span className='pl-3'>Loading...</span>
                </>
              ) : (
                'Sign In'
              )}
            </Button>
            <OAuth />
          </form>
          <div className='flex gap-2 text-sm mt-5'>
            <span>Have an account?</span>
            <Link to='/sign-up' className='text-blue-500'>
              Sign up
            </Link>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}