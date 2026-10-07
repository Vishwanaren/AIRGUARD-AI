import React from 'react';
import { Wind, ShieldCheck, Database, Cpu, Lock, BookOpen } from 'lucide-react';

export const AboutView: React.FC = () => {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Hero Header */}
      <div className="glass-card p-8 bg-gradient-to-br from-emerald-500/10 via-slate-900/40 to-cyan-500/10 border border-emerald-500/30 text-center space-y-3">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center text-white mx-auto shadow-lg shadow-emerald-500/20">
          <Wind className="w-10 h-10 animate-pulse" />
        </div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">AIRGUARD AI</h1>
        <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
          Next-Day Air Quality Forecasting & Health Intelligence for Indian Cities
        </p>
      </div>

      {/* Grid Documentation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Core Task */}
        <div className="glass-card p-6 space-y-3">
          <div className="flex items-center space-x-2 text-emerald-500 font-bold text-sm">
            <Cpu className="w-5 h-5" />
            <span>Project Objective & Machine Learning Tasks</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            The core objective is to forecast <strong>TOMORROW'S AQI</strong> ($t+1$) using historical daily pollutant measurements through day $t$.
          </p>
          <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1.5 list-disc list-inside">
            <li><strong>Regression Task:</strong> Predict tomorrow's numerical AQI value.</li>
            <li><strong>Classification Task:</strong> Predict tomorrow's official CPCB AQI Category (Good, Satisfactory, Moderate, Poor, Very Poor, Severe).</li>
          </ul>
        </div>

        {/* Data Leakage Prevention */}
        <div className="glass-card p-6 space-y-3 border-l-4 border-rose-500">
          <div className="flex items-center space-x-2 text-rose-500 font-bold text-sm">
            <Lock className="w-5 h-5" />
            <span>Strict Data Leakage Prevention</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Our pipeline strictly avoids data leakage:
          </p>
          <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900 text-xs font-mono font-bold text-slate-800 dark:text-slate-200">
            Historical Observations ($t, t-1, ...$) + Lags/Rolling/Calendar Features $\rightarrow$ AQI ($t+1$)
          </div>
          <p className="text-xs text-slate-500">
            Same-day target reconstructing signals are strictly prohibited in all feature transformations.
          </p>
        </div>

        {/* Time-Based Split */}
        <div className="glass-card p-6 space-y-3">
          <div className="flex items-center space-x-2 text-cyan-500 font-bold text-sm">
            <ShieldCheck className="w-5 h-5" />
            <span>Time-Based Validation Strategy</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Random k-fold splitting causes target leakage in time-series forecasting. We strictly enforce time-based splitting:
          </p>
          <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1 font-mono">
            <li>• Training Set: 2015 – 2018</li>
            <li>• Validation Set: 2019 (Used for dynamic model selection)</li>
            <li>• Test Set: 2020 (Used for final evaluation)</li>
          </ul>
        </div>

        {/* Dataset */}
        <div className="glass-card p-6 space-y-3">
          <div className="flex items-center space-x-2 text-purple-500 font-bold text-sm">
            <Database className="w-5 h-5" />
            <span>Dataset & Pollutants</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Air Quality Data in India (2015–2020) containing daily city observations for PM2.5, PM10, NO2, SO2, CO, O3, NO, NOx, NH3, Benzene, Toluene, and Xylene.
          </p>
          <p className="text-xs text-slate-500">
            Includes CPCB sub-index formulas, outlier handling, and time-aware linear interpolation.
          </p>
        </div>

      </div>

      {/* SHAP & Explainability */}
      <div className="glass-card p-6 space-y-3">
        <div className="flex items-center space-x-2 text-amber-500 font-bold text-sm">
          <BookOpen className="w-5 h-5" />
          <span>Explainability & Model Transparency</span>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          AIRGUARD AI incorporates SHAP (SHapley Additive exPlanations) to decompose every individual prediction into feature attribution values. This ensures complete transparency regarding why a specific forecast was generated without black-box opacity.
        </p>
      </div>

    </div>
  );
};
