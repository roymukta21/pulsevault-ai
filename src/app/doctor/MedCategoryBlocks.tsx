"use client";

import { MedicalRecord, MedicineCategory } from "@/src/types";
import { useState } from "react";
import { MedicineBadge } from "../patient/MedicineBadge";

interface MedCategoryBlocksProps {
  records: MedicalRecord[];
}

type Tab = Exclude<MedicineCategory, "Antibiotic" | "Other">;

const TABS: { key: Tab; label: string; color: string }[] = [
  { key: "Vitamin", label: "Vitamins", color: "var(--pv-green)" },
  { key: "Calcium", label: "Calcium", color: "var(--pv-amber)" },
  { key: "Gastric", label: "Gastric", color: "#8b5cf6" },
  { key: "Painkiller", label: "Painkillers", color: "var(--pv-blue)" },
  { key: "Cardiac", label: "Cardiac", color: "#ec4899" },
];

export function MedCategoryBlocks({ records }: MedCategoryBlocksProps) {
  const [activeTab, setActiveTab] = useState<Tab>("Vitamin");

  const filtered = records.flatMap((r) =>
    r.medicines
      .filter((m) => m.category === activeTab)
      .map((m) => ({ ...m, date: r.date, doctor: r.doctorName }))
  );

  const activeConfig = TABS.find((t) => t.key === activeTab)!;

  return (
    <div className="space-y-4">
      {/* Tab pills */}
      <div className="flex flex-wrap gap-2">
        {TABS.map((tab) => {
          const count = records.flatMap((r) =>
            r.medicines.filter((m) => m.category === tab.key)
          ).length;

          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className="px-4 py-2 rounded-lg text-sm font-medium border transition-all flex items-center gap-2"
              style={
                activeTab === tab.key
                  ? {
                      background: `${tab.color}18`,
                      borderColor: `${tab.color}50`,
                      color: tab.color,
                    }
                  : {
                      background: "transparent",
                      borderColor: "var(--pv-border)",
                      color: "var(--pv-muted)",
                    }
              }
            >
              {tab.label}
              {count > 0 && (
                <span
                  className="text-xs px-1.5 py-0.5 rounded-full"
                  style={{
                    background: activeTab === tab.key ? `${tab.color}25` : "var(--pv-surface-2)",
                    color: activeTab === tab.key ? tab.color : "var(--pv-muted)",
                  }}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Content */}
      {filtered.length === 0 ? (
        <div
          className="rounded-xl p-8 text-center"
          style={{ background: "var(--pv-surface-2)", border: "1px solid var(--pv-border)" }}
        >
          <p className="text-sm text-pv-muted">
            No {activeConfig.label.toLowerCase()} recorded.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .map((m, i) => (
              <div
                key={i}
                className="flex items-center gap-4 p-4 rounded-xl"
                style={{ background: "var(--pv-surface-2)", border: "1px solid var(--pv-border)" }}
              >
                <MedicineBadge category={m.category} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold">{m.name}</p>
                  <p className="text-xs text-pv-muted mt-0.5">
                    {m.dosage} · {m.duration}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs font-medium">{m.date}</p>
                  <p className="text-xs text-pv-muted">{m.doctor}</p>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}