import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';

const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });

router.post("/", async (req, res) => {
  const { context, symptoms, history } = req.body;

  const prompt = `
You are a helpful medical intake assistant. A patient has submitted the following health information through a symptom tracker form.
Analyze it and provide:
1. A brief summary of what the patient is experiencing
2. Possible conditions that could match these symptoms (list 2-4, not a diagnosis)
3. Urgency level: Low / Moderate / High — with a one-line reason
4. Recommended next steps (e.g. rest, see a GP, go to urgent care)

Be empathetic, clear, and always remind the user this is not a medical diagnosis.

--- PATIENT CONTEXT ---
Age Range: ${context.ageRange || "Not provided"}
Sex: ${context.sex || "Not provided"}
Height: ${context.height || "Not provided"}
Weight: ${context.weight || "Not provided"}
Current Medications: ${context.medications || "None listed"}
Known Allergies: ${context.allergies || "None listed"}

--- SYMPTOMS ---
${symptoms.length === 0 ? "No symptoms listed." : symptoms.map((s) =>
  `- ${s.name}: duration ${s.duration || "unknown"}, severity ${s.severity}/10${s.notes ? `, notes: "${s.notes}"` : ""}`
).join("\n")}

--- MEDICAL HISTORY ---
Family History: ${history.familyHistory || "Not provided"}
Past Diagnoses: ${history.pastDiagnoses || "Not provided"}
Recent Lab Results: ${history.labResults || "Not provided"}
  `;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    res.json({ analysis: text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gemini request failed" });
  }
});

export default router;