import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, AlertTriangle, FlaskConical, UserCheck } from 'lucide-react';

const ITEMS = [
  {
    icon: AlertTriangle,
    title: "Not Medical Advice",
    description: "All AI outputs are experimental. HealthHive is a research tool — never use it as a substitute for professional medical care.",
  },
  {
    icon: FlaskConical,
    title: "Transparent Research",
    description: "We document where the AI performs well and where it falls short. Accuracy metrics will be published after testing.",
  },
  {
    icon: ShieldCheck,
    title: "Privacy First",
    description: "Your symptom data is stored securely with role-based access control. Only you can see your submissions.",
  },
  {
    icon: UserCheck,
    title: "Role-Based Access",
    description: "Separate access levels for patients, providers, and admins ensure data is only seen by the right people.",
  },
];

export const Ethics = () => {
  return (
    <section id="ethics" className="py-24 px-6 md:px-12 bg-surface-container-low">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-headline font-extrabold text-on-surface"
          >
            Ethics & <span className="text-editorial-gradient">Safety.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-on-surface-variant mt-4 max-w-xl mx-auto"
          >
            HealthHive is built with transparency and responsibility at its core.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {ITEMS.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass-panel p-8 rounded-3xl ambient-shadow"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                <item.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-headline font-bold text-on-surface mb-3">{item.title}</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};