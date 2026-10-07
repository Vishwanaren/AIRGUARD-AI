import React from 'react';
import { AnalyticsData } from '../../types';
import { BarChart2, PieChart as PieIcon, Activity, SunSnow, ShieldAlert } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface AnalyticsViewProps {
  analytics: AnalyticsData;
}

const CATEGORY_COLORS: Record<string, string> = {
  Good: '#10B981',
  Satisfactory: '#84CC16',
  Moderate: '#F59E0B',
  Poor: '#EF4444',
  'Very Poor': '#8B5CF6',
  Severe: '#991B1B'
};

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ analytics }) => {
  const pieData = Object.entries(analytics.category_distribution).map(([name, value]) => ({
    name,
    value
  }));

  return (
    <div className="space-y-6">
      
      <div className="glass-card p-6 border-l-4 border-purple-500">
        <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
          <Activity className="w-6 h-6 text-purple-500" />
          <span>Historical Air Quality Analytics ({analytics.city})</span>
        </h2>
        <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
          In-depth seasonal, monthly, pollutant correlation, and COVID-19 lockdown impact analysis
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* 1. Monthly Trends Chart */}
        <div className="glass-card p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-emerald-500" />
            <span>Average Monthly AQI Profile</span>
          </h3>

          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.monthly_trends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
                <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} />
                <YAxis stroke="#94A3B8" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }} />
                <Bar dataKey="avg_aqi" fill="#10B981" radius={[4, 4, 0, 0]} name="Avg AQI" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2. Category Distribution Donut */}
        <div className="glass-card p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <PieIcon className="w-4 h-4 text-purple-500" />
            <span>AQI Category Distribution</span>
          </h3>

          <div className="w-full h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.name] || '#64748B'} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 text-xs">
            {pieData.map((item) => (
              <div key={item.name} className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: CATEGORY_COLORS[item.name] || '#64748B' }} />
                <span className="text-slate-600 dark:text-slate-300 font-medium">{item.name} ({item.value})</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 3. Pollutant Correlations & Seasonal Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Pollutant Correlation List */}
        <div className="glass-card p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Pollutant Correlation with AQI Index
          </h3>
          <p className="text-xs text-slate-500">Linear Pearson correlation coefficients ($r$)</p>

          <div className="space-y-2.5">
            {analytics.pollutant_correlations.map((pc) => {
              const absVal = Math.abs(pc.correlation_with_aqi);
              return (
                <div key={pc.pollutant} className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800 dark:text-slate-200">{pc.pollutant}</span>
                  <div className="flex items-center space-x-3 w-1/2">
                    <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-500 h-full rounded-full"
                        style={{ width: `${absVal * 100}%` }}
                      />
                    </div>
                    <span className="font-mono font-bold text-slate-700 dark:text-slate-300 w-12 text-right">
                      {pc.correlation_with_aqi > 0 ? `+${pc.correlation_with_aqi}` : pc.correlation_with_aqi}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Seasonal Breakdown */}
        <div className="glass-card p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <SunSnow className="w-4 h-4 text-amber-500" />
            <span>Seasonal AQI Averages</span>
          </h3>

          <div className="grid grid-cols-2 gap-4">
            {Object.entries(analytics.seasonal_summary).map(([season, avg]) => (
              <div key={season} className="p-4 rounded-xl bg-slate-100/70 dark:bg-slate-900/70 border border-slate-200/60 dark:border-slate-800 space-y-1">
                <span className="text-xs text-slate-500 block font-semibold">{season}</span>
                <span className="text-2xl font-black text-slate-900 dark:text-white">{avg} AQI</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 4. COVID-19 Lockdown Period Analysis */}
      <div className="glass-card p-6 bg-gradient-to-r from-cyan-500/10 via-slate-900/40 to-emerald-500/10 border border-cyan-500/20 space-y-3">
        <div className="flex items-center space-x-2 text-cyan-500 font-extrabold text-sm">
          <ShieldAlert className="w-5 h-5" />
          <span>COVID-19 Lockdown Period Impact Analysis (Spring 2020)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-3 rounded-xl bg-white/50 dark:bg-slate-900/50">
            <span className="text-xs text-slate-500 block">Lockdown Period Avg (2020)</span>
            <span className="text-2xl font-black text-emerald-500">
              {analytics.covid_period_impact.covid_period_avg_aqi} AQI
            </span>
          </div>

          <div className="p-3 rounded-xl bg-white/50 dark:bg-slate-900/50">
            <span className="text-xs text-slate-500 block">Pre-COVID Baseline Avg (2018-2019)</span>
            <span className="text-2xl font-black text-slate-700 dark:text-slate-300">
              {analytics.covid_period_impact.pre_covid_baseline_avg_aqi} AQI
            </span>
          </div>

          <div className="p-3 rounded-xl bg-white/50 dark:bg-slate-900/50">
            <span className="text-xs text-slate-500 block">Pollution Reduction Drop</span>
            <span className="text-2xl font-black text-cyan-400">
              -{analytics.covid_period_impact.percentage_reduction}%
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pt-1">
          {analytics.covid_period_impact.summary}
        </p>
      </div>

    </div>
  );
};
