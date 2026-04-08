import Groq from 'groq-sdk';
import Analysis from '../models/analysis.js';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const analyzeSymptoms = async (req, res) => {
  const { context, symptoms, history } = req.body;

  const prompt = `
You are a helpful medical intake assistant. A patient has submitted health information through a symptom tracker.

Use these criteria to determine the rating:
- "Low": Minor symptoms, self-manageable at home, no red flags
- "Moderate": Symptoms could maybe warrant a doctor visit within a few days 
- "High": Symptoms need prompt medical attention within 24 hours
- "Emergency": Life-threatening symptoms, call 911 immediately


Respond ONLY with a valid JSON object in this exact format, nothing else:
{
  "rating": "Low" | "Moderate" | "High" | "Emergency",
  "summary": "2-3 sentence empathetic summary / diagnosis of what the patient may be experiencing and recommended next steps. Tell them to contanct a specific health care if needed.
   You can keep prompts shorter depending on the content"
}

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
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 512,
    });

    const raw = completion.choices[0].message.content;
    const clean = raw.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);

    const savedAnalysis = new Analysis({
      userId: req.userId,
      context,
      symptoms,
      history,
      analysis: parsed.summary,
      rating: parsed.rating,
    });

    await savedAnalysis.save();

    res.json({
      analysis: parsed.summary,
      rating: parsed.rating,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Analysis request failed" });
  }
};

export const getUserAnalyses = async (req, res) => {
  try {
    const analyses = await Analysis.find({ userId: req.userId })
      .sort({ createdAt: -1 });
    res.json({ analyses });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch analyses" });
  }
};