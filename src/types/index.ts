export interface Medicine {
  name: string;
  dosage: string;
  duration: string;
  category: MedicineCategory;
}

export type MedicineCategory =
  | "Antibiotic"
  | "Vitamin"
  | "Calcium"
  | "Gastric"
  | "Painkiller"
  | "Cardiac"
  | "Other";

export interface TestResult {
  testName: string;
  value: string;
  unit?: string;
  normalRange?: string;
}

export interface MedicalRecord {
  recordId: string;
  patientId: string;
  date: string;
  doctorName: string;
  patientCase: string;
  symptoms: string[];
  respiratoryRate: string;
  bloodPressure: string;
  medicines: Medicine[];
  testResults: TestResult[];
  rawText?: string;
  createdAt: string;
}

export interface Patient {
  patientId: string;
  name: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  bloodGroup: string;
  phone: string;
  email: string;
  status: "Active" | "Suspended";
  registeredAt: string;
  records: MedicalRecord[];
}

export interface Doctor {
  doctorId: string;
  name: string;
  specialty: string;
  licenseNumber: string;
  phone: string;
  email: string;
  status: "Active" | "Suspended";
  registeredAt: string;
}

export interface AuditLog {
  logId: string;
  timestamp: string;
  action: string;
  patientId?: string;
  doctorId?: string;
  details: string;
}

export interface SystemStats {
  totalPatients: number;
  totalDoctors: number;
  totalDocumentsParsed: number;
  totalRecords: number;
}

export interface AIExtractionResult {
  doctorName: string;
  date: string;
  patientCase: string;
  symptoms: string[];
  respiratoryRate: string;
  bloodPressure: string;
  medicines: Medicine[];
  testResults: TestResult[];
}