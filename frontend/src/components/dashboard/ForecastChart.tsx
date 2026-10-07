import React, { useState } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine
} from 'recharts';
import { TrendPoint } from '../../types';
import { Calendar } from 'lucide-react';

interface ForecastChartProps {
  trendHistory: TrendPoint[];
}

export const ForecastChart: React.FC<ForecastChartProps> = ({ trendHistory }) => {
  const [timeframe, setTimeframe] = useState<'7d' | '30d'>('7d');

  const filteredPoints = timeframe === '7d' ? trendHistory.slice(-8) : trendHistory;

  const chartData = filteredPoints.map((pt) => ({
    date: pt.date,
    aqiHistorical: !pt.is_forecast ? pt.aqi : null,
    aqiForecast: pt.is_forecast ? pt.aqi : null,
    aqiAll: pt.aqi,
    isForecast: pt.is_forecast
  }));

  // Bridge last historical point to forecast point for continuous line
  if (chartData.length >= 2) {
    const lastHistIdx = chartData.findIndex((d) => d.isForecast) - 1;
    if (lastHistIdx >= 0) {
      chartData[lastHistIdx].aqiForecast = chartData[lastHistIdx].aqiHistorical;
    }
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const isFc = data.isForecast;

      return (
        <div className="glass-card p-3 shadow-xl border border-slate-200 dark:border-slate-800 text-xs space-y-1">
          <p className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-emerald-500" />
            {label} {isFc ? '(Next Day Forecast)' : '(Historical)'}
          </p>
          <div className="flex items-center space-x-2">
            <span className="text-slate-500 dark:text-slate-400">AQI Index:</span>
            <span className="font-mono font-bold text-sm text-emerald-600 dark:text-emerald-400">
              {data.aqiAll}
            </span>
          </div>
          {isFc && (
            <span className="inline-block px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold text-[10px]">
              AI ML PREDICTION
            </span>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-card p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Air Quality Index Trend & AI Forecast</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Recent live/model history used for inference, paired with the next-day regression prediction
          </p>
        </div>

        {/* Timeframe Toggle */}
        <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setTimeframe('7d')}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
              timeframe === '7d'
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            7 Days
          </button>
          <button
            onClick={() => setTimeframe('30d')}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
              timeframe === '30d'
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            30 Days
          </button>
        </div>
      </div>

      {/* Chart Area */}
      <div className="w-full h-72">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="histGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="fcGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
            <XAxis dataKey="date" stroke="#94A3B8" fontSize={11} tickLine={false} />
            <YAxis stroke="#94A3B8" fontSize={11} domain={[0, 'auto']} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />

            {/* Threshold Reference Lines */}
            <ReferenceLine y={100} stroke="#84CC16" strokeDasharray="3 3" label={{ value: 'Satisfactory (100)', fill: '#84CC16', fontSize: 10 }} />
            <ReferenceLine y={200} stroke="#F59E0B" strokeDasharray="3 3" label={{ value: 'Moderate (200)', fill: '#F59E0B', fontSize: 10 }} />
            <ReferenceLine y={300} stroke="#EF4444" strokeDasharray="3 3" label={{ value: 'Poor (300)', fill: '#EF4444', fontSize: 10 }} />

            {/* Historical Area */}
            <Area
              type="monotone"
              dataKey="aqiHistorical"
              stroke="#10B981"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#histGradient)"
              name="Historical AQI"
            />

            {/* Forecast Dotted Line */}
            <Line
              type="monotone"
              dataKey="aqiForecast"
              stroke="#8B5CF6"
              strokeWidth={3}
              strokeDasharray="5 5"
              dot={{ r: 5, fill: '#8B5CF6', strokeWidth: 2, stroke: '#FFFFFF' }}
              name="Next Day Forecast"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-center space-x-6 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center space-x-1.5">
          <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
          <span>Recent Live/Model History</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-3 h-3 rounded-full bg-purple-500 inline-block border border-dashed border-white" />
          <span>Tomorrow ML Prediction</span>
        </div>
      </div>
    </div>
  );
};
