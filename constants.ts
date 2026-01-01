import { Student, AgeGroup, AttendanceStatus, Employee, EmployeeRole } from './types';

// Official Élever Logo (Optimized Data URI)
// This is a representative high-quality SVG of the Élever Logo (Sprout + Book + Text)
export const APP_LOGO = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'%3E%3Cdefs%3E%3ClinearGradient id='leafGrad' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%2398D2B9;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%2367A08B;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Cpath d='M200,220 c-20,0-80-5-100-20 c0,0,0,15,0,20 c20,15,80,20,100,20 s80-5,100-20 c0-5,0-20,0-20 c-20,15-80,20-100,20z' fill='%23F4D06F' opacity='0.8'/%3E%3Cpath d='M200,210 c-20,0-80-5-100-20 c0,0,0,15,0,20 c20,15,80,20,100,20 s80-5,100-20 c0-5,0-20,0-20 c-20,15-80,20-100,20z' fill='%2398D2B9' opacity='0.5'/%3E%3Cpath d='M200,100 v110' stroke='%2367A08B' stroke-width='6' stroke-linecap='round'/%3E%3Cpath d='M200,140 c-10-10-30-20-50-10 c-20,10-15,40,0,50 c15,10,40,0,50-10' fill='url(%23leafGrad)'/%3E%3Cpath d='M200,120 c10-10,30-20,60-10 c30,10,25,50,0,65 c-25,15-50,0-60-15' fill='url(%23leafGrad)'/%3E%3Ctext x='200' y='320' font-family='Quicksand, sans-serif' font-size='60' font-weight='bold' fill='%2341618B' text-anchor='middle'%3EÉlever%3C/text%3E%3Ctext x='200' y='355' font-family='Quicksand, sans-serif' font-size='16' font-weight='bold' fill='%239CA3AF' text-anchor='middle' letter-spacing='2'%3EDAY CARE %26 PRESCHOOL%3C/text%3E%3C/svg%3E";

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 'EL-1001',
    name: 'Aria Thompson',
    ageGroup: AgeGroup.INFANT,
    photoUrl: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=150&h=150&fit=crop',
    primaryGuardian: 'mother',
    father: { name: 'David Thompson', phone: '555-0101', email: 'david.t@email.com', photoUrl: '' },
    mother: { name: 'Sarah Thompson', phone: '555-0102', email: 'sarah.t@email.com', photoUrl: '' },
    status: AttendanceStatus.OUT,
    logs: [],
    enrollmentDate: '2023-09-01',
    birthday: '2023-02-15',
    bloodGroup: 'O+',
    address: '123 Maple Ave, Springfield',
    specialNotes: 'Allergic to strawberries.'
  },
  {
    id: 'EL-1002',
    name: 'Leo Garcia',
    ageGroup: AgeGroup.TODDLER,
    photoUrl: 'https://images.unsplash.com/photo-1510333319768-7c40c11c509d?w=150&h=150&fit=crop',
    primaryGuardian: 'father',
    father: { name: 'Marcus Garcia', phone: '555-0201', email: 'marcus.g@email.com', photoUrl: '' },
    mother: { name: 'Elena Garcia', phone: '555-0202', email: 'elena.g@email.com', photoUrl: '' },
    status: AttendanceStatus.OUT,
    logs: [],
    enrollmentDate: '2023-10-15',
    birthday: '2022-05-10',
    bloodGroup: 'A+',
    address: '456 Oak Lane, Springfield',
    specialNotes: 'Loves building blocks.'
  }
];

export const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: 'STAFF-01',
    name: 'Ms. Rachel Green',
    role: EmployeeRole.TEACHER,
    photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
    phone: '555-9001',
    email: 'rachel.g@elever.com',
    status: AttendanceStatus.OUT,
    logs: [],
    joinDate: '2022-01-10',
    birthday: '1990-05-05',
    bloodGroup: 'B+',
    address: '789 Pine St, Springfield',
    qualification: 'M.Ed in Early Childhood'
  }
];
