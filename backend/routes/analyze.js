import express from 'express';
import Groq from 'groq-sdk';

const router = express.Router();
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

router.post("/", async (req, res) => {
  const { context, symptoms, history } = req.body;

  const prompt = `
You are a helpful medical intake assistant. A patient has submitted health information through a symptom tracker.
Analyze it and provide:
1. A brief summary of what the patient is experiencing
2. Possible conditions that could match (list 2-4, not a diagnosis)
3. Urgency level: Low / Moderate / High — with a one-line reason
4. Recommended next steps

Be empathetic and always remind the user this is not a medical diagnosis.

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
    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1024,
    });

    const text = completion.choices[0].message.content;
    res.json({ analysis: text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Analysis request failed" });
  }
});

export default router;