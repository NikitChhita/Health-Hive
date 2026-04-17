import mongoose from 'mongoose';

const analysisSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  context: {
    ageRange: String,
    sex: String,
    height: String,
    weight: String,
    medications: String,
    allergies: String,
  },
  symptoms: [
    {
      name: String,
      duration: String,
      severity: Number,
      notes: String,
    }
  ],
  history: {
    familyHistory: String,
    pastDiagnoses: String,
    labResults: String,
  },
  analysis: { type: String, required: true },
  rating: { type: String, enum: ['Low', 'Moderate', 'High', 'Emergency'], default: 'Low' },
  urgencyScore: { type: Number, min: 1, max: 10 },
  headline: String,
  needsUrgentCare: { type: Boolean, default: false },
  warningSymptoms: [String],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Analysis', analysisSchema);
