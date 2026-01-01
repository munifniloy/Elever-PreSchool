import React, { useState, useEffect, useCallback } from 'react';
import { Student, AttendanceStatus, AgeGroup, Employee } from './types';
import { INITIAL_STUDENTS, INITIAL_EMPLOYEES, APP_LOGO } from './constants';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import AttendanceList from './components/AttendanceList';
import EmployeeList from './components/EmployeeList';
import Reports from './components/Reports';
import StudentProfile from './components/StudentProfile';
import Login from './components/Login';

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
    if (confirm("Are you sure you want to remove this student from Élever? This action cannot be undone.")) {
      setStudents(prev => prev.filter(s => s.id !== id));
      setSelectedStudentId(null);
    }
  };

  const handleDeleteEmployee = (id: string) => {
    if (confirm("Are you sure you want to remove this staff member?")) {
      setEmployees(prev => prev.filter(e => e.id !== id));
    }
  };

  const selectedStudent = students.find(s => s.id === selectedStudentId);

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="flex min-h-screen bg-[#f8faf9]">
      <Sidebar activeTab={activeTab as any} setActiveTab={setActiveTab as any} onLogout={handleLogout} />
      
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <header className="mb-8 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <img src={APP_LOGO} alt="Élever Logo" className="w-12 h-12 object-contain" />
            <div>
              <h1 className="text-3xl font-bold text-[#41618B]">Élever Day Care & Preschool</h1>
              <p className="text-gray-500 font-medium text-sm">Managing growth and excellence since {new Date().getFullYear()}.</p>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="bg-[#f1f7f5] px-4 py-2 rounded-2xl border border-[#dbece5] flex items-center space-x-2">
              <span className="w-2 h-2 bg-[#98D2B9] rounded-full animate-pulse"></span>
              <span className="text-xs font-bold text-[#67A08B] uppercase tracking-wider">Admin Active</span>
            </div>
          </div>
        </header>

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