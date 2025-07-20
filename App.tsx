import React, { useState, useCallback } from 'react';
import type { Patient, Procedure, ClinicInfo, AppData } from './types';
import { INITIAL_PATIENTS } from './constants';
import Header from './components/Header';
import PatientList from './components/PatientList';
import PatientDetail from './components/PatientDetail';
import { WalletIcon } from './components/IconComponents';
import AddPatientModal from './components/AddPatientModal';
import ClinicInfoModal from './components/ClinicInfoModal';

const App: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>(INITIAL_PATIENTS);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(INITIAL_PATIENTS[0]?.id || null);
  const [isAddPatientModalOpen, setAddPatientModalOpen] = useState(false);
  const [isClinicModalOpen, setClinicModalOpen] = useState(false);
  const [clinicInfo, setClinicInfo] = useState<ClinicInfo>({
      name: "Dental Billing Hub",
      address: "123 Smile Street\nSuite 100\nToothville, MD 20852",
      logo: null
  });

  const handleSelectPatient = useCallback((id: string) => {
    setSelectedPatientId(id);
  }, []);

  const handleAddProcedure = useCallback((patientId: string, newProcedureData: Omit<Procedure, 'id' | 'date'>) => {
    setPatients(prevPatients => {
      return prevPatients.map(patient => {
        if (patient.id === patientId) {
          const newProcedure: Procedure = {
            ...newProcedureData,
            id: `proc_${Date.now()}`,
            date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
          };
          return {
            ...patient,
            procedures: [...patient.procedures, newProcedure],
          };
        }
        return patient;
      });
    });
  }, []);
  
  const handleUpdateProcedure = useCallback((patientId: string, procedureId: string, updatedData: Partial<Omit<Procedure, 'id'>>) => {
      setPatients(prevPatients => prevPatients.map(patient => {
          if (patient.id === patientId) {
              return {
                  ...patient,
                  procedures: patient.procedures.map(proc => 
                      proc.id === procedureId ? { ...proc, ...updatedData } : proc
                  ),
              };
          }
          return patient;
      }));
  }, []);

  const handleAddNewPatient = useCallback((newPatientData: Omit<Patient, 'id' | 'procedures'>) => {
    const newPatient: Patient = {
      ...newPatientData,
      id: `p_${Date.now()}`,
      procedures: [],
    };
    setPatients(prev => [...prev, newPatient]);
    setSelectedPatientId(newPatient.id);
    setAddPatientModalOpen(false);
  }, []);

  const handleUpdateClinicInfo = useCallback((newInfo: ClinicInfo) => {
    setClinicInfo(newInfo);
    setClinicModalOpen(false);
  }, []);

  const handleExportData = useCallback(() => {
    try {
        const appData: AppData = {
            patients,
            clinicInfo,
        };
        const jsonString = JSON.stringify(appData, null, 2);
        const blob = new Blob([jsonString], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'dental-hub-data.json';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    } catch (error) {
        console.error("Failed to export data:", error);
        alert("An error occurred while exporting data.");
    }
  }, [patients, clinicInfo]);

  const handleImportData = useCallback((fileContent: string) => {
    try {
        const importedData: AppData = JSON.parse(fileContent);

        if (importedData && Array.isArray(importedData.patients) && importedData.clinicInfo) {
            setPatients(importedData.patients);
            setClinicInfo(importedData.clinicInfo);
            setSelectedPatientId(importedData.patients[0]?.id || null);
            setClinicModalOpen(false);
            alert('Data imported successfully!');
        } else {
            throw new Error("Invalid data structure in file.");
        }
    } catch (error) {
        console.error("Failed to import data:", error);
        alert("Failed to import data. The file may be corrupt or in the wrong format.");
    }
  }, []);

  const selectedPatient = patients.find(p => p.id === selectedPatientId);

  return (
    <div className="h-screen flex flex-col font-sans">
      <Header 
        clinicInfo={clinicInfo}
        onClinicSettingsClick={() => setClinicModalOpen(true)}
      />
      <div className="flex-grow flex flex-row min-h-0">
        <PatientList
          patients={patients}
          selectedPatientId={selectedPatientId}
          onSelectPatient={handleSelectPatient}
          onAddPatientClick={() => setAddPatientModalOpen(true)}
        />
        <main className="flex-grow bg-slate-100 overflow-y-auto">
          {selectedPatient ? (
            <PatientDetail 
              patient={selectedPatient}
              clinicInfo={clinicInfo}
              onAddProcedure={handleAddProcedure}
              onUpdateProcedure={handleUpdateProcedure}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                <WalletIcon className="w-16 h-16 text-gray-400 mb-4" />
                <h2 className="text-2xl font-semibold">Welcome to the {clinicInfo.name}</h2>
                <p className="mt-2 max-w-md">Please select a patient from the list on the left to view their details and manage their billing, or add a new patient to get started.</p>
            </div>
          )}
        </main>
      </div>
      {isAddPatientModalOpen && (
        <AddPatientModal
          onClose={() => setAddPatientModalOpen(false)}
          onAddPatient={handleAddNewPatient}
        />
      )}
      {isClinicModalOpen && (
        <ClinicInfoModal
            currentInfo={clinicInfo}
            onClose={() => setClinicModalOpen(false)}
            onSave={handleUpdateClinicInfo}
            onImport={handleImportData}
            onExport={handleExportData}
        />
      )}
    </div>
  );
};

export default App;
