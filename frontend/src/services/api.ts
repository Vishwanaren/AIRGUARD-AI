import axios from 'axios';
import {
  CityInfo,
  ForecastData,
  HistoricalPoint,
  AnalyticsData,
  ModelMetricsData,
  GlobalImportanceFeature,
  ExplanationData
} from '../types';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchHealth = async () => {
  const res = await api.get('/health');
  return res.data;
};

export const fetchCities = async (): Promise<CityInfo[]> => {
  const res = await api.get('/cities');
  return res.data;
};

export const fetchForecast = async (city: string): Promise<ForecastData> => {
  const res = await api.get(`/forecast/${encodeURIComponent(city)}`);
  return res.data;
};

export const fetchExplanation = async (city: string): Promise<ExplanationData> => {
  const res = await api.get(`/forecast/${encodeURIComponent(city)}/explanation`);
  return res.data;
};

export const fetchHistorical = async (city: string, days = 30): Promise<HistoricalPoint[]> => {
  const res = await api.get(`/historical/${encodeURIComponent(city)}?days=${days}`);
  return res.data.data;
};

export const fetchAnalytics = async (city: string): Promise<AnalyticsData> => {
  const res = await api.get(`/analytics/${encodeURIComponent(city)}`);
  return res.data;
};

export const fetchModelMetrics = async (): Promise<ModelMetricsData> => {
  const res = await api.get('/model/metrics');
  return res.data;
};

export const fetchModelFeatures = async (): Promise<GlobalImportanceFeature[]> => {
  const res = await api.get('/model/features');
  return res.data.features;
};
