import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Sidebar } from './Sidebar';
import { DashboardHeader } from './DashboardHeader';
import { ArrowRight, Activity, Heart, X, User, Clock, Thermometer, Calendar } from 'lucide-react';

const analyses = [
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
];

const AnalysisModal = ({ item, onClose }) => (
  <AnimatePresence>
    {item && (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-on-surface/20 backdrop-blur-sm"
          aria-hidden="true"
        />
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="detail-modal-title"
          initial={{ opacity: 0, y: 16, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.97 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-lg bg-white rounded-[2rem] shadow-2xl overflow-y-auto max-h-[90vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-surface-container">
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${item.ratingColor}`}>
                {item.rating} Priority
              </span>
              <span className="text-xs text-on-surface-variant">{item.date} at {item.time}</span>
            </div>
            <button
              aria-label="Close"
              onClick={onClose}
              className="p-2 text-on-surface-variant hover:bg-surface-container rounded-full transition-colors"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Submitted form fields */}
            <div>
              <h3 id="detail-modal-title" className="text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-3">Submitted Information</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-3 p-3 bg-surface-container-low rounded-2xl">
                  <User className="w-4 h-4 text-primary shrink-0" aria-hidden="true" />
                  <div>
                    <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">Age</p>
                    <p className="text-sm font-bold text-on-surface">{item.form.age}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-surface-container-low rounded-2xl">
                  <User className="w-4 h-4 text-primary shrink-0" aria-hidden="true" />
                  <div>
                    <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">Gender</p>
                    <p className="text-sm font-bold text-on-surface">{item.form.gender}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-surface-container-low rounded-2xl">
                  <Clock className="w-4 h-4 text-primary shrink-0" aria-hidden="true" />
                  <div>
                    <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">Duration</p>
                    <p className="text-sm font-bold text-on-surface">{item.form.duration}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-surface-container-low rounded-2xl">
                  <Thermometer className="w-4 h-4 text-primary shrink-0" aria-hidden="true" />
                  <div>
                    <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">Severity</p>
                    <p className="text-sm font-bold text-on-surface">{item.form.severity} / 10</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Symptoms */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">Symptoms Reported</h3>
              <p className="text-sm text-on-surface leading-relaxed bg-surface-container-low p-4 rounded-2xl">{item.symptoms}</p>
            </div>

            {/* AI Analysis */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">AI Analysis</h3>
              <div className="p-4 bg-surface-container rounded-2xl border border-surface-container-high">
                <p className="text-sm text-on-surface-variant leading-relaxed italic">&quot;{item.analysis}&quot;</p>
              </div>
            </div>

            {/* Date */}
            <div className="flex items-center gap-2 text-xs text-on-surface-variant">
              <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
              Submitted on {item.date} at {item.time}
            </div>
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

export const Dashboard = ({ onSignOut, user }) => {
  const navigate = useNavigate();
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);

  return (
    <div className="flex min-h-screen bg-surface">
      <Sidebar onSignOut={onSignOut} onNewIntakeClick={() => navigate('/symptom-checker')} />

      <main className="flex-1 flex flex-col min-w-0">
        <DashboardHeader user={user} onSignOut={onSignOut} />

        <div className="p-6 md:p-8 max-w-5xl mx-auto w-full">
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
            <div>
              <h1 className="text-3xl font-headline font-extrabold text-on-surface">
                Health Dashboard
              </h1>
              <p className="text-on-surface-variant mt-1">
                Welcome back, {user?.name?.split(' ')[0] || 'there'} — track and manage your symptom analyses.
              </p>
            </div>
            <button
              onClick={() => navigate('/symptom-checker')}
              className="px-6 py-3 bg-primary text-white rounded-2xl font-bold flex items-center gap-2 hover:bg-primary-container transition-all shadow-lg shadow-primary/20"
            >
              <Activity className="w-5 h-5" aria-hidden="true" />
              New Intake
            </button>
          </header>

          <div className="space-y-8">
            <section>
              <h3 className="text-xl font-headline font-extrabold text-on-surface mb-6 flex items-center gap-2">
                <Activity className="text-primary w-5 h-5" aria-hidden="true" />
                Recent Analyses
              </h3>

              <div className="grid gap-6">
                {analyses.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white p-6 md:p-8 rounded-[2rem] ambient-shadow border border-surface-container hover:border-primary/20 transition-all group cursor-pointer"
                    onClick={() => setSelectedAnalysis(item)}
                  >
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${item.ratingColor}`}>
                            {item.rating} Priority
                          </span>
                          <span className="text-xs text-on-surface-variant font-medium">
                            {item.date} at {item.time}
                          </span>
                        </div>
                        <h4 className="text-lg font-bold text-on-surface leading-tight group-hover:text-primary transition-colors">
                          {item.symptoms}
                        </h4>
                      </div>
                      <div className="flex items-center gap-2 text-primary font-bold text-sm shrink-0">
                        View Details <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                      </div>
                    </div>

                    <div className="p-4 bg-surface-container rounded-2xl border border-surface-container-high">
                      <p className="text-sm text-on-surface-variant leading-relaxed italic">
                        &quot;{item.analysis}&quot;
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-primary text-white p-8 rounded-[2rem] shadow-xl shadow-primary/20 relative overflow-hidden group">
                <div className="relative z-10">
                  <h3 className="text-xl font-headline font-extrabold mb-2">Emergency Support</h3>
                  <p className="text-on-primary-container text-sm leading-relaxed mb-6">
                    If you are experiencing a life-threatening emergency, please call emergency services immediately.
                  </p>
                  <a
                    href="https://www.google.com/maps/search/hospitals+near+me"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-6 py-3 bg-white text-primary rounded-xl font-bold text-sm hover:bg-on-primary-container transition-all"
                  >
                    Find Nearest Hospital
                  </a>
                </div>
                <Heart className="absolute -right-8 -bottom-8 w-40 h-40 text-white/10 group-hover:scale-110 transition-transform duration-500" aria-hidden="true" />
              </div>
            </section>
          </div>
        </div>
      </main>

      <AnalysisModal item={selectedAnalysis} onClose={() => setSelectedAnalysis(null)} />
    </div>
  );
};
