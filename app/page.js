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
    const savedTasks = localStorage.getItem('onyx_v3');
    const savedSecurity = localStorage.getItem('onyx_sec');
    const savedPin = localStorage.getItem('onyx_p');
    if (savedTasks) setTasks(JSON.parse(savedTasks));
    if (savedPin) setMasterPin(savedPin);
    if (savedSecurity === 'true') {
      setSecurityEnabled(true);
      setIsLocked(true);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('onyx_v3', JSON.stringify(tasks));
    localStorage.setItem('onyx_sec', securityEnabled);
    localStorage.setItem('onyx_p', masterPin);
  }, [tasks, securityEnabled, masterPin]);

  const addTask = (text = input) => {
    if (text.trim()) {
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setTasks([{ id: Date.now(), text: text.trim(), time: timeStr }, ...tasks]);
      setInput('');
      if (navigator.vibrate) navigator.vibrate(15);
    }
  };

  const startVoice = () => {
    const Speech = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Speech) return alert("Not supported");
    const rec = new Speech();
    rec.onstart = () => setIsListening(true);
    rec.onresult = (e) => { addTask(e.results[0][0].transcript); setIsListening(false); };
    rec.onend = () => setIsListening(false);
    rec.start();
  };

  const handlePin = (digit) => {
    const newPin = pin + digit;
    setPin(newPin);
    if (newPin === masterPin) { setIsLocked(false); setPin(''); }
    else if (newPin.length >= 4) { setPin(''); if(navigator.vibrate) navigator.vibrate(100); }
  };

  if (isLocked && securityEnabled) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center font-serif text-yellow-500">
        <div className="text-5xl mb-12 tracking-tighter opacity-80">★ ★</div>
        <div className="flex gap-6 mb-16">
          {[...Array(4)].map((_, i) => (
            <div key={i} className={`w-2 h-2 rounded-full border border-yellow-600 ${pin.length > i ? 'bg-yellow-500 shadow-[0_0_10px_#eab308]' : ''}`} />
          ))}
        </div>
        <div className="grid grid-cols-3 gap-10">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, "C", 0].map(btn => (
            <button key={btn} onClick={() => btn === "C" ? setPin('') : handlePin(btn)} className="text-3xl font-light w-12 h-12 flex items-center justify-center active:scale-110 transition-transform">
              {btn}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-[#f4f4f4] font-serif p-8 selection:bg-yellow-500/20">
      <div className="max-w-xl mx-auto">
        
        {/* Luxury Header */}
        <header className="flex justify-between items-baseline mb-20">
          <div>
            <h1 className="text-5xl font-light tracking-tighter text-yellow-500/90">Onyx</h1>
            <p className="text-[10px] tracking-[0.6em] uppercase mt-2 text-yellow-700/50">Est. 2024</p>
          </div>
          <button onClick={() => setShowSettings(!showSettings)} className="text-[10px] tracking-widest uppercase border-b border-yellow-900 pb-1 text-yellow-600">
            {showSettings ? 'Close' : 'Menu'}
          </button>
        </header>

        {showSettings ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-12 py-10">
             <section className="space-y-4">
                <label className="text-[10px] tracking-widest text-yellow-700 uppercase">Security Protocol</label>
                <button onClick={() => setSecurityEnabled(!securityEnabled)} className="w-full text-left py-4 text-2xl border-b border-white/10">
                  {securityEnabled ? 'Encryption: Active' : 'Encryption: Off'}
                </button>
             </section>
             <section className="space-y-4">
                <label className="text-[10px] tracking-widest text-yellow-700 uppercase">New Access Code</label>
                <input type="number" placeholder="0000" className="w-full bg-transparent py-4 text-2xl border-b border-white/10 outline-none placeholder:text-white/10" onChange={e => e.target.value.length === 4 && setMasterPin(e.target.value)} />
             </section>
             <button onClick={() => { if(confirm("Destroy all?")) setTasks([]); }} className="w-full py-6 text-red-900 uppercase text-[10px] tracking-[0.8em] mt-20">Wipe Data Vault</button>
          </div>
        ) : (
          <main className="animate-in fade-in duration-1000">
            {/* Search and Input */}
            <div className="mb-20 space-y-12">
              <input className="w-full bg-transparent border-b border-white/10 py-2 text-sm italic placeholder:text-white/10 outline-none" 
                placeholder="Find entry..." value={search} onChange={e => setSearch(e.target.value)} />
              
              <div className="relative group">
                <input className="w-full bg-transparent border-b border-yellow-900/50 py-4 text-3xl outline-none placeholder:text-white/5 focus:border-yellow-600 transition-all" 
                  placeholder="New Thought" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && addTask()} />
                <div className="absolute right-0 bottom-4 flex gap-8 items-center">
                   <button onClick={startVoice} className={`${isListening ? 'text-red-500' : 'text-yellow-600'} transition-colors`}>Mic</button>
                   <button onClick={() => addTask()} className="text-yellow-500 text-sm tracking-widest font-bold uppercase">Add</button>
                </div>
              </div>
            </div>

            {/* List */}
            <div className="space-y-16">
              {tasks.filter(t => t.text.toLowerCase().includes(search.toLowerCase())).map(t => (
                <div key={t.id} className="group border-l border-yellow-900/20 pl-8 relative">
                   <div className="text-3xl font-light leading-snug mb-3 text-white/90">{t.text}</div>
                   <div className="flex justify-between items-center">
                     <span className="text-[10px] tracking-[0.4em] text-yellow-700/50 uppercase">{t.time}</span>
                     <button onClick={() => setTasks(tasks.filter(x => x.id !== t.id))} className="text-white/10 group-hover:text-red-900 transition-colors text-xs">Delete</button>
                   </div>
                </div>
              ))}
            </div>
            
            {securityEnabled && (
              <button onClick={() => setIsLocked(true)} className="mt-32 w-full py-10 text-[9px] tracking-[1em] uppercase text-yellow-900/30 hover:text-yellow-600 transition-all underline underline-offset-8">Lock Onyx</button>
            )}
          </main>
        )}
      </div>
    </div>
  );
}
