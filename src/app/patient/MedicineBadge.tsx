"use client";

import { MedicineCategory } from "@/src/types";



interface MedicineBadgeProps {
  category: MedicineCategory;
  size?: "sm" | "md";
}

const categoryConfig: Record<
  MedicineCategory,
  { label: string; className: string }
> = {
  Antibiotic: { label: "Antibiotic", className: "badge-antibiotic" },
  Vitamin: { label: "Vitamin", className: "badge-vitamin" },
  Calcium: { label: "Calcium", className: "badge-calcium" },
  Gastric: { label: "Gastric", className: "badge-gastric" },
  Painkiller: { label: "Painkiller", className: "badge-painkiller" },
  Cardiac: { label: "Cardiac", className: "badge-cardiac" },
  Other: { label: "Other", className: "badge-other" },
};

export function MedicineBadge({ category, size = "md" }: MedicineBadgeProps) {
  const config = categoryConfig[category] ?? categoryConfig["Other"];
  return (
    <span
      className={`${config.className} rounded-full font-medium shrink-0`}
      style={{
        fontSize: size === "sm" ? "10px" : "11px",
        padding: size === "sm" ? "2px 8px" : "3px 10px",
      }}
    >
      {config.label}
    </span>
  );
}