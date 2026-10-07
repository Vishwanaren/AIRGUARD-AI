import React from 'react';
import { Activity } from 'lucide-react';
import { HistoricalPoint } from '../../types';

interface PollutantCardProps {
  name: string;
  value: number | undefined;
  unit: string;
  description: string;
  history: HistoricalPoint[];
}

export const PollutantCard: React.FC<PollutantCardProps> = ({
  name,
  value,
  unit,
  description,
  history
}) => {
  const displayVal = value !== undefined && value !== null ? value.toFixed(1) : 'N/A';
  
  // Extract values for sparkline
  const key = name.toLowerCase().replace('.', '') as keyof HistoricalPoint;
  const series = history
    .map((h) => (h[key] !== undefined ? (h[key] as number) : 0))
    .filter((v) => v > 0);

  const maxSeries = Math.max(...series, 1);
  const minSeries = Math.min(...series, 0);
  const range = maxSeries - minSeries || 1;

  return (
    <div className="glass-card-hover p-4 flex flex-col justify-between space-y-3">
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold text-xs">
            {name}
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">{name}</h4>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">{description}</p>
          </div>
        </div>
        <Activity className="w-4 h-4 text-slate-400" />
      </div>

      <div className="flex items-baseline justify-between pt-1">
        <div className="flex items-baseline space-x-1">
          <span className="text-2xl font-black text-slate-900 dark:text-white">{displayVal}</span>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{unit}</span>
        </div>

        {/* Mini SVG Sparkline */}
        {series.length > 2 && (
          <div className="w-20 h-6">
            <svg className="w-full h-full overflow-visible">
              <path
                d={series
                  .map((val, idx) => {
                    const x = (idx / (series.length - 1)) * 80;
                    const y = 24 - ((val - minSeries) / range) * 20;
                    return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
                  })
                  .join(' ')}
                fill="none"
                stroke="#10B981"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
        )}
      </div>

    </div>
  );
};
