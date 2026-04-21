"use client";
import { useState } from 'react';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState('');

  const addTask = () => {
    if (input) {
      setTasks([...tasks, { id: Date.now(), text: input }]);
      setInput('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 text-black">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg p-6 mt-10">
        <h1 className="text-3xl font-extrabold text-blue-600 mb-6">Termux App</h1>
        <div className="flex gap-2 mb-4">
          <input 
            className="border-2 border-gray-200 p-3 w-full rounded-xl focus:outline-none focus:border-blue-400" 
            value={input} 
            onChange={(e) => setInput(e.target.value)}
            placeholder="Write something..."
          />
          <button onClick={addTask} className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold">Add</button>
        </div>
        <div className="space-y-3">
          {tasks.map(task => (
            <div key={task.id} className="p-4 bg-gray-50 rounded-lg border border-gray-100 shadow-sm">
              {task.text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

