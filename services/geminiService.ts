
import { GoogleGenAI, Type } from "@google/genai";
import { Student } from "../types";

export const generateDailySummary = async (student: Student): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const inLog = student.logs.find(l => l.type === 'In');
  const outLog = student.logs.find(l => l.type === 'Out');
  
  const prompt = `
    Create a warm, professional, and encouraging daily summary for a parent of a child at "Élever Day Care & Preschool".
    
    Child Details:
    - Name: ${student.name}
    - Age Group: ${student.ageGroup}
    - Check-in Time: ${inLog ? new Date(inLog.timestamp).toLocaleTimeString() : 'N/A'}
    - Check-out Time: ${outLog ? new Date(outLog.timestamp).toLocaleTimeString() : 'N/A'}
    - Special Notes/Context: ${student.specialNotes || 'No specific notes for today.'}
    
    The tone should reflect the Élever brand: sophisticated, caring, and growth-oriented. 
    Mention that they had a wonderful day of discovery. 
    Keep it around 2-3 sentences.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "No summary available today.";
  } catch (error) {
    console.error("Error generating summary:", error);
    return "We had a wonderful day of growth at Élever! Please speak with your teacher for more details.";
  }
};

export const getAttendanceInsights = async (students: Student[]): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const presentCount = students.filter(s => s.status === 'In').length;
  const totalCount = students.length;

  const prompt = `
    As an educational consultant for "Élever Day Care & Preschool", look at these attendance numbers and provide a quick one-sentence insight for the school director.
    Current Attendance: ${presentCount} out of ${totalCount} students present.
    Focus on maintaining our high standards of care, staffing ratios, or child engagement.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "Focus on individualized care for our growing students.";
  } catch (error) {
    return "Ensure we maintain our premium care ratios.";
  }
};
