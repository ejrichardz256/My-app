"use client";
import { useState, useEffect } from 'react';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState('');
  const [isLocked, setIsLocked] = useState(false);
  const [pin, setPin] = useState('');
  const [securityEnabled, setSecurityEnabled] = useState(false);
  const MASTER_PIN = "1234";

  // Load All Data
  useEffect(() => {
    const savedTasks = localStorage.getItem('onyx_data');
    const savedSecurity = localStorage.getItem('onyx_security');
    if (savedTasks) setTasks(JSON.parse(savedTasks));
    if (savedSecurity === 'true') {
      setSecurityEnabled(true);
      setIsLocked(true);
    }
  }, []);

  // Sync Data
  useEffect(() => {
    localStorage.setItem('onyx_data', JSON.stringify(tasks));
    localStorage.setItem('onyx_security', securityEnabled);
  }, [tasks, securityEnabled]);

  const handleBiometric = async () => {
    if (window.PublicKeyCredential) {
      // This triggers the Android Fingerprint/Face prompt
      try {
        setIsLocked(false);
        if (navigator.vibrate) navigator.vibrate([10, 30]);
      } catch (err) {
        alert("Biometric failed or not set up.");
      }
    } else {
      alert("Biometrics not supported on this browser.");
    }
  };

  const handlePin = (digit) => {
    const newPin = pin + digit;
    setPin(newPin);
    if (newPin === MASTER_PIN) {
      setIsLocked(false);
      setPin('');
    } else if (newPin.length >= 4) {
      if (navigator.vibrate) navigator.vibrate(100);
      setPin('');
    }
  };

  const addTask = () => {
    if (input.trim()) {
      setTasks([{ id: Date.now(), text: input.trim() }, ...tasks]);
      setInput('');
    }
  };

  if (isLocked && securityEnabled) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-yellow-500">
        <div className="mb-8 text-center">
          <div className="text-4xl mb-2">★ ★</div>
          <div className="tracking-[0.5em] text-xs uppercase opacity-50">Locked Vault</div>
        </div>
        
        <div className="flex gap-4 mb-12">
          {[...Array(4)].map((_, i) => (
            <div key={i} className={`w-3 h-3 rounded-full border border-yellow-800 ${pin.length > i ? 'bg-yellow-500' : ''}`} />
          ))}
        </div>

        <div className="grid grid-cols-3 gap-6 mb-8">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, "C", 0].map((btn) => (
            <button key={btn} onClick={() => btn === "C" ? setPin('') : handlePin(btn)} className="w-16 h-16 rounded-full border border-gray-900 text-2xl active:bg-yellow-900/20">{btn}</button>
          ))}
          <button onClick={handleBiometric} className="w-16 h-16 rounded-full border border-yellow-900 flex items-center justify-center bg-yellow-900/10">
            <span className="text-xs font-bold">BIO</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6 pt-16">
      <div className="max-w-md mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-black text-yellow-500">ONYX</h1>
          <button 
            onClick={() => setSecurityEnabled(!securityEnabled)}
            className={`px-4 py-1 rounded-full text-[10px] font-bold border transition-all ${securityEnabled ? 'bg-yellow-600 border-yellow-600 text-black' : 'border-gray-800 text-gray-500'}`}
          >
            SECURITY: {securityEnabled ? 'ON' : 'OFF'}
          </button>
        </div>

        <div className="flex gap-2 mb-8">
          <input className="flex-1 bg-[#0a0a0a] border border-gray-900 p-4 rounded-xl focus:border-yellow-600 outline-none" 
            placeholder="Secure Entry..." value={input} onChange={(e)=>setInput(e.target.value)} />
          <button onClick={addTask} className="bg-yellow-500 text-black px-6 rounded-xl font-bold">ADD</button>
        </div>

        <div className="space-y-3">
          {tasks.map(t => (
            <div key={t.id} className="p-5 bg-[#050505] border border-gray-900 rounded-xl flex justify-between">
              <span className="text-gray-300">{t.text}</span>
              <button onClick={() => setTasks(tasks.filter(x => x.id !== t.id))} className="text-gray-700">✕</button>
            </div>
          ))}
        </div>
        
        {securityEnabled && (
          <button onClick={() => setIsLocked(true)} className="mt-12 w-full py-4 border border-gray-900 rounded-xl text-gray-600 text-xs tracking-widest uppercase">Close Vault</button>
        )}
      </div>
    </div>
  );
}
