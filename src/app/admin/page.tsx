"use client";

import {
  addAuditLog,
  clearAllData,
  deleteDoctor,
  deletePatient,
  getAllDoctors,
  getAllPatients,
  getAuditLogs,
  getStats,
  saveDoctor,
  savePatient,
  seedMockData,
} from "@/src/lib/storage";
import { AuditLog, Doctor, Patient, SystemStats } from "@/src/types";
import { useState, useEffect } from "react";


type AdminTab = "patients" | "doctors" | "logs" | "config";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>("patients");
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [stats, setStats] = useState<SystemStats>({
    totalPatients: 0,
    totalDoctors: 0,
    totalDocumentsParsed: 0,
    totalRecords: 0,
  });
  const [toast, setToast] = useState("");

  function load() {
    setPatients(getAllPatients());
    setDoctors(getAllDoctors());
    setLogs(getAuditLogs());
    setStats(getStats());
  }

  useEffect(() => {
    load();
  }, []);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  }

  function togglePatientStatus(p: Patient) {
    const updated: Patient = {
      ...p,
      status: p.status === "Active" ? "Suspended" : "Active",
    };
    savePatient(updated);
    addAuditLog({
      action:
        updated.status === "Suspended"
          ? "PATIENT_SUSPENDED"
          : "PATIENT_ACTIVATED",
      patientId: p.patientId,
      details: `${p.name} (${p.patientId}) status changed to ${updated.status}`,
    });
    showToast(`${p.name} is now ${updated.status}`);
    load();
  }

  function toggleDoctorStatus(d: Doctor) {
    const updated: Doctor = {
      ...d,
      status: d.status === "Active" ? "Suspended" : "Active",
    };
    saveDoctor(updated);
    addAuditLog({
      action:
        updated.status === "Suspended"
          ? "DOCTOR_SUSPENDED"
          : "DOCTOR_ACTIVATED",
      doctorId: d.doctorId,
      details: `${d.name} (${d.doctorId}) status changed to ${updated.status}`,
    });
    showToast(`${d.name} is now ${updated.status}`);
    load();
  }

  function handleDeletePatient(p: Patient) {
    if (!confirm(`Delete patient ${p.name}? This cannot be undone.`)) return;
    deletePatient(p.patientId);
    addAuditLog({
      action: "PATIENT_DELETED",
      patientId: p.patientId,
      details: `Patient ${p.name} (${p.patientId}) deleted by admin`,
    });
    showToast(`${p.name} deleted`);
    load();
  }

  function handleDeleteDoctor(d: Doctor) {
    if (!confirm(`Delete doctor ${d.name}? This cannot be undone.`)) return;
    deleteDoctor(d.doctorId);
    addAuditLog({
      action: "DOCTOR_DELETED",
      doctorId: d.doctorId,
      details: `Doctor ${d.name} (${d.doctorId}) deleted by admin`,
    });
    showToast(`${d.name} deleted`);
    load();
  }

  function handleSeedData() {
    seedMockData();
    showToast("Mock data loaded successfully");
    load();
  }

  function handleClearData() {
    if (!confirm("Clear ALL data from localStorage? This cannot be undone."))
      return;
    clearAllData();
    showToast("All data cleared");
    load();
  }

  const tabs: { key: AdminTab; label: string; count?: number }[] = [
    { key: "patients", label: "Patients", count: patients.length },
    { key: "doctors", label: "Doctors", count: doctors.length },
    { key: "logs", label: "Audit Logs", count: logs.length },
    { key: "config", label: "Config" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <p className="section-label">Admin Portal</p>
        <h1 className="text-2xl font-bold">System Control Panel</h1>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {[
          {
            label: "Active Patients",
            value: stats.totalPatients,
            color: "var(--pv-green)",
          },
          {
            label: "Active Doctors",
            value: stats.totalDoctors,
            color: "var(--pv-blue)",
          },
          {
            label: "Docs Parsed by AI",
            value: stats.totalDocumentsParsed,
            color: "var(--pv-amber)",
          },
          {
            label: "Total Records",
            value: stats.totalRecords,
            color: "#8b5cf6",
          },
        ].map((s) => (
          <div key={s.label} className="pv-card p-5 text-center">
            <p className="text-3xl font-bold mb-1" style={{ color: s.color }}>
              {s.value}
            </p>
            <p className="text-xs text-pv-muted">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div
        className="flex gap-1 mb-6 p-1 rounded-xl w-fit"
        style={{ background: "var(--pv-surface)" }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.key
                ? "text-pv-amber"
                : "text-pv-muted hover:text-pv-text"
            }`}
            style={
              activeTab === tab.key
                ? {
                    background: "var(--pv-surface-2)",
                    border: "1px solid var(--pv-border)",
                  }
                : {}
            }
          >
            {tab.label}
            {tab.count !== undefined && tab.count > 0 && (
              <span
                className="text-xs px-1.5 py-0.5 rounded-full"
                style={{
                  background: "var(--pv-surface-2)",
                  color: "var(--pv-muted)",
                }}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "patients" && (
        <PatientsTab
          patients={patients}
          onToggleStatus={togglePatientStatus}
          onDelete={handleDeletePatient}
        />
      )}

      {activeTab === "doctors" && (
        <DoctorsTab
          doctors={doctors}
          onToggleStatus={toggleDoctorStatus}
          onDelete={handleDeleteDoctor}
        />
      )}

      {activeTab === "logs" && <AuditLogsTab logs={logs} />}

      {activeTab === "config" && (
        <ConfigTab onSeed={handleSeedData} onClear={handleClearData} />
      )}

      {/* Toast */}
      {toast && (
        <div
          className="toast fixed bottom-6 right-6 px-5 py-3 rounded-xl text-sm font-medium z-50"
          style={{
            background: "var(--pv-surface-2)",
            border: "1px solid var(--pv-border)",
            boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
          }}
        >
          ✓ {toast}
        </div>
      )}
    </div>
  );
}

//  Patients Tab

function PatientsTab({
  patients,
  onToggleStatus,
  onDelete,
}: {
  patients: Patient[];
  onToggleStatus: (p: Patient) => void;
  onDelete: (p: Patient) => void;
}) {
  if (patients.length === 0) {
    return (
      <div className="pv-card p-10 text-center">
        <p className="text-pv-muted text-sm mb-3">
          No patients registered yet.
        </p>
        <p className="text-xs text-pv-muted">
          Go to Config tab and load mock data, or register patients via the
          Patient Portal.
        </p>
      </div>
    );
  }

  return (
    <div className="pv-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="pv-table">
          <thead>
            <tr>
              <th>Patient ID</th>
              <th>Name</th>
              <th>Age / Gender</th>
              <th>Blood Group</th>
              <th>Records</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((p) => (
              <tr key={p.patientId}>
                <td className="font-mono text-pv-blue text-xs">
                  {p.patientId}
                </td>
                <td className="font-medium">{p.name}</td>
                <td className="text-pv-muted">
                  {p.age} · {p.gender}
                </td>
                <td className="font-semibold text-pv-red">{p.bloodGroup}</td>
                <td>{p.records.length}</td>
                <td>
                  <span
                    className={
                      p.status === "Active"
                        ? "status-active"
                        : "status-suspended"
                    }
                  >
                    {p.status}
                  </span>
                </td>
                <td>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onToggleStatus(p)}
                      className="pv-btn-secondary text-xs px-3 py-1.5"
                    >
                      {p.status === "Active" ? "Suspend" : "Activate"}
                    </button>
                    <button
                      onClick={() => onDelete(p)}
                      className="pv-btn-danger text-xs px-3 py-1.5"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Doctors Tab

function DoctorsTab({
  doctors,
  onToggleStatus,
  onDelete,
}: {
  doctors: Doctor[];
  onToggleStatus: (d: Doctor) => void;
  onDelete: (d: Doctor) => void;
}) {
  if (doctors.length === 0) {
    return (
      <div className="pv-card p-10 text-center">
        <p className="text-pv-muted text-sm">No doctors registered yet.</p>
      </div>
    );
  }

  return (
    <div className="pv-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="pv-table">
          <thead>
            <tr>
              <th>Doctor ID</th>
              <th>Name</th>
              <th>Specialty</th>
              <th>License</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map((d) => (
              <tr key={d.doctorId}>
                <td className="font-mono text-pv-blue text-xs">{d.doctorId}</td>
                <td className="font-medium">{d.name}</td>
                <td className="text-pv-muted">{d.specialty}</td>
                <td className="font-mono text-xs text-pv-muted">
                  {d.licenseNumber}
                </td>
                <td>
                  <span
                    className={
                      d.status === "Active"
                        ? "status-active"
                        : "status-suspended"
                    }
                  >
                    {d.status}
                  </span>
                </td>
                <td>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onToggleStatus(d)}
                      className="pv-btn-secondary text-xs px-3 py-1.5"
                    >
                      {d.status === "Active" ? "Suspend" : "Activate"}
                    </button>
                    <button
                      onClick={() => onDelete(d)}
                      className="pv-btn-danger text-xs px-3 py-1.5"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Audit Logs Tab

function AuditLogsTab({ logs }: { logs: AuditLog[] }) {
  if (logs.length === 0) {
    return (
      <div className="pv-card p-10 text-center">
        <p className="text-pv-muted text-sm">No audit logs yet.</p>
      </div>
    );
  }

  const actionColor: Record<string, string> = {
    DOCUMENT_PARSED: "var(--pv-green)",
    MOCK_DATA_SEEDED: "var(--pv-amber)",
    PATIENT_SUSPENDED: "var(--pv-red)",
    PATIENT_ACTIVATED: "var(--pv-green)",
    PATIENT_DELETED: "var(--pv-red)",
    DOCTOR_SUSPENDED: "var(--pv-red)",
    DOCTOR_ACTIVATED: "var(--pv-green)",
    DOCTOR_DELETED: "var(--pv-red)",
  };

  return (
    <div className="pv-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="pv-table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Action</th>
              <th>Details</th>
              <th>Patient / Doctor</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.logId}>
                <td className="font-mono text-xs text-pv-muted">
                  {new Date(log.timestamp).toLocaleString()}
                </td>
                <td>
                  <span
                    className="text-xs font-semibold px-2 py-1 rounded-md font-mono"
                    style={{
                      color: actionColor[log.action] ?? "var(--pv-muted)",
                      background: `${actionColor[log.action] ?? "var(--pv-muted)"}18`,
                    }}
                  >
                    {log.action}
                  </span>
                </td>
                <td className="text-sm text-pv-muted max-w-xs truncate">
                  {log.details}
                </td>
                <td className="font-mono text-xs text-pv-muted">
                  {log.patientId ?? log.doctorId ?? "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

//  Config Tab

function ConfigTab({
  onSeed,
  onClear,
}: {
  onSeed: () => void;
  onClear: () => void;
}) {
  return (
    <div className="space-y-4">
      {/* Seed mock data */}
      <div
        className="pv-card p-5 flex items-center justify-between gap-4 flex-wrap"
        style={{ borderColor: "rgba(245, 158, 11, 0.25)" }}
      >
        <div>
          <p className="font-semibold mb-1">Load Mock Dataset</p>
          <p className="text-sm text-pv-muted">
            Injects 2 sample patients and 2 doctors with pre-made medical
            records for quick testing.
          </p>
        </div>
        <button onClick={onSeed} className="pv-btn-primary shrink-0">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
          Seed Mock Data
        </button>
      </div>

      {/* Gemini key status */}
      <div className="pv-card p-5">
        <p className="font-semibold mb-1">Gemini API Key</p>
        <p className="text-sm text-pv-muted mb-3">
          Your API key is stored in localStorage under{" "}
          <code className="font-mono text-xs bg-pv-surface-2 px-1.5 py-0.5 rounded">
            pv_gemini_key
          </code>
          . Set it from the Patient Portal upload section.
        </p>
        <div className="flex items-center gap-2 text-sm">
          {typeof window !== "undefined" &&
          localStorage.getItem("pv_gemini_key") ? (
            <>
              <span className="w-2 h-2 rounded-full bg-pv-green inline-block" />
              <span className="text-pv-green">API key is set</span>
            </>
          ) : (
            <>
              <span className="w-2 h-2 rounded-full bg-pv-muted inline-block" />
              <span className="text-pv-muted">No API key found</span>
            </>
          )}
        </div>
      </div>

      {/* localStorage info */}
      <div className="pv-card p-5">
        <p className="font-semibold mb-1">Storage Keys</p>
        <div className="space-y-2 mt-3">
          {[
            "pulsevault_patients",
            "pulsevault_doctors",
            "pulsevault_audit_logs",
            "pulsevault_stats",
            "pv_gemini_key",
          ].map((key) => (
            <div key={key} className="flex items-center justify-between">
              <code
                className="text-xs font-mono px-2 py-1 rounded"
                style={{
                  background: "var(--pv-surface-2)",
                  color: "var(--pv-blue)",
                }}
              >
                {key}
              </code>
              <span className="text-xs text-pv-muted">
                {typeof window !== "undefined" && localStorage.getItem(key)
                  ? `${(localStorage.getItem(key)!.length / 1024).toFixed(1)} KB`
                  : "empty"}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Danger zone */}
      <div
        className="pv-card p-5"
        style={{ borderColor: "rgba(239, 68, 68, 0.25)" }}
      >
        <p className="font-semibold text-pv-red mb-1">Danger Zone</p>
        <p className="text-sm text-pv-muted mb-4">
          Permanently clears all patient records, doctor profiles, and logs from
          localStorage.
        </p>
        <button onClick={onClear} className="pv-btn-danger">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14H6L5 6" />
            <path d="M10 11v6M14 11v6" />
          </svg>
          Clear All Data
        </button>
      </div>
    </div>
  );
}
