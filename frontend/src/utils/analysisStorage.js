const ANALYSES_STORAGE_KEY = 'analyses';

const defaultAnalyses = [
  {
    id: 1,
    symptoms: 'Severe headache, light sensitivity, nausea',
    date: 'Mar 29, 2026',
    time: '11:20 PM',
    rating: 'High',
    ratingColor: 'text-error bg-error/10',
    analysis: 'Symptoms may indicate a severe migraine or potentially more serious neurological condition. Immediate rest in a dark room is advised. If symptoms worsen or include confusion, seek immediate care.',
    form: {
      age: 28,
      gender: 'Female',
      duration: '2 days',
      severity: 8,
    },
  },
  {
    id: 2,
    symptoms: 'Mild cough, slight sore throat',
    date: 'Mar 25, 2026',
    time: '09:15 AM',
    rating: 'Low',
    ratingColor: 'text-tertiary bg-tertiary/10',
    analysis: 'Likely a common cold or mild viral infection. Stay hydrated and monitor temperature. Rest is recommended.',
    form: {
      age: 28,
      gender: 'Female',
      duration: '3 days',
      severity: 3,
    },
  },
  {
    id: 3,
    symptoms: 'Chest tightness, shortness of breath',
    date: 'Mar 18, 2026',
    time: '02:40 PM',
    rating: 'Emergency',
    ratingColor: 'text-error bg-error/10',
    analysis: 'Chest tightness combined with shortness of breath requires immediate medical attention. Please call emergency services or go to the nearest emergency room now.',
    form: {
      age: 28,
      gender: 'Female',
      duration: '1 hour',
      severity: 9,
    },
  },
  {
    id: 4,
    symptoms: 'Fatigue, mild joint pain',
    date: 'Mar 10, 2026',
    time: '08:00 AM',
    rating: 'Medium',
    ratingColor: 'text-secondary bg-secondary/10',
    analysis: 'Fatigue and mild joint pain may point to a viral illness or early inflammatory condition. Monitor symptoms and consult a physician if they persist beyond a week.',
    form: {
      age: 28,
      gender: 'Female',
      duration: '5 days',
      severity: 5,
    },
  },
];

const saveAnalyses = (analyses) => {
  localStorage.setItem(ANALYSES_STORAGE_KEY, JSON.stringify(analyses));
};

export const getStoredAnalyses = () => {
  const stored = localStorage.getItem(ANALYSES_STORAGE_KEY);

  if (!stored) {
    saveAnalyses(defaultAnalyses);
    return defaultAnalyses;
  }

  try {
    return JSON.parse(stored);
  } catch {
    saveAnalyses(defaultAnalyses);
    return defaultAnalyses;
  }
};

export const deleteStoredAnalysis = (analysisId) => {
  const nextAnalyses = getStoredAnalyses().filter(({ id }) => id !== analysisId);
  saveAnalyses(nextAnalyses);
  return nextAnalyses;
};
