import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Sidebar } from './Sidebar';
import { DashboardHeader } from './DashboardHeader';
import { AnalysisSupportActions } from './AnalysisSupportActions';
import { ArrowRight, Activity, Heart, X, User, Clock, Thermometer, Calendar, Trash2 } from 'lucide-react';
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
          aria-labelledby="detail-modal-title"
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
              <h3 id="detail-modal-title" className="mb-3 text-xs font-bold uppercase tracking-wider text-on-surface-variant">
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
                <p className="text-sm italic leading-relaxed text-on-surface-variant">&quot;{item.analysis}&quot;</p>
              </div>
            </div>

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

export const Dashboard = ({ onSignOut, user }) => {
  const navigate = useNavigate();
  const [analyses, setAnalyses] = useState([]);
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);
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

      if (selectedAnalysis?._id === analysisId) {
        setSelectedAnalysis(null);
      }
    } catch (err) {
      setError(err.message || 'Failed to delete analysis');
    }
  };

  return (
    <div className="flex min-h-screen bg-surface">
      <Sidebar onSignOut={onSignOut} onNewIntakeClick={() => navigate('/symptom-checker')} />

      <main className="flex-1 min-w-0 flex flex-col">
        <DashboardHeader user={user} onSignOut={onSignOut} />

        <div className="mx-auto w-full max-w-5xl p-6 md:p-8">
          <header className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h1 className="text-3xl font-headline font-extrabold text-on-surface">Health Dashboard</h1>
              <p className="mt-1 text-on-surface-variant">
                Welcome back, {user?.name?.split(' ')[0] || 'there'} — track and manage your symptom analyses.
              </p>
            </div>
            <button
              onClick={() => navigate('/symptom-checker')}
              className="flex items-center gap-2 rounded-2xl bg-primary px-6 py-3 font-bold text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary-container"
            >
              <Activity className="w-5 h-5" aria-hidden="true" />
              New Intake
            </button>
          </header>

          <div className="space-y-8">
            <section>
              <h3 className="mb-6 flex items-center gap-2 text-xl font-headline font-extrabold text-on-surface">
                <Activity className="w-5 h-5 text-primary" aria-hidden="true" />
                All Analyses
              </h3>

              {error && (
                <div className="mb-4 rounded-2xl border border-error/20 bg-error/5 px-4 py-3 text-sm text-error">
                  {error}
                </div>
              )}

              {loading ? (
                <p className="text-sm text-on-surface-variant">Loading analyses...</p>
              ) : analyses.length === 0 ? (
                <div className="rounded-[2rem] border border-dashed border-surface-container-high bg-white p-10 text-center">
                  <p className="text-sm font-bold text-on-surface">No symptom checks yet.</p>
                  <p className="mt-2 text-sm text-on-surface-variant">
                    Start a new intake to generate your first analysis.
                  </p>
                </div>
              ) : (
                <div className="grid gap-6">
                  {analyses.map((item) => {
                    const { date, time } = formatDate(item.createdAt);
                    const symptoms = formatSymptoms(item);

                    return (
                      <motion.div
                        key={item._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="group cursor-pointer rounded-[2rem] border border-surface-container bg-white p-6 ambient-shadow transition-all hover:border-primary/20 md:p-8"
                        onClick={() => setSelectedAnalysis(item)}
                      >
                        <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-start">
                          <div className="flex-1">
                            <div className="mb-2 flex items-center gap-3">
                              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${ratingStyles[item.rating] || ratingStyles.Low}`}>
                                {item.rating} Priority
                              </span>
                              <span className="text-xs font-medium text-on-surface-variant">
                                {date} at {time}
                              </span>
                            </div>
                            <h4 className="text-lg font-bold leading-tight text-on-surface transition-colors group-hover:text-primary">
                              {symptoms}
                            </h4>
                          </div>
                          <div className="flex items-center gap-3 shrink-0">
                            <button
                              type="button"
                              onClick={(event) => {
                                event.stopPropagation();
                                handleDelete(item._id);
                              }}
                              className="inline-flex items-center gap-2 rounded-xl border border-error/15 px-3 py-2 text-sm font-bold text-error transition-colors hover:bg-error/5"
                              aria-label={`Delete symptom check for ${symptoms}`}
                            >
                              <Trash2 className="w-4 h-4" aria-hidden="true" />
                              Delete
                            </button>
                            <div className="flex items-center gap-2 text-sm font-bold text-primary">
                              View Details
                              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                            </div>
                          </div>
                        </div>

                        <div className="rounded-2xl border border-surface-container-high bg-surface-container p-4">
                          <p className="text-sm italic leading-relaxed text-on-surface-variant">
                            &quot;{item.analysis}&quot;
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </section>

            <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="group relative overflow-hidden rounded-[2rem] bg-primary p-8 text-white shadow-xl shadow-primary/20">
                <div className="relative z-10">
                  <h3 className="mb-2 text-xl font-headline font-extrabold">Emergency Support</h3>
                  <p className="mb-6 text-sm leading-relaxed text-on-primary-container">
                    If you are experiencing a life-threatening emergency, please call emergency services immediately.
                  </p>
                  <a
                    href="https://www.google.com/maps/search/hospitals+near+me"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block rounded-xl bg-white px-6 py-3 text-sm font-bold text-primary transition-all hover:bg-on-primary-container"
                  >
                    Find Nearest Hospital
                  </a>
                </div>
                <Heart className="absolute -bottom-8 -right-8 w-40 h-40 text-white/10 transition-transform duration-500 group-hover:scale-110" aria-hidden="true" />
              </div>
            </section>
          </div>
        </div>
      </main>

      <AnalysisModal item={selectedAnalysis} onClose={() => setSelectedAnalysis(null)} />
    </div>
  );
};
