import React from 'react';
import { Student, AttendanceStatus, AgeGroup } from '../types.ts';

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
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Total Present" value={presentCount} color="bg-[#41618B]" icon="👥" />
        <StatCard title="Infants" value={infantCount} color="bg-[#98D2B9]" icon="🌱" />
        <StatCard title="Toddlers" value={toddlerCount} color="bg-[#F4D06F]" icon="🧸" />
        <StatCard title="Preschoolers" value={preschoolerCount} color="bg-[#67A08B]" icon="🎒" />
      </div>

      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-8 flex items-center gap-3">
           <span className="w-2 h-8 bg-[#41618B] rounded-full"></span>
           Checked-In Students
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {students.filter(s => s.status === AttendanceStatus.IN).map(student => (
            <div 
              key={student.id} 
              className="flex items-center space-x-4 p-5 bg-gray-50 rounded-3xl hover:bg-[#eef2f7] cursor-pointer transition-all group"
              onClick={() => onSelectStudent(student.id)}
            >
              <img src={student.photoUrl} alt={student.name} className="w-14 h-14 rounded-2xl border-2 border-white shadow-sm object-cover" />
              <div>
                <h3 className="font-bold text-gray-800 text-sm group-hover:text-[#41618B] transition-colors">{student.name}</h3>
                <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mt-0.5">
                  Arrived at {new Date(student.logs.filter(l => l.type === 'In').slice(-1)[0]?.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
          {presentCount === 0 && (
            <div className="col-span-full py-20 text-center bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200">
              <p className="text-gray-400 font-bold italic tracking-wide">No students are currently on premises.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, color, icon }: { title: string, value: number, color: string, icon: string }) => (
  <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-lg transition-all">
    <div>
      <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">{title}</p>
      <h3 className="text-4xl font-extrabold text-gray-800">{value}</h3>
    </div>
    <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center text-2xl text-white shadow-xl`}>
      {icon}
    </div>
  </div>
);

export default Dashboard;