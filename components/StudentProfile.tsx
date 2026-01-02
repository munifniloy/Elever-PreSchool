import React, { useState } from 'react';
import { Student } from '../types.ts';
import { generateDailySummary } from '../services/geminiService.ts';

interface StudentProfileProps {
  student: Student;
  onClose: () => void;
  onSave: (student: Student) => void;
  onDelete: (id: string) => void;
}

const StudentProfile: React.FC<StudentProfileProps> = ({ student, onClose, onSave, onDelete }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [notes, setNotes] = useState(student.specialNotes || '');

  const handleGenerateSummary = async () => {
    setIsGenerating(true);
    const summary = await generateDailySummary(student);
    setAiSummary(summary);
    setIsGenerating(false);
  };

  const handleSave = () => {
    onSave({ ...student, specialNotes: notes });
  };

  return (
    <div className="fixed inset-0 bg-[#41618B]/20 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-3xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 fade-in duration-300 max-h-[90vh] overflow-y-auto custom-scrollbar">
        <div className="relative h-48 bg-gradient-to-r from-[#41618B] via-[#41618B] to-[#98D2B9] flex items-end justify-center">
          <div className="absolute top-6 left-6 bg-white/20 px-3 py-1 rounded-full text-white text-[10px] font-bold uppercase tracking-widest backdrop-blur-sm">
            ID: {student.id}
          </div>
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 w-10 h-10 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center text-white text-2xl transition-all"
          >
            ✕
          </button>
          <div className="mb-[-3.5rem] z-10">
            <img src={student.photoUrl} alt={student.name} className="w-36 h-36 rounded-full border-[6px] border-white shadow-xl object-cover" />
          </div>
        </div>
        
        <div className="pt-20 p-8 space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-800">{student.name}</h2>
            <div className="flex flex-wrap items-center justify-center gap-3 mt-3">
              <span className="flex items-center gap-1 bg-[#f1f7f5] text-[#67A08B] px-3 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider shadow-sm">
                🎂 {student.birthday ? new Date(student.birthday).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'Date not set'}
              </span>
              <span className="flex items-center gap-1 bg-red-50 text-red-600 px-3 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider shadow-sm">
                🩸 {student.bloodGroup}
              </span>
              <span className="bg-[#41618B] text-white px-3 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider shadow-sm">{student.ageGroup}</span>
            </div>
            <p className="mt-4 text-gray-500 text-sm font-medium max-w-md mx-auto">📍 {student.address || 'Address not registered'}</p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-bold text-[#67A08B] uppercase tracking-widest border-l-4 border-[#98D2B9] pl-3">Family Contacts</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Mother Info */}
              <div className="bg-pink-50/50 p-5 rounded-3xl border border-pink-100">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-16 h-16 rounded-full bg-pink-100 overflow-hidden border-2 border-white shadow-sm flex-shrink-0">
                    {student.mother.photoUrl ? (
                      <img src={student.mother.photoUrl} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl">👩</div>
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-pink-700">{student.mother.name || 'Mother Name Not Set'}</h4>
                    <p className="text-[10px] text-pink-400 font-bold uppercase">Mother</p>
                  </div>
                </div>
                <div className="space-y-1.5 bg-white/60 p-3 rounded-2xl">
                  <p className="text-xs text-gray-700 font-bold">📞 {student.mother.phone}</p>
                  <p className="text-[10px] text-gray-500 font-medium truncate">📧 {student.mother.email}</p>
                </div>
              </div>

              {/* Father Info */}
              <div className="bg-blue-50/50 p-5 rounded-3xl border border-blue-100">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-16 h-16 rounded-full bg-blue-100 overflow-hidden border-2 border-white shadow-sm flex-shrink-0">
                    {student.father.photoUrl ? (
                      <img src={student.father.photoUrl} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl">👨</div>
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-[#41618B]">{student.father.name || 'Father Name Not Set'}</h4>
                    <p className="text-[10px] text-blue-400 font-bold uppercase">Father</p>
                  </div>
                </div>
                <div className="space-y-1.5 bg-white/60 p-3 rounded-2xl">
                  <p className="text-xs text-gray-700 font-bold">📞 {student.father.phone}</p>
                  <p className="text-[10px] text-gray-500 font-medium truncate">📧 {student.father.email}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-bold text-[#67A08B] uppercase tracking-widest border-l-4 border-[#F4D06F] pl-3">Staff Notes & Care Logs</h3>
            <textarea
              className="w-full h-24 p-4 bg-gray-50 border border-gray-100 rounded-3xl focus:ring-2 focus:ring-[#98D2B9] outline-none transition-all resize-none text-gray-700"
              placeholder="Record any special observations or instructions here..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div className="bg-[#eef2f7] p-6 rounded-[2rem] border border-[#dbe6f0]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-[#41618B] flex items-center gap-2">
                <span className="text-[#41618B]">✨</span> Élever AI Briefing
              </h3>
              <button
                onClick={handleGenerateSummary}
                disabled={isGenerating}
                className="px-4 py-2 bg-[#41618B] text-white rounded-xl text-xs font-bold shadow-lg shadow-[#41618B]/20 hover:bg-[#344e70] disabled:opacity-50 transition-all"
              >
                {isGenerating ? 'Generating...' : 'Create Daily Brief'}
              </button>
            </div>
            {aiSummary ? (
              <p className="text-[#41618B] leading-relaxed italic font-medium">"{aiSummary}"</p>
            ) : (
              <p className="text-gray-400 text-sm italic">Use our AI assistant to draft a personalized daily summary for the parents.</p>
            )}
          </div>

          <div className="flex flex-col md:flex-row gap-4 pt-4">
            <button
              onClick={() => {
                if(confirm("Permanently delete this student and all their records?")) {
                  onDelete(student.id);
                  onClose();
                }
              }}
              className="px-6 py-4 bg-red-50 text-red-600 font-bold rounded-2xl hover:bg-red-500 hover:text-white transition-all text-sm flex items-center justify-center gap-2"
            >
              <span>🗑️</span> Remove Profile
            </button>
            <div className="flex flex-1 gap-4">
              <button
                onClick={onClose}
                className="flex-1 py-4 bg-gray-50 text-gray-400 font-bold rounded-2xl hover:bg-gray-100 transition-all"
              >
                Close
              </button>
              <button
                onClick={handleSave}
                className="flex-[2] py-4 bg-[#41618B] text-white font-bold rounded-2xl shadow-xl shadow-[#41618B]/20 transition-all hover:bg-[#344e70]"
              >
                Update Records
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;