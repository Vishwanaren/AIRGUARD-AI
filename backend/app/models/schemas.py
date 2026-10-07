"""
Pydantic Schemas for AIRGUARD AI API.
Provides typed, validated request and response structures.
"""

from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Any

class HealthResponse(BaseModel):
    status: str = Field(..., example="healthy")
    timestamp: str
    dataset_rows: int
    models_loaded: bool
    version: str

class CityInfo(BaseModel):
    name: str
    state: Optional[str] = None
    latest_date: str
    latest_aqi: float
    latest_category: str
    main_pollutant: str

class HistoricalPoint(BaseModel):
    date: str
    aqi: float
    aqi_bucket: str
    pm25: Optional[float] = None
    pm10: Optional[float] = None
    no2: Optional[float] = None
    so2: Optional[float] = None
    co: Optional[float] = None
    o3: Optional[float] = None

class HistoricalResponse(BaseModel):
    city: str
    count: int
    data: List[HistoricalPoint]

class FeatureContribution(BaseModel):
    feature: str
    impact: float
    signed_impact: float
    direction: str

class ExplanationResponse(BaseModel):
    city: str
    target_date: str
    predicted_aqi: float
    predicted_category: str
    top_factors: List[FeatureContribution]
    natural_language_explanation: str

class TrendPoint(BaseModel):
    date: str
    aqi: float
    is_forecast: bool = False

class CurrentPollutants(BaseModel):
    pm25: Optional[float] = None
    pm10: Optional[float] = None
    no2: Optional[float] = None
    so2: Optional[float] = None
    co: Optional[float] = None
    o3: Optional[float] = None

class ForecastResponse(BaseModel):
    city: str
    forecast_date: str
    current_date: str
    current_aqi: float
    current_source: str = "Unknown"
    current_pollutants: CurrentPollutants = CurrentPollutants()
    predicted_aqi: float
    predicted_category: str
    aqi_change: float
    change_direction: str
    confidence_interval: Dict[str, float]
    main_pollutant: str
    health_advisory: Dict[str, Any]
    explanation: ExplanationResponse
    trend_history: List[TrendPoint]

class MonthlyTrend(BaseModel):
    month: str
    avg_aqi: float
    max_aqi: float
    min_aqi: float

class PollutantCorrelation(BaseModel):
    pollutant: str
    correlation_with_aqi: float

class AnalyticsResponse(BaseModel):
    city: str
    monthly_trends: List[MonthlyTrend]
    category_distribution: Dict[str, int]
    pollutant_correlations: List[PollutantCorrelation]
    seasonal_summary: Dict[str, float]
    covid_period_impact: Dict[str, Any]

class MetricSet(BaseModel):
    mae: Optional[float] = None
    rmse: Optional[float] = None
    r2: Optional[float] = None
    accuracy: Optional[float] = None
    weighted_f1: Optional[float] = None
    precision: Optional[float] = None
    recall: Optional[float] = None
    adjacent_accuracy: Optional[float] = None
    confusion_matrix: Optional[List[List[int]]] = None
    labels: Optional[List[str]] = None

class ModelResult(BaseModel):
    val_metrics: MetricSet
    test_metrics: MetricSet
    is_selected: bool = False

class ModelMetricsResponse(BaseModel):
    selected_regression_model: str
    selected_classification_model: str
    regression_models: Dict[str, ModelResult]
    classification_models: Dict[str, ModelResult]

class FeatureImportanceItem(BaseModel):
    feature: str
    importance: float

class GlobalImportanceResponse(BaseModel):
    features: List[FeatureImportanceItem]
