import React from 'react';
import { Thermometer, Droplets, Wind, Compass, CloudRain, Sun, Cloud, CloudFog } from 'lucide-react';
import { WeatherData } from '../../types';

interface RealtimeWeatherCardProps {
  weather?: WeatherData;
  city: string;
}

export const RealtimeWeatherCard: React.FC<RealtimeWeatherCardProps> = ({ weather, city }) => {
  if (!weather) return null;

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'Clear Sky':
        return <Sun className="w-5 h-5 text-amber-500" />;
      case 'Rainy':
      case 'Showers':
        return <CloudRain className="w-5 h-5 text-blue-500" />;
      case 'Foggy':
        return <CloudFog className="w-5 h-5 text-slate-400" />;
      default:
        return <Cloud className="w-5 h-5 text-sky-500" />;
    }
  };

  return (
    <div className="glass-card p-6 bg-white dark:bg-slate-900 border border-stone-200/90 dark:border-slate-800 rounded-3xl shadow-sm">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-2xl bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400">
            {getWeatherIcon(weather.condition)}
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Real-Time Weather in {city}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Current atmospheric parameters impacting air dispersion
            </p>
          </div>
        </div>

        <span className="px-3.5 py-1 rounded-full text-xs font-semibold bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border border-sky-200/60 dark:border-sky-800/60">
          {weather.condition}
        </span>
      </div>

      {/* Grid of Weather Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        
        {/* Temperature */}
        <div className="p-4 rounded-2xl bg-stone-50 dark:bg-slate-800/50 border border-stone-200/60 dark:border-slate-700/60">
          <div className="flex items-center space-x-2 text-rose-500 mb-1">
            <Thermometer className="w-4 h-4" />
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Temperature</span>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">
            {weather.temperature}°C
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">Feels like {weather.feels_like}°C</p>
        </div>

        {/* Humidity */}
        <div className="p-4 rounded-2xl bg-stone-50 dark:bg-slate-800/50 border border-stone-200/60 dark:border-slate-700/60">
          <div className="flex items-center space-x-2 text-cyan-500 mb-1">
            <Droplets className="w-4 h-4" />
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Humidity</span>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">
            {weather.humidity}%
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">Relative Moisture</p>
        </div>

        {/* Wind Speed */}
        <div className="p-4 rounded-2xl bg-stone-50 dark:bg-slate-800/50 border border-stone-200/60 dark:border-slate-700/60">
          <div className="flex items-center space-x-2 text-teal-500 mb-1">
            <Wind className="w-4 h-4" />
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Wind Speed</span>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">
            {weather.wind_speed} <span className="text-xs font-normal text-slate-500">km/h</span>
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">Pollutant Dispersion</p>
        </div>

        {/* Wind Direction / Rain */}
        <div className="p-4 rounded-2xl bg-stone-50 dark:bg-slate-800/50 border border-stone-200/60 dark:border-slate-700/60">
          <div className="flex items-center space-x-2 text-indigo-500 mb-1">
            <Compass className="w-4 h-4" />
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Wind Direction</span>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">
            {weather.wind_direction}°
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">Rain: {weather.precipitation} mm</p>
        </div>

      </div>

    </div>
  );
};
