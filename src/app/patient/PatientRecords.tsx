"use client";

import { useState } from "react";
import { Patient, MedicalRecord } from "../../types";
import { MedicineBadge } from "./MedicineBadge";

interface PatientRecordsProps {
  patient: Patient;
}

export function PatientRecords({ patient }: PatientRecordsProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const sorted = [...patient.records].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  if (sorted.length === 0) {
    return (
      <div className="pv-card p-10 text-center">
        <p className="text-pv-muted text-sm">No records yet. Upload a document to get started.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sorted.map((record) => (
        <RecordCard
          key={record.recordId}
          record={record}
          expanded={expandedId === record.recordId}
          onToggle={() =>
            setExpandedId(
              expandedId === record.recordId ? null : record.recordId
            )
          }
        />
      ))}
    </div>
  );
}

interface RecordCardProps {
  record: MedicalRecord;
  expanded: boolean;
  onToggle: () => void;
}

function RecordCard({ record, expanded, onToggle }: RecordCardProps) {
  return (
    <div className="pv-card overflow-hidden">
      {/* Header row */}
      <button
        onClick={onToggle}
        className="w-full p-5 flex items-center gap-4 text-left hover:bg-white/[0.02] transition-colors"
      >
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: "var(--pv-surface-2)", border: "1px solid var(--pv-border)" }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--pv-blue)" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <p className="font-semibold text-sm">{record.date}</p>
            <p className="text-sm text-pv-muted">{record.doctorName}</p>
          </div>
          <p className="text-xs text-pv-muted mt-0.5 truncate">{record.patientCase}</p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="flex gap-1.5 flex-wrap justify-end">
            {Array.from(new Set(record.medicines.map((m) => m.category)))
              .slice(0, 3)
              .map((cat) => (
                <MedicineBadge key={cat} category={cat} size="sm" />
              ))}
          </div>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--pv-muted)"
            strokeWidth="2"
            className="transition-transform duration-200"
            style={{ transform: expanded ? "rotate(180deg)" : "rotate(0deg)" }}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </button>

      {/* Expanded detail */}
      {expanded && (
        <div
          className="px-5 pb-5 space-y-5"
          style={{ borderTop: "1px solid var(--pv-border)" }}
        >
          {/* Vitals */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
            {[
              { label: "RR", value: record.respiratoryRate },
              { label: "BP", value: record.bloodPressure },
              { label: "Medicines", value: `${record.medicines.length} prescribed` },
              { label: "Tests", value: `${record.testResults.length} results` },
            ].map((v) => (
              <div
                key={v.label}
                className="rounded-lg p-3"
                style={{ background: "var(--pv-surface-2)" }}
              >
                <p className="text-xs text-pv-muted mb-1">{v.label}</p>
                <p className="text-sm font-medium">{v.value}</p>
              </div>
            ))}
          </div>

          {/* Symptoms */}
          {record.symptoms.length > 0 && (
            <div>
              <p className="section-label">Symptoms</p>
              <div className="flex flex-wrap gap-2">
                {record.symptoms.map((s, i) => (
                  <span
                    key={i}
                    className="text-xs px-3 py-1 rounded-full"
                    style={{ background: "var(--pv-surface-2)", border: "1px solid var(--pv-border)" }}
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Medicines */}
          {record.medicines.length > 0 && (
            <div>
              <p className="section-label">Medicines</p>
              <div className="space-y-2">
                {record.medicines.map((med, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 rounded-lg"
                    style={{ background: "var(--pv-surface-2)" }}
                  >
                    <MedicineBadge category={med.category} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{med.name}</p>
                      <p className="text-xs text-pv-muted">{med.dosage} · {med.duration}</p>
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
              <div className="overflow-x-auto">
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
                        <td className="font-semibold">{t.value}</td>
                        <td className="text-pv-muted">{t.unit || "—"}</td>
                        <td className="text-pv-muted text-xs">{t.normalRange || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}