"use client";

import { getPatientById } from "@/src/lib/storage";
import { MedicalRecord, Patient } from "@/src/types";
import { useState } from "react";
import { AntibioticTracker } from "./AntibioticTracker";
import { MedCategoryBlocks } from "./MedCategoryBlocks";
import { DiagnosticHistory } from "./DiagnosticHistory";
import { MedicineBadge } from "../patient/MedicineBadge";



type DashTab = "antibiotics" | "medications" | "diagnostics";

export default function DoctorPage() {
  const [searchId, setSearchId] = useState("");
  const [patient, setPatient] = useState<Patient | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [activeTab, setActiveTab] = useState<DashTab>("antibiotics");
  const [expandedRecord, setExpandedRecord] = useState<MedicalRecord | null>(null);

  function handleSearch() {
    const trimmed = searchId.trim().toUpperCase();
    if (!trimmed) return;
    const found = getPatientById(trimmed);
    if (found) {
      setPatient(found);
      setNotFound(false);
    } else {
      setPatient(null);
      setNotFound(true);
    }
  }

  const tabs: { key: DashTab; label: string; icon: React.ReactNode }[] = [
    {
      key: "antibiotics",
      label: "Antibiotic Tracker",
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      ),
    },
    {
      key: "medications",
      label: "Medications",
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
        </svg>
      ),
    },
    {
      key: "diagnostics",
      label: "Diagnostics",
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
      ),
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <p className="section-label">Doctor Portal</p>
        <h1 className="text-2xl font-bold">Patient Health Dashboard</h1>
      </div>

      {/* Search bar */}
      <div className="pv-card p-5 mb-6">
        <p className="section-label">Search Patient by ID</p>
        <div className="flex gap-3">
          <input
            className="pv-input font-mono"
            placeholder="e.g. PV-1001"
            value={searchId}
            onChange={(e) => {
              setSearchId(e.target.value);
              setNotFound(false);
            }}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <button onClick={handleSearch} className="pv-btn-primary shrink-0">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            Search
          </button>
        </div>

        {notFound && (
          <p className="text-pv-red text-sm mt-3">
            No patient found with ID &quot;{searchId.trim()}&quot;. Check the ID and try again.
          </p>
        )}
      </div>

      {patient && (
        <>
          {/* Patient info card */}
          <div
            className="rounded-xl p-5 mb-6"
            style={{
              background: "rgba(59, 130, 246, 0.06)",
              border: "1px solid rgba(59, 130, 246, 0.2)",
            }}
          >
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold"
                  style={{ background: "rgba(59, 130, 246, 0.15)", color: "var(--pv-blue)" }}
                >
                  {patient.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-lg font-bold">{patient.name}</h2>
                  <p className="font-mono text-sm text-pv-blue">{patient.patientId}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-5 text-sm">
                <div>
                  <p className="text-xs text-pv-muted mb-0.5">Age / Gender</p>
                  <p className="font-medium">{patient.age} yrs · {patient.gender}</p>
                </div>
                <div>
                  <p className="text-xs text-pv-muted mb-0.5">Blood Group</p>
                  <p className="font-bold text-pv-red">{patient.bloodGroup}</p>
                </div>
                <div>
                  <p className="text-xs text-pv-muted mb-0.5">Consultations</p>
                  <p className="font-medium">{patient.records.length} records</p>
                </div>
                <div>
                  <p className="text-xs text-pv-muted mb-0.5">Status</p>
                  <span className={patient.status === "Active" ? "status-active" : "status-suspended"}>
                    {patient.status}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {[
              {
                label: "Total Medicines",
                value: patient.records.flatMap((r) => r.medicines).length,
                color: "var(--pv-blue)",
              },
              {
                label: "Antibiotics",
                value: patient.records
                  .flatMap((r) => r.medicines)
                  .filter((m) => m.category === "Antibiotic").length,
                color: "var(--pv-red)",
              },
              {
                label: "Test Results",
                value: patient.records.flatMap((r) => r.testResults).length,
                color: "var(--pv-green)",
              },
              {
                label: "Last Visit",
                value: patient.records.length
                  ? [...patient.records].sort(
                      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
                    )[0].date
                  : "—",
                color: "var(--pv-amber)",
              },
            ].map((s) => (
              <div
                key={s.label}
                className="pv-card p-4 text-center"
              >
                <p className="text-xl font-bold mb-1" style={{ color: s.color }}>
                  {s.value}
                </p>
                <p className="text-xs text-pv-muted">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Dashboard tabs */}
          <div className="flex gap-1 mb-5 p-1 rounded-xl w-fit" style={{ background: "var(--pv-surface)" }}>
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.key ? "text-pv-blue" : "text-pv-muted hover:text-pv-text"
                }`}
                style={
                  activeTab === tab.key
                    ? { background: "var(--pv-surface-2)", border: "1px solid var(--pv-border)" }
                    : {}
                }
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="pv-card p-5 mb-6">
            {activeTab === "antibiotics" && (
              <AntibioticTracker records={patient.records} />
            )}
            {activeTab === "medications" && (
              <MedCategoryBlocks records={patient.records} />
            )}
            {activeTab === "diagnostics" && (
              <DiagnosticHistory records={patient.records} />
            )}
          </div>

          {/* Consultation timeline */}
          <div>
            <p className="section-label mb-4">Consultation Timeline</p>
            <div className="space-y-3">
              {[...patient.records]
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((record) => (
                  <div key={record.recordId} className="pv-card p-4">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 flex-wrap mb-2">
                          <span className="text-sm font-semibold">{record.date}</span>
                          <span className="text-sm text-pv-muted">{record.doctorName}</span>
                        </div>
                        <p className="text-sm text-pv-muted mb-3 leading-relaxed">
                          {record.patientCase}
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {record.medicines.slice(0, 4).map((m, i) => (
                            <MedicineBadge key={i} category={m.category} size="sm" />
                          ))}
                          {record.medicines.length > 4 && (
                            <span className="text-xs text-pv-muted px-2 py-0.5 rounded-full" style={{ background: "var(--pv-surface-2)" }}>
                              +{record.medicines.length - 4} more
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => setExpandedRecord(record)}
                        className="pv-btn-secondary text-xs shrink-0"
                      >
                        View Full Record
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </>
      )}

      {/* Full record modal */}
      {expandedRecord && (
        <RecordDetailModal
          record={expandedRecord}
          onClose={() => setExpandedRecord(null)}
        />
      )}
    </div>
  );
}

// Record Detail Modal 

function RecordDetailModal({
  record,
  onClose,
}: {
  record: MedicalRecord;
  onClose: () => void;
}) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold">{record.date}</h2>
            <p className="text-sm text-pv-muted">{record.doctorName}</p>
          </div>
          <button onClick={onClose} className="text-pv-muted hover:text-pv-text">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-5">
          {/* Case summary */}
          <div>
            <p className="section-label">Case Summary</p>
            <p className="text-sm leading-relaxed">{record.patientCase}</p>
          </div>

          {/* Vitals */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg p-3" style={{ background: "var(--pv-surface-2)" }}>
              <p className="text-xs text-pv-muted mb-1">Respiratory Rate</p>
              <p className="font-semibold">{record.respiratoryRate}</p>
            </div>
            <div className="rounded-lg p-3" style={{ background: "var(--pv-surface-2)" }}>
              <p className="text-xs text-pv-muted mb-1">Blood Pressure</p>
              <p className="font-semibold">{record.bloodPressure}</p>
            </div>
          </div>

          {/* Symptoms */}
          {record.symptoms.length > 0 && (
            <div>
              <p className="section-label">Symptoms</p>
              <div className="flex flex-wrap gap-2">
                {record.symptoms.map((s, i) => (
                  <span key={i} className="text-xs px-3 py-1 rounded-full" style={{ background: "var(--pv-surface-2)", border: "1px solid var(--pv-border)" }}>
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Medicines */}
          {record.medicines.length > 0 && (
            <div>
              <p className="section-label">Medicines ({record.medicines.length})</p>
              <div className="space-y-2">
                {record.medicines.map((m, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-lg" style={{ background: "var(--pv-surface-2)" }}>
                    <MedicineBadge category={m.category} size="sm" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{m.name}</p>
                      <p className="text-xs text-pv-muted">{m.dosage} · {m.duration}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Test results */}
          {record.testResults.length > 0 && (
            <div>
              <p className="section-label">Test Results</p>
              <table className="pv-table">
                <thead>
                  <tr>
                    <th>Test</th>
                    <th>Value</th>
                    <th>Unit</th>
                    <th>Normal Range</th>
                  </tr>
                </thead>
                <tbody>
                  {record.testResults.map((t, i) => (
                    <tr key={i}>
                      <td>{t.testName}</td>
                      <td className="font-semibold text-pv-blue">{t.value}</td>
                      <td className="text-pv-muted">{t.unit || "—"}</td>
                      <td className="text-pv-muted text-xs">{t.normalRange || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}