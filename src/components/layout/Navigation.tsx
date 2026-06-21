"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  {
    href: "/patient",
    label: "Patient Portal",
    color: "#10b981",
    dot: "#10b981",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
  {
    href: "/doctor",
    label: "Doctor Portal",
    color: "#3b82f6",
    dot: "#3b82f6",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
  },
  {
    href: "/admin",
    label: "Admin Portal",
    color: "#f59e0b",
    dot: "#f59e0b",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
];

export function Navigation() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 40,
        background: "rgba(10, 15, 30, 0.95)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid #1e3a6e",
        height: "64px",
      }}
    >
      <div
        style={{
          maxWidth: "1152px",
          margin: "0 auto",
          padding: "0 24px",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            textDecoration: "none",
          }}
        >
          {/* ECG line */}
          <svg viewBox="0 0 120 32" style={{ width: "120px", height: "32px" }}>
            <polyline
              points="0,16 16,16 20,6 24,26 28,16 36,16 40,10 44,22 48,16 120,16"
              fill="none"
              stroke="#3b82f6"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="ecg-line"
            />
            <circle cx="48" cy="16" r="3" fill="#3b82f6" className="pulse-dot" />
          </svg>
          <span
            style={{
              fontSize: "17px",
              fontWeight: 600,
              color: "#e2e8f0",
              letterSpacing: "-0.02em",
            }}
          >
            Pulse<span style={{ color: "#3b82f6" }}>Vault</span>
            <span style={{ color: "#64748b", fontWeight: 400, fontSize: "13px", marginLeft: "4px" }}>AI</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }} className="hidden-mobile">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "8px 16px",
                  borderRadius: "10px",
                  fontSize: "14px",
                  fontWeight: 500,
                  textDecoration: "none",
                  color: isActive ? item.color : "#64748b",
                  background: isActive ? `${item.color}12` : "transparent",
                  border: isActive ? `1px solid ${item.color}35` : "1px solid transparent",
                  transition: "all 0.15s ease",
                }}
              >
                {isActive && (
                  <span
                    style={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      background: item.dot,
                      display: "inline-block",
                      animation: "pulse-glow 2s ease-in-out infinite",
                    }}
                  />
                )}
                <span style={{ color: isActive ? item.color : "#94a3b8" }}>
                  {item.icon}
                </span>
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          style={{
            background: "none",
            border: "none",
            color: "#64748b",
            cursor: "pointer",
            padding: "8px",
            borderRadius: "8px",
            display: "none",
          }}
          className="show-mobile"
          aria-label="Toggle menu"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {mobileOpen
              ? <path d="M18 6L6 18M6 6l12 12" />
              : <><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></>}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          style={{
            background: "#0a0f1e",
            borderTop: "1px solid #1e3a6e",
            padding: "12px 24px 16px",
          }}
        >
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "12px 14px",
                  borderRadius: "10px",
                  fontSize: "14px",
                  fontWeight: 500,
                  textDecoration: "none",
                  color: isActive ? item.color : "#94a3b8",
                  background: isActive ? `${item.color}10` : "transparent",
                  marginBottom: "4px",
                }}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </div>
      )}

      <style>{`
        @media (min-width: 768px) {
          .hidden-mobile { display: flex !important; }
          .show-mobile { display: none !important; }
        }
        @media (max-width: 767px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: block !important; }
        }
      `}</style>
    </nav>
  );
}