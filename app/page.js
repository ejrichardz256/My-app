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
    const saved = localStorage.getItem('onyx_v6');
    const sec = localStorage.getItem('onyx_sec');
    const p = localStorage.getItem('onyx_p');
    if (saved) setTasks(JSON.parse(saved));
    if (p) setMasterPin(p);
    if (sec === 'true') { setSecurityEnabled(true); setIsLocked(true); }
  }, []);

  useEffect(() => {
    localStorage.setItem('onyx_v6', JSON.stringify(tasks));
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
      <div className="min-h-screen bg-black flex flex-col items-center justify-center font-serif text-yellow-600">
        <div className="text-4xl mb-12 tracking-widest opacity-50">★ ★</div>
        <div className="flex gap-6 mb-16">
          {[...Array(4)].map((_, i) => (
            <div key={i} className={`w-2 h-2 rounded-full border border-yellow-700 ${pin.length > i ? 'bg-yellow-500 shadow-[0_0_10px_#eab308]' : ''}`} />
          ))}
        </div>
        <div className="grid grid-cols-3 gap-10">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, "C", 0].map(btn => (
            <button key={btn} onClick={() => btn === "C" ? setPin('') : handlePin(btn)} className="text-3xl font-light w-12 h-12 flex items-center justify-center active:scale-110 transition-transform">{btn}</button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-[#f4f4f4] font-serif p-6">
      <div className="max-w-4xl mx-auto">
        
        <header className="flex justify-between items-center py-4 mb-10">
          <h1 className="text-3xl font-black text-yellow-500 tracking-tighter">Onyx</h1>
          <div className="flex items-center gap-3">
            <div className="relative flex items-center">
              <svg xmlns="http://w3.org" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3 absolute left-3 text-yellow-700/60">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
              <input 
                className="bg-white/5 border border-white/10 rounded-full py-1.5 pl-8 pr-4 text-[10px] text-white outline-none focus:border-yellow-900/40 w-28 sm:w-40 transition-all" 
                placeholder="Search" 
                value={search} 
                onChange={e => setSearch(e.target.value)} 
              />
            </div>
            <button onClick={() => setShowSettings(!showSettings)} className="text-[10px] tracking-widest uppercase text-yellow-700">{showSettings ? 'Back' : 'Menu'}</button>
          </div>
        </header>

        {showSettings ? (
          <div className="p-4 space-y-10">
            <button onClick={() => setSecurityEnabled(!securityEnabled)} className="w-full text-left py-4 text-xl border-b border-white/5">{securityEnabled ? 'Vault: Secured' : 'Vault: Open'}</button>
            <input type="number" placeholder="New PIN" className="w-full bg-transparent py-4 text-xl border-b border-white/5 outline-none" onChange={e => e.target.value.length === 4 && setMasterPin(e.target.value)} />
            <button onClick={() => { if(confirm("Wipe?")) setTasks([]); }} className="w-full py-6 text-red-900 uppercase text-[10px] tracking-widest">Clear All Data</button>
          </div>
        ) : (
          <main>
            {/* Minimalist Input - No border/box */}
            <div className="mb-12">
              <input className="w-full bg-transparent p-2 text-xl outline-none placeholder:text-white/10 italic border-b border-white/5 mb-4" 
                placeholder="New Thought..." value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && addTask()} />
              <div className="flex justify-end gap-6 items-center pr-2">
                <button onClick={startVoice} className={isListening ? 'text-red-500' : 'text-yellow-600/80 hover:text-yellow-500'}>
                  <svg xmlns="http://w3.org" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" />
                  </svg>
                </button>
                <button onClick={() => addTask()} className="text-yellow-600/80 text-[10px] font-bold uppercase tracking-[0.2em] hover:text-yellow-500 transition-colors">Add</button>
              </div>
            </div>

            {/* Pill-style Grid (Matches Search Bar) */}
            <div className="columns-2 gap-4 space-y-4">
              {tasks.filter(t => t.text.toLowerCase().includes(search.toLowerCase())).map(t => (
                <div key={t.id} className="break-inside-avoid bg-white/5 border border-white/5 p-5 rounded-[2rem] hover:border-yellow-900/30 transition-all group">
                   <div className="text-lg font-light leading-relaxed mb-3 text-white/80 break-words">{t.text}</div>
                   <div className="flex justify-between items-center">
                     <span className="text-[7px] tracking-widest text-yellow-700/40 uppercase font-bold">{t.time}</span>
                     <button onClick={() => setTasks(tasks.filter(x => x.id !== t.id))} className="text-white/5 group-hover:text-red-900 transition-colors text-[10px]">✕</button>
                   </div>
                </div>
              ))}
            </div>
            
            {securityEnabled && (
              <button onClick={() => setIsLocked(true)} className="mt-24 w-full py-10 text-[7px] tracking-[1.5em] uppercase text-yellow-900/20 hover:text-yellow-800 transition-all">Lock Onyx</button>
            )}
          </main>
        )}
      </div>
    </div>
  );
}
