
import React, { useState } from 'react';
import { Student } from '../types';
import { generateDailySummary } from '../services/geminiService';

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

  const primaryParent = student[student.primaryGuardian];
  const secondaryParentKey = student.primaryGuardian === 'father' ? 'mother' : 'father';
  const secondaryParent = student[secondaryParentKey];

  return (
    <div className="fixed inset-0 bg-[#41618B]/20 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-3xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 fade-in duration-300 max-h-[90vh] overflow-y-auto">
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
            <div className="flex items-center justify-center space-x-4 mt-2">
              <span className="flex items-center gap-1 bg-[#f1f7f5] text-[#67A08B] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                🎂 {student.birthday ? new Date(student.birthday).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'No B-Day'}
              </span>
              <span className="flex items-center gap-1 bg-red-50 text-red-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                🩸 {student.bloodGroup}
              </span>
              <span className="text-[#67A08B] font-bold uppercase tracking-widest text-xs">{student.ageGroup}</span>
            </div>
            <p className="mt-3 text-gray-400 text-xs italic">📍 {student.address || 'Address not registered'}</p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-bold text-[#67A08B] uppercase tracking-widest border-l-4 border-[#98D2B9] pl-3">Family Contacts</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Primary Card */}
              <div className="bg-[#f0f9f6] p-5 rounded-3xl border border-[#dbece5] relative overflow-hidden group">
                <div className="absolute top-0 right-0 bg-[#98D2B9] text-white px-3 py-1 text-[10px] font-bold uppercase rounded-bl-xl">
                  Primary
                </div>
                <div className="flex items-center space-x-4">
                  <img src={primaryParent.photoUrl} className="w-16 h-16 rounded-2xl object-cover shadow-sm border-2 border-white" />
                  <div>
                    <h4 className="font-bold text-[#41618B]">{primaryParent.name}</h4>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">{student.primaryGuardian}</p>
                    <div className="mt-1 space-y-0.5">
                      <p className="text-xs text-gray-600">📞 {primaryParent.phone}</p>
                      <p className="text-[10px] text-gray-400 truncate w-32">📧 {primaryParent.email}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Secondary Card */}
              <div className="bg-white p-5 rounded-3xl border border-gray-100 flex items-center space-x-4">
                <img src={secondaryParent.photoUrl} className="w-16 h-16 rounded-2xl object-cover shadow-sm grayscale opacity-70 transition-all" />
                <div>
                  <h4 className="font-bold text-gray-700">{secondaryParent.name}</h4>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">{secondaryParentKey}</p>
                  <div className="mt-1 space-y-0.5">
                    <p className="text-xs text-gray-600">📞 {secondaryParent.phone}</p>
                    <p className="text-[10px] text-gray-400 truncate w-32">📧 {secondaryParent.email}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-bold text-[#67A08B] uppercase tracking-widest border-l-4 border-[#F4D06F] pl-3">Care Instructions</h3>
            <textarea
              className="w-full h-24 p-4 bg-gray-50 border border-gray-100 rounded-3xl focus:ring-2 focus:ring-[#98D2B9] outline-none transition-all resize-none text-gray-700"
              placeholder="Record milestones and moments..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div className="bg-[#eef2f7] p-6 rounded-[2rem] border border-[#dbe6f0]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-[#41618B] flex items-center gap-2">
                <span className="text-[#41618B]">✨</span> Parent Briefing (AI)
              </h3>
              <button
                onClick={handleGenerateSummary}
                disabled={isGenerating}
                className="px-4 py-2 bg-[#41618B] text-white rounded-xl text-xs font-bold shadow-lg shadow-[#41618B]/20 hover:bg-[#344e70] disabled:opacity-50 transition-all"
              >
                {isGenerating ? 'Drafting...' : 'Draft Briefing'}
              </button>
            </div>
            {aiSummary ? (
              <p className="text-[#41618B] leading-relaxed italic font-medium">"{aiSummary}"</p>
            ) : (
              <p className="text-gray-400 text-sm">Use our Élever AI to draft a polished update for the guardian.</p>
            )}
          </div>

          <div className="flex flex-col md:flex-row gap-4 pt-4">
            <button
              onClick={() => onDelete(student.id)}
              className="px-6 py-4 bg-red-50 text-red-600 font-bold rounded-2xl hover:bg-red-500 hover:text-white transition-all text-sm flex items-center justify-center gap-2"
            >
              <span>🗑️</span> Remove Student Profile
            </button>
            <div className="flex flex-1 gap-4">
              <button
                onClick={onClose}
                className="flex-1 py-4 bg-gray-50 text-gray-400 font-bold rounded-2xl hover:bg-gray-100 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex-[2] py-4 bg-gradient-to-r from-[#41618B] to-[#517bb0] text-white font-bold rounded-2xl shadow-xl shadow-[#41618B]/20 hover:shadow-[#41618B]/40 transition-all"
              >
                Update & Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
