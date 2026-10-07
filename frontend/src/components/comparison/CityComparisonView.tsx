import React, { useState } from 'react';
import { CityInfo } from '../../types';
import { AqiBadge } from '../common/AqiBadge';
import { Building2, BarChart3, ArrowUpAZ, ArrowDownWideNarrow, ArrowUpNarrowWide } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface CityComparisonViewProps {
  cities: CityInfo[];
  onSelectCity: (city: string) => void;
}

export const CityComparisonView: React.FC<CityComparisonViewProps> = ({ cities, onSelectCity }) => {
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | 'name'>('desc');

  const sortedCities = [...cities].sort((a, b) => {
    if (sortOrder === 'asc') return a.latest_aqi - b.latest_aqi;
    if (sortOrder === 'desc') return b.latest_aqi - a.latest_aqi;
    return a.name.localeCompare(b.name);
  });

  const chartData = sortedCities.map((c) => ({
    name: c.name,
    aqi: c.latest_aqi,
    category: c.latest_category
  }));

  return (
    <div className="space-y-6">
      
      <div className="glass-card p-6 border-l-4 border-cyan-500">
        <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
          <Building2 className="w-6 h-6 text-cyan-500" />
          <span>Multi-City Air Quality Comparison</span>
        </h2>
        <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
          Factual comparative analysis of current air quality observations across major Indian urban centers
        </p>
      </div>

      {/* Bar Chart Comparison */}
      <div className="glass-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-emerald-500" />
            <span>City AQI Comparison Overview</span>
          </h3>
          <span className="text-xs text-slate-500 font-medium">Sorted: {sortOrder.toUpperCase()}</span>
        </div>

        <div className="w-full h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
              <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} angle={-25} textAnchor="end" />
              <YAxis stroke="#94A3B8" fontSize={11} domain={[0, 'auto']} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
              />
              <Bar dataKey="aqi" fill="#10B981" radius={[6, 6, 0, 0]} name="Latest AQI" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Controls Bar for City Cards Sorting */}
      <div className="glass-card p-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
            City Rankings & Station Cards
          </h4>
          <p className="text-xs text-slate-500">
            Click any city card to load its full next-day AI forecast and analytics
          </p>
        </div>

        {/* Sorting Buttons */}
        <div className="flex items-center space-x-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setSortOrder('desc')}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              sortOrder === 'desc'
                ? 'bg-rose-500 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <ArrowDownWideNarrow className="w-3.5 h-3.5" />
            <span>Highest AQI First</span>
          </button>

          <button
            onClick={() => setSortOrder('asc')}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              sortOrder === 'asc'
                ? 'bg-emerald-500 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <ArrowUpNarrowWide className="w-3.5 h-3.5" />
            <span>Lowest AQI First</span>
          </button>

          <button
            onClick={() => setSortOrder('name')}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              sortOrder === 'name'
                ? 'bg-sky-500 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <ArrowUpAZ className="w-3.5 h-3.5" />
            <span>Alphabetical</span>
          </button>
        </div>
      </div>

      {/* Sorted City Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedCities.map((city) => (
          <div
            key={city.name}
            onClick={() => onSelectCity(city.name)}
            className="glass-card-hover p-5 space-y-3 cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-base font-extrabold text-slate-900 dark:text-white group-hover:text-emerald-500 transition-colors">
                  {city.name}
                </h4>
                <p className="text-[10px] text-slate-500">{city.state}</p>
              </div>
              <AqiBadge category={city.latest_category} size="md" />
            </div>

            <div className="flex items-baseline justify-between pt-2 border-t border-slate-200/60 dark:border-slate-800">
              <div>
                <span className="text-xs text-slate-500 dark:text-slate-400 block">Latest AQI</span>
                <span className="text-3xl font-black text-slate-900 dark:text-white">{city.latest_aqi}</span>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-500 dark:text-slate-400 block">Main Pollutant</span>
                <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{city.main_pollutant}</span>
              </div>
            </div>

            <p className="text-[10px] text-slate-400 text-right">Observation Date: {city.latest_date}</p>
          </div>
        ))}
      </div>

    </div>
  );
};
