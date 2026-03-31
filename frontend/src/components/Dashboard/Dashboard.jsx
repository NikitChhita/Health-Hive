import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Sidebar } from './Sidebar';
import { DashboardHeader } from './DashboardHeader';
import { ArrowRight, Activity, MessageSquare, Heart } from 'lucide-react';

const analyses = [
  {
    id: 1,
    symptoms: 'Severe headache, light sensitivity, nausea',
    date: 'Mar 29, 2026',
    time: '11:20 PM',
    rating: 'High',
    ratingColor: 'text-error bg-error/10',
    analysis: 'Symptoms may indicate a severe migraine or potentially more serious neurological condition. Immediate rest in a dark room is advised. If symptoms worsen or include confusion, seek immediate care.',
  },
  {
    id: 2,
    symptoms: 'Mild cough, slight sore throat',
    date: 'Mar 25, 2026',
    time: '09:15 AM',
    rating: 'Low',
    ratingColor: 'text-tertiary bg-tertiary/10',
    analysis: 'Likely a common cold or mild viral infection. Stay hydrated and monitor temperature. Rest is recommended.',
  },
];

export const Dashboard = ({ onSignOut, user }) => {
  const navigate = useNavigate();

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
              <Activity className="w-5 h-5" />
              New Intake
            </button>
          </header>

          <div className="space-y-8">
            <section>
              <h3 className="text-xl font-headline font-extrabold text-on-surface mb-6 flex items-center gap-2">
                <Activity className="text-primary w-5 h-5" />
                Recent Analyses
              </h3>

              <div className="grid gap-6">
                {analyses.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white p-6 md:p-8 rounded-[2rem] ambient-shadow border border-surface-container hover:border-primary/20 transition-all group cursor-pointer"
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
                      <div className="flex items-center gap-2 text-primary font-bold text-sm">
                        View Details <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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
                  <button className="px-6 py-3 bg-white text-primary rounded-xl font-bold text-sm hover:bg-on-primary-container transition-all">
                    Find Nearest Hospital
                  </button>
                </div>
                <Heart className="absolute -right-8 -bottom-8 w-40 h-40 text-white/10 group-hover:scale-110 transition-transform duration-500" />
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};