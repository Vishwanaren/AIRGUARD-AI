import React from 'react';
import { Wind, Moon, Sun, MapPin, RefreshCw } from 'lucide-react';
import { CityInfo } from '../../types';

interface HeaderProps {
  cities: CityInfo[];
  selectedCity: string;
  onSelectCity: (city: string) => void;
  activeTab: string;
  onSelectTab: (tab: string) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  isLoading?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  cities,
  selectedCity,
  onSelectCity,
  activeTab,
  onSelectTab,
  darkMode,
  onToggleDarkMode,
  isLoading
}) => {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'forecast', label: 'Forecast' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'comparison', label: 'City Comparison' },
    { id: 'model_insights', label: 'Model Insights' },
    { id: 'about', label: 'About' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-stone-200/80 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onSelectTab('dashboard')}>
            <div className="w-9 h-9 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-sm">
              <Wind className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white">AirGuard</span>
                <span className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-[10px] font-extrabold px-1.5 py-0.5 rounded-full">LIVE</span>
              </div>
              <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 hidden sm:block">
                Air Quality & Health Intelligence
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex space-x-1 lg:space-x-1.5 bg-stone-100 dark:bg-slate-900 p-1 rounded-2xl border border-stone-200/60 dark:border-slate-800">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all ${
                  activeTab === tab.id
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Right Controls: City Selector & Dark Mode Toggle */}
          <div className="flex items-center space-x-3">
            {/* City Dropdown */}
            <div className="relative flex items-center">
              <MapPin className="w-4 h-4 text-emerald-500 absolute left-3 pointer-events-none" />
              <select
                value={selectedCity}
                onChange={(e) => onSelectCity(e.target.value)}
                disabled={isLoading}
                className="pl-9 pr-8 py-1.5 text-sm font-semibold bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all cursor-pointer disabled:opacity-50"
              >
                {cities.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.name} ({c.latest_aqi} AQI)
                  </option>
                ))}
              </select>
              {isLoading && (
                <RefreshCw className="w-4 h-4 text-emerald-500 animate-spin absolute right-3 pointer-events-none" />
              )}
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={onToggleDarkMode}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:text-emerald-500 transition-all border border-slate-200 dark:border-slate-800"
              title="Toggle theme"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>

        </div>

        {/* Mobile Navigation Tabs */}
        <div className="md:hidden flex space-x-1 overflow-x-auto pb-2 scrollbar-none border-t border-slate-200/50 dark:border-slate-800/50 pt-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`px-3 py-1 text-xs font-semibold whitespace-nowrap rounded-lg ${
                activeTab === tab.id
                  ? 'bg-emerald-500 text-slate-950 font-bold'
                  : 'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

      </div>
    </header>
  );
};
