import React from 'react';
import { APP_LOGO } from '../constants';

interface SidebarProps {
  activeTab: 'dashboard' | 'attendance' | 'employees' | 'reports';
  setActiveTab: (tab: 'dashboard' | 'attendance' | 'employees' | 'reports') => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, onLogout }) => {
  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: '🏠' },
    { id: 'attendance', label: 'Students', icon: '🎒' },
    { id: 'employees', label: 'Staff Management', icon: '👔' },
    { id: 'reports', label: 'Records & Export', icon: '📊' },
  ];

  return (
    <nav className="w-20 md:w-64 bg-white border-r border-gray-100 flex flex-col items-center md:items-start py-8 px-4 space-y-4">
      <div className="mb-10 flex items-center space-x-3 px-2">
        <img src={APP_LOGO} alt="Logo" className="w-10 h-10 object-contain" />
        <span className="hidden md:inline text-xl font-bold text-[#41618B] tracking-tight">Élever</span>
      </div>
      
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => setActiveTab(item.id as any)}
          className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all ${
            activeTab === item.id 
              ? 'bg-[#eef2f7] text-[#41618B] font-semibold' 
              : 'text-gray-400 hover:bg-gray-50'
          }`}
        >
          <span className="text-xl">{item.icon}</span>
          <span className="hidden md:inline font-medium">{item.label}</span>
        </button>
      ))}

      <button
        onClick={onLogout}
        className="w-full flex items-center space-x-3 p-3 rounded-xl transition-all text-red-400 hover:bg-red-50 mt-4"
      >
        <span className="text-xl">🚪</span>
        <span className="hidden md:inline font-medium">Sign Out</span>
      </button>
      
      <div className="mt-auto pt-10 w-full hidden md:block">
        <div className="p-4 bg-[#f1f7f5] rounded-2xl border border-[#dbece5]">
          <p className="text-xs font-bold text-[#67a08b] uppercase tracking-wider mb-2">Director Note</p>
          <p className="text-sm text-[#4a7263] italic">"Data is the seed of better decisions."</p>
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;