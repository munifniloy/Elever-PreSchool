import React, { useState, useRef } from 'react';
import { Student, AttendanceStatus, AgeGroup } from '../types.ts';

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

  return (
    <div className="space-y-2">
      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</label>
      <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
        <div className="w-16 h-16 rounded-xl bg-gray-200 overflow-hidden border-2 border-white shadow-sm flex-shrink-0">
          {value ? <img src={value} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-300 text-xl">📸</div>}
        </div>
        <div className="flex flex-col space-y-2 flex-1">
          <div className="flex gap-2">
            <button type="button" onClick={() => fileInputRef.current?.click()} className="flex-1 py-2 bg-white border border-gray-200 text-gray-600 rounded-xl text-[10px] font-bold hover:bg-gray-50 transition-all">Upload</button>
            <button type="button" onClick={startCamera} className="flex-1 py-2 bg-[#98D2B9] text-white rounded-xl text-[10px] font-bold hover:bg-[#67A08B] transition-all">Snap</button>
          </div>
          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => {
             const file = e.target.files?.[0];
             if (file) {
               const reader = new FileReader();
               reader.onloadend = () => onChange(reader.result as string);
               reader.readAsDataURL(file);
             }
          }} />
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

interface AttendanceListProps {
  students: Student[];
  onToggleAttendance: (id: string) => void;
  onSelectStudent: (id: string) => void;
  onAddStudent: (student: Student) => void;
  onDeleteStudent: (id: string) => void;
}

const AttendanceList: React.FC<AttendanceListProps> = ({ students, onToggleAttendance, onSelectStudent, onAddStudent, onDeleteStudent }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [newStudent, setNewStudent] = useState<Partial<Student>>({
    name: '',
    ageGroup: AgeGroup.TODDLER,
    photoUrl: '',
    primaryGuardian: 'mother',
    father: { name: '', phone: '', email: '', photoUrl: '' },
    mother: { name: '', phone: '', email: '', photoUrl: '' },
    status: AttendanceStatus.OUT,
    logs: [],
    enrollmentDate: new Date().toISOString(),
    birthday: '',
    bloodGroup: 'Unknown',
    address: ''
  });

  const handleEnrollSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudent.photoUrl || !newStudent.name) {
      alert("Please complete the basic student details and upload a child photo.");
      return;
    }
    const id = `EL-${Math.floor(1000 + Math.random() * 9000)}`;
    onAddStudent({ ...newStudent, id } as Student);
    setIsAdding(false);
    setNewStudent({
      name: '',
      ageGroup: AgeGroup.TODDLER,
      photoUrl: '',
      primaryGuardian: 'mother',
      father: { name: '', phone: '', email: '', photoUrl: '' },
      mother: { name: '', phone: '', email: '', photoUrl: '' },
      status: AttendanceStatus.OUT,
      logs: [],
      enrollmentDate: new Date().toISOString(),
      birthday: '',
      bloodGroup: 'Unknown',
      address: ''
    });
  };

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
        <div className="relative flex-1">
          <span className="absolute left-5 top-1/2 -translate-y-1/2 text-xl text-gray-400">🔍</span>
          <input 
            type="text" 
            placeholder="Search student records..." 
            className="w-full pl-14 pr-6 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-[#98D2B9] outline-none transition-all text-gray-700 font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="px-8 py-4 bg-[#98D2B9] text-white rounded-2xl font-bold text-sm hover:scale-105 active:scale-95 transition-all shadow-xl shadow-[#98D2B9]/20"
        >
          + Enroll New Student
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredStudents.map(student => (
          <div 
            key={student.id} 
            className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all relative overflow-hidden group"
          >
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onDeleteStudent(student.id);
              }}
              className="absolute top-4 right-4 w-10 h-10 bg-red-50 text-red-500 rounded-full flex items-center justify-center transition-all hover:bg-red-500 hover:text-white z-20 shadow-sm border border-red-100"
              title="Remove Student Profile"
            >
              🗑️
            </button>
            
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#f1f7f5] rounded-bl-[4rem] -mr-8 -mt-8 transition-all group-hover:scale-110"></div>
            
            <div className="flex items-start justify-between mb-6 relative">
              <div 
                className="flex items-center space-x-4 cursor-pointer"
                onClick={() => onSelectStudent(student.id)}
              >
                <img src={student.photoUrl} alt={student.name} className="w-16 h-16 rounded-2xl border-2 border-white shadow-md object-cover" />
                <div>
                  <h3 className="font-bold text-gray-800 text-lg group-hover:text-[#41618B] transition-colors">{student.name}</h3>
                  <span className={`text-[10px] font-bold uppercase px-3 py-1 rounded-full ${
                    student.ageGroup === AgeGroup.INFANT ? 'bg-[#f1f7f5] text-[#67A08B]' : 
                    student.ageGroup === AgeGroup.TODDLER ? 'bg-[#fffbeb] text-[#d97706]' : 'bg-[#eff6ff] text-[#3b82f6]'
                  }`}>
                    {student.ageGroup}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4 mb-8 bg-gray-50/50 p-4 rounded-3xl border border-gray-50">
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-400 font-bold uppercase tracking-tighter">Emergency Contact</span>
                <span className="text-gray-700 font-bold">{student[student.primaryGuardian].name}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-400 font-bold uppercase tracking-tighter">Direct Line</span>
                <span className="text-blue-500 font-bold">📞 {student[student.primaryGuardian].phone}</span>
              </div>
            </div>

            <button
              onClick={() => onToggleAttendance(student.id)}
              className={`w-full py-4 rounded-2xl font-bold text-sm transition-all shadow-lg ${
                student.status === AttendanceStatus.IN 
                  ? 'bg-white text-gray-500 border border-gray-100 hover:bg-red-50 hover:text-red-500 hover:border-red-100' 
                  : 'bg-[#41618B] text-white hover:bg-[#344e70] shadow-[#41618B]/20'
              }`}
            >
              {student.status === AttendanceStatus.IN ? 'Check Out 👋' : 'Check In ✅'}
            </button>
          </div>
        ))}
      </div>

      {isAdding && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[70] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-3xl p-8 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-extrabold text-[#41618B]">Student Enrollment</h2>
              <button onClick={() => setIsAdding(false)} className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-200 transition-all">✕</button>
            </div>
            
            <form onSubmit={handleEnrollSubmit} className="space-y-8">
              {/* CHILD SECTION */}
              <div className="space-y-6">
                <h3 className="text-xs font-bold text-[#67A08B] uppercase tracking-widest border-l-4 border-[#98D2B9] pl-3">Child Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Full Name</label>
                    <input required placeholder="Student's Legal Name" className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none border border-transparent focus:border-[#98D2B9]" value={newStudent.name} onChange={e => setNewStudent({...newStudent, name: e.target.value})} />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Age Group</label>
                    <select className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none" value={newStudent.ageGroup} onChange={e => setNewStudent({...newStudent, ageGroup: e.target.value as AgeGroup})}>
                      {Object.values(AgeGroup).map(ag => <option key={ag} value={ag}>{ag}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Date of Birth</label>
                    <input required type="date" className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none" value={newStudent.birthday} onChange={e => setNewStudent({...newStudent, birthday: e.target.value})} />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Blood Group</label>
                    <select className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none" value={newStudent.bloodGroup} onChange={e => setNewStudent({...newStudent, bloodGroup: e.target.value})}>
                      {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown'].map(bg => <option key={bg} value={bg}>{bg}</option>)}
                    </select>
                  </div>
                </div>
                <ImagePicker label="Child Portrait" value={newStudent.photoUrl || ''} onChange={(data) => setNewStudent({...newStudent, photoUrl: data})} />
              </div>

              {/* MOTHER SECTION */}
              <div className="space-y-4 p-6 bg-pink-50/30 rounded-3xl border border-pink-100">
                <h3 className="text-xs font-bold text-pink-500 uppercase tracking-widest flex items-center gap-2">👩 Mother's Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Name</label>
                      <input required className="w-full px-4 py-3 bg-white rounded-xl outline-none" value={newStudent.mother?.name} onChange={e => setNewStudent({...newStudent, mother: {...newStudent.mother!, name: e.target.value}})} />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Phone</label>
                      <input required className="w-full px-4 py-3 bg-white rounded-xl outline-none" value={newStudent.mother?.phone} onChange={e => setNewStudent({...newStudent, mother: {...newStudent.mother!, phone: e.target.value}})} />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Email</label>
                      <input required type="email" className="w-full px-4 py-3 bg-white rounded-xl outline-none" value={newStudent.mother?.email} onChange={e => setNewStudent({...newStudent, mother: {...newStudent.mother!, email: e.target.value}})} />
                    </div>
                  </div>
                  <div className="flex flex-col justify-center">
                    <ImagePicker 
                      label="Mother's Photo" 
                      value={newStudent.mother?.photoUrl || ''} 
                      onChange={(data) => setNewStudent({...newStudent, mother: {...newStudent.mother!, photoUrl: data}})} 
                    />
                  </div>
                </div>
              </div>

              {/* FATHER SECTION */}
              <div className="space-y-4 p-6 bg-blue-50/30 rounded-3xl border border-blue-100">
                <h3 className="text-xs font-bold text-[#41618B] uppercase tracking-widest flex items-center gap-2">👨 Father's Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Name</label>
                      <input required className="w-full px-4 py-3 bg-white rounded-xl outline-none" value={newStudent.father?.name} onChange={e => setNewStudent({...newStudent, father: {...newStudent.father!, name: e.target.value}})} />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Phone</label>
                      <input required className="w-full px-4 py-3 bg-white rounded-xl outline-none" value={newStudent.father?.phone} onChange={e => setNewStudent({...newStudent, father: {...newStudent.father!, phone: e.target.value}})} />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Email</label>
                      <input required type="email" className="w-full px-4 py-3 bg-white rounded-xl outline-none" value={newStudent.father?.email} onChange={e => setNewStudent({...newStudent, father: {...newStudent.father!, email: e.target.value}})} />
                    </div>
                  </div>
                  <div className="flex flex-col justify-center">
                    <ImagePicker 
                      label="Father's Photo" 
                      value={newStudent.father?.photoUrl || ''} 
                      onChange={(data) => setNewStudent({...newStudent, father: {...newStudent.father!, photoUrl: data}})} 
                    />
                  </div>
                </div>
              </div>

              {/* ADDRESS SECTION */}
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Home Address</label>
                <textarea required placeholder="Full residential address..." className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none h-24 resize-none" value={newStudent.address} onChange={e => setNewStudent({...newStudent, address: e.target.value})} />
              </div>

              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setIsAdding(false)} className="flex-1 py-4 bg-gray-100 rounded-2xl font-bold text-gray-500">Cancel</button>
                <button type="submit" className="flex-1 py-4 bg-[#41618B] text-white rounded-2xl font-bold shadow-xl shadow-[#41618B]/20 transition-all hover:scale-[1.01]">Complete Enrollment</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceList;