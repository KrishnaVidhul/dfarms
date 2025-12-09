
// @ts-nocheck
"use client";

import { useState } from "react";
import { Activity, Mic2 } from "lucide-react";
import clsx from "clsx";
import twMerge from "tailwind-merge";

const VoiceToTextProcurementLogging = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcription, setTranscription] = useState("");

  const startRecording = async () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Sorry, your browser does not support speech recognition.");
      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      setTranscription(event.results[0][0].transcript);
    };

    recognition.onerror = (event) => {
      console.error("Error occurred:", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
    setIsListening(true);
  };

  const stopRecording = () => {
    if ("webkitSpeechRecognition" in window) {
      (window as any).webkitSpeechRecognition.stop();
    }
    setIsListening(false);
  };

  return (
    <div className={twMerge("bg-gray-900 text-white p-6 rounded-lg shadow-lg")}>
      <h2 className="text-xl font-bold mb-4">Voice-to-Text Procurement Logging</h2>
      <div className="flex items-center justify-between">
        {isListening ? (
          <button
            onClick={stopRecording}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Stop Recording
          </button>
        ) : (
          <button
            onClick={startRecording}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Start Recording
          </button>
        )}
      </div>
      {transcription && (
        <div className="mt-4 bg-gray-800 p-4 rounded-lg">
          <p className="text-base font-semibold">Transcription:</p>
          <pre>{transcription}</pre>
        </div>
      )}
    </div>
  );
};

export default VoiceToTextProcurementLogging;
