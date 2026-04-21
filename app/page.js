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

  useEffect(() => {
    const savedTasks = localStorage.getItem('onyx_data');
    const savedSecurity = localStorage.getItem('onyx_security');
    const savedPin = localStorage.getItem('onyx_pin');
    if (savedTasks) setTasks(JSON.parse(savedTasks));
    if (savedPin) setMasterPin(savedPin);
    if (savedSecurity === 'true') {
      setSecurityEnabled(true);
      setIsLocked(true);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('onyx_data', JSON.stringify(tasks));
    localStorage.setItem('onyx_security', securityEnabled);
    localStorage.setItem('onyx_pin', masterPin);
  }, [tasks, securityEnabled, masterPin]);

  const handlePin = (digit) => {
    const newPin = pin + digit;
    setPin(newPin);
    if (newPin === masterPin) {
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
      const timeStr = `${now.toLocaleDateString()} ${now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
      setTasks([{ id: Date.now(), text: input.trim(), time: timeStr }, ...tasks]);
      setInput('');
      if (navigator.vibrate) navigator.vibrate(15);
    }
  };

  const exportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(tasks));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "onyx_vault_export.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const filteredTasks = tasks.filter(t => t.text.toLowerCase().includes(search.toLowerCase()));

  if (isLocked && securityEnabled) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6">
        <div className="text-yellow-500 text-4xl mb-2">★ ★</div>
        <div className="text-white tracking-[0.3em] text-xs font-bold mb-10">ONYX VAULT</div>
        <div className="flex gap-4 mb-10">
          {[...Array(4)].map((_, i) => (
            <div key={i} className={`w-4 h-4 rounded-full border-2 border-yellow-500 ${pin.length > i ? 'bg-yellow-500' : ''}`} />
          ))}
        </div>
        <div className="grid grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, "C", 0].map((btn) => (
            <button key={btn} onClick={() => btn === "C" ? setPin('') : handlePin(btn)} className="w-16 h-16 rounded-full border border-white/20 text-white text-2xl font-bold active:bg-yellow-500 active:text-black transition-colors">{btn}</button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6 pt-10">
      <div className="max-w-md mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-black text-yellow-500 tracking-tighter">ONYX</h1>
          <button onClick={() => setShowSettings(!showSettings)} className="text-white bg-white/10 px-4 py-2 rounded-lg text-xs font-bold border border-white/20 uppercase tracking-widest">
            {showSettings ? 'Close' : 'Settings'}
          </button>
        </div>

        {showSettings ? (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8 space-y-6">
            <h2 className="text-yellow-500 font-bold uppercase tracking-widest text-sm">Vault Settings</h2>
            <div>
              <p className="text-[10px] text-white/50 mb-2 uppercase">Security Toggle</p>
              <button onClick={() => setSecurityEnabled(!securityEnabled)} className={`w-full py-3 rounded-xl font-bold border transition-all ${securityEnabled ? 'bg-yellow-500 text-black border-yellow-500' : 'bg-transparent text-white border-white/20'}`}>
                PIN PROTECTION: {securityEnabled ? 'ACTIVE' : 'DISABLED'}
              </button>
            </div>
            <div>
              <p className="text-[10px] text-white/50 mb-2 uppercase">Change 4-Digit PIN</p>
              <input type="number" placeholder="Enter new PIN" className="w-full bg-black border border-white/20 p-3 rounded-xl text-white outline-none focus:border-yellow-500" onChange={(e) => e.target.value.length === 4 && setMasterPin(e.target.value)} />
            </div>
            <button onClick={exportData} className="w-full py-3 bg-white text-black rounded-xl font-bold uppercase text-xs">Export Vault (.JSON)</button>
          </div>
        ) : (
          <>
            <input className="w-full bg-white/5 border border-white/20 p-4 rounded-xl text-white placeholder-white/30 mb-4 outline-none focus:border-yellow-500" 
              placeholder="Search tasks..." value={search} onChange={(e)=>setSearch(e.target.value)} />
            
            <div className="relative mb-8">
              <input className="w-full bg-white/10 border border-white/20 p-5 rounded-2xl text-white outline-none focus:border-yellow-500 text-lg" 
                placeholder="New log..." value={input} onChange={(e)=>setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addTask()} />
              <button onClick={addTask} className="absolute right-2 top-2 bottom-2 bg-yellow-500 text-black px-6 rounded-xl font-black">ADD</button>
            </div>

            <div className="space-y-4">
              {filteredTasks.map(t => (
                <div key={t.id} className="p-6 bg-white/5 border border-white/10 rounded-2xl flex justify-between items-center group shadow-xl">
                  <div className="flex flex-col pr-4">
                    <span className="text-white text-xl font-medium mb-1 break-words">{t.text}</span>
                    <span className="text-[10px] tracking-widest text-yellow-500 font-bold uppercase">{t.time}</span>
                  </div>
                  <button onClick={() => setTasks(tasks.filter(x => x.id !== t.id))} className="text-white/40 hover:text-red-500 font-bold text-xl px-2">✕</button>
                </div>
              ))}
            </div>
          </>
        )}
        
        {securityEnabled && !showSettings && (
          <button onClick={() => setIsLocked(true)} className="mt-12 w-full py-5 bg-white/5 border border-white/20 rounded-2xl text-white text-[10px] font-bold tracking-[0.4em] uppercase">Lock Vault Now</button>
        )}
      </div>
    </div>
  );
}
