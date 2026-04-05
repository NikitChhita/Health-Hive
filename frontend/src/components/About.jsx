import React from 'react';
import { motion } from 'motion/react';
import { GitBranch, Users, Target } from 'lucide-react';

export const About = () => {
  return (
    <section id="about" className="py-24 px-6 md:px-12 bg-surface">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left — text */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block text-xs font-bold uppercase tracking-wider text-primary mb-4">
              About HealthHive
            </span>
            <h2 className="text-4xl md:text-5xl font-headline font-extrabold text-on-surface leading-tight mb-6">
              Built to explore what AI <br />
              <span className="text-editorial-gradient">can — and can't — do.</span>
            </h2>
            <p className="text-on-surface-variant leading-relaxed mb-6">
              HealthHive is a full-stack research project investigating whether large language models can
              reliably classify symptom urgency. It is not a medical product — it is an honest experiment
              with transparent goals and documented limitations.
            </p>
            <p className="text-on-surface-variant leading-relaxed">
              The platform is built on the MERN stack with JWT authentication, role-based access control,
              and a clean data pipeline from symptom submission to AI analysis. All outputs are logged for
              accuracy evaluation and will be published once testing is complete.
            </p>
          </motion.div>

          {/* Right — stat cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-4">
            {[
              {
                icon: Target,
                label: 'Research Goal',
                value: 'Measure AI urgency classification accuracy across real symptom inputs.',
              },
              {
                icon: GitBranch,
                label: 'Tech Stack',
                value: 'MongoDB · Express · React · Node.js · Claude AI · JWT Auth',
              },
              {
                icon: Users,
                label: 'Who It\'s For',
                value: 'Researchers, developers, and healthcare professionals curious about AI limitations.',
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-4 p-6 bg-surface-container-lowest rounded-3xl border border-surface-container ambient-shadow"
              >
                <div className="w-10 h-10 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0">
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1">{item.label}</p>
                  <p className="text-sm text-on-surface leading-relaxed">{item.value}</p>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};
