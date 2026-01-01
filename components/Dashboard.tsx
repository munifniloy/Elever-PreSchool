
import React from 'react';
import { Student, AttendanceStatus, AgeGroup } from '../types';

interface DashboardProps {
  students: Student[];
  onSelectStudent: (id: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ students, onSelectStudent }) => {
  const presentCount = students.filter(s => s.status === AttendanceStatus.IN).length;
  const infantCount = students.filter(s => s.ageGroup === AgeGroup.INFANT && s.status === AttendanceStatus.IN).length;
  const toddlerCount = students.filter(s => s.ageGroup === AgeGroup.TODDLER && s.status === AttendanceStatus.IN).length;
  const preschoolerCount = students.filter(s => s.ageGroup === AgeGroup.PRESCHOOLER && s.status === AttendanceStatus.IN).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Total Present" value={presentCount} color="bg-[#41618B]" icon="👥" />
        <StatCard title="Infants" value={infantCount} color="bg-[#98D2B9]" icon="🌱" />
        <StatCard title="Toddlers" value={toddlerCount} color="bg-[#F4D06F]" icon="🧸" />
        <StatCard title="Preschoolers" value={preschoolerCount} color="bg-[#67A08B]" icon="🎒" />
      </div>

      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Currently Checked In</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {students.filter(s => s.status === AttendanceStatus.IN).map(student => (
            <div 
              key={student.id} 
              className="flex items-center space-x-4 p-4 bg-gray-50 rounded-2xl hover:bg-[#eef2f7] cursor-pointer transition-colors border border-transparent hover:border-[#41618B]/10"
              onClick={() => onSelectStudent(student.id)}
            >
              <img src={student.photoUrl} alt={student.name} className="w-12 h-12 rounded-full border-2 border-white shadow-sm object-cover" />
              <div>
                <h3 className="font-semibold text-gray-800 text-sm">{student.name}</h3>
                <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">
                  {new Date(student.logs.filter(l => l.type === 'In').slice(-1)[0]?.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
          {presentCount === 0 && (
            <div className="col-span-full py-12 text-center">
              <p className="text-gray-400 font-medium italic">No students are currently checked in.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, color, icon }: { title: string, value: number, color: string, icon: string }) => (
  <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between">
    <div>
      <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">{title}</p>
      <h3 className="text-3xl font-bold text-gray-800 mt-1">{value}</h3>
    </div>
    <div className={`w-12 h-12 ${color} rounded-2xl flex items-center justify-center text-2xl text-white shadow-lg`}>
      {icon}
    </div>
  </div>
);

export default Dashboard;
