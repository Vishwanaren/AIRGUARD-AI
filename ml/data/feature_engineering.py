"""
Feature Engineering Layer for AIRGUARD AI.
Creates time-aware lag features, rolling statistics, calendar/cyclical encodings,
pollutant ratios, and city one-hot encodings with zero data leakage.
"""

import logging
import pandas as pd
import numpy as np
from ml.data.loader import get_aqi_bucket

logger = logging.getLogger("AirGuardFeatureEngineering")

class FeatureEngineer:
    LAG_POLLUTANTS = ['AQI', 'PM2.5', 'PM10', 'NO2', 'SO2', 'CO', 'O3']
    LAG_WINDOWS = [1, 2, 3, 7]
    ROLLING_WINDOWS = [3, 7]
    
    def __init__(self, include_city_onehot: bool = True):
        self.include_city_onehot = include_city_onehot
        self.feature_names = []
        self.city_columns = []
        self.imputer_values = {}

    def create_features(self, df: pd.DataFrame, is_training: bool = True) -> pd.DataFrame:
        logger.info("Starting feature engineering...")
        df = df.copy()
        
        # Ensure sorting by City and Date
        df['Date'] = pd.to_datetime(df['Date'])
        df = df.sort_values(by=['City', 'Date']).reset_index(drop=True)

                # Ensure all training-time pollutant columns exist during live inference.
        # Live providers may not return every pollutant used by the trained model.
        required_pollutants = [
            'PM2.5', 'PM10', 'NO', 'NO2', 'NOx',
            'NH3', 'CO', 'SO2', 'O3', 'Benzene',
            'Toluene', 'Xylene', 'AQI'
        ]

        for col in required_pollutants:
            if col not in df.columns:
                fill_value = self.imputer_values.get(col, 0.0)
                df[col] = fill_value
                
        # 1. Target Creation (Tomorrow's AQI and Category within same city)
        df['target_aqi'] = df.groupby('City')['AQI'].shift(-1)
        df['target_category'] = df['target_aqi'].apply(get_aqi_bucket)

        # 2. Lag Features
        for col in self.LAG_POLLUTANTS:
            if col in df.columns:
                for lag in self.LAG_WINDOWS:
                    feat_name = f"{col}_lag_{lag}"
                    df[feat_name] = df.groupby('City')[col].shift(lag - 1)

        # 3. Rolling Features (computed on day t and earlier)
        for col in ['AQI', 'PM2.5', 'PM10']:
            if col in df.columns:
                for window in self.ROLLING_WINDOWS:
                    roll_mean = f"{col}_roll_mean_{window}d"
                    roll_std = f"{col}_roll_std_{window}d"
                    
                    df[roll_mean] = df.groupby('City')[col].transform(
                        lambda x: x.rolling(window=window, min_periods=1).mean()
                    )
                    df[roll_std] = df.groupby('City')[col].transform(
                        lambda x: x.rolling(window=window, min_periods=1).std().fillna(0.0)
                    )

        # 4. Calendar Features
        df['day'] = df['Date'].dt.day
        df['month'] = df['Date'].dt.month
        df['day_of_week'] = df['Date'].dt.dayofweek
        df['week_of_year'] = df['Date'].dt.isocalendar().week.astype(int)
        df['is_weekend'] = (df['day_of_week'] >= 5).astype(int)

        def get_season(m):
            if m in [12, 1, 2]: return 1
            elif m in [3, 4, 5]: return 2
            elif m in [6, 7, 8, 9]: return 3
            else: return 4
        df['season'] = df['month'].apply(get_season)

        # 5. Cyclical Features
        df['month_sin'] = np.sin(2 * np.pi * df['month'] / 12.0)
        df['month_cos'] = np.cos(2 * np.pi * df['month'] / 12.0)
        df['day_of_week_sin'] = np.sin(2 * np.pi * df['day_of_week'] / 7.0)
        df['day_of_week_cos'] = np.cos(2 * np.pi * df['day_of_week'] / 7.0)

        # 6. Pollutant Ratios (Division by zero safe)
        df['PM2.5_PM10_ratio'] = (df['PM2.5'] / (df['PM10'] + 1e-5)).clip(0.0, 2.0)
        df['NO2_NOx_ratio'] = (df['NO2'] / (df['NOx'] + 1e-5)).clip(0.0, 2.0)

        # 7. City One-Hot Encoding
        if self.include_city_onehot:
            city_dummies = pd.get_dummies(df['City'], prefix='city', dtype=float)
            if is_training:
                self.city_columns = city_dummies.columns.tolist()
            else:
                for col in self.city_columns:
                    if col not in city_dummies.columns:
                        city_dummies[col] = 0.0
                city_dummies = city_dummies[self.city_columns]
            df = pd.concat([df, city_dummies], axis=1)

        # Determine feature names
        exclude_cols = ['City', 'Date', 'target_aqi', 'target_category', 'AQI_Bucket']
        self.feature_names = [c for c in df.columns if c not in exclude_cols]

        # 8. Feature Imputation (fill residual NaNs)
        if is_training:
            for feat in self.feature_names:
                med_val = float(df[feat].median())
                if pd.isna(med_val): med_val = 0.0
                self.imputer_values[feat] = med_val
                df[feat] = df[feat].fillna(med_val)
            df = df.dropna(subset=['target_aqi']).copy()
        else:
            for feat in self.feature_names:
                med_val = self.imputer_values.get(feat, 0.0)
                df[feat] = df[feat].fillna(med_val)

        logger.info(f"Feature engineering completed. Generated {len(self.feature_names)} features for {len(df)} samples.")
        return df

    def get_feature_names(self) -> list:
        return self.feature_names
