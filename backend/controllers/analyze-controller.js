import Groq from 'groq-sdk';
import Analysis from '../models/analysis.js';

let groq = null;
if (process.env.GROQ_API_KEY && process.env.GROQ_API_KEY !== 'gsk_placeholder_key_for_development') {
  groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
}

const DEFAULT_SCORE_BY_RATING = {
  Low: 2,
  Moderate: 5,
  High: 7,
  Emergency: 9,
};

const VALID_RATINGS = new Set(['Low', 'Moderate', 'High', 'Emergency']);

const normalizeAnalysis = (parsed, symptoms) => {
  const rating = VALID_RATINGS.has(parsed.rating) ? parsed.rating : 'Low';
  const urgencyScore = Math.max(
    1,
    Math.min(10, Number(parsed.urgencyScore) || DEFAULT_SCORE_BY_RATING[rating])
  );
  const warningSymptoms = Array.isArray(parsed.warningSymptoms)
    ? parsed.warningSymptoms
        .filter((symptom) => typeof symptom === 'string' && symptom.trim())
        .map((symptom) => symptom.trim())
        .slice(0, 6)
    : [];
  const inferredWarningSymptoms = warningSymptoms.length > 0
    ? warningSymptoms
    : symptoms.slice(0, 4).map((symptom) => symptom.name);

  return {
    rating,
    urgencyScore,
    headline:
      typeof parsed.headline === 'string' && parsed.headline.trim()
        ? parsed.headline.trim()
        : `${rating} priority symptoms`,
    summary:
      typeof parsed.summary === 'string' && parsed.summary.trim()
        ? parsed.summary.trim()
        : 'We could not generate a detailed analysis. Please consult a medical professional if symptoms worsen.',
    needsUrgentCare:
      typeof parsed.needsUrgentCare === 'boolean'
        ? parsed.needsUrgentCare
        : rating === 'High' || rating === 'Emergency',
    warningSymptoms: inferredWarningSymptoms,
  };
};

export const analyzeSymptoms = async (req, res) => {
  console.log('analyzeSymptoms hit'); 

  if (!groq) {
    return res.status(503).json({ error: "AI analysis service not configured." });
  }

  const { context, symptoms, history } = req.body;
  const { imageBase64, imageMediaType } = history;
  console.log('Image received:', !!imageBase64, '| Media type:', imageMediaType);


  const prompt = `
You are a helpful medical intake assistant. A patient has submitted health information through a symptom tracker.
${imageBase64 ? "The patient has uploaded an image of a physical condition. Analyze it carefully and use it as a primary input for your assessment, even if no text symptoms are listed." : ""}

Use these criteria to determine the rating:
- "Low" (score 1-3): Minor symptoms, self-manageable at home, no red flags
- "Moderate" (score 4-5): Symptoms may warrant a doctor visit within a few days
- "High" (score 6-7): Needs prompt same-day medical attention or urgent care
- "Emergency" (score 8-10): Life-threatening symptoms, call 911 immediately

Respond ONLY with a valid JSON object in this exact format, nothing else:
{
  "rating": "Low" | "Moderate" | "High" | "Emergency",
  "urgencyScore": 1-10,
  "headline": "short urgent headline (max 10 words)",
  "summary": "2-3 sentence empathetic triage summary explaining urgency and recommended next steps",
  "needsUrgentCare": true | false,
  "warningSymptoms": ["list", "of", "concerning", "symptoms"]
}

If an image has been provided, analyze it carefully and base your rating primarily on what you observe visually, even if no symptoms are listed in text.
If no image and no symptoms are provided, choose "Low" and ask for more detail in the summary.

--- PATIENT CONTEXT ---
Age Range: ${context.ageRange || "Not provided"}
Sex: ${context.sex || "Not provided"}
Height: ${context.height || "Not provided"}
Weight: ${context.weight || "Not provided"}
Current Medications: ${context.medications || "None listed"}
Known Allergies: ${context.allergies || "None listed"}

--- SYMPTOMS ---
${symptoms.length === 0
  ? imageBase64
    ? "No text symptoms listed. Please analyze the uploaded image to determine the assessment."
    : "No symptoms listed."
  : symptoms.map((s) =>
    `- ${s.name}: duration ${s.duration || "unknown"}, severity ${s.severity}/10${s.notes ? `, notes: "${s.notes}"` : ""}`
  ).join("\n")}

--- MEDICAL HISTORY ---
Family History: ${history.familyHistory || "Not provided"}
Past Diagnoses: ${history.pastDiagnoses || "Not provided"}
Recent Lab Results: ${history.labResults || "Not provided"}
  `;

  const userContent = imageBase64
    ? [
        {
          type: "image_url",
          image_url: { url: `data:${imageMediaType};base64,${imageBase64}` },
        },
        { type: "text", text: prompt },
      ]
    : prompt;

  try {
    const completion = await groq.chat.completions.create({
      model: imageBase64 ? "meta-llama/llama-4-scout-17b-16e-instruct" : "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: userContent }],
      max_tokens: 512,
    });

    const raw = completion.choices[0].message.content;
    const clean = raw.replace(/```json|```/g, "").trim();
    const parsed = normalizeAnalysis(JSON.parse(clean), symptoms);

    const savedAnalysis = new Analysis({
      userId: req.userId,
      context,
      symptoms,
      history,
      analysis: parsed.summary,
      rating: parsed.rating,
      urgencyScore: parsed.urgencyScore,
      headline: parsed.headline,
      needsUrgentCare: parsed.needsUrgentCare,
      warningSymptoms: parsed.warningSymptoms,
    });

    await savedAnalysis.save();

    res.json({
      analysis: parsed.summary,
      rating: parsed.rating,
      urgencyScore: parsed.urgencyScore,
      headline: parsed.headline,
      needsUrgentCare: parsed.needsUrgentCare,
      warningSymptoms: parsed.warningSymptoms,
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

export const deleteAnalysis = async (req, res) => {
  try {
    const deletedAnalysis = await Analysis.findOneAndDelete({
      _id: req.params.analysisId,
      userId: req.userId,
    });

    if (!deletedAnalysis) {
      return res.status(404).json({ message: 'Analysis not found' });
    }

    return res.json({ message: 'Analysis deleted successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Failed to delete analysis' });
  }
};