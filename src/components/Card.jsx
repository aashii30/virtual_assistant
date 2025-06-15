import React, { useContext } from 'react'
import { userDataContext } from '../context/UserContext'

function Card({image}) {
    const {serverUrl,userData,setUserData,backendImage,setBackendImage,
frontendImage,setFrontendImage,selectedImage,setSelectedImage}=useContext(userDataContext)
  return (
    <div className={`w-24 sm:w-28 md:w-32 lg:w-36 aspect-[2/3] bg-[#020220] border-2
                   border-[#0000ff66]  rounded-2xl overflow-hidden hover:shadow-2xl
                   hover:shadow-blue-950 cursor-pointer hover:border-4 hover:border-white
                   ${selectedImage==image?"border-4 border-white shadow-2xl shadow-blue-950":""}`}  
                   onClick={()=>{setSelectedImage(image)
                                 setBackendImage(null)
                                 setFrontendImage(null) }} >
        <img src={image} className='w-full h-full object-cover' />

    </div>
  )
}

export default Card