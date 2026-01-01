
import React, { useState, useRef } from 'react';
import { Student, AttendanceStatus, AgeGroup } from '../types';

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
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      alert("Could not access camera. Please check permissions.");
      setShowCamera(false);
    }
  };

  const stopCamera = () => {
    const stream = videoRef.current?.srcObject as MediaStream;
    stream?.getTracks().forEach(track => track.stop());
    setShowCamera(false);
  };

  const capture = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        const data = canvas.toDataURL('image/jpeg', 0.8);
        onChange(data);
        stopCamera();
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{label}</label>
      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
        <div className="w-16 h-16 rounded-xl bg-gray-200 overflow-hidden flex-shrink-0 border-2 border-white shadow-sm">
          {value ? (
            <img src={value} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">👤</div>
          )}
        </div>
        <div className="flex-1 flex flex-col space-y-2">
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 py-1.5 bg-white border border-gray-200 text-gray-600 rounded-lg text-[10px] font-bold hover:bg-gray-100 transition-colors"
            >
              Upload File
            </button>
            <button
              type="button"
              onClick={startCamera}
              className="flex-1 py-1.5 bg-[#41618B] text-white rounded-lg text-[10px] font-bold hover:bg-[#344e70] transition-colors"
            >
              Take Photo
            </button>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>
      </div>

      {showCamera && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center p-6 backdrop-blur-sm">
          <div className="relative w-full max-w-md aspect-[3/4] bg-black rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white/10">
            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
            <div className="absolute inset-0 border-[40px] border-black/40 pointer-events-none">
              <div className="w-full h-full border border-white/20 rounded-xl"></div>
            </div>
          </div>
          <div className="flex space-x-4 mt-8">
            <button
              type="button"
              onClick={stopCamera}
              className="px-8 py-3 bg-white/10 text-white rounded-2xl font-bold hover:bg-white/20 transition-all"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={capture}
              className="px-8 py-3 bg-[#98D2B9] text-white rounded-2xl font-bold shadow-xl shadow-[#98D2B9]/30 hover:scale-105 active:scale-95 transition-all"
            >
              Take Snapshot
            </button>
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
  const [filter, setFilter] = useState<AgeGroup | 'All'>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const [newStudent, setNewStudent] = useState({
    name: '',
    ageGroup: AgeGroup.INFANT,
    photoUrl: '',
    primaryGuardian: 'mother' as 'father' | 'mother',
    father: { name: '', phone: '', email: '', photoUrl: '' },
    mother: { name: '', phone: '', email: '', photoUrl: '' },
    specialNotes: '',
    birthday: '',
    bloodGroup: 'Unknown',
    address: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudent.photoUrl) {
      alert("Please provide a photo of the student.");
      return;
    }
    const id = `EL-${Math.floor(1000 + Math.random() * 9000)}`;
    const studentToEnroll: Student = {
      ...newStudent,
      id,
      status: AttendanceStatus.OUT,
      logs: [],
      enrollmentDate: new Date().toISOString()
    };
    onAddStudent(studentToEnroll);
    setIsAdding(false);
    setNewStudent({
      name: '',
      ageGroup: AgeGroup.INFANT,
      photoUrl: '',
      primaryGuardian: 'mother',
      father: { name: '', phone: '', email: '', photoUrl: '' },
      mother: { name: '', phone: '', email: '', photoUrl: '' },
      specialNotes: '',
      birthday: '',
      bloodGroup: 'Unknown',
      address: ''
    });
  };

  const filteredStudents = students.filter(s => {
    const matchesFilter = filter === 'All' || s.ageGroup === filter;
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-3xl shadow-sm border border-gray-100">
        <div className="relative flex-1">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          <input 
            type="text" 
            placeholder="Search our students..." 
            className="w-full pl-12 pr-4 py-3 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-[#98D2B9] outline-none transition-all text-black"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-2">
          {(['All', ...Object.values(AgeGroup)] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                filter === f ? 'bg-[#41618B] text-white shadow-md' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
              }`}
            >
              {f}
            </button>
          ))}
          <button 
            onClick={() => setIsAdding(true)}
            className="ml-2 px-6 py-2 bg-[#98D2B9] text-white rounded-xl text-xs font-bold hover:bg-[#83bba3] transition-all shadow-lg shadow-[#98D2B9]/30"
          >
            + Enroll New
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStudents.map(student => (
          <div 
            key={student.id} 
            className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all group border-b-4 border-transparent hover:border-b-[#98D2B9] relative"
          >
            <div className="flex items-start justify-between mb-4">
              <div 
                className="flex items-center space-x-3 cursor-pointer"
                onClick={() => onSelectStudent(student.id)}
              >
                <img src={student.photoUrl || 'https://via.placeholder.com/150'} alt={student.name} className="w-14 h-14 rounded-full border-2 border-[#f1f7f5] shadow-sm object-cover" />
                <div>
                  <h3 className="font-bold text-gray-800 group-hover:text-[#41618B] transition-colors">{student.name}</h3>
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                    student.ageGroup === AgeGroup.INFANT ? 'bg-[#f1f7f5] text-[#67A08B]' : 
                    student.ageGroup === AgeGroup.TODDLER ? 'bg-[#fffbeb] text-[#d97706]' : 'bg-[#eff6ff] text-[#3b82f6]'
                  }`}>
                    {student.ageGroup}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteStudent(student.id);
                  }}
                  className="w-8 h-8 flex items-center justify-center bg-red-50 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-all shadow-sm"
                  title="Remove Student"
                >
                  🗑️
                </button>
                <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  student.status === AttendanceStatus.IN ? 'bg-[#eefcf5] text-[#16a34a]' : 'bg-gray-50 text-gray-400'
                }`}>
                  {student.status}
                </div>
              </div>
            </div>

            <div className="space-y-3 mb-6" onClick={() => onSelectStudent(student.id)}>
              <div className="flex justify-between text-xs">
                <span className="text-gray-400 uppercase font-bold tracking-tighter">Guardian</span>
                <span className="text-gray-700 font-semibold">{student[student.primaryGuardian].name}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-400 uppercase font-bold tracking-tighter">Phone</span>
                <span className="text-gray-700 font-semibold">{student[student.primaryGuardian].phone}</span>
              </div>
            </div>

            <button
              onClick={() => onToggleAttendance(student.id)}
              className={`w-full py-3 rounded-2xl font-bold transition-all ${
                student.status === AttendanceStatus.IN 
                  ? 'bg-gray-50 text-gray-500 hover:bg-red-50 hover:text-red-600' 
                  : 'bg-[#98D2B9] text-white hover:bg-[#83bba3] shadow-lg shadow-[#98D2B9]/20'
              }`}
            >
              {student.status === AttendanceStatus.IN ? 'Sign Out 👋' : 'Sign In ✅'}
            </button>
          </div>
        ))}
      </div>

      {isAdding && (
        <div className="fixed inset-0 bg-[#41618B]/30 backdrop-blur-md z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95">
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Enroll at Élever</h2>
                  <p className="text-sm text-gray-400">Complete all student, medical, and parent records.</p>
                </div>
                <button onClick={() => setIsAdding(false)} className="text-gray-400 hover:text-gray-600 text-2xl">✕</button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-[#67A08B] uppercase tracking-widest border-l-4 border-[#98D2B9] pl-3">1. Student Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Full Name</label>
                        <input 
                          required
                          type="text" 
                          className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-[#98D2B9] text-black"
                          value={newStudent.name}
                          onChange={e => setNewStudent({...newStudent, name: e.target.value})}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Age Group</label>
                        <select 
                          className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-[#41618B] text-black font-semibold"
                          value={newStudent.ageGroup}
                          onChange={e => setNewStudent({...newStudent, ageGroup: e.target.value as AgeGroup})}
                        >
                          {Object.values(AgeGroup).map(age => <option key={age} value={age} className="text-black bg-white hover:bg-blue-600">{age}</option>)}
                        </select>
                      </div>
                    </div>
                    <ImagePicker 
                      label="Student Photo" 
                      value={newStudent.photoUrl} 
                      onChange={(data) => setNewStudent({...newStudent, photoUrl: data})} 
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Birthday</label>
                      <input 
                        required
                        type="date" 
                        className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-[#98D2B9] text-black"
                        value={newStudent.birthday}
                        onChange={e => setNewStudent({...newStudent, birthday: e.target.value})}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Blood Group</label>
                      <select 
                        className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-[#41618B] text-black font-semibold"
                        value={newStudent.bloodGroup}
                        onChange={e => setNewStudent({...newStudent, bloodGroup: e.target.value})}
                      >
                        {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown'].map(bg => (
                          <option key={bg} value={bg} className="text-black bg-white hover:bg-blue-600">{bg}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Home Address</label>
                    <input 
                      required
                      type="text" 
                      className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-[#98D2B9] text-black"
                      placeholder="Street, City, ZIP"
                      value={newStudent.address}
                      onChange={e => setNewStudent({...newStudent, address: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4 p-5 bg-[#fffdf7] rounded-[2rem] border border-[#F4D06F]/30">
                    <h3 className="text-xs font-bold text-[#b48d1c] uppercase tracking-widest border-l-4 border-[#F4D06F] pl-3">2a. Father's Details</h3>
                    <div className="space-y-3">
                      <input placeholder="Name" className="w-full px-4 py-2 bg-white rounded-xl text-sm border border-gray-100 text-black" value={newStudent.father.name} onChange={e => setNewStudent({...newStudent, father: {...newStudent.father, name: e.target.value}})} />
                      <input placeholder="Phone" className="w-full px-4 py-2 bg-white rounded-xl text-sm border border-gray-100 text-black" value={newStudent.father.phone} onChange={e => setNewStudent({...newStudent, father: {...newStudent.father, phone: e.target.value}})} />
                      <input placeholder="Email" className="w-full px-4 py-2 bg-white rounded-xl text-sm border border-gray-100 text-black" value={newStudent.father.email} onChange={e => setNewStudent({...newStudent, father: {...newStudent.father, email: e.target.value}})} />
                      <ImagePicker label="Father Photo" value={newStudent.father.photoUrl} onChange={(data) => setNewStudent({...newStudent, father: {...newStudent.father, photoUrl: data}})} />
                    </div>
                  </div>

                  <div className="space-y-4 p-5 bg-[#f0f4f9] rounded-[2rem] border border-[#41618B]/10">
                    <h3 className="text-xs font-bold text-[#41618B] uppercase tracking-widest border-l-4 border-[#41618B] pl-3">2b. Mother's Details</h3>
                    <div className="space-y-3">
                      <input placeholder="Name" className="w-full px-4 py-2 bg-white rounded-xl text-sm border border-gray-100 text-black" value={newStudent.mother.name} onChange={e => setNewStudent({...newStudent, mother: {...newStudent.mother, name: e.target.value}})} />
                      <input placeholder="Phone" className="w-full px-4 py-2 bg-white rounded-xl text-sm border border-gray-100 text-black" value={newStudent.mother.phone} onChange={e => setNewStudent({...newStudent, mother: {...newStudent.mother, phone: e.target.value}})} />
                      <input placeholder="Email" className="w-full px-4 py-2 bg-white rounded-xl text-sm border border-gray-100 text-black" value={newStudent.mother.email} onChange={e => setNewStudent({...newStudent, mother: {...newStudent.mother, email: e.target.value}})} />
                      <ImagePicker label="Mother Photo" value={newStudent.mother.photoUrl} onChange={(data) => setNewStudent({...newStudent, mother: {...newStudent.mother, photoUrl: data}})} />
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-gray-50 rounded-3xl space-y-4">
                   <div className="flex items-center justify-between">
                     <label className="text-sm font-bold text-gray-700">Who is the Primary Guardian?</label>
                     <div className="flex bg-white rounded-xl p-1 shadow-sm">
                       <button 
                        type="button"
                        onClick={() => setNewStudent({...newStudent, primaryGuardian: 'father'})}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${newStudent.primaryGuardian === 'father' ? 'bg-[#41618B] text-white' : 'text-gray-400'}`}
                       >
                         Father
                       </button>
                       <button 
                        type="button"
                        onClick={() => setNewStudent({...newStudent, primaryGuardian: 'mother'})}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${newStudent.primaryGuardian === 'mother' ? 'bg-[#41618B] text-white' : 'text-gray-400'}`}
                       >
                         Mother
                       </button>
                     </div>
                   </div>
                   <textarea 
                    placeholder="Medical notes, allergies, or special instructions..."
                    className="w-full p-4 bg-white rounded-2xl outline-none focus:ring-2 focus:ring-[#98D2B9] text-sm h-24 text-black"
                    value={newStudent.specialNotes}
                    onChange={e => setNewStudent({...newStudent, specialNotes: e.target.value})}
                   />
                </div>

                <div className="flex gap-4">
                  <button 
                    type="button"
                    onClick={() => setIsAdding(false)} 
                    className="flex-1 py-4 bg-gray-100 rounded-2xl font-bold text-gray-500 hover:bg-gray-200 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-[2] py-4 bg-[#41618B] text-white rounded-2xl font-bold shadow-xl shadow-[#41618B]/20 hover:bg-[#344e70] transition-all"
                  >
                    Enroll Student
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceList;
