import React from 'react';
import { ModelMetricsData, GlobalImportanceFeature } from '../../types';
import { Cpu, Award, BarChart3, CheckCircle, Table } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface ModelInsightsViewProps {
  metrics: ModelMetricsData;
  features: GlobalImportanceFeature[];
}

export const ModelInsightsView: React.FC<ModelInsightsViewProps> = ({ metrics, features }) => {
  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="glass-card p-6 border-l-4 border-emerald-500 bg-gradient-to-r from-emerald-500/10 via-slate-900/30 to-purple-500/10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Cpu className="w-6 h-6 text-emerald-500" />
              <span>Machine Learning Leaderboard & Model Insights</span>
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
              Validation & Test metrics evaluated across time-based splits (2015-2018 Train | 2019 Val | 2020 Test)
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="px-3 py-1.5 rounded-xl bg-emerald-500 text-slate-950 text-xs font-black flex items-center gap-1 shadow-sm">
              <Award className="w-4 h-4" /> Selected Regression: {metrics.selected_regression_model}
            </span>
          </div>
        </div>
      </div>

      {/* Regression Leaderboard Table */}
      <div className="glass-card p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Table className="w-4 h-4 text-emerald-500" />
          <span>Regression Models Leaderboard (Target: Next-Day Numerical AQI)</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase font-bold">
                <th className="py-2.5 px-3">Model Name</th>
                <th className="py-2.5 px-3">Val MAE</th>
                <th className="py-2.5 px-3">Val RMSE</th>
                <th className="py-2.5 px-3">Val R²</th>
                <th className="py-2.5 px-3">Test MAE (2020)</th>
                <th className="py-2.5 px-3">Test RMSE</th>
                <th className="py-2.5 px-3">Test R²</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
              {Object.entries(metrics.regression_models).map(([name, res]) => (
                <tr key={name} className={res.is_selected ? 'bg-emerald-500/10 dark:bg-emerald-500/20 font-bold' : ''}>
                  <td className="py-3 px-3 flex items-center space-x-2">
                    <span className="text-slate-900 dark:text-white font-bold">{name}</span>
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {res.val_metrics.mae}
                  </td>
                  <td className="py-3 px-3 font-mono">{res.val_metrics.rmse}</td>
                  <td className="py-3 px-3 font-mono">{res.val_metrics.r2}</td>
                  <td className="py-3 px-3 font-mono font-bold text-slate-900 dark:text-white">
                    {res.test_metrics.mae}
                  </td>
                  <td className="py-3 px-3 font-mono">{res.test_metrics.rmse}</td>
                  <td className="py-3 px-3 font-mono">{res.test_metrics.r2}</td>
                  <td className="py-3 px-3">
                    {res.is_selected ? (
                      <span className="px-2 py-0.5 rounded bg-emerald-500 text-slate-950 text-[10px] font-black inline-flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> SELECTED BEST
                      </span>
                    ) : (
                      <span className="text-slate-400">Evaluated</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Classification Leaderboard Table */}
      <div className="glass-card p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Table className="w-4 h-4 text-purple-500" />
          <span>Classification Models Leaderboard (Target: Next-Day AQI Category)</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase font-bold">
                <th className="py-2.5 px-3">Model Name</th>
                <th className="py-2.5 px-3">Val Accuracy</th>
                <th className="py-2.5 px-3">Val Weighted F1</th>
                <th className="py-2.5 px-3">Val Adj-Acc</th>
                <th className="py-2.5 px-3">Test Accuracy (2020)</th>
                <th className="py-2.5 px-3">Test Weighted F1</th>
                <th className="py-2.5 px-3">Test Adj-Acc</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
              {Object.entries(metrics.classification_models).map(([name, res]) => (
                <tr key={name} className={res.is_selected ? 'bg-purple-500/10 dark:bg-purple-500/20 font-bold' : ''}>
                  <td className="py-3 px-3 text-slate-900 dark:text-white font-bold">{name}</td>
                  <td className="py-3 px-3 font-mono">{res.val_metrics.accuracy}</td>
                  <td className="py-3 px-3 font-mono font-bold text-purple-600 dark:text-purple-400">
                    {res.val_metrics.weighted_f1}
                  </td>
                  <td className="py-3 px-3 font-mono text-emerald-500 font-bold">{res.val_metrics.adjacent_accuracy}</td>
                  <td className="py-3 px-3 font-mono">{res.test_metrics.accuracy}</td>
                  <td className="py-3 px-3 font-mono">{res.test_metrics.weighted_f1}</td>
                  <td className="py-3 px-3 font-mono text-emerald-500 font-bold">{res.test_metrics.adjacent_accuracy}</td>
                  <td className="py-3 px-3">
                    {res.is_selected ? (
                      <span className="px-2 py-0.5 rounded bg-purple-500 text-white text-[10px] font-black inline-flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> SELECTED BEST
                      </span>
                    ) : (
                      <span className="text-slate-400">Evaluated</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SHAP Global Feature Importance Bar Chart */}
      <div className="glass-card p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-emerald-500" />
          <span>SHAP Global Feature Importance Ranking</span>
        </h3>
        <p className="text-xs text-slate-500">Mean absolute SHAP value impact across all background samples</p>

        <div className="w-full h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart layout="vertical" data={features.slice(0, 12)} margin={{ top: 10, right: 20, left: 60, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
              <XAxis type="number" stroke="#94A3B8" fontSize={11} />
              <YAxis type="category" dataKey="feature" stroke="#94A3B8" fontSize={11} />
              <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }} />
              <Bar dataKey="importance" fill="#10B981" radius={[0, 6, 6, 0]} name="SHAP Importance" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};
