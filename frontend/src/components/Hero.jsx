import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, ShieldCheck, FlaskConical } from 'lucide-react';

export const Hero = ({ onStartClick }) => {
  return (
    <section className="relative pt-32 pb-16 px-6 md:pt-48 md:pb-24 overflow-hidden">
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[400px] h-[400px] bg-tertiary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-low text-primary text-xs font-bold uppercase tracking-wider mb-6"
        >
          <FlaskConical className="w-3.5 h-3.5" />
          Proof of Concept — Not Medical Advice
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-7xl font-headline font-extrabold tracking-tight text-on-surface leading-[1.1] mb-6"
        >
          AI Symptom Triage, <br />
          <span className="text-editorial-gradient">Explored.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-on-surface-variant leading-relaxed max-w-2xl mx-auto mb-10"
        >
          HealthHive is a research platform testing whether AI can consistently classify symptom urgency — Emergency, High, Medium, or Low — and direct users to appropriate resources. All outputs are experimental.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button
            onClick={onStartClick}
            className="w-full sm:w-auto px-8 py-4 bg-primary text-white rounded-full font-bold text-lg flex items-center justify-center gap-2 hover:bg-primary-container transition-all ambient-shadow group"
          >
            Try the Intake Form
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="mt-12 flex items-center justify-center gap-8"
        >
          <div className="flex items-center gap-2">
            <ShieldCheck className="text-tertiary w-5 h-5" />
            <span className="text-sm font-medium text-on-surface-variant">JWT Auth & Encrypted Data</span>
          </div>
          <div className="flex items-center gap-2">
            <FlaskConical className="text-primary w-5 h-5" />
            <span className="text-sm font-medium text-on-surface-variant">Research Purpose Only</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};