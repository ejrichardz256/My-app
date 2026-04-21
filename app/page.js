"use client";
import { useState, useEffect } from 'react';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('onyx_data');
    if (saved) setTasks(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('onyx_data', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (text = input) => {
    const taskText = text.trim();
    if (taskText) {
      if (navigator.vibrate) navigator.vibrate(15); 
      setTasks([{ id: Date.now(), text: taskText }, ...tasks]);
      setInput('');
    }
  };

  const startVoice = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice not supported on this browser.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    
    recognition.onstart = () => {
      setIsListening(true);
      if (navigator.vibrate) navigator.vibrate([10, 30, 10]);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      addTask(transcript);
      setIsListening(false);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    
    recognition.start();
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <div className="max-w-md mx-auto pt-16 px-6">
        
        <div className="flex flex-col items-center mb-12">
          <div className="text-yellow-500 text-4xl mb-2">★ ★</div>
          <h1 className="text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-yellow-100 to-yellow-800">
            ONYX
          </h1>
          <p className="text-gray-600 text-[10px] tracking-[0.4em] mt-3 uppercase">Voice Command Enabled</p>
        </div>

        <div className="relative mb-10">
          <input 
            className={`w-full bg-[#0a0a0a] border ${isListening ? 'border-yellow-500 animate-pulse' : 'border-gray-900'} p-5 rounded-2xl text-white focus:outline-none transition-all`} 
            value={input} 
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addTask()}
            placeholder={isListening ? "Listening..." : "Secure new entry..."}
          />
          <div className="absolute right-2 top-2 bottom-2 flex gap-1">
            <button onClick={startVoice} className={`px-3 rounded-xl transition-colors ${isListening ? 'text-red-500' : 'text-yellow-600 hover:text-yellow-400'}`}>
              <svg xmlns="http://w3.org" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" />
              </svg>
            </button>
            <button onClick={() => addTask()} className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-4 rounded-xl font-black text-xs active:scale-95 transition-transform">
              ADD
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {tasks.map(t => (
            <div key={t.id} className="flex justify-between items-center p-6 bg-[#0a0a0a] rounded-2xl border border-gray-900">
              <span className="text-gray-300 font-light">{t.text}</span>
              <button onClick={() => setTasks(tasks.filter(x => x.id !== t.id))} className="text-gray-800 hover:text-red-900">✕</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
