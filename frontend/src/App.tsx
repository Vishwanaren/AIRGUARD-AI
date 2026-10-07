import React, { useState, useEffect } from 'react';
import { Header } from './components/common/Header';
import { DashboardView } from './components/dashboard/DashboardView';
import { ForecastView } from './components/forecast/ForecastView';
import { CityComparisonView } from './components/comparison/CityComparisonView';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { ModelInsightsView } from './components/model_insights/ModelInsightsView';
import { AboutView } from './components/about/AboutView';

import {
  fetchCities,
  fetchForecast,
  fetchHistorical,
  fetchAnalytics,
  fetchModelMetrics,
  fetchModelFeatures
} from './services/api';

import {
  CityInfo,
  ForecastData,
  HistoricalPoint,
  AnalyticsData,
  ModelMetricsData,
  GlobalImportanceFeature
} from './types';

import { AlertCircle, RefreshCw } from 'lucide-react';

export const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [cities, setCities] = useState<CityInfo[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>('Delhi');

  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [history, setHistory] = useState<HistoricalPoint[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [metrics, setMetrics] = useState<ModelMetricsData | null>(null);
  const [features, setFeatures] = useState<GlobalImportanceFeature[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Sync Dark Mode class on <html> element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Load Initial Cities
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const cityList = await fetchCities();
        setCities(cityList);
        if (cityList.length > 0 && !cityList.some((c) => c.name === selectedCity)) {
          setSelectedCity(cityList[0].name);
        }
      } catch (err: any) {
        console.error('Failed to load cities:', err);
        setError('Failed to connect to backend server. Make sure API is running on port 8000.');
      }
    };
    loadInitialData();
  }, []);

  // Fetch City-Specific Data on City Change
  useEffect(() => {
    if (!selectedCity) return;

    const loadCityData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [fcData, histData, anaData] = await Promise.all([
          fetchForecast(selectedCity),
          fetchHistorical(selectedCity, 30),
          fetchAnalytics(selectedCity)
        ]);
        setForecast(fcData);
        setHistory(histData);
        setAnalytics(anaData);

        // Update cities list with current live AQI
        setCities((prev) =>
          prev.map((c) =>
            c.name.toLowerCase() === selectedCity.toLowerCase()
              ? { ...c, latest_aqi: Math.round(fcData.current_aqi), latest_category: fcData.predicted_category }
              : c
          )
        );
      } catch (err: any) {
        console.error(`Failed to load data for ${selectedCity}:`, err);
        setError(`Failed to fetch forecast data for '${selectedCity}'.`);
      } finally {
        setIsLoading(false);
      }
    };

    loadCityData();
  }, [selectedCity]);

  // Load Model Insights Data on Tab Selection
  useEffect(() => {
    if (activeTab === 'model_insights' && !metrics) {
      const loadModelData = async () => {
        try {
          const [metData, featData] = await Promise.all([
            fetchModelMetrics(),
            fetchModelFeatures()
          ]);
          setMetrics(metData);
          setFeatures(featData);
        } catch (err: any) {
          console.error('Failed to load model metrics:', err);
        }
      };
      loadModelData();
    }
  }, [activeTab, metrics]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans">
      
      {/* Header */}
      <Header
        cities={cities}
        selectedCity={selectedCity}
        onSelectCity={setSelectedCity}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        isLoading={isLoading}
      />

      {/* Main Body Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Error State */}
        {error && (
          <div className="glass-card p-4 border-l-4 border-rose-500 bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2 text-xs font-bold">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="px-3 py-1 bg-rose-500 text-white text-xs font-bold rounded-lg hover:bg-rose-600 transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* Loading Spinner */}
        {isLoading && !forecast && (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <RefreshCw className="w-10 h-10 text-emerald-500 animate-spin" />
            <p className="text-sm font-extrabold text-slate-600 dark:text-slate-300">
              Generating Next-Day AQI Forecast & SHAP Explanations...
            </p>
          </div>
        )}

        {/* Active Tab View Rendering */}
        {!isLoading && forecast && (
          <>
            {activeTab === 'dashboard' && <DashboardView forecast={forecast} history={history} />}
            {activeTab === 'forecast' && <ForecastView forecast={forecast} history={history} />}
            {activeTab === 'comparison' && <CityComparisonView cities={cities} onSelectCity={setSelectedCity} />}
            {activeTab === 'analytics' && (
              analytics ? (
                <AnalyticsView analytics={analytics} />
              ) : (
                <div className="flex flex-col items-center justify-center py-20 space-y-3">
                  <RefreshCw className="w-8 h-8 text-emerald-500 animate-spin" />
                  <p className="text-xs font-bold text-slate-500">Loading City Analytics...</p>
                </div>
              )
            )}
            {activeTab === 'model_insights' && (
              metrics ? (
                <ModelInsightsView metrics={metrics} features={features} />
              ) : (
                <div className="flex flex-col items-center justify-center py-20 space-y-3">
                  <RefreshCw className="w-8 h-8 text-emerald-500 animate-spin" />
                  <p className="text-xs font-bold text-slate-500">Loading Model Performance & Insights...</p>
                </div>
              )
            )}
            {activeTab === 'about' && <AboutView />}
            {!['dashboard', 'forecast', 'comparison', 'analytics', 'model_insights', 'about'].includes(activeTab) && (
              <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center font-extrabold text-2xl">
                  404
                </div>
                <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100">Page Not Found</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md">
                  The page or section you requested could not be found. Click below to return to the Dashboard.
                </p>
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
                >
                  Return to Dashboard
                </button>
              </div>
            )}
          </>
        )}

      </main>

      {/* Footer */}
      <footer className="glass-card rounded-none border-t border-slate-200/80 dark:border-slate-800/80 py-4 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>AIRGUARD AI © 2026 — Next-Day Air Quality & Health Intelligence</span>
          <span>Full-Stack Machine Learning • Live AQI + Historical Analysis • Developed for ML Hackathon</span>
        </div>
      </footer>

    </div>
  );
};

export default App;
