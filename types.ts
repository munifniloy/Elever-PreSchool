
export enum AgeGroup {
  INFANT = 'Infant',
  TODDLER = 'Toddler',
  PRESCHOOLER = 'Preschooler'
}

export enum EmployeeRole {
  TEACHER = 'Teacher',
  STAFF = 'Staff',
  ADMIN = 'Admin'
}

export enum AttendanceStatus {
  IN = 'In',
  OUT = 'Out'
}

export interface AttendanceLog {
  id: string;
  type: AttendanceStatus;
  timestamp: string;
}

export interface ParentDetails {
  name: string;
  phone: string;
  email: string;
  photoUrl: string;
}

export interface Student {
  id: string;
  name: string;
  ageGroup: AgeGroup;
  photoUrl: string;
  father: ParentDetails;
  mother: ParentDetails;
  primaryGuardian: 'father' | 'mother';
  status: AttendanceStatus;
  logs: AttendanceLog[];
  specialNotes?: string;
  enrollmentDate: string;
  // New Fields
  birthday: string;
  bloodGroup: string;
  address: string;
}

export interface Employee {
  id: string;
  name: string;
  role: EmployeeRole;
  photoUrl: string;
  phone: string;
  email: string;
  status: AttendanceStatus;
  logs: AttendanceLog[];
  joinDate: string;
  // New Fields
  birthday: string;
  bloodGroup: string;
  address: string;
  qualification: string;
}

export interface DailySummary {
  studentId: string;
  date: string;
  aiGeneratedNote: string;
}
