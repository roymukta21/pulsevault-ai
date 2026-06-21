import {
  Patient,
  Doctor,
  MedicalRecord,
  AuditLog,
  SystemStats,
} from "../types";
import { v4 as uuidv4 } from "uuid";

const KEYS = {
  PATIENTS: "pulsevault_patients",
  DOCTORS: "pulsevault_doctors",
  AUDIT_LOGS: "pulsevault_audit_logs",
  STATS: "pulsevault_stats",
};

//  Patients 

export function getAllPatients(): Patient[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEYS.PATIENTS);
    return raw ? (JSON.parse(raw) as Patient[]) : [];
  } catch {
    return [];
  }
}

export function getPatientById(patientId: string): Patient | null {
  return getAllPatients().find((p) => p.patientId === patientId) ?? null;
}

export function savePatient(patient: Patient): void {
  const patients = getAllPatients();
  const idx = patients.findIndex((p) => p.patientId === patient.patientId);
  if (idx >= 0) {
    patients[idx] = patient;
  } else {
    patients.push(patient);
  }
  localStorage.setItem(KEYS.PATIENTS, JSON.stringify(patients));
  updateStats();
}

export function deletePatient(patientId: string): void {
  const patients = getAllPatients().filter((p) => p.patientId !== patientId);
  localStorage.setItem(KEYS.PATIENTS, JSON.stringify(patients));
  updateStats();
}

export function appendMedicalRecord(
  patientId: string,
  record: MedicalRecord
): boolean {
  const patient = getPatientById(patientId);
  if (!patient) return false;
  patient.records = [record, ...patient.records];
  savePatient(patient);
  incrementDocsParsed();
  addAuditLog({
    action: "DOCUMENT_PARSED",
    patientId,
    details: `AI extracted record for ${record.date} — Dr. ${record.doctorName}`,
  });
  return true;
}

//  Doctors 

export function getAllDoctors(): Doctor[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEYS.DOCTORS);
    return raw ? (JSON.parse(raw) as Doctor[]) : [];
  } catch {
    return [];
  }
}

export function saveDoctor(doctor: Doctor): void {
  const doctors = getAllDoctors();
  const idx = doctors.findIndex((d) => d.doctorId === doctor.doctorId);
  if (idx >= 0) {
    doctors[idx] = doctor;
  } else {
    doctors.push(doctor);
  }
  localStorage.setItem(KEYS.DOCTORS, JSON.stringify(doctors));
  updateStats();
}

export function deleteDoctor(doctorId: string): void {
  const doctors = getAllDoctors().filter((d) => d.doctorId !== doctorId);
  localStorage.setItem(KEYS.DOCTORS, JSON.stringify(doctors));
  updateStats();
}

//  Audit Logs 
export function getAuditLogs(): AuditLog[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEYS.AUDIT_LOGS);
    return raw ? (JSON.parse(raw) as AuditLog[]) : [];
  } catch {
    return [];
  }
}

export function addAuditLog(
  entry: Omit<AuditLog, "logId" | "timestamp">
): void {
  const logs = getAuditLogs();
  const newLog: AuditLog = {
    logId: uuidv4(),
    timestamp: new Date().toISOString(),
    ...entry,
  };
  logs.unshift(newLog);
  // Keep last 200 logs
  localStorage.setItem(KEYS.AUDIT_LOGS, JSON.stringify(logs.slice(0, 200)));
}

//  Stats 

export function getStats(): SystemStats {
  if (typeof window === "undefined")
    return {
      totalPatients: 0,
      totalDoctors: 0,
      totalDocumentsParsed: 0,
      totalRecords: 0,
    };
  try {
    const raw = localStorage.getItem(KEYS.STATS);
    return raw
      ? (JSON.parse(raw) as SystemStats)
      : {
          totalPatients: 0,
          totalDoctors: 0,
          totalDocumentsParsed: 0,
          totalRecords: 0,
        };
  } catch {
    return {
      totalPatients: 0,
      totalDoctors: 0,
      totalDocumentsParsed: 0,
      totalRecords: 0,
    };
  }
}

function updateStats(): void {
  const patients = getAllPatients();
  const doctors = getAllDoctors();
  const current = getStats();
  const stats: SystemStats = {
    totalPatients: patients.filter((p) => p.status === "Active").length,
    totalDoctors: doctors.filter((d) => d.status === "Active").length,
    totalDocumentsParsed: current.totalDocumentsParsed,
    totalRecords: patients.reduce((acc, p) => acc + p.records.length, 0),
  };
  localStorage.setItem(KEYS.STATS, JSON.stringify(stats));
}

function incrementDocsParsed(): void {
  const stats = getStats();
  stats.totalDocumentsParsed += 1;
  localStorage.setItem(KEYS.STATS, JSON.stringify(stats));
}

//  Seed / Reset 

export function clearAllData(): void {
  Object.values(KEYS).forEach((k) => localStorage.removeItem(k));
}

export function seedMockData(): void {
  clearAllData();

  const mockPatients: Patient[] = [
    {
      patientId: "PV-1001",
      name: "Rahim Uddin",
      age: 45,
      gender: "Male",
      bloodGroup: "B+",
      phone: "017XXXXXXXX",
      email: "rahim@example.com",
      status: "Active",
      registeredAt: "2024-01-10T09:00:00Z",
      records: [
        {
          recordId: uuidv4(),
          patientId: "PV-1001",
          date: "2024-03-15",
          doctorName: "Dr. Fahmida Islam",
          patientCase:
            "Patient presented with persistent cough, mild fever, and sore throat for 5 days.",
          symptoms: ["Cough", "Fever", "Sore Throat"],
          respiratoryRate: "18 breaths/min",
          bloodPressure: "120/80 mmHg",
          medicines: [
            {
              name: "Azithromycin",
              dosage: "500mg",
              duration: "5 days",
              category: "Antibiotic",
            },
            {
              name: "Paracetamol",
              dosage: "500mg",
              duration: "3 days",
              category: "Painkiller",
            },
            {
              name: "Omeprazole",
              dosage: "20mg",
              duration: "7 days",
              category: "Gastric",
            },
          ],
          testResults: [
            { testName: "CBC - WBC", value: "11.2", unit: "×10³/μL", normalRange: "4.5–11.0" },
            { testName: "CRP", value: "24", unit: "mg/L", normalRange: "<5" },
          ],
          createdAt: new Date().toISOString(),
        },
        {
          recordId: uuidv4(),
          patientId: "PV-1001",
          date: "2024-06-20",
          doctorName: "Dr. Tariq Hassan",
          patientCase: "Routine checkup. Complained of mild joint pain.",
          symptoms: ["Joint Pain", "Fatigue"],
          respiratoryRate: "16 breaths/min",
          bloodPressure: "118/76 mmHg",
          medicines: [
            {
              name: "Calcium Carbonate",
              dosage: "500mg",
              duration: "30 days",
              category: "Calcium",
            },
            {
              name: "Vitamin D3",
              dosage: "1000 IU",
              duration: "30 days",
              category: "Vitamin",
            },
          ],
          testResults: [
            { testName: "Vitamin D", value: "18", unit: "ng/mL", normalRange: "30–100" },
            { testName: "Calcium", value: "8.6", unit: "mg/dL", normalRange: "8.5–10.5" },
          ],
          createdAt: new Date().toISOString(),
        },
      ],
    },
    {
      patientId: "PV-1002",
      name: "Sadia Khanam",
      age: 32,
      gender: "Female",
      bloodGroup: "O+",
      phone: "018XXXXXXXX",
      email: "sadia@example.com",
      status: "Active",
      registeredAt: "2024-02-14T11:00:00Z",
      records: [
        {
          recordId: uuidv4(),
          patientId: "PV-1002",
          date: "2024-05-10",
          doctorName: "Dr. Nusrat Jahan",
          patientCase: "Follow-up for hypertension management.",
          symptoms: ["Headache", "Dizziness"],
          respiratoryRate: "17 breaths/min",
          bloodPressure: "145/92 mmHg",
          medicines: [
            {
              name: "Amlodipine",
              dosage: "5mg",
              duration: "30 days",
              category: "Cardiac",
            },
            {
              name: "Pantoprazole",
              dosage: "40mg",
              duration: "14 days",
              category: "Gastric",
            },
          ],
          testResults: [
            { testName: "Creatinine", value: "0.9", unit: "mg/dL", normalRange: "0.6–1.1" },
            { testName: "Blood Sugar (Fasting)", value: "98", unit: "mg/dL", normalRange: "70–100" },
          ],
          createdAt: new Date().toISOString(),
        },
      ],
    },
  ];

  const mockDoctors: Doctor[] = [
    {
      doctorId: "DR-001",
      name: "Dr. Fahmida Islam",
      specialty: "General Physician",
      licenseNumber: "BMDC-12345",
      phone: "019XXXXXXXX",
      email: "fahmida@hospital.com",
      status: "Active",
      registeredAt: "2023-06-01T08:00:00Z",
    },
    {
      doctorId: "DR-002",
      name: "Dr. Tariq Hassan",
      specialty: "Orthopedics",
      licenseNumber: "BMDC-67890",
      phone: "016XXXXXXXX",
      email: "tariq@hospital.com",
      status: "Active",
      registeredAt: "2023-08-15T08:00:00Z",
    },
  ];

  mockPatients.forEach(savePatient);
  mockDoctors.forEach(saveDoctor);
  addAuditLog({ action: "MOCK_DATA_SEEDED", details: "Admin seeded mock patient & doctor data." });
}