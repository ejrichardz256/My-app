"use client";
import { useState, useEffect } from 'react';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState('');

  const addTask = () => {
    if (input.trim()) {
      setTasks([...tasks, { id: Date.now(), text: input.trim() }]);
      setInput('');
    }
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-yellow-500/30">
      <div className="max-w-md mx-auto pt-12 px-6">
        
        {/* Header Section */}
        <div className="flex flex-col items-center mb-10">
          <div className="text-yellow-500 text-3xl mb-2 drop-shadow-[0_0_8px_rgba(234,179,8,0.8)]">
            ★ ★
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 via-yellow-500 to-yellow-700">
            ONYX
          </h1>
          <p className="text-gray-500 text-xs tracking-[0.2em] mt-2 uppercase">Premium Essentials</p>
        </div>

        {/* Input Section */}
        <div className="relative group mb-8">
          <input 
            className="w-full bg-[#111] border border-gray-800 p-4 rounded-2xl text-white placeholder-gray-600 focus:outline-none focus:border-yellow-600 transition-all shadow-inner" 
            value={input} 
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addTask()}
            placeholder="Enter priority task..."
          />
          <button 
            onClick={addTask} 
            className="absolute right-2 top-2 bottom-2 bg-gradient-to-br from-yellow-400 to-yellow-700 text-black px-5 rounded-xl font-bold hover:scale-95 active:scale-90 transition-transform"
          >
            ADD
          </button>
        </div>

        {/* Task List */}
        <div className="space-y-4">
          {tasks.length === 0 && (
            <p className="text-center text-gray-700 mt-10 italic">No active tasks in the vault.</p>
          )}
          {tasks.map(task => (
            <div 
              key={task.id} 
              className="flex justify-between items-center p-5 bg-[#0a0a0a] rounded-2xl border border-gray-900 group hover:border-yellow-900/50 transition-colors"
            >
              <span className="text-gray-200 font-medium">{task.text}</span>
              <button 
                onClick={() => deleteTask(task.id)} 
                className="text-gray-600 hover:text-red-500 transition-colors px-2"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
