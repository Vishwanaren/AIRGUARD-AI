"""Data access layer. Historical training data is immutable and kept separate from live data."""
import os
import logging
import pandas as pd
import numpy as np
from backend.app.core.config import settings
from backend.app.services.live_aqi_service import LiveAQIService
from ml.data.loader import DataLoader, get_aqi_bucket
from ml.data.preprocessor import Preprocessor

logger = logging.getLogger("AirGuardDataService")

class DataService:
    _instance = None
    def __init__(self):
        self.clean_file = os.path.join(settings.ARTIFACTS_DIR, "clean_air_quality.csv")
        self.df = None
        self.live_service = LiveAQIService.get_instance()
        self.load_data()

    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            cls._instance = DataService()
        return cls._instance

    def load_data(self):
        if os.path.exists(self.clean_file):
            self.df = pd.read_csv(self.clean_file)
            self.df['Date'] = pd.to_datetime(self.df['Date'])
        else:
            loader = DataLoader(file_path=settings.DATA_PATH)
            raw_df = loader.load_data()
            self.df = Preprocessor().preprocess(raw_df)
            os.makedirs(settings.ARTIFACTS_DIR, exist_ok=True)
            self.df.to_csv(self.clean_file, index=False)
        self.df = self.df.sort_values(['City', 'Date']).reset_index(drop=True)
        # IMPORTANT: never shift historical dates and never overwrite them with live readings.

    def get_live_current(self, city: str):
        return self.live_service.fetch_live_aqi(city)

    def get_all_cities(self) -> list:
        cities_info = []
        for city, group in self.df.groupby('City'):
            historical_latest = group.sort_values('Date').iloc[-1]
            live = self.get_live_current(city)
            if live:
                latest_aqi = live['AQI']
                latest_category = get_aqi_bucket(latest_aqi)
                latest_date = pd.Timestamp.now(tz='Asia/Kolkata').strftime('%Y-%m-%d')
                pollutants = {p: live.get(p, 0) for p in ['PM2.5','PM10','NO2','SO2','CO','O3']}
            else:
                latest_aqi = float(historical_latest['AQI'])
                latest_category = str(historical_latest['AQI_Bucket'])
                latest_date = historical_latest['Date'].strftime('%Y-%m-%d')
                pollutants = {p: historical_latest.get(p, 0) for p in ['PM2.5','PM10','NO2','SO2','CO','O3']}
            main_p = max(pollutants, key=lambda p: float(pollutants.get(p) or 0))
            cities_info.append({
                'name': city, 'state': str(historical_latest.get('state', 'India')),
                'latest_date': latest_date, 'latest_aqi': round(float(latest_aqi)),
                'latest_category': latest_category, 'main_pollutant': main_p
            })
        return sorted(cities_info, key=lambda x: x['name'])

    def get_city_history(self, city: str, days: int = None) -> pd.DataFrame:
        city_key = city.strip().title()
        city_df = self.df[self.df['City'].str.lower() == city_key.lower()].sort_values('Date').copy()
        if city_df.empty:
            for existing_city in self.df['City'].unique():
                if existing_city.lower() in city_key.lower() or city_key.lower() in existing_city.lower():
                    city_df = self.df[self.df['City'] == existing_city].sort_values('Date').copy()
                    break
        if days and not city_df.empty:
            city_df = city_df.tail(days)
        return city_df

    def get_forecast_history(self, city: str, days: int = 30) -> pd.DataFrame:
        """Return recent live/model history for inference only; never mutate the historical dataset."""
        records = self.live_service.fetch_real_historical_30days(city)
        if records:
            df = pd.DataFrame(records)
            df['Date'] = pd.to_datetime(df['Date'])
            return df.sort_values('Date').tail(days).reset_index(drop=True)
        return self.get_city_history(city, days=days)
