import React from 'react';
import { TrendingUp, TrendingDown, Minus, ShieldAlert, Sparkles, Calendar } from 'lucide-react';
import { ForecastData } from '../../types';
import { AqiBadge } from '../common/AqiBadge';

interface AqiHeroCardProps {
  data: ForecastData;
}

export const AqiHeroCard: React.FC<AqiHeroCardProps> = ({ data }) => {
  const isIncrease = data.change_direction === 'increase';
  const isDecrease = data.change_direction === 'decrease';

  return (
    <div className="glass-card p-6 md:p-8 bg-white dark:bg-slate-900 border border-stone-200/90 dark:border-slate-800 rounded-3xl shadow-sm">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        
        {/* Left Column: Forecast Title & Humanized AQI Value */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-xs font-bold tracking-wide text-emerald-700 dark:text-emerald-400">
            <Sparkles className="w-4 h-4 text-emerald-500" />
            <span>Tomorrow's Expected Air Quality ({data.forecast_date})</span>
          </div>

          <div className="flex items-baseline space-x-4">
            <span className="text-6xl md:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {Math.round(data.predicted_aqi)}
            </span>
            <div className="flex flex-col space-y-1">
              <AqiBadge category={data.predicted_category} size="lg" />
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Numerical Index: {data.predicted_aqi}
              </span>
            </div>
          </div>

          {/* Change from today indicator & Live Station badge */}
          <div className="flex flex-wrap items-center gap-3 text-sm font-semibold">
            <div
              className={`flex items-center space-x-1 px-3 py-1 rounded-xl text-xs font-semibold ${
                isIncrease
                  ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300'
                  : isDecrease
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                  : 'bg-stone-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
              }`}
            >
              {isIncrease && <TrendingUp className="w-3.5 h-3.5" />}
              {isDecrease && <TrendingDown className="w-3.5 h-3.5" />}
              {!isIncrease && !isDecrease && <Minus className="w-3.5 h-3.5" />}
              <span>
                {data.aqi_change > 0 ? `+${data.aqi_change}` : data.aqi_change} AQI vs Live Today ({data.current_aqi})
              </span>
            </div>

            <div className="flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Current AQI: {data.current_aqi}</span>
            </div>

            <div className="text-xs text-slate-500 dark:text-slate-400">
              Primary Pollutant: <span className="font-bold text-slate-800 dark:text-slate-200">{data.main_pollutant}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Confidence Range & Quick Advisory Banner */}
        <div className="w-full md:w-80 flex flex-col space-y-3 bg-stone-50 dark:bg-slate-800/50 p-5 rounded-2xl border border-stone-200/60 dark:border-slate-700/60">
          <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 font-semibold">
            <span className="flex items-center space-x-1.5">
              <Calendar className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Forecast Range</span>
            </span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {data.confidence_interval.lower} – {data.confidence_interval.upper} AQI
            </span>
          </div>

          <div className="w-full bg-stone-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (data.predicted_aqi / 400) * 100)}%` }}
            />
          </div>

          <div className="flex items-start space-x-2 pt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <p className="line-clamp-2">{data.health_advisory.summary}</p>
          </div>
        </div>

      </div>
    </div>
  );
};
