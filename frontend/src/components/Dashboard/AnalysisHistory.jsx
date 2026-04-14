import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { DashboardHeader } from './DashboardHeader';
import { AnalysisSupportActions } from './AnalysisSupportActions';
import { History, X, User, Clock, Thermometer, Calendar, Trash2 } from 'lucide-react';
import { deleteStoredAnalysis, getStoredAnalyses } from '../../utils/analysisStorage';

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
          aria-labelledby="history-modal-title"
          initial={{ opacity: 0, y: 16, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.97 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-lg bg-white rounded-[2rem] shadow-2xl overflow-y-auto max-h-[90vh]"
        >
          <div className="flex items-center justify-between p-6 border-b border-surface-container">
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${item.ratingColor}`}>
                {item.rating} Priority
              </span>
              <span className="text-xs text-on-surface-variant">{item.date} at {item.time}</span>
            </div>
            <button aria-label="Close" onClick={onClose} className="p-2 text-on-surface-variant hover:bg-surface-container rounded-full transition-colors">
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            <div>
              <h3 id="history-modal-title" className="text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-3">Submitted Information</h3>
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

            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">Symptoms Reported</h3>
              <p className="text-sm text-on-surface leading-relaxed bg-surface-container-low p-4 rounded-2xl">{item.symptoms}</p>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">AI Analysis</h3>
              <div className="p-4 bg-surface-container rounded-2xl border border-surface-container-high">
                <p className="text-sm text-on-surface-variant leading-relaxed italic">&quot;{item.analysis}&quot;</p>
              </div>
            </div>

            <AnalysisSupportActions rating={item.rating} />

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

export const AnalysisHistory = ({ onSignOut, user }) => {
  const navigate = useNavigate();
  const [analyses, setAnalyses] = useState(() => getStoredAnalyses());
  const [selected, setSelected] = useState(null);

  const handleDelete = (analysisId) => {
    if (!window.confirm('Delete this symptom check?')) return;

    setAnalyses(deleteStoredAnalysis(analysisId));

    if (selected?.id === analysisId) {
      setSelected(null);
    }
  };

  return (
    <div className="flex min-h-screen bg-surface">
      <Sidebar onSignOut={onSignOut} onNewIntakeClick={() => navigate('/symptom-checker')} activePage="history" />

      <main className="flex-1 flex flex-col min-w-0">
        <DashboardHeader user={user} onSignOut={onSignOut} />

        <div className="p-6 md:p-8 max-w-5xl mx-auto w-full">
          <header className="mb-10">
            <h1 className="text-3xl font-headline font-extrabold text-on-surface flex items-center gap-3">
              <History className="text-primary w-7 h-7" aria-hidden="true" />
              Analysis History
            </h1>
            <p className="text-on-surface-variant mt-1">All your past symptom submissions and AI results.</p>
          </header>

          <div className="grid gap-4">
            {analyses.length === 0 ? (
              <div className="rounded-[2rem] border border-dashed border-surface-container-high bg-white p-10 text-center">
                <p className="text-sm font-bold text-on-surface">No symptom checks in your history.</p>
                <p className="mt-2 text-sm text-on-surface-variant">New analyses will appear here after you submit them.</p>
              </div>
            ) : analyses.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.07 }}
                onClick={() => setSelected(item)}
                className="bg-white p-5 md:p-6 rounded-2xl ambient-shadow border border-surface-container hover:border-primary/20 transition-all group cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <span className={`mt-0.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shrink-0 ${item.ratingColor}`}>
                    {item.rating}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-on-surface group-hover:text-primary transition-colors truncate">{item.symptoms}</p>
                    <p className="text-xs text-on-surface-variant mt-0.5">{item.date} at {item.time}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(item.id);
                    }}
                    className="inline-flex items-center gap-2 rounded-xl border border-error/15 px-3 py-2 text-sm font-bold text-error hover:bg-error/5 transition-colors"
                    aria-label={`Delete symptom check for ${item.symptoms}`}
                  >
                    <Trash2 className="w-4 h-4" aria-hidden="true" />
                    Delete
                  </button>
                  <span className="text-xs font-bold text-primary">View Details →</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      <AnalysisModal item={selected} onClose={() => setSelected(null)} />
    </div>
  );
};
