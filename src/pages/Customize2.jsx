import React, { useContext, useState } from 'react'
import { userDataContext } from '../context/UserContext'
import axios from "axios"
import { MdKeyboardBackspace } from "react-icons/md";
import { useNavigate } from 'react-router-dom';

function Customize2() {
    const {userData,backendImage,selectedImage,serverUrl,setUserData}=useContext(userDataContext)
    const [assistantName,setAssistantName]=useState(userData?.AssistantName || "")
    const [loading,setLoading]=useState(false) 
    const navigate=useNavigate()
    const handleUpdateAssistant = async()=>{
        setLoading(true)
            try {
                let formData= new FormData()
                formData.append("assistantName",assistantName)
                if(backendImage){
                     formData.append("assistantImage",backendImage)
                }
                else{
                    formData.append("imageUrl",selectedImage)
                }
                const result = await axios.post(`${serverUrl}/api/user/update`,formData,{withCredentials:true})
                setLoading(false)
                console.log(result.data)
                setUserData(result.data)
                navigate("/")

            } catch (error) {
                setLoading(false)
                console.log(error)
            }
    }

  return (
    <div className='min-h-screen w-full overflow-x-hidden bg-gradient-to-t from-[black] to-[#030353] 
      flex items-center justify-center flex-col px-4 py-8 relative'>
        <MdKeyboardBackspace className='absolute top-[30px] left-[30px] text-white 
        w-[25px] h-[25px] cursor-pointer ' onClick={()=>navigate("/customize")}/>
        <h3 className='text-white text-2xl sm:text-3xl md:text-4xl text-center mb-8'>Enter your 
            <span className='text-blue-300'> Assistant name</span></h3>
        <input type="text" placeholder='eg. Nova' className='w-full max-w-[600px]
               h-[60px] outline-none border-2 border-white bg-transparent
             text-white placeholder-grey-300 px-[20px] py-[10px] 
               rounded-full text-[18px]' 
               required onChange={(e)=>setAssistantName(e.target.value)} value={assistantName}/>
        {assistantName && <button className='mt-8 px-6 py-2 bg-white rounded-full text-black 
        font-semibold text-[19px] cursor-pointer' disabled={loading} onClick={()=>{
            handleUpdateAssistant()}} >{!loading?"Create your Assistant": "Loading..."}</button>}       
        

    </div>
  )
}

export default Customize2