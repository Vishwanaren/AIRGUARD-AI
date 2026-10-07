import React from 'react';
import { HeartPulse, AlertCircle, CheckCircle2, UserCheck } from 'lucide-react';
import { HealthAdvisory } from '../../types';

interface HealthAdvisoryCardProps {
  advisory: HealthAdvisory;
  category: string;
}

export const HealthAdvisoryCard: React.FC<HealthAdvisoryCardProps> = ({ advisory, category }) => {
  return (
    <div className="glass-card p-6 space-y-4 border-l-4" style={{ borderColor: advisory.color_hex }}>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200">
            <HeartPulse className="w-5 h-5 text-rose-500" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <span>HEALTH ADVISORY & GUIDANCE</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Factual health recommendations based on standard AQI thresholds ({category})
            </p>
          </div>
        </div>

        {advisory.mask_required && (
          <span className="px-3 py-1 rounded-full text-xs font-black bg-rose-500 text-white flex items-center gap-1 shadow-sm">
            <AlertCircle className="w-3.5 h-3.5" /> Mask Recommended
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        
        {/* General Population */}
        <div className="p-3.5 rounded-xl bg-slate-100/70 dark:bg-slate-900/70 border border-slate-200/60 dark:border-slate-800 space-y-1">
          <div className="flex items-center space-x-1.5 font-bold text-slate-800 dark:text-slate-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>General Public</span>
          </div>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            {advisory.general_recommendation}
          </p>
        </div>

        {/* Sensitive Groups */}
        <div className="p-3.5 rounded-xl bg-slate-100/70 dark:bg-slate-900/70 border border-slate-200/60 dark:border-slate-800 space-y-1">
          <div className="flex items-center space-x-1.5 font-bold text-slate-800 dark:text-slate-200">
            <UserCheck className="w-4 h-4 text-amber-500" />
            <span>Sensitive Groups (Children, Elderly, Asthma)</span>
          </div>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            {advisory.sensitive_groups}
          </p>
        </div>

      </div>

    </div>
  );
};
