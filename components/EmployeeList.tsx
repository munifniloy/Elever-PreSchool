import React, { useState, useRef } from 'react';
import { Employee, AttendanceStatus, EmployeeRole } from '../types.ts';

interface ImagePickerProps {
  value: string;
  onChange: (base64: string) => void;
  label: string;
}

const ImagePicker: React.FC<ImagePickerProps> = ({ value, onChange, label }) => {
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startCamera = async () => {
    try {
      setShowCamera(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      alert("Camera access denied.");
      setShowCamera(false);
    }
  };

  const stopCamera = () => {
    const stream = videoRef.current?.srcObject as MediaStream;
    stream?.getTracks().forEach(t => t.stop());
    setShowCamera(false);
  };

  const capture = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0);
      const data = canvas.toDataURL('image/jpeg', 0.8);
      onChange(data);
      stopCamera();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => onChange(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</label>
      <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
        <div className="w-20 h-20 rounded-2xl bg-gray-200 overflow-hidden border-4 border-white shadow-sm flex-shrink-0">
          {value ? <img src={value} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-300 text-3xl">👤</div>}
        </div>
        <div className="flex flex-col space-y-2 flex-1">
          <button type="button" onClick={() => fileInputRef.current?.click()} className="py-2 bg-white border border-gray-200 text-gray-600 rounded-xl text-xs font-bold hover:bg-gray-50 transition-all">Upload Photo</button>
          <button type="button" onClick={startCamera} className="py-2 bg-[#41618B] text-white rounded-xl text-xs font-bold hover:bg-[#344e70] transition-all">Open Camera</button>
          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
        </div>
      </div>
      {showCamera && (
        <div className="fixed inset-0 z-[100] bg-black/90 flex flex-col items-center justify-center p-6 backdrop-blur-md">
          <div className="relative w-full max-w-sm aspect-square bg-black rounded-[3rem] overflow-hidden border-4 border-white/20">
            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
          </div>
          <div className="flex space-x-4 mt-8">
            <button onClick={stopCamera} className="px-8 py-3 bg-white/10 text-white rounded-2xl font-bold">Cancel</button>
            <button onClick={capture} className="px-8 py-3 bg-[#98D2B9] text-white rounded-2xl font-bold shadow-2xl">Capture</button>
          </div>
        </div>
      )}
    </div>
  );
};

interface EmployeeListProps {
  employees: Employee[];
  onToggleAttendance: (id: string) => void;
  onAddEmployee: (employee: Employee) => void;
  onDeleteEmployee: (id: string) => void;
}

const EmployeeList: React.FC<EmployeeListProps> = ({ employees, onToggleAttendance, onAddEmployee, onDeleteEmployee }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newStaff, setNewStaff] = useState({
    name: '',
    role: EmployeeRole.TEACHER,
    photoUrl: '',
    phone: '',
    email: '',
    birthday: '',
    bloodGroup: 'Unknown',
    address: '',
    qualification: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaff.photoUrl) {
      alert("Please provide a staff photo.");
      return;
    }
    const id = `STAFF-${Math.floor(1000 + Math.random() * 9000)}`;
    const staffToEnroll: Employee = {
      ...newStaff,
      id,
      status: AttendanceStatus.OUT,
      logs: [],
      joinDate: new Date().toISOString()
    };
    onAddEmployee(staffToEnroll);
    setIsAdding(false);
    setNewStaff({
      name: '',
      role: EmployeeRole.TEACHER,
      photoUrl: '',
      phone: '',
      email: '',
      birthday: '',
      bloodGroup: 'Unknown',
      address: '',
      qualification: ''
    });
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Staff & Faculty</h2>
          <p className="text-sm text-gray-400">Track working hours for teachers and support staff.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="px-6 py-2 bg-[#41618B] text-white rounded-xl text-xs font-bold hover:bg-[#344e70] transition-all shadow-lg shadow-[#41618B]/20"
        >
          + Add Staff Member
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {employees.map(employee => (
          <div key={employee.id} className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 relative overflow-hidden flex flex-col">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <img src={employee.photoUrl || 'https://via.placeholder.com/150'} className="w-14 h-14 rounded-2xl object-cover shadow-sm border-2 border-[#f1f7f5]" />
                <div>
                  <h3 className="font-bold text-gray-800">{employee.name}</h3>
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                    employee.role === EmployeeRole.TEACHER ? 'bg-purple-50 text-purple-600' : 'bg-orange-50 text-orange-600'
                  }`}>
                    {employee.role}
                  </span>
                </div>
              </div>
              
              {/* CLEARLY VISIBLE DELETE BUTTON FOR STAFF */}
              <button 
                onClick={() => onDeleteEmployee(employee.id)}
                className="p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm border border-red-100"
                title="Remove Staff Member"
              >
                🗑️
              </button>
            </div>

            <div className="space-y-2 mb-6 text-sm text-gray-500 flex-1">
              <p>📞 {employee.phone}</p>
              <p className="truncate">🎓 {employee.qualification || 'No qualification listed'}</p>
              <p className="text-[10px] text-gray-400 font-medium truncate">📍 {employee.address || 'No address'}</p>
            </div>

            <div className="flex items-center justify-between mb-4 bg-gray-50 p-3 rounded-2xl">
              <div className="text-center">
                <p className="text-[10px] font-bold text-gray-400 uppercase">Today's In</p>
                <p className="font-bold text-gray-700 text-xs">
                  {employee.logs.find(l => l.type === 'In' && new Date(l.timestamp).toDateString() === new Date().toDateString())?.timestamp 
                    ? new Date(employee.logs.find(l => l.type === 'In' && new Date(l.timestamp).toDateString() === new Date().toDateString())!.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
                    : '--:--'}
                </p>
              </div>
              <div className="w-px h-8 bg-gray-200"></div>
              <div className="text-center">
                <p className="text-[10px] font-bold text-gray-400 uppercase">Blood</p>
                <p className="font-bold text-red-500 text-xs">{employee.bloodGroup}</p>
              </div>
            </div>

            <button
              onClick={() => onToggleAttendance(employee.id)}
              className={`w-full py-3 rounded-2xl font-bold transition-all ${
                employee.status === AttendanceStatus.IN 
                  ? 'bg-red-50 text-red-600 hover:bg-red-100' 
                  : 'bg-[#41618B] text-white hover:bg-[#344e70] shadow-lg shadow-[#41618B]/20'
              }`}
            >
              {employee.status === AttendanceStatus.IN ? 'Clock Out 👋' : 'Clock In ✅'}
            </button>
          </div>
        ))}
      </div>

      {isAdding && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-md z-[70] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg p-8 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Staff Registration</h2>
              <button onClick={() => setIsAdding(false)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Full Name</label>
                  <input required className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none border border-transparent focus:border-[#41618B]/20 text-black" value={newStaff.name} onChange={e => setNewStaff({...newStaff, name: e.target.value})} />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Role</label>
                  <select className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none border border-transparent focus:ring-2 focus:ring-[#41618B] text-black font-semibold" value={newStaff.role} onChange={e => setNewStaff({...newStaff, role: e.target.value as EmployeeRole})}>
                    {Object.values(EmployeeRole).map(r => <option key={r} value={r} className="text-black bg-white hover:bg-blue-600">{r}</option>)}
                  </select>
                </div>
              </div>
              
              <ImagePicker label="Staff Portrait" value={newStaff.photoUrl} onChange={(data) => setNewStaff({...newStaff, photoUrl: data})} />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Birthday</label>
                  <input required type="date" className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none text-black" value={newStaff.birthday} onChange={e => setNewStaff({...newStaff, birthday: e.target.value})} />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Blood Group</label>
                  <select className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-[#41618B] text-black font-semibold" value={newStaff.bloodGroup} onChange={e => setNewStaff({...newStaff, bloodGroup: e.target.value})}>
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown'].map(bg => (
                      <option key={bg} value={bg} className="text-black bg-white hover:bg-blue-600">{bg}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Qualification</label>
                <input placeholder="e.g., M.Ed, B.S. Nutrition" className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none text-black" value={newStaff.qualification} onChange={e => setNewStaff({...newStaff, qualification: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Phone</label>
                  <input required className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none text-black" value={newStaff.phone} onChange={e => setNewStaff({...newStaff, phone: e.target.value})} />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Email</label>
                  <input required type="email" className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none text-black" value={newStaff.email} onChange={e => setNewStaff({...newStaff, email: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Home Address</label>
                <input className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none text-black" value={newStaff.address} onChange={e => setNewStaff({...newStaff, address: e.target.value})} />
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setIsAdding(false)} className="flex-1 py-4 bg-gray-100 rounded-2xl font-bold text-gray-500">Cancel</button>
                <button type="submit" className="flex-1 py-4 bg-[#41618B] text-white rounded-2xl font-bold">Register Staff</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeList;