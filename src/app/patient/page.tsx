"use client";

import { getAllPatients, savePatient } from "@/src/lib/storage";
import { Patient } from "@/src/types";
import { useState, useEffect } from "react";
import { PatientRecords } from "./PatientRecords";
import { UploadCenter } from "./UploadCenter";

export default function PatientPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<string>("");
  const [showRegister, setShowRegister] = useState(false);
  const [activeTab, setActiveTab] = useState<"upload" | "records">("upload");

  useEffect(() => {
    setPatients(getAllPatients());
  }, []);

  function refresh() {
    const updated = getAllPatients();
    setPatients(updated);
    if (selectedPatientId) {
      const still = updated.find((p) => p.patientId === selectedPatientId);
      if (!still) setSelectedPatientId("");
    }
  }

  const selectedPatient = patients.find((p) => p.patientId === selectedPatientId) ?? null;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="section-label">Patient Portal</p>
          <h1 className="text-2xl font-bold">My Health Records</h1>
        </div>
        <button
          onClick={() => setShowRegister(true)}
          className="pv-btn-primary text-sm"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Register Patient
        </button>
      </div>

      {/* Patient selector */}
      <div className="pv-card p-5 mb-6">
        <label className="section-label block">Select Patient</label>
        {patients.length === 0 ? (
          <p className="text-sm text-pv-muted">
            No patients registered yet.{" "}
            <button
              className="text-pv-blue underline"
              onClick={() => setShowRegister(true)}
            >
              Register one
            </button>{" "}
            or load mock data from Admin Portal.
          </p>
        ) : (
          <div className="flex flex-wrap gap-3">
            {patients.map((p) => (
              <button
                key={p.patientId}
                onClick={() => setSelectedPatientId(p.patientId)}
                className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                  selectedPatientId === p.patientId
                    ? "border-pv-blue bg-blue-500/10 text-pv-blue"
                    : "border-pv text-pv-muted hover:border-pv-blue/50 hover:text-pv-text"
                }`}
              >
                <span className="font-mono text-xs mr-2">{p.patientId}</span>
                {p.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {selectedPatient && (
        <>
          {/* Patient info strip */}
          <div
            className="rounded-xl p-4 mb-6 flex flex-wrap gap-6 items-center"
            style={{ background: "var(--pv-surface)", border: "1px solid var(--pv-border)" }}
          >
            <div>
              <p className="text-xs text-pv-muted mb-0.5">Name</p>
              <p className="font-semibold">{selectedPatient.name}</p>
            </div>
            <div>
              <p className="text-xs text-pv-muted mb-0.5">Patient ID</p>
              <p className="font-mono text-sm text-pv-blue">{selectedPatient.patientId}</p>
            </div>
            <div>
              <p className="text-xs text-pv-muted mb-0.5">Age / Gender</p>
              <p className="text-sm">{selectedPatient.age} yrs · {selectedPatient.gender}</p>
            </div>
            <div>
              <p className="text-xs text-pv-muted mb-0.5">Blood Group</p>
              <p className="text-sm font-semibold text-pv-red">{selectedPatient.bloodGroup}</p>
            </div>
            <div>
              <p className="text-xs text-pv-muted mb-0.5">Records</p>
              <p className="text-sm">{selectedPatient.records.length} consultations</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mb-6 p-1 rounded-xl w-fit" style={{ background: "var(--pv-surface)" }}>
            {(["upload", "records"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
                  activeTab === tab
                    ? "text-pv-text"
                    : "text-pv-muted hover:text-pv-text"
                }`}
                style={
                  activeTab === tab
                    ? { background: "var(--pv-surface-2)", border: "1px solid var(--pv-border)" }
                    : {}
                }
              >
                {tab === "upload" ? "Upload Document" : `Records (${selectedPatient.records.length})`}
              </button>
            ))}
          </div>

          {activeTab === "upload" ? (
            <UploadCenter patient={selectedPatient} onSuccess={refresh} />
          ) : (
            <PatientRecords
             patient={selectedPatient} />
          )}
        </>
      )}

      {/* Register modal */}
      {showRegister && (
        <RegisterModal
          onClose={() => setShowRegister(false)}
          onSave={(p) => {
            savePatient(p);
            refresh();
            setSelectedPatientId(p.patientId);
            setShowRegister(false);
          }}
          existingCount={patients.length}
        />
      )}
    </div>
  );
}

// Register Patient Modal 

interface RegisterModalProps {
  onClose: () => void;
  onSave: (patient: Patient) => void;
  existingCount: number;
}

function RegisterModal({ onClose, onSave, existingCount }: RegisterModalProps) {
  const [form, setForm] = useState({
    name: "",
    age: "",
    gender: "Male" as Patient["gender"],
    bloodGroup: "A+",
    phone: "",
    email: "",
  });

  function handleSubmit() {
    if (!form.name.trim() || !form.age) return;
    const newPatient: Patient = {
      patientId: `PV-${1001 + existingCount}`,
      name: form.name.trim(),
      age: Number(form.age),
      gender: form.gender,
      bloodGroup: form.bloodGroup,
      phone: form.phone,
      email: form.email,
      status: "Active",
      registeredAt: new Date().toISOString(),
      records: [],
    };
    onSave(newPatient);
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Register New Patient</h2>
          <button onClick={onClose} className="text-pv-muted hover:text-pv-text">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="section-label block">Full Name *</label>
              <input
                className="pv-input"
                placeholder="e.g. Rahim Uddin"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div>
              <label className="section-label block">Age *</label>
              <input
                className="pv-input"
                type="number"
                placeholder="e.g. 35"
                value={form.age}
                onChange={(e) => setForm({ ...form, age: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="section-label block">Gender</label>
              <select
                className="pv-input"
                value={form.gender}
                onChange={(e) =>
                  setForm({ ...form, gender: e.target.value as Patient["gender"] })
                }
              >
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="section-label block">Blood Group</label>
              <select
                className="pv-input"
                value={form.bloodGroup}
                onChange={(e) => setForm({ ...form, bloodGroup: e.target.value })}
              >
                {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
                  <option key={bg}>{bg}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="section-label block">Phone</label>
              <input
                className="pv-input"
                placeholder="e.g. 017XXXXXXXX"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>
            <div>
              <label className="section-label block">Email</label>
              <input
                className="pv-input"
                type="email"
                placeholder="e.g. patient@email.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6 justify-end">
          <button onClick={onClose} className="pv-btn-secondary">Cancel</button>
          <button
            onClick={handleSubmit}
            className="pv-btn-primary"
            disabled={!form.name || !form.age}
          >
            Register Patient
          </button>
        </div>
      </div>
    </div>
  );
}