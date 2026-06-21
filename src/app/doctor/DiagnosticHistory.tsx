"use client";

import { MedicalRecord } from "@/src/types";


interface DiagnosticHistoryProps {
  records: MedicalRecord[];
}

export function DiagnosticHistory({ records }: DiagnosticHistoryProps) {
  // Flatten all test results with their dates
  const allTests = records.flatMap((r) =>
    r.testResults.map((t) => ({ ...t, date: r.date, doctor: r.doctorName }))
  );

  if (allTests.length === 0) {
    return (
      <div
        className="rounded-xl p-8 text-center"
        style={{ background: "var(--pv-surface-2)", border: "1px solid var(--pv-border)" }}
      >
        <p className="text-sm text-pv-muted">No diagnostic test results recorded.</p>
      </div>
    );
  }

  // Group by test name to show trends
  const byTestName = allTests.reduce<
    Record<string, { value: string; unit: string; normalRange: string; date: string }[]>
  >((acc, t) => {
    if (!acc[t.testName]) acc[t.testName] = [];
    acc[t.testName].push({
      value: t.value,
      unit: t.unit ?? "",
      normalRange: t.normalRange ?? "",
      date: t.date,
    });
    return acc;
  }, {});

  const sorted = Object.entries(byTestName).sort((a, b) => b[1].length - a[1].length);

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="grid grid-cols-2 gap-3">
        <div
          className="rounded-xl p-4 text-center"
          style={{ background: "var(--pv-surface-2)", border: "1px solid var(--pv-border)" }}
        >
          <p className="text-2xl font-bold text-pv-blue mb-1">{allTests.length}</p>
          <p className="text-xs text-pv-muted">Total Tests</p>
        </div>
        <div
          className="rounded-xl p-4 text-center"
          style={{ background: "var(--pv-surface-2)", border: "1px solid var(--pv-border)" }}
        >
          <p className="text-2xl font-bold text-pv-green mb-1">{sorted.length}</p>
          <p className="text-xs text-pv-muted">Unique Tests</p>
        </div>
      </div>

      {/* Per-test trend blocks */}
      {sorted.map(([testName, entries]) => (
        <div
          key={testName}
          className="rounded-xl overflow-hidden"
          style={{ border: "1px solid var(--pv-border)" }}
        >
          {/* Test header */}
          <div
            className="px-4 py-3 flex items-center justify-between"
            style={{ background: "var(--pv-surface-2)" }}
          >
            <p className="text-sm font-semibold">{testName}</p>
            {entries[0]?.normalRange && (
              <p className="text-xs text-pv-muted">
                Normal: {entries[0].normalRange} {entries[0].unit}
              </p>
            )}
          </div>

          {/* Entries table */}
          <table className="pv-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Value</th>
                <th>Unit</th>
                <th>Doctor</th>
              </tr>
            </thead>
            <tbody>
              {entries
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((entry, i) => (
                  <tr key={i}>
                    <td className="text-sm">{entry.date}</td>
                    <td>
                      <span className="font-semibold text-pv-blue">{entry.value}</span>
                    </td>
                    <td className="text-pv-muted text-sm">{entry.unit || "—"}</td>
                    <td className="text-pv-muted text-xs">{entry.date}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}