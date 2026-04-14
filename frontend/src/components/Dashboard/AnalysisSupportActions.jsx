import React from 'react';
import { ExternalLink, Siren, ShieldPlus } from 'lucide-react';

const supportConfig = {
  Emergency: {
    href: 'https://www.google.com/maps/search/emergency+room+near+me',
    label: 'Get Help',
    description: 'Find the nearest emergency room now.',
    icon: Siren,
    className: 'bg-error text-white hover:bg-error/90',
  },
  High: {
    href: 'https://www.google.com/maps/search/urgent+care+near+me',
    label: 'Get Help',
    description: 'Find urgent care near you for faster evaluation.',
    icon: ShieldPlus,
    className: 'bg-primary text-white hover:bg-primary-container',
  },
  Medium: {
    href: 'https://www.google.com/maps/search/urgent+care+near+me',
    label: 'Get Help',
    description: 'Locate urgent care if symptoms continue or worsen.',
    icon: ShieldPlus,
    className: 'bg-primary text-white hover:bg-primary-container',
  },
  Low: {
    href: 'https://www.google.com/maps/search/primary+care+near+me',
    label: 'Get Help',
    description: 'Find a nearby clinic or primary care provider.',
    icon: ShieldPlus,
    className: 'bg-primary text-white hover:bg-primary-container',
  },
};

const defaultConfig = {
  href: 'https://www.google.com/maps/search/medical+care+near+me',
  label: 'Get Help',
  description: 'Find nearby medical care.',
  icon: ShieldPlus,
  className: 'bg-primary text-white hover:bg-primary-container',
};

export const AnalysisSupportActions = ({ rating }) => {
  const config = supportConfig[rating] || defaultConfig;
  const Icon = config.icon;

  return (
    <div className="rounded-2xl border border-surface-container-high bg-surface-container-low p-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-bold text-on-surface">Need follow-up care?</p>
          <p className="text-xs leading-relaxed text-on-surface-variant">{config.description}</p>
        </div>
        <a
          href={config.href}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition-colors ${config.className}`}
        >
          <Icon className="h-4 w-4" aria-hidden="true" />
          {config.label}
          <ExternalLink className="h-4 w-4" aria-hidden="true" />
        </a>
      </div>
    </div>
  );
};
