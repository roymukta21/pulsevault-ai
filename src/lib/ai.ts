import { AIExtractionResult } from "../types";

const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

const SYSTEM_PROMPT = `You are a medical document parser. The user will give you text or image content from a prescription or medical test report. 

Extract information and return ONLY a valid JSON object with this exact structure — no markdown, no explanation, just raw JSON:

{
  "doctorName": "string (Doctor's full name, or 'Unknown' if not found)",
  "date": "string (consultation date in YYYY-MM-DD format, or today's date if not found)",
  "patientCase": "string (1-2 sentence summary of the patient's condition/complaints)",
  "symptoms": ["array of symptom strings"],
  "respiratoryRate": "string (RR value with unit, or 'Not recorded')",
  "bloodPressure": "string (BP value like '120/80 mmHg', or 'Not recorded')",
  "medicines": [
    {
      "name": "string",
      "dosage": "string",
      "duration": "string",
      "category": "one of: Antibiotic, Vitamin, Calcium, Gastric, Painkiller, Cardiac, Other"
    }
  ],
  "testResults": [
    {
      "testName": "string",
      "value": "string",
      "unit": "string or empty string",
      "normalRange": "string or empty string"
    }
  ]
}

Rules:
- Categorize antibiotics correctly (any -mycin, -cillin, -cycline, -floxacin endings, or known antibiotics)
- If a field has no data, use empty array [] or the placeholder strings above
- Date must be YYYY-MM-DD format
- Return ONLY the JSON, nothing else`;

export async function extractMedicalDataFromText(
  text: string,
  apiKey: string
): Promise<AIExtractionResult> {
  const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      system_instruction: {
        parts: [{ text: SYSTEM_PROMPT }],
      },
      contents: [
        {
          parts: [
            {
              text: `Parse this medical document and return structured JSON:\n\n${text}`,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 2048,
      },
    }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(
      err?.error?.message ?? `Gemini API error: ${response.status}`
    );
  }

  const data = await response.json();
  const rawText: string =
    data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

  // Strip any accidental markdown fences
  const cleaned = rawText
    .replace(/```json\s*/gi, "")
    .replace(/```\s*/g, "")
    .trim();

  try {
    const parsed = JSON.parse(cleaned) as AIExtractionResult;
    return parsed;
  } catch {
    throw new Error(
      "AI returned invalid JSON. Please try again or use a clearer document."
    );
  }
}

export async function extractMedicalDataFromImage(
  base64Image: string,
  mimeType: string,
  apiKey: string
): Promise<AIExtractionResult> {
  const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      system_instruction: {
        parts: [{ text: SYSTEM_PROMPT }],
      },
      contents: [
        {
          parts: [
            {
              text: "Parse this medical prescription/report image and return structured JSON:",
            },
            {
              inline_data: {
                mime_type: mimeType,
                data: base64Image,
              },
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 2048,
      },
    }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(
      err?.error?.message ?? `Gemini API error: ${response.status}`
    );
  }

  const data = await response.json();
  const rawText: string =
    data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

  const cleaned = rawText
    .replace(/```json\s*/gi, "")
    .replace(/```\s*/g, "")
    .trim();

  try {
    return JSON.parse(cleaned) as AIExtractionResult;
  } catch {
    throw new Error(
      "AI returned invalid JSON. Please try again or use a clearer document."
    );
  }
}