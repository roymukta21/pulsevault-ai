"use client";
import Link from "next/link";

const portals = [
  {
    href: "/patient",
    tag: "Patient",
    title: "Patient Portal",
    description: "Upload prescriptions and reports. Our AI engine extracts and organizes your medical history automatically.",
    accent: "#10b981",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
  {
    href: "/doctor",
    tag: "Doctor",
    title: "Doctor Portal",
    description: "View any patient's complete health timeline, antibiotic history, and diagnostic trends at a glance.",
    accent: "#3b82f6",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
  },
  {
    href: "/admin",
    tag: "Admin",
    title: "Admin Portal",
    description: "Manage patient and doctor profiles, monitor AI parsing activity, and control system configurations.",
    accent: "#f59e0b",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
];

export default function HomePage() {
  return (
    <div
      style={{
        minHeight: "calc(100vh - 64px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "48px 24px",
        background: "#0a0f1e",
      }}
    >
      {/* Hero ECG */}
      <div style={{ marginBottom: "40px" }}>
        <svg viewBox="0 0 320 56" style={{ width: "260px", height: "48px" }}>
          <polyline
            points="0,28 44,28 54,8 64,48 74,28 94,28 106,14 118,42 130,28 320,28"
            fill="none"
            stroke="#3b82f6"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="ecg-line"
          />
          <circle cx="130" cy="28" r="4" fill="#3b82f6" className="pulse-dot" />
        </svg>
      </div>

      {/* Heading */}
      <div style={{ textAlign: "center", marginBottom: "56px", maxWidth: "560px" }}>
        <h1
          style={{
            fontSize: "clamp(36px, 6vw, 52px)",
            fontWeight: 700,
            letterSpacing: "-0.03em",
            marginBottom: "16px",
            lineHeight: 1.1,
            color: "#e2e8f0",
          }}
        >
          Pulse<span style={{ color: "#3b82f6" }}>Vault</span>
          <span style={{ color: "#64748b", fontWeight: 400, fontSize: "0.45em", verticalAlign: "middle", marginLeft: "8px" }}>AI</span>
        </h1>
        <p style={{ fontSize: "17px", color: "#64748b", lineHeight: 1.7 }}>
          Upload a prescription. Our AI reads it, structures it, and builds your
          complete health timeline — ready for your doctor in seconds.
        </p>
      </div>

      {/* Portal cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "20px",
          width: "100%",
          maxWidth: "960px",
        }}
      >
        {portals.map((p) => (
          <Link key={p.href} href={p.href} style={{ textDecoration: "none" }}>
            <div
              style={{
                background: `${p.accent}08`,
                border: `1px solid ${p.accent}30`,
                borderRadius: "16px",
                padding: "28px",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                gap: "20px",
                transition: "transform 0.15s ease, box-shadow 0.15s ease",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(-3px)";
                (e.currentTarget as HTMLDivElement).style.boxShadow = `0 12px 32px ${p.accent}18`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
              }}
            >
              {/* Icon */}
              <div
                style={{
                  width: "52px",
                  height: "52px",
                  borderRadius: "14px",
                  background: `${p.accent}18`,
                  color: p.accent,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {p.icon}
              </div>

              <div style={{ flex: 1 }}>
                <p
                  style={{
                    fontSize: "11px",
                    fontWeight: 600,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: p.accent,
                    marginBottom: "6px",
                  }}
                >
                  {p.tag}
                </p>
                <h2
                  style={{
                    fontSize: "18px",
                    fontWeight: 600,
                    color: "#e2e8f0",
                    marginBottom: "10px",
                  }}
                >
                  {p.title}
                </h2>
                <p style={{ fontSize: "14px", color: "#64748b", lineHeight: 1.65 }}>
                  {p.description}
                </p>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "13px",
                  fontWeight: 500,
                  color: p.accent,
                }}
              >
                Enter portal
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>
        ))}
      </div>

    
    </div>
  );
}