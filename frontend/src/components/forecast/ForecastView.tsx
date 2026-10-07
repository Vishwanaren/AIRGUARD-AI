import React from 'react';
import { ForecastData, HistoricalPoint } from '../../types';
import { AqiHeroCard } from '../dashboard/AqiHeroCard';
import { ExplanationCard } from '../dashboard/ExplanationCard';
import { Calendar, ShieldAlert } from 'lucide-react';
import { AqiBadge } from '../common/AqiBadge';

interface ForecastViewProps {
  forecast: ForecastData;
  history: HistoricalPoint[];
}

export const ForecastView: React.FC<ForecastViewProps> = ({ forecast, history }) => {
  return (
    <div className="space-y-6">
      
      <div className="glass-card p-6 bg-gradient-to-r from-emerald-500/10 via-cyan-500/10 to-purple-500/10 border border-emerald-500/20">
        <h2 className="text-xl font-black text-slate-900 dark:text-white">
          Detailed Air Quality Forecast for {forecast.city}
        </h2>
        <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
          Machine Learning Next-Day Regression ($t+1$) & Classification Model Output
        </p>
      </div>

      <AqiHeroCard data={forecast} />

      {/* SHAP Explanation */}
      <ExplanationCard explanation={forecast.explanation} />

      {/* Multi-Day Historical Trend & Forecast Table */}
      <div className="glass-card p-6 space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Calendar className="w-4 h-4 text-emerald-500" />
          <span>Daily Prediction History & Outlook</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase font-bold">
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">AQI Value</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Main Pollutant</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
              {forecast.trend_history.map((pt, idx) => (
                <tr key={idx} className={pt.is_forecast ? 'bg-purple-500/10 dark:bg-purple-500/20 font-bold' : ''}>
                  <td className="py-2.5 px-3 font-mono">{pt.date}</td>
                  <td className="py-2.5 px-3">
                    {pt.is_forecast ? (
                      <span className="px-2 py-0.5 rounded bg-purple-500 text-white text-[10px] font-bold">
                        TOMORROW FORECAST
                      </span>
                    ) : (
                      <span className="text-slate-500">Historical Observation</span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 font-mono font-bold text-sm">
                    {pt.aqi}
                  </td>
                  <td className="py-2.5 px-3">
                    <AqiBadge category={pt.is_forecast ? forecast.predicted_category : 'Moderate'} size="sm" />
                  </td>
                  <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300">
                    {forecast.main_pollutant}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center space-x-2 text-xs text-amber-600 dark:text-amber-400 pt-2">
          <ShieldAlert className="w-4 h-4 shrink-0" />
          <span>
            Current AQI is sourced separately from the historical training data. Forecasts are model outputs and should not be treated as official CPCB forecasts.
          </span>
        </div>
      </div>

    </div>
  );
};
