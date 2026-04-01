import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Send, Activity, Info } from 'lucide-react';

export const SymptomChecker = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    age: '',
    gender: '',
    symptoms: '',
    duration: '',
    severity: '5',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setTimeout(() => {
      navigate('/dashboard');
    }, 1500);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 bg-surface">
      <div className="max-w-3xl mx-auto">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors mb-8 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl border border-surface-container-high"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
              <Activity className="text-primary w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-headline font-extrabold text-on-surface">Symptom Analysis</h1>
              <p className="text-on-surface-variant text-sm">Provide details for a clear health insight.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="sc-age" className="text-xs font-bold text-on-surface-variant uppercase tracking-wider ml-1">Age</label>
                <input
                  id="sc-age"
                  required
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="e.g. 25"
                  autoComplete="age"
                  className="w-full px-4 py-4 bg-surface-container rounded-2xl text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="sc-gender" className="text-xs font-bold text-on-surface-variant uppercase tracking-wider ml-1">Gender</label>
                <select
                  id="sc-gender"
                  required
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-4 py-4 bg-surface-container rounded-2xl text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all appearance-none"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer-not-to-say">Prefer not to say</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="sc-symptoms" className="text-xs font-bold text-on-surface-variant uppercase tracking-wider ml-1">Primary Symptoms</label>
              <textarea
                id="sc-symptoms"
                required
                name="symptoms"
                value={formData.symptoms}
                onChange={handleChange}
                placeholder="Describe what you're feeling..."
                rows="4"
                className="w-full px-4 py-4 bg-surface-container rounded-2xl text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="sc-duration" className="text-xs font-bold text-on-surface-variant uppercase tracking-wider ml-1">Duration</label>
                <input
                  id="sc-duration"
                  required
                  type="text"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  placeholder="e.g. 3 days"
                  className="w-full px-4 py-4 bg-surface-container rounded-2xl text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="sc-severity" className="text-xs font-bold text-on-surface-variant uppercase tracking-wider ml-1">Severity (1-10)</label>
                <div className="flex items-center gap-4">
                  <input
                    id="sc-severity"
                    type="range"
                    min="1"
                    max="10"
                    name="severity"
                    value={formData.severity}
                    onChange={handleChange}
                    aria-valuemin={1}
                    aria-valuemax={10}
                    aria-valuenow={Number(formData.severity)}
                    className="flex-1 h-2 bg-surface-container rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <span aria-hidden="true" className="text-lg font-bold text-primary w-8 text-center">{formData.severity}</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-surface-container-low rounded-2xl border border-surface-container-high flex gap-3">
              <Info className="w-5 h-5 text-primary shrink-0" />
              <p className="text-xs text-on-surface-variant leading-relaxed">
                This tool is for informational and case study purposes only.
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-5 bg-primary text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-primary-container transition-all shadow-lg group"
            >
              Submit for Analysis
              <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};