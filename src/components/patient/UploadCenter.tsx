"use client";

import { MedicineBadge } from "@/src/app/patient/MedicineBadge";
import { extractMedicalDataFromImage, extractMedicalDataFromText } from "@/src/lib/ai";
import { appendMedicalRecord } from "@/src/lib/storage";
import { AIExtractionResult, MedicalRecord, Patient } from "@/src/types";
import { useState, useRef} from "react";
import { v4 as uuidv4 } from "uuid";

interface UploadCenterProps {
  patient: Patient;
  onSuccess: () => void;
}

type UploadStep = "idle" | "uploading" | "extracting" | "preview" | "done" | "error";

export function UploadCenter({ patient, onSuccess }: UploadCenterProps) {
  const [apiKey, setApiKey] = useState(() =>
    typeof window !== "undefined" ? localStorage.getItem("pv_gemini_key") ?? "" : ""
  );
  const [showKeyInput, setShowKeyInput] = useState(!apiKey);
  const [step, setStep] = useState<UploadStep>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [fileName, setFileName] = useState("");
  const [extraction, setExtraction] = useState<AIExtractionResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function saveApiKey(key: string) {
    setApiKey(key);
    localStorage.setItem("pv_gemini_key", key);
    if (key) setShowKeyInput(false);
  }

  async function processFile(file: File) {
    if (!apiKey) {
      setShowKeyInput(true);
      return;
    }
    setFileName(file.name);
    setStep("extracting");
    setErrorMsg("");

    try {
      let result: AIExtractionResult;

      if (file.type === "application/pdf") {
        // For PDF: read as text via FileReader (basic text extraction)
        const text = await readFileAsText(file);
        result = await extractMedicalDataFromText(text, apiKey);
      } else if (file.type.startsWith("image/")) {
        const { base64, mimeType } = await readFileAsBase64(file);
        result = await extractMedicalDataFromImage(base64, mimeType, apiKey);
      } else {
        throw new Error("Unsupported file type. Please upload a PDF or image.");
      }

      setExtraction(result);
      setStep("preview");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Unknown error occurred.");
      setStep("error");
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    e.target.value = "";
  }

  function saveRecord() {
    if (!extraction) return;
    const record: MedicalRecord = {
      recordId: uuidv4(),
      patientId: patient.patientId,
      date: extraction.date,
      doctorName: extraction.doctorName,
      patientCase: extraction.patientCase,
      symptoms: extraction.symptoms,
      respiratoryRate: extraction.respiratoryRate,
      bloodPressure: extraction.bloodPressure,
      medicines: extraction.medicines,
      testResults: extraction.testResults,
      createdAt: new Date().toISOString(),
    };
    appendMedicalRecord(patient.patientId, record);
    setStep("done");
    onSuccess();
    setTimeout(() => setStep("idle"), 3000);
  }

  function reset() {
    setStep("idle");
    setExtraction(null);
    setFileName("");
    setErrorMsg("");
  }

  return (
    <div className="space-y-6">
      {/* API Key section */}
      {showKeyInput && (
        <div
          className="rounded-xl p-5"
          style={{
            background: "rgba(245, 158, 11, 0.06)",
            border: "1px solid rgba(245, 158, 11, 0.2)",
          }}
        >
          <div className="flex items-start gap-3 mb-4">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" className="mt-0.5 shrink-0">
              <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
            </svg>
            <div>
              <p className="text-sm font-medium text-pv-amber mb-1">Gemini API Key Required</p>
              <p className="text-xs text-pv-muted">
                Your key is stored only in your browser. Get one free at{" "}
                <a href="https://aistudio.google.com/apikey" target="_blank" rel="noreferrer" className="text-pv-blue underline">
                  aistudio.google.com
                </a>
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <input
              className="pv-input"
              type="password"
              placeholder="AIza..."
              defaultValue={apiKey}
              onBlur={(e) => saveApiKey(e.target.value.trim())}
              onKeyDown={(e) => {
                if (e.key === "Enter")
                  saveApiKey((e.target as HTMLInputElement).value.trim());
              }}
            />
            <button
              className="pv-btn-primary shrink-0"
              onClick={() => {
                const input = document.querySelector<HTMLInputElement>(
                  'input[placeholder="AIza..."]'
                );
                if (input) saveApiKey(input.value.trim());
              }}
            >
              Save
            </button>
          </div>
        </div>
      )}

      {!showKeyInput && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-pv-muted">
            <span className="w-2 h-2 rounded-full bg-pv-green inline-block pulse-dot" />
            Gemini AI connected
          </div>
          <button
            className="text-xs text-pv-muted hover:text-pv-blue underline"
            onClick={() => setShowKeyInput(true)}
          >
            Change API key
          </button>
        </div>
      )}

      {/* Upload zone */}
      {step === "idle" && (
        <div
          className={`drag-zone ${dragOver ? "drag-over" : ""}`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,.pdf"
            className="hidden"
            onChange={handleFileInput}
          />
          <div className="flex flex-col items-center gap-3">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{ background: "var(--pv-surface-2)", border: "1px solid var(--pv-border)" }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--pv-blue)" strokeWidth="1.5">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="12" y1="12" x2="12" y2="18" />
                <polyline points="9 15 12 12 15 15" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium mb-1">
                Drop your prescription or report here
              </p>
              <p className="text-xs text-pv-muted">
                Supports PDF, PNG, JPEG — AI will extract all medical data
              </p>
            </div>
            <button className="pv-btn-secondary text-sm">Browse files</button>
          </div>
        </div>
      )}

      {/* Extracting state */}
      {step === "extracting" && (
        <div className="pv-card p-8 flex flex-col items-center gap-4 text-center">
          <div className="spinner w-8 h-8" style={{ width: 32, height: 32, borderWidth: 3 }} />
          <div>
            <p className="font-medium mb-1">Analyzing document…</p>
            <p className="text-sm text-pv-muted">{fileName}</p>
            <p className="text-xs text-pv-muted mt-2">
              Gemini AI is reading and structuring your medical data
            </p>
          </div>
        </div>
      )}

      {/* Error state */}
      {step === "error" && (
        <div
          className="rounded-xl p-5"
          style={{
            background: "rgba(239, 68, 68, 0.06)",
            border: "1px solid rgba(239, 68, 68, 0.2)",
          }}
        >
          <p className="text-pv-red font-medium mb-2">Extraction failed</p>
          <p className="text-sm text-pv-muted mb-4">{errorMsg}</p>
          <button onClick={reset} className="pv-btn-secondary text-sm">Try again</button>
        </div>
      )}

      {/* Done state */}
      {step === "done" && (
        <div
          className="rounded-xl p-5 flex items-center gap-3"
          style={{
            background: "rgba(16, 185, 129, 0.08)",
            border: "1px solid rgba(16, 185, 129, 0.2)",
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          <div>
            <p className="text-pv-green font-medium text-sm">Record saved successfully</p>
            <p className="text-xs text-pv-muted">Added to {patient.name}&apos;s health history</p>
          </div>
        </div>
      )}

      {/* Preview & confirm */}
      {step === "preview" && extraction && (
        <ExtractionPreview
          extraction={extraction}
          fileName={fileName}
          onConfirm={saveRecord}
          onDiscard={reset}
        />
      )}
    </div>
  );
}

//  Extraction Preview 

interface ExtractionPreviewProps {
  extraction: AIExtractionResult;
  fileName: string;
  onConfirm: () => void;
  onDiscard: () => void;
}

function ExtractionPreview({ extraction, fileName, onConfirm, onDiscard }: ExtractionPreviewProps) {
  return (
    <div className="space-y-5">
      {/* Source file banner */}
      <div
        className="rounded-lg px-4 py-3 flex items-center gap-3 text-sm"
        style={{ background: "var(--pv-surface-2)", border: "1px solid var(--pv-border)" }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--pv-blue)" strokeWidth="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
        </svg>
        <span className="text-pv-muted">Source:</span>
        <span className="font-medium">{fileName}</span>
        <span className="ml-auto text-xs text-pv-green bg-green-500/10 px-2 py-0.5 rounded-full">
          AI Extracted
        </span>
      </div>

      <div className="pv-card p-6 space-y-6">
        {/* Header info */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div>
            <p className="section-label">Doctor</p>
            <p className="font-medium">{extraction.doctorName}</p>
          </div>
          <div>
            <p className="section-label">Date</p>
            <p className="font-medium">{extraction.date}</p>
          </div>
          <div>
            <p className="section-label">Respiratory Rate</p>
            <p className="font-medium">{extraction.respiratoryRate}</p>
          </div>
          {extraction.bloodPressure !== "Not recorded" && (
            <div>
              <p className="section-label">Blood Pressure</p>
              <p className="font-medium">{extraction.bloodPressure}</p>
            </div>
          )}
        </div>

        {/* Patient case */}
        <div>
          <p className="section-label">Case Summary</p>
          <p className="text-sm leading-relaxed" style={{ color: "var(--pv-text)" }}>
            {extraction.patientCase}
          </p>
        </div>

        {/* Symptoms */}
        {extraction.symptoms.length > 0 && (
          <div>
            <p className="section-label">Symptoms</p>
            <div className="flex flex-wrap gap-2">
              {extraction.symptoms.map((s, i) => (
                <span
                  key={i}
                  className="text-xs px-3 py-1 rounded-full"
                  style={{ background: "var(--pv-surface-2)", border: "1px solid var(--pv-border)", color: "var(--pv-text)" }}
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Medicines */}
        {extraction.medicines.length > 0 && (
          <div>
            <p className="section-label">Medicines ({extraction.medicines.length})</p>
            <div className="space-y-2">
              {extraction.medicines.map((med, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3 rounded-lg"
                  style={{ background: "var(--pv-surface-2)" }}
                >
                  <MedicineBadge category={med.category} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{med.name}</p>
                    <p className="text-xs text-pv-muted">{med.dosage} · {med.duration}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Test results */}
        {extraction.testResults.length > 0 && (
          <div>
            <p className="section-label">Test Results ({extraction.testResults.length})</p>
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
                  {extraction.testResults.map((t, i) => (
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

      {/* Action buttons */}
      <div className="flex gap-3 justify-end">
        <button onClick={onDiscard} className="pv-btn-secondary">
          Discard
        </button>
        <button onClick={onConfirm} className="pv-btn-primary">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v14a2 2 0 0 1-2 2z" />
            <polyline points="17 21 17 13 7 13 7 21" />
            <polyline points="7 3 7 8 15 8" />
          </svg>
          Save to Health Record
        </button>
      </div>
    </div>
  );
}

//  File reading helpers 

function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Failed to read file."));
    reader.readAsText(file);
  });
}

function readFileAsBase64(file: File): Promise<{ base64: string; mimeType: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(",")[1];
      resolve({ base64, mimeType: file.type });
    };
    reader.onerror = () => reject(new Error("Failed to read image."));
    reader.readAsDataURL(file);
  });
}