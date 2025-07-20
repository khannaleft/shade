export interface Procedure {
  id: string;
  name: string;
  description: string;
  code: string;
  cost: number;
  date: string;
  imageBase64?: string;
}

export interface Patient {
  id: string;
  name: string;
  email: string;
  dob: string;
  procedures: Procedure[];
}

export interface ProcedureSuggestion {
    procedureName: string;
    description: string;
    suggestedCode: string;
    estimatedCost: number;
}

export interface ClinicInfo {
  name: string;
  address: string;
  logo: string | null;
}

export interface AppData {
    patients: Patient[];
    clinicInfo: ClinicInfo;
}
