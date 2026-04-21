"use client";
import { useState, useEffect } from 'react';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState('');
  const [search, setSearch] = useState('');
  const [isLocked, setIsLocked] = useState(false);
  const [pin, setPin] = useState('');
  const [masterPin, setMasterPin] = useState('1234');
  const [securityEnabled, setSecurityEnabled] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('onyx_v7');
    const sec = localStorage.getItem('onyx_sec');
    const p = localStorage.getItem('onyx_p');
    if (saved) setTasks(JSON.parse(saved));
    if (p) setMasterPin(p);
    if (sec === 'true') { setSecurityEnabled(true); setIsLocked(true); }
  }, []);

  useEffect(() => {
    localStorage.setItem('onyx_v7', JSON.stringify(tasks));
    localStorage.setItem('onyx_sec', securityEnabled);
    localStorage.setItem('onyx_p', masterPin);
  }, [tasks, securityEnabled, masterPin]);

  const addTask = (text = input) => {
    if (text.trim()) {
      const now = new Date();
      const timeStr = now.toLocaleDateString([], { month: 'short', day: 'numeric' });
      setTasks([{ id: Date.now(), text: text.trim(), time: timeStr }, ...tasks]);
      setInput('');
      if (navigator.vibrate) navigator.vibrate(15);
    }
  };

  const startVoice = () => {
    const Speech = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Speech) return;
    const rec = new Speech();
    rec.onstart = () => setIsListening(true);
    rec.onresult = (e) => { addTask(e.results.transcript); setIsListening(false); };
    rec.onend = () => setIsListening(false);
    rec.start();
  };

  const handlePin = (digit) => {
    const newPin = pin + digit;
    setPin(newPin);
    if (newPin === masterPin) { setIsLocked(false); setPin(''); }
    else if (newPin.length >= 4) { setPin(''); }
  };

  if (isLocked && securityEnabled) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center font-sans text-yellow-600">
        <div className="text-4xl mb-12 opacity-50">★ ★</div>
        <div className="flex gap-6 mb-16">
          {[...Array(4)].map((_, i) => (
            <div key={i} className={`w-3 h-3 rounded-full border border-yellow-800 ${pin.length > i ? 'bg-yellow-500 shadow-[0_0_10px_#eab308]' : ''}`} />
          ))}
        </div>
        <div className="grid grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, "C", 0].map(btn => (
            <button key={btn} onClick={() => btn === "C" ? setPin('') : handlePin(btn)} className="text-3xl font-light w-16 h-16 rounded-full border border-white/5 flex items-center justify-center active:bg-white/10 transition-all">{btn}</button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#000] text-[#eee] font-sans p-4 pb-32">
      <div className="max-w-4xl mx-auto">
        
        {/* Google Keep Pill Search Bar */}
        <header className="sticky top-2 z-50 bg-[#1e1e1e]/90 backdrop-blur-md rounded-full px-4 py-2 flex justify-between items-center shadow-lg border border-white/5">
          <div className="flex items-center gap-3 flex-1">
            <button onClick={() => setShowSettings(!showSettings)} className="p-2 text-gray-400 hover:text-white">
              <svg xmlns="http://w3.org" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
            <input 
              className="bg-transparent border-none w-full py-1 text-sm outline-none placeholder:text-gray-500" 
              placeholder="Search your notes" 
              value={search} 
              onChange={e => setSearch(e.target.value)} 
            />
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-yellow-600 flex items-center justify-center font-bold text-black text-xs">O</div>
          </div>
        </header>

        {showSettings ? (
          <div className="mt-8 space-y-6 animate-in fade-in">
             <button onClick={() => setSecurityEnabled(!securityEnabled)} className="w-full text-left py-4 border-b border-white/5 flex justify-between">
                <span>Security Vault</span>
                <span className="text-yellow-500">{securityEnabled ? 'Active' : 'Off'}</span>
             </button>
             <input type="number" placeholder="Set 4-Digit PIN" className="w-full bg-transparent py-4 border-b border-white/5 outline-none" onChange={e => e.target.value.length === 4 && setMasterPin(e.target.value)} />
             <button onClick={() => { if(confirm("Destroy all entries?")) setTasks([]); }} className="w-full text-left py-4 text-red-800">Clear All Data</button>
             <button onClick={() => setShowSettings(false)} className="w-full py-3 bg-yellow-600 text-black rounded-lg font-bold">Back to Notes</button>
          </div>
        ) : (
          <main className="mt-8">
            <div className="columns-2 gap-3 space-y-3">
              {tasks.filter(t => t.text.toLowerCase().includes(search.toLowerCase())).map(t => (
                <div key={t.id} className="break-inside-avoid bg-[#1e1e1e] border border-white/10 p-4 rounded-xl hover:border-yellow-600/30 transition-all group relative">
                   <div className="text-sm font-medium leading-relaxed mb-6 text-white/90 break-words">{t.text}</div>
                   <div className="flex justify-between items-center text-[10px] text-gray-500">
                     <span>{t.time}</span>
                     <button onClick={() => setTasks(tasks.filter(x => x.id !== t.id))} className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-opacity p-1">
                        <svg xmlns="http://w3.org" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                        </svg>
                     </button>
                   </div>
                </div>
              ))}
            </div>
            
            {/* Floating Bottom Bar (FAB) */}
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md bg-[#1e1e1e] border border-white/10 rounded-full p-2 flex items-center shadow-2xl z-50">
              <input className="flex-1 bg-transparent px-4 py-2 text-sm outline-none placeholder:text-gray-500" 
                placeholder="Take a note..." value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && addTask()} />
              <div className="flex gap-2 pr-2">
                 <button onClick={startVoice} className={`p-2 rounded-full transition-colors ${isListening ? 'bg-red-500 text-white' : 'text-yellow-600 hover:bg-white/5'}`}>
                    <svg xmlns="http://w3.org" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" />
                    </svg>
                 </button>
                 <button onClick={() => addTask()} className="bg-yellow-600 text-black px-4 py-2 rounded-full font-bold text-xs">Save</button>
              </div>
            </div>

            {securityEnabled && (
              <button onClick={() => setIsLocked(true)} className="fixed bottom-24 right-6 p-3 bg-[#1e1e1e] border border-white/10 rounded-full text-yellow-600 shadow-xl z-40">
                 <svg xmlns="http://w3.org" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                 </svg>
              </button>
            )}
          </main>
        )}
      </div>
    </div>
  );
}
