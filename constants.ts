import { Student, AgeGroup, AttendanceStatus, Employee, EmployeeRole } from './types.ts';

export const APP_LOGO = "https://scontent.fdac207-1.fna.fbcdn.net/v/t39.30808-6/580953026_122104121385091354_2616901556806922445_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeFUzSlWVy87Bd7pqYwKyXKhSbP3K6lSpFZJs_crqVKkVr48ihKdsIv1wMqz_tW4dhG4v8BOpFQuItFEynM-eqDZ&_nc_ohc=1Q2M5F-gBxsQ7kNvwFgQCxn&_nc_oc=Adl3GP80x485XvFbzMdTLIWzjhbFv8kiPS_UKE_ivs4bmWGkQrYOhoyDHOm3VSlEdQc&_nc_zt=23&_nc_ht=scontent.fdac207-1.fna&_nc_gid=vzRLTGejsiIwmPsfSdACMw&oh=00_AforXIYOFRE142E0fQCjBaT5voNGR2_mtSb3-vwu3V7iAA&oe=695D4AA6";

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