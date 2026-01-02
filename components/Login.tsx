import React, { useState } from 'react';
import { APP_LOGO } from '../constants.ts';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('admin@eleverbd.com');
  const [password, setPassword] = useState('admin123');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') {
      onLogin();
    } else {
      alert('Invalid Access Key');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl p-12 text-center border border-gray-100 animate-fade">
        <div className="relative mb-8">
           <img src={APP_LOGO} alt="Élever Logo" className="w-32 h-32 rounded-[2rem] object-cover mx-auto shadow-2xl border-4 border-white" />
           <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#41618B] text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg">
             Console
           </div>
        </div>
        <h1 className="text-3xl font-extrabold text-[#41618B] mb-2 tracking-tight">System Portal</h1>
        <p className="text-gray-400 font-medium text-sm mb-10">Administrative Management Suite</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <input 
            type="email" 
            placeholder="Admin Email" 
            className="w-full p-5 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-[#98D2B9] transition-all text-center font-medium"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <input 
            type="password" 
            placeholder="Access Key" 
            className="w-full p-5 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-[#98D2B9] transition-all text-center font-medium"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <button className="w-full py-5 bg-[#41618B] text-white rounded-2xl font-bold shadow-xl shadow-[#41618B]/20 hover:scale-[1.02] active:scale-[0.98] transition-all uppercase tracking-widest text-xs">
            Unlock Console
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;