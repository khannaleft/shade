
import React from 'react';
import type { Patient } from '../types';
import { UserGroupIcon, ChevronRightIcon, UserPlusIcon } from './IconComponents';

interface PatientListProps {
  patients: Patient[];
  selectedPatientId: string | null;
  onSelectPatient: (id: string) => void;
  onAddPatientClick: () => void;
}

const PatientList: React.FC<PatientListProps> = ({ patients, selectedPatientId, onSelectPatient, onAddPatientClick }) => {
  return (
    <aside className="w-full md:w-80 lg:w-96 bg-white border-r border-gray-200 flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center">
            <UserGroupIcon className="h-6 w-6 text-gray-500" />
            <h2 className="ml-3 text-lg font-semibold text-gray-800">Patients</h2>
        </div>
        <button 
            onClick={onAddPatientClick}
            className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-teal-600 hover:bg-teal-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-teal-500"
            aria-label="Add new patient"
        >
            <UserPlusIcon className="h-6 w-6" />
        </button>
      </div>
      <div className="flex-grow overflow-y-auto">
        <nav className="p-2 space-y-1">
          {patients.map((patient) => (
            <button
              key={patient.id}
              onClick={() => onSelectPatient(patient.id)}
              className={`w-full text-left flex items-center justify-between p-3 rounded-md transition-colors duration-150 ${
                selectedPatientId === patient.id
                  ? 'bg-teal-50 text-teal-700 font-semibold'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <div>
                <p className="text-sm">{patient.name}</p>
                <p className={`text-xs ${ selectedPatientId === patient.id ? 'text-teal-600' : 'text-gray-500'}`}>{patient.email}</p>
              </div>
              {selectedPatientId === patient.id && <ChevronRightIcon className="h-5 w-5 text-teal-600" />}
            </button>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default PatientList;
