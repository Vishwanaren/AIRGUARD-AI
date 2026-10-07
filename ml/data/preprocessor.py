"""
Data Preprocessing Layer for AIRGUARD AI.
Handles sorting by City & Date, duplicate removal, time-aware missing value imputation,
and outlier handling without target leakage.
"""

import logging
import pandas as pd
import numpy as np

logger = logging.getLogger("AirGuardPreprocessor")

class Preprocessor:
    POLLUTANTS = ['PM2.5', 'PM10', 'NO', 'NO2', 'NOx', 'NH3', 'CO', 'SO2', 'O3', 'Benzene', 'Toluene', 'Xylene']
    
    def __init__(self, clip_outliers: bool = True):
        self.clip_outliers = clip_outliers

    def preprocess(self, df: pd.DataFrame) -> pd.DataFrame:
        logger.info("Starting data preprocessing pipeline...")
        df = df.copy()

        # 1. Date parsing & validation
        df['Date'] = pd.to_datetime(df['Date'], errors='coerce')
        df = df.dropna(subset=['Date', 'City']).copy()

        # 2. Sort by City and Date
        df = df.sort_values(by=['City', 'Date']).reset_index(drop=True)

        # 3. Deduplication by City and Date
        initial_count = len(df)
        df = df.drop_duplicates(subset=['City', 'Date'], keep='last').reset_index(drop=True)
        if len(df) < initial_count:
            logger.info(f"Removed {initial_count - len(df)} duplicate (City, Date) records.")

        # 4. Ensure complete daily date grid per city to prevent gaps in time-series
        city_dfs = []
        for city, group in df.groupby('City'):
            group = group.set_index('Date')
            # Reindex to complete daily range
            min_date, max_date = group.index.min(), group.index.max()
            full_idx = pd.date_range(start=min_date, end=max_date, freq='D')
            group = group.reindex(full_idx)
            group['City'] = city
            group.index.name = 'Date'
            group = group.reset_index()

            # 5. Time-aware missing-value handling (Interpolate + ffill + bfill strictly per city)
            num_cols = [c for c in self.POLLUTANTS + ['AQI'] if c in group.columns]
            for col in num_cols:
                # Linear time-aware interpolation
                group[col] = group[col].interpolate(method='linear', limit_direction='both')
                # Fallback ffill and bfill
                group[col] = group[col].ffill().bfill()
                
            city_dfs.append(group)

        df = pd.concat(city_dfs, ignore_index=True)

        # 6. Outlier Handling (clip negative values and upper unphysical bounds)
        if self.clip_outliers:
            for col in self.POLLUTANTS:
                if col in df.columns:
                    df[col] = df[col].clip(lower=0.0, upper=1500.0)
            if 'AQI' in df.columns:
                df['AQI'] = df['AQI'].clip(lower=0.0, upper=1000.0)

        logger.info(f"Preprocessing finished. Clean dataset shape: {df.shape}")
        return df
