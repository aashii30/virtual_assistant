import React, { useContext, useEffect, useRef, useState } from 'react'
import { userDataContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import aiImg from "../assets/ai.gif"
import { CgMenuRight } from "react-icons/cg";
import { RxCross1 } from "react-icons/rx";
import userImg from "../assets/user.gif"
function Home() {
  const {userData,serverUrl,setUserData,getGeminiResponse}=useContext(userDataContext)
  const navigate=useNavigate()
  const [listening,setListening]=useState(false)
  const [userText,setUserText]=useState("")
  const [aiText,setAiText]=useState("")
  const isSpeakingRef=useRef(false)
  const recognitionRef=useRef(null)
  const [ham,setHam]=useState(false)
  const isRecognizingRef=useRef(false)
  const synth=window.speechSynthesis

  const handleLogOut=async ()=>{
    try {
      const result=await axios.get(`${serverUrl}/api/auth/logout`,{withCredentials:true})
      setUserData(null)
      navigate("/signin")
    } catch (error) {
      setUserData(null)
      console.log(error)
    }
  }

  const startRecognition = () => {
    
   if (!isSpeakingRef.current && !isRecognizingRef.current) {
    try {
      recognitionRef.current?.start();
      console.log("Recognition requested to start");
    } catch (error) {
      if (error.name !== "InvalidStateError") {
        console.error("Start error:", error);
      }
    }
  }
    
  }

  const speak=(text)=>{
    const utterence=new SpeechSynthesisUtterance(text)
    utterence.lang = 'hi-IN';
    const voices =window.speechSynthesis.getVoices()
    const hindiVoice = voices.find(v => v.lang === 'hi-IN');
    if (hindiVoice) {
      utterence.voice = hindiVoice;
    }


    isSpeakingRef.current=true
    utterence.onend=()=>{
        setAiText("");
  isSpeakingRef.current = false;
  setTimeout(() => {
    startRecognition(); // ⏳ Delay se race condition avoid hoti hai
  }, 800);
    }
   synth.cancel(); // 🛑 pehle se koi speech ho to band karo
synth.speak(utterence);
  }

  const handleCommand=(data)=>{
    const {type,userInput,response}=data
      speak(response);
    
    if (type === 'google-search') {
      const query = encodeURIComponent(userInput);
      window.open(`https://www.google.com/search?q=${query}`, '_blank');
    }
     if (type === 'calculator-open') {
  
      window.open(`https://www.google.com/search?q=calculator`, '_blank');
    }
     if (type === "instagram-open") {
      window.open(`https://www.instagram.com/`, '_blank');
    }
    if (type ==="facebook-open") {
      window.open(`https://www.facebook.com/`, '_blank');
    }
     if (type ==="weather-show") {
      window.open(`https://www.google.com/search?q=weather`, '_blank');
    }

    if (type === 'youtube-search' || type === 'youtube-play') {
      const query = encodeURIComponent(userInput);
      window.open(`https://www.youtube.com/results?search_query=${query}`, '_blank');
    }

  }

useEffect(() => {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();

  recognition.continuous = true;
  recognition.lang = 'en-US';
  recognition.interimResults = false;

  recognitionRef.current = recognition;

  let isMounted = true;  // flag to avoid setState on unmounted component

  // Start recognition after 1 second delay only if component still mounted
  const startTimeout = setTimeout(() => {
    if (isMounted && !isSpeakingRef.current && !isRecognizingRef.current) {
      try {
        recognition.start();
        console.log("Recognition requested to start");
      } catch (e) {
        if (e.name !== "InvalidStateError") {
          console.error(e);
        }
      }
    }
  }, 1000);

  recognition.onstart = () => {
    isRecognizingRef.current = true;
    setListening(true);
  };

  recognition.onend = () => {
    isRecognizingRef.current = false;
    setListening(false);
    if (isMounted && !isSpeakingRef.current) {
      setTimeout(() => {
        if (isMounted) {
          try {
            recognition.start();
            console.log("Recognition restarted");
          } catch (e) {
            if (e.name !== "InvalidStateError") console.error(e);
          }
        }
      }, 1000);
    }
  };

  recognition.onerror = (event) => {
    console.warn("Recognition error:", event.error);
    isRecognizingRef.current = false;
    setListening(false);
    if (event.error !== "aborted" && isMounted && !isSpeakingRef.current) {
      setTimeout(() => {
        if (isMounted) {
          try {
            recognition.start();
            console.log("Recognition restarted after error");
          } catch (e) {
            if (e.name !== "InvalidStateError") console.error(e);
          }
        }
      }, 1000);
    }
  };

  recognition.onresult = async (e) => {
    const transcript = e.results[e.results.length - 1][0].transcript.trim();
    if (transcript.toLowerCase().includes(userData.assistantName.toLowerCase())) {
      setAiText("");
      setUserText(transcript);
      recognition.stop();
      isRecognizingRef.current = false;
      setListening(false);
      const data = await getGeminiResponse(transcript);
      handleCommand(data);
      setAiText(data.response);
      setUserText("");
    }
  };


    const greeting = new SpeechSynthesisUtterance(`Hello ${userData.name}, what can I help you with?`);
    greeting.lang = 'hi-IN';
   
    window.speechSynthesis.speak(greeting);
 

  return () => {
    isMounted = false;
    clearTimeout(startTimeout);
    recognition.stop();
    setListening(false);
    isRecognizingRef.current = false;
  };
}, []);




  return (
    <div className='w-full min-h-screen bg-gradient-to-t from-black to-[#02023d] flex justify-center items-center flex-col gap-4 p-5 overflow-hidden relative'>
      <CgMenuRight className='lg:hidden text-white absolute top-5 right-5 w-6 h-6' onClick={()=>setHam(true)}/>
      <div className={`absolute lg:hidden top-0 left-0 w-full h-full bg-[#00000053] backdrop-blur-lg p-5 flex flex-col gap-5 items-start z-50 transition-transform duration-300 ease-in-out ${ham ? "translate-x-0" : "translate-x-full"}`}>
 <RxCross1 className='text-white absolute top-5 right-5 w-6 h-6' onClick={()=>setHam(false)}/>
 <button className='w-full max-w-[200px] h-12 text-black font-semibold bg-white rounded-full text-lg ' onClick={handleLogOut}>Log Out</button>
      <button className='w-full max-w-[200px] h-12 text-black font-semibold bg-white rounded-full text-lg' onClick={()=>navigate("/customize")}>Customize your Assistant</button>

<div className='w-full h-px bg-gray-400'></div>
<h1 className='text-white font-semibold text-lg'>History</h1>

<div className='w-full max-h-[300px] overflow-y-auto flex flex-col gap-3'>
  {userData.history?.map((his)=>(
    <div className='text-gray-200 text-base truncate  '>{his}</div>
  ))}

</div>

      </div>
      <button className='hidden lg:block absolute top-5 right-5 min-w-[150px] h-12 text-black font-semibold bg-white rounded-full text-lg ' onClick={handleLogOut}>Log Out</button>
      <button className='hidden lg:block absolute top-[90px] right-5 min-w-[150px] h-12 text-black font-semibold bg-white rounded-full text-lg' onClick={()=>navigate("/customize")}>Customize your Assistant</button>
      <div className='w-[80%] max-w-[320px] h-[300px] md:h-[400px] flex justify-center items-center overflow-hidden rounded-2xl shadow-lg'>
<img src={userData?.assistantImage} alt="" className='h-full w-full object-cover'/>
      </div>
      <h1 className='text-white text-lg font-semibold text-center mt-2'>I'm {userData?.assistantName}</h1>
      {!aiText && <img src={userImg} alt="" className='w-40'/>}
      {aiText && <img src={aiImg} alt="" className='w-40'/>}
    
    <h1 className='text-white text-base font-medium text-center break-words px-4 max-w-full'>{userText?userText:aiText?aiText:null}</h1>
      
    </div>
  )
}

export default Home