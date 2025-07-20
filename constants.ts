
import type { Patient } from './types';

export const INITIAL_PATIENTS: Patient[] = [
  {
    id: 'p1',
    name: 'Eleanor Vance',
    email: 'eleanor.v@example.com',
    dob: '1985-05-22',
    procedures: [
      { id: 'proc1', name: 'Annual Check-up & Cleaning', description: 'Routine examination, scaling, and polishing.', code: 'D0120', cost: 12000, date: '2024-07-10' },
      { id: 'proc2', name: 'Bitewing X-rays', description: 'Four bitewing radiographic images.', code: 'D0274', cost: 6000, date: '2024-07-10' },
    ],
  },
  {
    id: 'p2',
    name: 'Marcus Holloway',
    email: 'm.holloway@example.com',
    dob: '1992-11-09',
    procedures: [
        { id: 'proc3', name: 'Resin-based Composite Filling', description: 'One surface, posterior tooth.', code: 'D2391', cost: 20000, date: '2024-06-15' },
    ],
  },
  {
    id: 'p3',
    name: 'Anya Sharma',
    email: 'anya.s@example.com',
    dob: '1978-02-14',
    procedures: [],
  },
   {
    id: 'p4',
    name: 'Liam Gallagher',
    email: 'liam.g@example.com',
    dob: '2001-09-03',
    procedures: [
       { id: 'proc4', name: 'Wisdom Tooth Extraction', description: 'Surgical removal of impacted third molar.', code: 'D7240', cost: 35000, date: '2023-11-20' },
       { id: 'proc5', name: 'Follow-up Examination', description: 'Post-operative check-up.', code: 'D9999', cost: 0, date: '2023-11-27' },
    ],
  },
];
