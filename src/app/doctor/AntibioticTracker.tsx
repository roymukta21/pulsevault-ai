"use client";

import { MedicalRecord } from "@/src/types";

// import { MedicalRecord } from "@/types";

interface AntibioticTrackerProps {
  records: MedicalRecord[];
}

export function AntibioticTracker({ records }: AntibioticTrackerProps) {
  const allAntibiotics = records.flatMap((r) =>
    r.medicines
      .filter((m) => m.category === "Antibiotic")
      .map((m) => ({ ...m, date: r.date, doctor: r.doctorName }))
  );

  const totalCourses = allAntibiotics.length;

  // Count by name
  const byName = allAntibiotics.reduce<Record<string, number>>((acc, m) => {
    acc[m.name] = (acc[m.name] ?? 0) + 1;
    return acc;
  }, {});

  const sorted = Object.entries(byName).sort((a, b) => b[1] - a[1]);
  const maxCount = sorted[0]?.[1] ?? 1;

  if (totalCourses === 0) {
    return (
      <div
        className="rounded-xl p-5 text-center"
        style={{ background: "var(--pv-surface-2)", border: "1px solid var(--pv-border)" }}
      >
        <p className="text-sm text-pv-muted">No antibiotic usage recorded.</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Total Courses", value: totalCourses, color: "var(--pv-red)" },
          { label: "Unique Types", value: sorted.length, color: "var(--pv-amber)" },
          {
            label: "Most Used",
            value: sorted[0]?.[0]?.split(" ")[0] ?? "—",
            color: "var(--pv-blue)",
          },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-xl p-4 text-center"
            style={{ background: "var(--pv-surface-2)", border: "1px solid var(--pv-border)" }}
          >
            <p className="text-xl font-bold mb-1" style={{ color: s.color }}>
              {s.value}
            </p>
            <p className="text-xs text-pv-muted">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Bar chart by antibiotic name */}
      <div>
        <p className="section-label">Usage by Antibiotic</p>
        <div className="space-y-3">
          {sorted.map(([name, count]) => (
            <div key={name}>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-medium">{name}</span>
                <span className="text-pv-muted">{count} course{count > 1 ? "s" : ""}</span>
              </div>
              <div
                className="h-2 rounded-full overflow-hidden"
                style={{ background: "var(--pv-surface-2)" }}
              >
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${(count / maxCount) * 100}%`,
                    background: "var(--pv-red)",
                    opacity: 0.8,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* History list */}
      <div>
        <p className="section-label">History</p>
        <div className="space-y-2">
          {allAntibiotics
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .map((m, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3 rounded-lg"
                style={{ background: "var(--pv-surface-2)" }}
              >
                <div
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ background: "var(--pv-red)" }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{m.name}</p>
                  <p className="text-xs text-pv-muted">{m.dosage} · {m.duration}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs text-pv-muted">{m.date}</p>
                  <p className="text-xs text-pv-muted">{m.doctor}</p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}