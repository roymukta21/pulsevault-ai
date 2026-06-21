import Link from "next/link";

const links = [
  { href: "/patient", label: "Patient Portal" },
  { href: "/doctor", label: "Doctor Portal" },
  { href: "/admin", label: "Admin Portal" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      style={{
        borderTop: "1px solid #1e3a6e",
        background: "#0a0f1e",
        padding: "32px 24px 24px",
        marginTop: "auto",
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: "24px",
        }}
      >
        {/* Top row: brand + links */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "20px",
          }}
        >
          {/* Brand */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path
                d="M2 12h4l2-6 4 12 2-6h8"
                stroke="#3b82f6"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="ecg-line"
              />
            </svg>
            <span style={{ fontSize: "15px", fontWeight: 600, color: "#e2e8f0" }}>
              Pulse<span style={{ color: "#3b82f6" }}>Vault</span>
              <span style={{ color: "#64748b", fontWeight: 400, marginLeft: "4px" }}>AI</span>
            </span>
          </div>

          {/* Links */}
          <nav style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                style={{
                  fontSize: "13px",
                  color: "#64748b",
                  textDecoration: "none",
                }}
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Divider */}
        <div style={{ height: "1px", background: "#1e3a6e" }} />

        {/* Bottom row */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "10px",
          }}
        >
          <p style={{ fontSize: "12px", color: "#475569" }}>
            © {year} PulseVault AI · All data stored locally in your browser
          </p>
          <p style={{ fontSize: "12px", color: "#475569" }}>
            No external database · Built for demonstration purposes
          </p>
        </div>
      </div>
    </footer>
  );
}