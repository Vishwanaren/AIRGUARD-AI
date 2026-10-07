import React from 'react';
import { ForecastData, HistoricalPoint } from '../../types';
import { AqiHeroCard } from './AqiHeroCard';
import { PollutantCard } from './PollutantCard';
import { ForecastChart } from './ForecastChart';
import { ExplanationCard } from './ExplanationCard';
import { RealtimeWeatherCard } from './RealtimeWeatherCard';
import { CpcbHealthAdviceCard } from './CpcbHealthAdviceCard';

interface DashboardViewProps {
  forecast: ForecastData;
  history: HistoricalPoint[];
}

export const DashboardView: React.FC<DashboardViewProps> = ({ forecast, history }) => {

  const pollutantMeta = [
    { name: 'PM2.5', unit: 'µg/m³', desc: 'Fine Particulate Matter (<2.5µm)' },
    { name: 'PM10', unit: 'µg/m³', desc: 'Coarse Particulate Matter (<10µm)' },
    { name: 'NO2', unit: 'µg/m³', desc: 'Nitrogen Dioxide' },
    { name: 'SO2', unit: 'µg/m³', desc: 'Sulfur Dioxide' },
    { name: 'CO', unit: 'mg/m³', desc: 'Carbon Monoxide' },
    { name: 'O3', unit: 'µg/m³', desc: 'Ozone' }
  ];

  return (
    <div className="space-y-6">
      
      {/* 1. Hero Next-Day Forecast Card */}
      <AqiHeroCard data={forecast} />

      {/* 2. Live Weather Analysis Card */}
      <RealtimeWeatherCard weather={forecast.weather} city={forecast.city} />

      {/* 3. Pollutant Cards Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Latest Pollutant Concentrations ({forecast.current_date})
          </h3>
          <span className="text-xs text-slate-500">6 Key Monitoring Pollutants</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {pollutantMeta.map((p) => {
            const keyMap: Record<string, keyof NonNullable<typeof forecast.current_pollutants>> = {
              'PM2.5': 'pm25', 'PM10': 'pm10', 'NO2': 'no2', 'SO2': 'so2', 'CO': 'co', 'O3': 'o3'
            };
            const val = forecast.current_pollutants[keyMap[p.name]];
            return (
              <PollutantCard
                key={p.name}
                name={p.name}
                value={val}
                unit={p.unit}
                description={p.desc}
                history={history}
              />
            );
          })}
        </div>
      </div>

      {/* 4. CPCB Health Advice & Health Risks Section */}
      <CpcbHealthAdviceCard data={forecast} />

      {/* 5. Forecast & Historical Recharts Chart */}
      <ForecastChart trendHistory={forecast.trend_history} />

      {/* 6. SHAP Explanation Card */}
      <ExplanationCard explanation={forecast.explanation} />

    </div>
  );
};
