"""
SQLAlchemy ORM Models for AIRGUARD AI.
Tables: cities, air_quality, predictions, model_metrics
"""

from sqlalchemy import Column, Integer, String, Float, DateTime, Text
from datetime import datetime
from backend.app.core.database import Base

class CityModel(Base):
    __tablename__ = "cities"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    state = Column(String, nullable=True)
    country = Column(String, default="India")
    lat = Column(Float, nullable=True)
    lon = Column(Float, nullable=True)

class AirQualityModel(Base):
    __tablename__ = "air_quality"

    id = Column(Integer, primary_key=True, index=True)
    city = Column(String, index=True, nullable=False)
    date = Column(DateTime, index=True, nullable=False)
    pm25 = Column(Float, nullable=True)
    pm10 = Column(Float, nullable=True)
    no2 = Column(Float, nullable=True)
    so2 = Column(Float, nullable=True)
    co = Column(Float, nullable=True)
    o3 = Column(Float, nullable=True)
    aqi = Column(Float, nullable=False)
    aqi_bucket = Column(String, nullable=False)

class PredictionModel(Base):
    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, index=True)
    city = Column(String, index=True, nullable=False)
    prediction_date = Column(DateTime, nullable=False)
    target_date = Column(DateTime, nullable=False)
    predicted_aqi = Column(Float, nullable=False)
    predicted_category = Column(String, nullable=False)
    actual_aqi = Column(Float, nullable=True)
    actual_category = Column(String, nullable=True)
    error = Column(Float, nullable=True)
    explanation_json = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class ModelMetricsModel(Base):
    __tablename__ = "model_metrics"

    id = Column(Integer, primary_key=True, index=True)
    model_name = Column(String, nullable=False)
    model_type = Column(String, nullable=False) # 'regression' or 'classification'
    val_mae = Column(Float, nullable=True)
    val_rmse = Column(Float, nullable=True)
    val_r2 = Column(Float, nullable=True)
    val_f1 = Column(Float, nullable=True)
    test_mae = Column(Float, nullable=True)
    test_rmse = Column(Float, nullable=True)
    test_r2 = Column(Float, nullable=True)
    test_f1 = Column(Float, nullable=True)
    is_selected = Column(Integer, default=0)
