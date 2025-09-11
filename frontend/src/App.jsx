import React, { useState, useEffect, useRef } from "react";
import { IoIosMic } from "react-icons/io";
import useVoiceModal from "./hooks/useVoiceModal";
import VoiceModal from "./components/VoiceModal";


function App() {

  const { isVoiceModalOpen, openModal, closeModal} = useVoiceModal();

  const handleClick = () => {
    openModal()
  }

 
  return (
    <div className="h-[100vh] relative w-full bg-black text-zinc-200 p-10  ">
      <div  className={`bg-[#1111117c]  border-2 border-zinc-900 rounded-3xl h-full w-full flex flex-col items-center justify-center`}>


      <p className="text-center font-medium text-4xl leading-10">
        Hi, I am Alex! <br />
        Your Personal Assistant
        <br />
        <span className="text-base text-zinc-500 font-base">Click on mic to start the conversation...</span>
      </p>

      <IoIosMic onClick={handleClick} className="p-2 mt-4 rounded-full bg-zinc-950 hover:bg-zinc-900 transition-all duration-300 cursor-pointer" size={"3rem"}/>


      {isVoiceModalOpen && 
        <VoiceModal />
      }
      </div>
      
    </div>
  );
}

export default App;



