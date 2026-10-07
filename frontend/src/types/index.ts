export interface CityInfo {
  name: string;
  state?: string;
  latest_date: string;
  latest_aqi: number;
  latest_category: string;
  main_pollutant: string;
}

export interface FeatureContribution {
  feature: string;
  impact: number;
  signed_impact: number;
  direction: 'increase' | 'decrease';
}

export interface ExplanationData {
  city: string;
  target_date: string;
  predicted_aqi: number;
  predicted_category: string;
  top_factors: FeatureContribution[];
  natural_language_explanation: string;
}

export interface HealthAdvisory {
  summary: string;
  general_recommendation: string;
  sensitive_groups: string;
  mask_required: boolean;
  color_hex: string;
}

export interface TrendPoint {
  date: string;
  aqi: number;
  is_forecast: boolean;
}

export interface WeatherData {
  temperature: number;
  feels_like: number;
  humidity: number;
  wind_speed: number;
  wind_direction: number;
  precipitation: number;
  condition: string;
}

export interface CigaretteExposure {
  today: number;
  days_7: number;
  days_30: number;
}

export interface CurrentPollutants {
  pm25?: number;
  pm10?: number;
  no2?: number;
  so2?: number;
  co?: number;
  o3?: number;
}

export interface ForecastData {
  city: string;
  forecast_date: string;
  current_date: string;
  current_aqi: number;
  current_source: string;
  current_pollutants: CurrentPollutants;
  predicted_aqi: number;
  predicted_category: string;
  aqi_change: number;
  change_direction: 'increase' | 'decrease' | 'stable';
  confidence_interval: {
    lower: number;
    upper: number;
  };
  main_pollutant: string;
  health_advisory: HealthAdvisory;
  weather?: WeatherData;
  cigarette_equivalent?: CigaretteExposure;
  explanation: ExplanationData;
  trend_history: TrendPoint[];
}

export interface HistoricalPoint {
  date: string;
  aqi: number;
  aqi_bucket: string;
  pm25?: number;
  pm10?: number;
  no2?: number;
  so2?: number;
  co?: number;
  o3?: number;
}

export interface MonthlyTrend {
  month: string;
  avg_aqi: number;
  max_aqi: number;
  min_aqi: number;
}

export interface PollutantCorrelation {
  pollutant: string;
  correlation_with_aqi: number;
}

export interface AnalyticsData {
  city: string;
  monthly_trends: MonthlyTrend[];
  category_distribution: Record<string, number>;
  pollutant_correlations: PollutantCorrelation[];
  seasonal_summary: Record<string, number>;
  covid_period_impact: {
    period: string;
    covid_period_avg_aqi: number;
    pre_covid_baseline_avg_aqi: number;
    percentage_reduction: number;
    summary: string;
  };
}

export interface MetricSet {
  mae?: number;
  rmse?: number;
  r2?: number;
  accuracy?: number;
  weighted_f1?: number;
  precision?: number;
  recall?: number;
  adjacent_accuracy?: number;
  confusion_matrix?: number[][];
  labels?: string[];
}

export interface ModelResult {
  val_metrics: MetricSet;
  test_metrics: MetricSet;
  is_selected: boolean;
}

export interface ModelMetricsData {
  selected_regression_model: string;
  selected_classification_model: string;
  regression_models: Record<string, ModelResult>;
  classification_models: Record<string, ModelResult>;
}

export interface GlobalImportanceFeature {
  feature: string;
  importance: number;
}
