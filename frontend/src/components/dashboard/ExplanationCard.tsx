import React from 'react';
import { HelpCircle, ArrowUpRight, ArrowDownRight, Cpu } from 'lucide-react';
import { ExplanationData } from '../../types';

interface ExplanationCardProps {
  explanation: ExplanationData;
}

export const ExplanationCard: React.FC<ExplanationCardProps> = ({ explanation }) => {
  const maxImpact = Math.max(...explanation.top_factors.map((f) => f.impact), 1);

  return (
    <div className="glass-card p-6 space-y-5">
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-xl bg-purple-500/10 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>WHY THIS FORECAST?</span>
              <HelpCircle className="w-4 h-4 text-slate-400" />
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              SHAP feature attribution for tomorrow's prediction
            </p>
          </div>
        </div>
        <span className="text-[10px] font-bold px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
          SHAP EXPLAINER v1.0
        </span>
      </div>

      {/* Natural Language Breakdown Box */}
      <div className="p-4 rounded-xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 text-xs leading-relaxed text-slate-700 dark:text-slate-300 font-medium">
        <span className="font-bold text-purple-600 dark:text-purple-400 mr-1">AI Reasoning Summary:</span>
        {explanation.natural_language_explanation}
      </div>

      {/* Feature Contribution Bars */}
      <div className="space-y-3 pt-1">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Top Contributing Features:
        </h4>

        {explanation.top_factors.map((factor, idx) => {
          const pct = Math.min(100, Math.max(10, (factor.impact / maxImpact) * 100));
          const isIncrease = factor.direction === 'increase';

          return (
            <div key={idx} className="space-y-1">
              <div className="flex items-center justify-between text-xs font-semibold">
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-slate-800 dark:text-slate-200">{factor.feature}</span>
                  <span
                    className={`inline-flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      isIncrease
                        ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                        : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                    }`}
                  >
                    {isIncrease ? (
                      <>
                        <ArrowUpRight className="w-3 h-3 mr-0.5" /> Increases AQI
                      </>
                    ) : (
                      <>
                        <ArrowDownRight className="w-3 h-3 mr-0.5" /> Reduces AQI
                      </>
                    )}
                  </span>
                </div>
                <span className="font-mono text-slate-600 dark:text-slate-300">
                  +{factor.impact.toFixed(1)} points
                </span>
              </div>

              {/* Bar */}
              <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isIncrease ? 'bg-gradient-to-r from-amber-500 to-rose-500' : 'bg-gradient-to-r from-teal-400 to-emerald-500'
                  }`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
