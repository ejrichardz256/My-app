"use client";
import { useState, useEffect } from 'react';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState('');

  // Load from phone memory
  useEffect(() => {
    const saved = localStorage.getItem('onyx_data');
    if (saved) setTasks(JSON.parse(saved));
  }, []);

  // Save to phone memory
  useEffect(() => {
    localStorage.setItem('onyx_data', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (input.trim()) {
      if (navigator.vibrate) navigator.vibrate(15); 
      setTasks([{ id: Date.now(), text: input.trim() }, ...tasks]);
      setInput('');
    }
  };

  const deleteTask = (id) => {
    if (navigator.vibrate) navigator.vibrate(5);
    setTasks(tasks.filter(t => t.id !== id));
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-yellow-500/30">
      <div className="max-w-md mx-auto pt-16 px-6">
        
        <div className="flex flex-col items-center mb-12">
          <div className="text-yellow-500 text-4xl mb-2 animate-pulse">★ ★</div>
          <h1 className="text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-yellow-100 via-yellow-500 to-yellow-800">
            ONYX
          </h1>
          <p className="text-gray-600 text-[10px] tracking-[0.4em] mt-3 uppercase font-light">The Premium Standard</p>
        </div>

        <div className="relative mb-10 group">
          <input 
            className="w-full bg-[#0a0a0a] border border-gray-900 p-5 rounded-2xl text-white placeholder-gray-700 focus:outline-none focus:border-yellow-600/50 transition-all shadow-2xl" 
            value={input} 
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addTask()}
            placeholder="Secure new entry..."
          />
          <button 
            onClick={addTask} 
            className="absolute right-2 top-2 bottom-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-6 rounded-xl font-black text-sm active:scale-90 transition-transform"
          >
            ADD
          </button>
        </div>

        <div className="space-y-4">
          {tasks.map(task => (
            <div key={task.id} className="flex justify-between items-center p-6 bg-gradient-to-b from-[#111] to-[#050505] rounded-2xl border border-gray-900 hover:border-yellow-900/40 transition-all group">
              <span className="text-gray-300 text-lg font-light tracking-wide">{task.text}</span>
              <button 
                onClick={() => deleteTask(task.id)} 
                className="text-gray-800 hover:text-red-900 transition-colors p-2"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        {tasks.length > 0 && (
          <p className="text-center text-gray-800 text-[10px] mt-10 tracking-widest uppercase">End of Vault</p>
        )}
      </div>
    </div>
  );
}
