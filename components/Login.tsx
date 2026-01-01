import React, { useState } from 'react';
import { APP_LOGO } from '../constants';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === 'admin@eleverbd.com' && password === 'admin123') {
      onLogin();
    } else {
      setError('Invalid admin credentials. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[#f8faf9] flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-72 h-72 bg-[#98D2B9]/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-[#41618B]/10 rounded-full blur-3xl"></div>

      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200/50 p-10 relative z-10 border border-gray-100 animate-in zoom-in-95 duration-500">
        <div className="text-center mb-10 flex flex-col items-center">
          <img src={APP_LOGO} alt="Élever Logo" className="w-32 h-32 object-contain mb-4" />
          <h1 className="text-2xl font-bold text-[#41618B]">Élever Portal</h1>
          <p className="text-gray-400 text-sm mt-2 font-medium">Authorized Management Access Only</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Admin Email</label>
            <input 
              required
              type="email" 
              className="w-full px-5 py-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-[#98D2B9] transition-all text-black outline-none"
              placeholder="admin@eleverbd.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError('');
              }}
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Access Password</label>
            <input 
              required
              type="password" 
              className="w-full px-5 py-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-[#98D2B9] transition-all text-black outline-none"
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-500 text-xs font-bold p-4 rounded-xl text-center animate-in slide-in-from-top-2">
              ⚠️ {error}
            </div>
          )}

          <button 
            type="submit"
            className="w-full py-4 bg-[#41618B] text-white rounded-2xl font-bold shadow-xl shadow-[#41618B]/20 hover:bg-[#344e70] transition-all transform active:scale-95"
          >
            Sign In to Dashboard
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-gray-50 text-center">
          <p className="text-[10px] text-gray-300 font-bold uppercase tracking-tighter">
            Property of Élever Day Care & Preschool
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;