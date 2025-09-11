import React, { useEffect, useRef, useState } from "react";
import { IoIosMic } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import axios from 'axios'

import useVoiceModal from "../hooks/useVoiceModal";

function VoiceModal() {
  const { toggleModal } = useVoiceModal();
  const recognitionRef = useRef(null)

  const baseUrl = import.meta.env.VITE_API_BASE_URL

  

  const handleModal = () => {
    toggleModal();
  };


  const speech = (text) => {

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.pitch = 2
    utterance.rate = 1.2
    window.speechSynthesis.speak(utterance)

  }

  const sendMessageToLlm = async (prompt) => {
    const response = await axios.post(`${baseUrl}/chat`, { prompt })
    const data = response.data.response
    console.log(data)
    if (data) {
      try {
        // try parsing as JSON
        const cmd = JSON.parse(data);
        console.log(cmd)
        executeCommand(cmd);
      } catch (err) {
        // fallback: normal text → speak
        speech(data);
      }
    }
  }

  function executeCommand(cmd) {
    speech(cmd.response)
    switch (cmd.action) {
      case "open_youtube":
        window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(cmd.query)}`, "_blank");
        break;
      case "google_search":
        window.open(`https://www.google.com/search?q=${encodeURIComponent(cmd.query)}`, "_blank");
        break;
      case "navigate":
        window.open(cmd.url, "_blank");
        break;
      default:
        console.log("Unknown command:", cmd);
    }
  }

  function startRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = "en-US";
    

    recognition.onresult = (e) => {
      const transcript = e.results[e.results.length - 1][0].transcript.trim().toLowerCase();
      console.log("transcript : ", transcript);

      if (transcript.includes("alex")) {
        sendMessageToLlm(transcript);
      }
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      recognition.stop();
      // Restart after a short delay to avoid crash loops
      setTimeout(() => recognition.start(), 500);
    };

    recognition.onend = () => {
      console.log("Recognition ended. Restarting...");
      // Restart after silence
      setTimeout(() => recognition.start(), 500);
    };

    recognition.start();
  }

  useEffect(() => {
    startRecognition();

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.onend = null; // stop restart loop
        recognitionRef.current.stop();
      }
    };
  }, []);




  return (
    <div className="h-100 bg-zinc-950 border-2 border-zinc-900 -translate-x-[50%] mt-10 -translate-y-[50%] w-100 absolute top-[50%] left-[50%]  rounded-3xl flex items-center justify-center gap-10 flex-col">
      <IoClose
        size={"2.5rem"}
        onClick={handleModal}
        className="fixed cursor-pointer transition-all duration-400 p-2 hover:bg-zinc-900 rounded-full text-zinc-400 top-2 right-2"
      />
      <IoIosMic className="glow-icon text-red-800" size={"8em"} />




    </div>
  );
}

export default VoiceModal;
