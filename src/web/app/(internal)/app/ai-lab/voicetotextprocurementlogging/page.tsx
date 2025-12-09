
// @ts-nocheck

'use client';

import React, { useState } from 'react';
import { Activity } from 'lucide-react';
import { useTheme } from 'next-themes';
import clsx from 'clsx';
import tailwindMerge from 'tailwind-merge';

const VoiceToTextProcurementLogging = () => {
  const [text, setText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const { theme } = useTheme();

  const startRecording = async () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            const audioUrl = URL.createObjectURL(event.data);
            const recognition = new webkitSpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = false;
            recognition.lang = 'en-US';

            recognition.onresult = (e) => {
              setText(e.results[0][0].transcript);
            };

            recognition.onerror = (err) => {
              console.error('Error:', err);
            };

            recognition.start();
          }
        };

        mediaRecorder.onstop = () => {
          stream.getTracks().forEach(track => track.stop());
        };

        mediaRecorder.start();
        setIsRecording(true);
      } catch (error) {
        console.error('Access to microphone denied.');
      }
    } else {
      console.error('Browser does not support getUserMedia');
    }
  };

  const stopRecording = () => {
    if (isRecording) {
      // Assuming the mediaRecorder is still available
      setIsRecording(false);
    }
  };

  return (
    <div className={tailwindMerge(
      'p-6 rounded-lg shadow-lg bg-white dark:bg-gray-800',
      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
    )}>
      <h2 className="mb-4 text-xl font-semibold">Voice-to-Text Procurement Logging</h2>
      <div>
        <button
          onClick={isRecording ? stopRecording : startRecording}
          className={tailwindMerge(
            'px-4 py-2 rounded-lg text-sm font-medium',
            isRecording ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'
          )}
        >
          {isRecording ? <Activity /> : 'Start Recording'}
        </button>
      </div>
      {text && (
        <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
          <p>Transcript:</p>
          <pre>{text}</pre>
        </div>
      )}
    </div>
  );
};

export default VoiceToTextProcurementLogging;
