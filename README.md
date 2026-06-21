# PulseVault AI

AI-powered prescription and health analytics management system. Patients upload prescriptions and reports, an AI engine extracts and structures the data, and doctors get a complete, organized view of a patient's medical history in seconds.

**Live demo:** [pulsevault-ai.vercel.app](https://pulsevault-ai.vercel.app)

---

## What it does

PulseVault AI solves a simple but common problem — medical records are scattered across paper prescriptions, lab reports, and memory. This app centralizes them and uses AI to make sense of unstructured documents automatically.

### Patient Portal
- Upload prescriptions and diagnostic reports
- AI extracts medicines, dosages, and test results automatically
- Browse a chronological health timeline
- View detailed records for any past visit

### Doctor Portal
- Search any patient by ID
- See medication history, antibiotic usage, and diagnostic trends at a glance
- Review consultation timelines and full visit records
- Quick stats: total medicines, antibiotics prescribed, tests run, last visit date

### Admin Portal
- Manage patient and doctor profiles (suspend, activate, delete)
- Monitor AI parsing activity across the system
- View color-coded audit logs of all actions
- System configuration and data management

---

## Tech stack

- **Framework:** Next.js 16 (App Router, Turbopack)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **AI extraction:** Gemini API
- **Storage:** Browser localStorage (no external database — all data stays on-device)

---

## Getting started

Clone the repo and install dependencies:

```bash
git clone https://github.com/roymukta21/pulsevault-ai.git
cd pulsevault-ai
npm install
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see it running.

---

## Project structure

```
src/
├── app/
│   ├── page.tsx          # Landing page
│   ├── patient/          # Patient portal
│   ├── doctor/           # Doctor portal
│   └── admin/            # Admin portal
├── components/
│   ├── layout/           # Navigation, Footer
│   ├── patient/
│   ├── doctor/
│   └── ui/
├── lib/                  # Storage utilities, AI extraction logic
└── types/                # Shared TypeScript types
```

---

## Notes

This is a demonstration project built to explore AI-assisted document parsing in a medical context. All data is stored locally in the browser — nothing is sent to or stored on an external server, and this is not intended for use with real patient data.

---

## License

This project is for educational and demonstration purposes.