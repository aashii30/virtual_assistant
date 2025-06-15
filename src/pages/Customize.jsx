import React, { useContext, useRef } from 'react'
import Card from '../components/Card'
import { RiImageAddLine } from "react-icons/ri";
import image1 from "../assets/image1.png"
import image2 from "../assets/image2.jpg"
import image3 from "../assets/image3.jpg"
import image4 from "../assets/image4.jpg"
import image5 from "../assets/image5.jpg"
import image6 from "../assets/image6.jpg"
import image7 from "../assets/image7.jpg"
import { useState } from 'react';
import { userDataContext } from '../context/UserContext.jsx';
import { useNavigate } from 'react-router-dom';
import { MdKeyboardBackspace } from "react-icons/md";

function Customize() {
   const {serverUrl,userData,setUserData,backendImage,setBackendImage,
        frontendImage,setFrontendImage,selectedImage,setSelectedImage}=useContext(userDataContext)
    const navigate=useNavigate()
    const inputImage=useRef()
    const handleImage=(e)=>{
        const file =e.target.files[0]
        setBackendImage(file)
        setFrontendImage(URL.createObjectURL(file))

    }

  return (
    <div className='min-h-screen w-full overflow-x-hidden bg-gradient-to-t from-[black] to-[#030353] 
      flex items-center justify-center flex-col px-4 py-8'>
         <MdKeyboardBackspace className='absolute top-[30px] left-[30px] text-white 
                w-[25px] h-[25px] cursor-pointer ' onClick={()=>navigate("/")}/>
        <h3 className='text-white text-2xl sm:text-3xl md:text-4xl text-center mb-8'>Select your 
            <span className='text-blue-300'> Assistant Image</span></h3>
        <div className='w-full max-w-[900px] flex justify-center items-center flex-wrap 
        gap-[15px]'>
        <Card image={image1} />
        <Card image={image2} />
        <Card image={image3} />
        <Card image={image4} />
        <Card image={image5} />
        <Card image={image6} />
        <Card image={image7} />
        <div className={`w-24 sm:w-28 md:w-32 lg:w-36 aspect-[2/3] bg-[#020220] border-2 border-[#0000ff66] 
    rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-blue-950 cursor-pointer 
    hover:border-4 hover:border-white flex items-center justify-center 
     ${selectedImage=="input"?"border-4 border-white shadow-2xl shadow-blue-950":""}`}
    onClick={()=>{inputImage.current.click()
                   setSelectedImage("input")
    }}>
        {!frontendImage && <RiImageAddLine className='text-white w-[25px] h-[25px] ' />}
        {frontendImage && <img src={frontendImage} className='h-full w-full object-cover rounded-xl' /> }
        
    </div>
       <input type='file' accept='image/*' ref={inputImage} hidden onChange={handleImage} />
     </div>
     {selectedImage && <button className='mt-8 px-6 py-2 bg-white rounded-full 
            text-black font-semibold text-[19px] cursor-pointer' onClick={()=>navigate("/customize2")} >Next</button>}
     

    </div>
  )
}

export default Customize