import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { DashboardHeader } from './DashboardHeader';
import { AnalysisSupportActions } from './AnalysisSupportActions';
import { History, X, User, Clock, Thermometer, Calendar, Trash2 } from 'lucide-react';
import { getStoredToken } from '../../utils/authStorage';
import { API_BASE_URL } from '../../utils/api';

const ratingStyles = {
  Low: 'text-tertiary bg-tertiary/10',
  Moderate: 'text-secondary bg-secondary/10',
  Medium: 'text-secondary bg-secondary/10',
  High: 'text-error bg-error/10',
  Emergency: 'text-error bg-error/10',
};

const formatDate = (dateStr) => {
  const date = new Date(dateStr);

  return {
    date: date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }),
    time: date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    }),
  };
};

const formatSymptoms = (analysis) =>
  analysis.symptoms?.map((symptom) => symptom.name).join(', ') || '—';

const formatUrgencyLabel = (analysis) => {
  if (analysis.headline) return analysis.headline;
  if (typeof analysis.urgencyScore === 'number') return `Urgency Score ${analysis.urgencyScore}/10`;
  return null;
};

const AnalysisModal = ({ item, onClose }) => {
  if (!item) return null;

  const { date, time } = formatDate(item.createdAt);

  return (
    <AnimatePresence>
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
          className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-[2rem] bg-white shadow-2xl"
        >
          <div className="flex items-center justify-between border-b border-surface-container p-6">
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${ratingStyles[item.rating] || ratingStyles.Low}`}>
                {item.rating} Priority
              </span>
              <span className="text-xs text-on-surface-variant">{date} at {time}</span>
            </div>
            <button
              aria-label="Close"
              onClick={onClose}
              className="rounded-full p-2 text-on-surface-variant transition-colors hover:bg-surface-container"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>

          <div className="space-y-6 p-6">
            <div>
              <h3 id="history-modal-title" className="mb-3 text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                Submitted Information
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-3 rounded-2xl bg-surface-container-low p-3">
                  <User className="w-4 h-4 shrink-0 text-primary" aria-hidden="true" />
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-on-surface-variant">Age Range</p>
                    <p className="text-sm font-bold text-on-surface">{item.context?.ageRange || '—'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-2xl bg-surface-container-low p-3">
                  <User className="w-4 h-4 shrink-0 text-primary" aria-hidden="true" />
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-on-surface-variant">Sex</p>
                    <p className="text-sm font-bold text-on-surface">{item.context?.sex || '—'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-2xl bg-surface-container-low p-3">
                  <Thermometer className="w-4 h-4 shrink-0 text-primary" aria-hidden="true" />
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-on-surface-variant">Medications</p>
                    <p className="text-sm font-bold text-on-surface">{item.context?.medications || 'None'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-2xl bg-surface-container-low p-3">
                  <Clock className="w-4 h-4 shrink-0 text-primary" aria-hidden="true" />
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-on-surface-variant">Allergies</p>
                    <p className="text-sm font-bold text-on-surface">{item.context?.allergies || 'None'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-on-surface-variant">Symptoms Reported</h3>
              <p className="rounded-2xl bg-surface-container-low p-4 text-sm leading-relaxed text-on-surface">
                {formatSymptoms(item)}
              </p>
            </div>

            <div>
              <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-on-surface-variant">AI Analysis</h3>
              <div className="rounded-2xl border border-surface-container-high bg-surface-container p-4">
                {formatUrgencyLabel(item) && (
                  <p className="mb-2 text-xs font-bold uppercase tracking-wider text-primary">
                    {formatUrgencyLabel(item)}
                  </p>
                )}
                <p className="text-sm italic leading-relaxed text-on-surface-variant">&quot;{item.analysis}&quot;</p>
              </div>
            </div>

            {Array.isArray(item.warningSymptoms) && item.warningSymptoms.length > 0 && (
              <div>
                <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-on-surface-variant">Flagged Symptoms</h3>
                <div className="flex flex-wrap gap-2">
                  {item.warningSymptoms.map((symptom) => (
                    <span
                      key={symptom}
                      className={`rounded-full px-3 py-1.5 text-xs font-bold ${ratingStyles[item.rating] || ratingStyles.Low}`}
                    >
                      {symptom}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <AnalysisSupportActions rating={item.rating} />

            <div className="flex items-center gap-2 text-xs text-on-surface-variant">
              <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
              Submitted on {date} at {time}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export const AnalysisHistory = ({ onSignOut, user }) => {
  const navigate = useNavigate();
  const [analyses, setAnalyses] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let ignore = false;

    const fetchAnalyses = async () => {
      const token = getStoredToken();

      if (!token) {
        if (!ignore) {
          setAnalyses([]);
          setLoading(false);
        }
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/analyze`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || data.message || 'Failed to load analyses');
        }

        if (!ignore) {
          setAnalyses(data.analyses || []);
        }
      } catch (err) {
        if (!ignore) {
          setError(err.message || 'Failed to load analyses');
          setAnalyses([]);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    fetchAnalyses();

    return () => {
      ignore = true;
    };
  }, []);

  const handleDelete = async (analysisId) => {
    if (!window.confirm('Delete this symptom check?')) return;

    const token = getStoredToken();

    if (!token) {
      setError('You must be signed in to delete an analysis.');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/analyze/${analysisId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Failed to delete analysis');
      }

      setAnalyses((current) => current.filter((analysis) => analysis._id !== analysisId));

      if (selected?._id === analysisId) {
        setSelected(null);
      }
    } catch (err) {
      setError(err.message || 'Failed to delete analysis');
    }
  };

  return (
    <div className="flex min-h-screen bg-surface">
      <Sidebar onSignOut={onSignOut} onNewIntakeClick={() => navigate('/symptom-checker')} activePage="history" />

      <main className="flex-1 min-w-0 flex flex-col">
        <DashboardHeader user={user} onSignOut={onSignOut} />

        <div className="mx-auto w-full max-w-5xl p-6 md:p-8">
          <header className="mb-10">
            <h1 className="flex items-center gap-3 text-3xl font-headline font-extrabold text-on-surface">
              <History className="w-7 h-7 text-primary" aria-hidden="true" />
              Analysis History
            </h1>
            <p className="mt-1 text-on-surface-variant">All your past symptom submissions and AI results.</p>
          </header>

          {error && (
            <div className="mb-4 rounded-2xl border border-error/20 bg-error/5 px-4 py-3 text-sm text-error">
              {error}
            </div>
          )}

          {loading ? (
            <p className="text-sm text-on-surface-variant">Loading analyses...</p>
          ) : analyses.length === 0 ? (
            <div className="rounded-[2rem] border border-dashed border-surface-container-high bg-white p-10 text-center">
              <p className="text-sm font-bold text-on-surface">No symptom checks in your history.</p>
              <p className="mt-2 text-sm text-on-surface-variant">
                New analyses will appear here after you submit them.
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {analyses.map((item, index) => {
                const { date, time } = formatDate(item.createdAt);
                const symptoms = formatSymptoms(item);

                return (
                  <motion.div
                    key={item._id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.07 }}
                    onClick={() => setSelected(item)}
                    className="group flex cursor-pointer flex-col justify-between gap-4 rounded-2xl border border-surface-container bg-white p-5 ambient-shadow transition-all hover:border-primary/20 sm:flex-row sm:items-center md:p-6"
                  >
                    <div className="flex min-w-0 flex-1 items-start gap-4">
                      <span className={`mt-0.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shrink-0 ${ratingStyles[item.rating] || ratingStyles.Low}`}>
                        {item.rating}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-on-surface transition-colors group-hover:text-primary">
                          {symptoms}
                        </p>
                        <p className="mt-0.5 text-xs text-on-surface-variant">{date} at {time}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          handleDelete(item._id);
                        }}
                        className="rounded-full p-2 text-error transition-colors hover:bg-error/5"
                        aria-label={`Delete symptom check for ${symptoms}`}
                      >
                        <Trash2 className="w-4 h-4" aria-hidden="true" />
                        
                      </button>
                      <span className="text-xs font-bold text-primary">View Details →</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <AnalysisModal item={selected} onClose={() => setSelected(null)} />
    </div>
  );
};
