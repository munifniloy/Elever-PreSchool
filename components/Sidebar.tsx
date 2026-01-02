import React from 'react';

interface SidebarProps {
  activeTab: 'dashboard' | 'attendance' | 'employees' | 'reports';
  setActiveTab: (tab: 'dashboard' | 'attendance' | 'employees' | 'reports') => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, onLogout }) => {
  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: '🏠' },
    { id: 'attendance', label: 'Students', icon: '🎒' },
    { id: 'employees', label: 'Staff', icon: '👔' },
    { id: 'reports', label: 'Exports', icon: '📊' },
  ];

  return (
    <nav className="w-20 md:w-64 bg-white border-r border-gray-100 flex flex-col py-10 px-4 space-y-4">
      <div className="flex-1 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id as any)}
            className={`w-full flex items-center space-x-4 p-4 rounded-2xl transition-all ${
              activeTab === item.id 
                ? 'bg-[#41618B] text-white shadow-xl shadow-[#41618B]/20' 
                : 'text-gray-400 hover:bg-gray-50'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="hidden md:inline font-bold text-sm tracking-wide">{item.label}</span>
          </button>
        ))}
      </div>

      <button
        onClick={onLogout}
        className="w-full flex items-center space-x-4 p-4 rounded-2xl transition-all text-red-400 hover:bg-red-50 mt-4"
      >
        <span className="text-xl">🚪</span>
        <span className="hidden md:inline font-bold text-sm">Sign Out</span>
      </button>
    </nav>
  );
};

export default Sidebar;