"use client";
import { useState, useEffect } from 'react';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState('');
  const [isLocked, setIsLocked] = useState(false);
  const [pin, setPin] = useState('');
  const [securityEnabled, setSecurityEnabled] = useState(false);
  const MASTER_PIN = "1234";

  useEffect(() => {
    const savedTasks = localStorage.getItem('onyx_data');
    const savedSecurity = localStorage.getItem('onyx_security');
    if (savedTasks) setTasks(JSON.parse(savedTasks));
    if (savedSecurity === 'true') {
      setSecurityEnabled(true);
      setIsLocked(true);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('onyx_data', JSON.stringify(tasks));
    localStorage.setItem('onyx_security', securityEnabled);
  }, [tasks, securityEnabled]);

  const handleBiometric = async () => {
    if (window.PublicKeyCredential) {
      setIsLocked(false);
      if (navigator.vibrate) navigator.vibrate(10);
    } else {
      alert("Biometrics not supported.");
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
      const now = new Date();
      const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const dateString = now.toLocaleDateString([], { month: 'short', day: 'numeric' });
      
      const newTask = {
        id: Date.now(),
        text: input.trim(),
        time: `${dateString} • ${timeString}`
      };
      
      setTasks([newTask, ...tasks]);
      setInput('');
      if (navigator.vibrate) navigator.vibrate(15);
    }
  };

  if (isLocked && securityEnabled) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-yellow-500">
        <div className="text-4xl mb-2 animate-pulse">★ ★</div>
        <div className="tracking-[0.4em] text-[10px] uppercase opacity-40 mb-12">Authorized Personnel Only</div>
        
        <div className="flex gap-4 mb-10">
          {[...Array(4)].map((_, i) => (
            <div key={i} className={`w-3 h-3 rounded-full border border-yellow-900 ${pin.length > i ? 'bg-yellow-600' : ''}`} />
          ))}
        </div>

        <div className="grid grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, "C", 0].map((btn) => (
            <button key={btn} onClick={() => btn === "C" ? setPin('') : handlePin(btn)} className="w-16 h-16 rounded-full border border-gray-900 text-2xl active:scale-90 transition-transform">{btn}</button>
          ))}
          <button onClick={handleBiometric} className="w-16 h-16 rounded-full border border-yellow-900 bg-yellow-900/10 font-bold text-[10px]">BIO</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6 pt-16">
      <div className="max-w-md mx-auto">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-3xl font-black tracking-tighter text-yellow-500">ONYX</h1>
            <p className="text-[9px] tracking-[0.3em] text-gray-600 uppercase">System Active</p>
          </div>
          <button 
            onClick={() => setSecurityEnabled(!securityEnabled)}
            className={`px-4 py-1 rounded-full text-[9px] font-bold border transition-all ${securityEnabled ? 'bg-yellow-600 border-yellow-600 text-black' : 'border-gray-800 text-gray-600'}`}
          >
            {securityEnabled ? 'SECURED' : 'UNSECURED'}
          </button>
        </div>

        <div className="relative mb-10 group">
          <input className="w-full bg-[#080808] border border-gray-900 p-5 rounded-2xl text-white placeholder-gray-700 focus:border-yellow-600/50 outline-none transition-all shadow-2xl" 
            placeholder="Log new entry..." value={input} onChange={(e)=>setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addTask()} />
          <button onClick={addTask} className="absolute right-2 top-2 bottom-2 bg-gradient-to-r from-yellow-500 to-yellow-700 text-black px-5 rounded-xl font-black text-xs">ADD</button>
        </div>

        <div className="space-y-4">
          {tasks.map(t => (
            <div key={t.id} className="p-6 bg-gradient-to-b from-[#0a0a0a] to-black border border-gray-900 rounded-2xl flex justify-between items-center group hover:border-yellow-900/30 transition-all">
              <div className="flex flex-col">
                <span className="text-gray-200 text-lg font-light mb-1">{t.text}</span>
                <span className="text-[9px] tracking-widest text-yellow-600/60 uppercase font-medium">{t.time}</span>
              </div>
              <button onClick={() => setTasks(tasks.filter(x => x.id !== t.id))} className="text-gray-800 hover:text-red-900 transition-colors">✕</button>
            </div>
          ))}
        </div>
        
        {securityEnabled && (
          <button onClick={() => setIsLocked(true)} className="mt-16 w-full py-4 border border-gray-900 rounded-xl text-gray-700 text-[9px] tracking-[0.5em] uppercase hover:bg-white/5 transition-all">Lock Vault</button>
        )}
      </div>
    </div>
  );
}
