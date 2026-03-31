import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, FlaskConical } from 'lucide-react';

export const CTA = ({ onStartClick }) => {
  return (
    <section className="py-24 px-6 md:px-12 bg-surface">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="cta-gradient p-12 md:p-24 rounded-[3rem] text-center relative overflow-hidden ambient-shadow"
        >
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

          <div className="relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider mb-8"
            >
              <FlaskConical className="w-3.5 h-3.5" />
              Research Platform
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl font-headline font-extrabold text-white leading-tight mb-8"
            >
              Try the AI Symptom <br />
              Intake Today.
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-lg text-white/80 leading-relaxed max-w-2xl mx-auto mb-12"
            >
              Submit your symptoms, get an AI-generated urgency classification, and help us evaluate whether this approach is feasible in real-world healthcare settings.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <button
                onClick={onStartClick}
                className="px-10 py-5 bg-white text-primary rounded-full font-bold text-xl flex items-center justify-center gap-2 hover:bg-surface-container transition-all ambient-shadow group mx-auto"
              >
                Start Intake Form
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};