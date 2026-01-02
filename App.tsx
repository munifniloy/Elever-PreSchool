import React, { useState, useEffect, useCallback } from 'react';
import { Student, AttendanceStatus, Employee } from './types.ts';
import { INITIAL_STUDENTS, INITIAL_EMPLOYEES, APP_LOGO } from './constants.ts';
import Sidebar from './components/Sidebar.tsx';
import Dashboard from './components/Dashboard.tsx';
import AttendanceList from './components/AttendanceList.tsx';
import EmployeeList from './components/EmployeeList.tsx';
import Reports from './components/Reports.tsx';
import StudentProfile from './components/StudentProfile.tsx';
import Login from './components/Login.tsx';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('elever-auth') === 'true';
  });

  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('elever-students');
    return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
  });

  const [employees, setEmployees] = useState<Employee[]>(() => {
    const saved = localStorage.getItem('elever-employees');
    return saved ? JSON.parse(saved) : INITIAL_EMPLOYEES;
  });
  
  const [activeTab, setActiveTab] = useState<'dashboard' | 'attendance' | 'employees' | 'reports'>('dashboard');
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('elever-students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('elever-employees', JSON.stringify(employees));
  }, [employees]);

  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem('elever-auth', 'true');
  };

  const handleLogout = () => {
    if (confirm("Logout from Élever Admin?")) {
      setIsLoggedIn(false);
      localStorage.removeItem('elever-auth');
    }
  };

  const handleToggleAttendance = useCallback((id: string) => {
    setStudents(prev => prev.map(student => {
      if (student.id === id) {
        const newStatus = student.status === AttendanceStatus.IN ? AttendanceStatus.OUT : AttendanceStatus.IN;
        const newLog = {
          id: Date.now().toString(),
          type: newStatus,
          timestamp: new Date().toISOString()
        };
        return {
          ...student,
          status: newStatus,
          logs: [...student.logs, newLog]
        };
      }
      return student;
    }));
  }, []);

  const handleToggleEmployeeAttendance = useCallback((id: string) => {
    setEmployees(prev => prev.map(employee => {
      if (employee.id === id) {
        const newStatus = employee.status === AttendanceStatus.IN ? AttendanceStatus.OUT : AttendanceStatus.IN;
        const newLog = {
          id: Date.now().toString(),
          type: newStatus,
          timestamp: new Date().toISOString()
        };
        return {
          ...employee,
          status: newStatus,
          logs: [...employee.logs, newLog]
        };
      }
      return employee;
    }));
  }, []);

  const handleUpdateStudent = (updatedStudent: Student) => {
    setStudents(prev => prev.map(s => s.id === updatedStudent.id ? updatedStudent : s));
    setSelectedStudentId(null);
  };

  const handleAddStudent = (newStudent: Student) => {
    setStudents(prev => [...prev, newStudent]);
  };

  const handleAddEmployee = (newEmployee: Employee) => {
    setEmployees(prev => [...prev, newEmployee]);
  };

  const handleDeleteStudent = (id: string) => {
    if (confirm("Are you sure you want to PERMANENTLY remove this student profile?")) {
      setStudents(prev => prev.filter(s => s.id !== id));
      if (selectedStudentId === id) setSelectedStudentId(null);
    }
  };

  const handleDeleteEmployee = (id: string) => {
    if (confirm("Are you sure you want to PERMANENTLY remove this staff member?")) {
      setEmployees(prev => prev.filter(e => e.id !== id));
    }
  };

  const selectedStudent = students.find(s => s.id === selectedStudentId);

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="flex min-h-screen bg-[#f8faf9] text-[#1e293b]">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} />
      
      <main className="flex-1 overflow-y-auto p-4 md:p-10 custom-scrollbar">
        <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-5">
            <img src={APP_LOGO} alt="Élever Logo" className="w-16 h-16 rounded-2xl object-cover shadow-lg border-2 border-white" />
            <div>
              <h1 className="text-3xl font-bold text-[#41618B] tracking-tight">Élever</h1>
              <p className="text-gray-400 font-medium text-sm">Day Care & Preschool Management</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 bg-white px-4 py-2 rounded-2xl shadow-sm border border-gray-100">
             <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
             <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Live System Active</span>
          </div>
        </header>

        <div className="animate-fade">
          {activeTab === 'dashboard' && (
            <Dashboard 
              students={students} 
              onSelectStudent={(id) => setSelectedStudentId(id)} 
            />
          )}

          {activeTab === 'attendance' && (
            <AttendanceList 
              students={students} 
              onToggleAttendance={handleToggleAttendance}
              onSelectStudent={(id) => setSelectedStudentId(id)}
              onAddStudent={handleAddStudent}
              onDeleteStudent={handleDeleteStudent}
            />
          )}

          {activeTab === 'employees' && (
            <EmployeeList 
              employees={employees}
              onToggleAttendance={handleToggleEmployeeAttendance}
              onAddEmployee={handleAddEmployee}
              onDeleteEmployee={handleDeleteEmployee}
            />
          )}

          {activeTab === 'reports' && (
            <Reports students={students} employees={employees} />
          )}
        </div>

        {selectedStudent && (
          <StudentProfile 
            student={selectedStudent} 
            onClose={() => setSelectedStudentId(null)}
            onSave={handleUpdateStudent}
            onDelete={handleDeleteStudent}
          />
        )}
      </main>
    </div>
  );
};

export default App;