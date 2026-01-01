
import React, { useState } from 'react';
import { Student, AttendanceStatus, Employee } from '../types';

interface ReportsProps {
  students: Student[];
  employees: Employee[];
}

const Reports: React.FC<ReportsProps> = ({ students, employees }) => {
  const [activeSegment, setActiveSegment] = useState<'daily' | 'student' | 'staff'>('daily');

  const downloadCSV = (data: any[], filename: string) => {
    if (!data || data.length === 0) {
      alert("No data available to export.");
      return;
    }

    const csvRows = [];
    const headers = Object.keys(data[0]);
    csvRows.push(headers.join(','));

    for (const row of data) {
      const values = headers.map(header => {
        const val = row[header] === null || row[header] === undefined ? '' : row[header];
        const escaped = ('' + val).replace(/"/g, '""');
        return `"${escaped}"`;
      });
      csvRows.push(values.join(','));
    }

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExportDaily = () => {
    const today = new Date().toLocaleDateString();
    const data = students.map(s => {
      const todayStr = new Date().toLocaleDateString();
      const inLog = s.logs.find(l => l.type === AttendanceStatus.IN && new Date(l.timestamp).toLocaleDateString() === todayStr);
      const outLog = s.logs.find(l => l.type === AttendanceStatus.OUT && new Date(l.timestamp).toLocaleDateString() === todayStr);
      
      return {
        'Student Name': s.name,
        'Guardian Name': s[s.primaryGuardian].name,
        'ID Number': s.id,
        'Check-In': inLog ? new Date(inLog.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A',
        'Check-Out': outLog ? new Date(outLog.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A',
        'Date': today
      };
    });

    downloadCSV(data, `Elever_Student_Register_${today.replace(/\//g, '-')}.csv`);
  };

  const handleExportStaffDaily = () => {
    const today = new Date().toLocaleDateString();
    const data = employees.map(e => {
      const todayStr = new Date().toLocaleDateString();
      const inLog = e.logs.find(l => l.type === AttendanceStatus.IN && new Date(l.timestamp).toLocaleDateString() === todayStr);
      const outLog = e.logs.find(l => l.type === AttendanceStatus.OUT && new Date(l.timestamp).toLocaleDateString() === todayStr);
      
      return {
        'Staff Name': e.name,
        'Role': e.role,
        'ID Number': e.id,
        'Clock-In': inLog ? new Date(inLog.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A',
        'Clock-Out': outLog ? new Date(outLog.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A',
        'Date': today
      };
    });

    downloadCSV(data, `Elever_Staff_Register_${today.replace(/\//g, '-')}.csv`);
  };

  const handleExportIndividual = (student: Student, timeframe: 'weekly' | 'monthly') => {
    const days = timeframe === 'weekly' ? 7 : 30;
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    cutoff.setHours(0, 0, 0, 0);

    const logsByDate: Record<string, { in: string; out: string }> = {};

    student.logs.forEach(log => {
      const logDate = new Date(log.timestamp);
      const dateKey = logDate.toLocaleDateString();
      if (logDate >= cutoff) {
        if (!logsByDate[dateKey]) logsByDate[dateKey] = { in: 'N/A', out: 'N/A' };
        if (log.type === AttendanceStatus.IN) logsByDate[dateKey].in = logDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        if (log.type === AttendanceStatus.OUT) logsByDate[dateKey].out = logDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      }
    });

    const data = Object.entries(logsByDate)
      .sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime())
      .map(([date, times]) => ({
        'Student Name': student.name,
        'Guardian Name': student[student.primaryGuardian].name,
        'ID Number': student.id,
        'Date': date,
        'Check-In': times.in,
        'Check-Out': times.out
      }));

    if (data.length === 0) {
      alert(`No records found for ${student.name}.`);
      return;
    }

    const safeName = student.name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    downloadCSV(data, `Elever_Student_${safeName}_${timeframe}.csv`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex p-1 bg-white rounded-2xl border border-gray-100 shadow-sm max-w-lg mx-auto overflow-x-auto">
        {(['daily', 'student', 'staff'] as const).map((seg) => (
          <button
            key={seg}
            onClick={() => setActiveSegment(seg)}
            className={`flex-1 py-3 px-4 text-xs font-bold rounded-xl transition-all capitalize whitespace-nowrap ${
              activeSegment === seg ? 'bg-[#41618B] text-white shadow-md' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            {seg === 'daily' ? 'Attendance Overview' : seg === 'student' ? 'Student Archive' : 'Staff Archive'}
          </button>
        ))}
      </div>

      {activeSegment === 'daily' && (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 text-center">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Master Register Exports</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <div className="p-6 bg-[#f1f7f5] rounded-[2rem] border border-[#dbece5] space-y-4">
              <div className="text-3xl">🎒</div>
              <h4 className="font-bold text-[#67A08B]">Student Daily Log</h4>
              <p className="text-xs text-gray-500">All student arrivals and departures for today.</p>
              <button onClick={handleExportDaily} className="w-full py-3 bg-[#67A08B] text-white rounded-xl font-bold text-xs shadow-lg shadow-[#67A08B]/20">Download Students CSV</button>
            </div>
            <div className="p-6 bg-[#f0f4f9] rounded-[2rem] border border-[#dbe6f0] space-y-4">
              <div className="text-3xl">👔</div>
              <h4 className="font-bold text-[#41618B]">Staff Clock Register</h4>
              <p className="text-xs text-gray-500">All staff clock-in and clock-out times for today.</p>
              <button onClick={handleExportStaffDaily} className="w-full py-3 bg-[#41618B] text-white rounded-xl font-bold text-xs shadow-lg shadow-[#41618B]/20">Download Staff CSV</button>
            </div>
          </div>
        </div>
      )}

      {activeSegment === 'student' && (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Individual Student Archives</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {students.map(s => (
              <div key={s.id} className="flex items-center justify-between p-5 bg-gray-50 rounded-3xl border border-transparent hover:border-[#41618B]/10 transition-all">
                <div className="flex items-center space-x-4">
                  <img src={s.photoUrl} className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm" />
                  <div>
                    <h4 className="font-bold text-gray-800">{s.name}</h4>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">ID: {s.id}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button onClick={() => handleExportIndividual(s, 'weekly')} className="px-3 py-2 bg-white text-[#41618B] border border-gray-200 rounded-xl text-[10px] font-bold hover:bg-[#41618B] hover:text-white uppercase transition-all">7 Days</button>
                  <button onClick={() => handleExportIndividual(s, 'monthly')} className="px-3 py-2 bg-white text-[#41618B] border border-gray-200 rounded-xl text-[10px] font-bold hover:bg-[#41618B] hover:text-white uppercase transition-all">30 Days</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSegment === 'staff' && (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Staff Performance Archives</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {employees.map(e => (
              <div key={e.id} className="flex items-center justify-between p-5 bg-gray-50 rounded-3xl border border-transparent hover:border-[#41618B]/10 transition-all">
                <div className="flex items-center space-x-4">
                  <img src={e.photoUrl} className="w-12 h-12 rounded-2xl object-cover border-2 border-white shadow-sm" />
                  <div>
                    <h4 className="font-bold text-gray-800">{e.name}</h4>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">{e.role}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="px-3 py-2 bg-white text-[#41618B] border border-gray-200 rounded-xl text-[10px] font-bold hover:bg-[#41618B] hover:text-white uppercase transition-all">Monthly Log</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
