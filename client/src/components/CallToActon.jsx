import { Button } from 'flowbite-react'
import React from 'react'

const CallToActon = () => {
    return (
        <div className='flex flex-col sm:flex-row border border-teal-500 justify-center items-center  text-center rounded-tl-3xl rounded-br-3xl'>
            <div className='flex-1 justify-center flex flex-col'>
                <h2 className='text-2xl'>wants to learn more aboute javascript </h2>
                <p className='text-gray-500 my-2'>Check out these resources with 100 JavaScript Projects </p>
                <Button gradientDuoTone={"purpleToPink"} className='rounded-tl-xl rounded-bl-none'><a href="https://www.100jsprojects.com" target='_blank' rel='noopener noreferrer'>100 JavaScript Projects</a> </Button>
            </div>
            <div className='p-7 flex-1'>
                <img src="https://bairesdev.mo.cloudinary.net/blog/2023/08/What-Is-JavaScript-Used-For.jpg?tx=w_1024,q_auto" alt="" />
            </div>
        </div>
    )
}

export default CallToActon;