"""
Analytics Service for AIRGUARD AI.
Provides rich historical analytics, monthly trends, pollutant correlations,
seasonal breakdowns, and COVID lockdown comparative analysis.
"""

import logging
import pandas as pd
import numpy as np
from backend.app.services.data_service import DataService

logger = logging.getLogger("AirGuardAnalyticsService")

class AnalyticsService:
    _instance = None

    def __init__(self):
        self.data_service = DataService.get_instance()

    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            cls._instance = AnalyticsService()
        return cls._instance

    def get_city_analytics(self, city: str) -> dict:
        city_df = self.data_service.get_city_history(city)
        if city_df.empty:
            raise ValueError(f"City '{city}' not found in database.")

        # 1. Monthly Trends
        city_df['month_name'] = city_df['Date'].dt.strftime('%b')
        city_df['month_num'] = city_df['Date'].dt.month
        monthly = []
        for (m_num, m_name), g in city_df.groupby(['month_num', 'month_name']):
            monthly.append({
                'month': m_name,
                'avg_aqi': round(float(g['AQI'].mean()), 1),
                'max_aqi': round(float(g['AQI'].max()), 1),
                'min_aqi': round(float(g['AQI'].min()), 1)
            })
        monthly = sorted(monthly, key=lambda x: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].index(x['month']))

        # 2. Category Distribution
        cat_counts = city_df['AQI_Bucket'].value_counts().to_dict()
        categories = ['Good', 'Satisfactory', 'Moderate', 'Poor', 'Very Poor', 'Severe']
        dist = {c: int(cat_counts.get(c, 0)) for c in categories}

        # 3. Pollutant Correlations with AQI
        pollutants = ['PM2.5', 'PM10', 'NO2', 'SO2', 'CO', 'O3', 'NO', 'NH3']
        correlations = []
        for p in pollutants:
            if p in city_df.columns and city_df[p].notnull().any():
                corr_val = city_df[p].corr(city_df['AQI'])
                if not np.isnan(corr_val):
                    correlations.append({
                        'pollutant': p,
                        'correlation_with_aqi': round(float(corr_val), 3)
                    })
        correlations = sorted(correlations, key=lambda x: abs(x['correlation_with_aqi']), reverse=True)

        # 4. Seasonal Summary
        def season_label(m):
            if m in [12, 1, 2]: return 'Winter'
            elif m in [3, 4, 5]: return 'Summer'
            elif m in [6, 7, 8, 9]: return 'Monsoon'
            else: return 'Post-Monsoon'

        city_df['season_name'] = city_df['month_num'].apply(season_label)
        seasonal = {}
        for s_name, g in city_df.groupby('season_name'):
            seasonal[s_name] = round(float(g['AQI'].mean()), 1)

        # 5. COVID Lockdown Period Analysis (March - June 2020 vs 2018-2019 baseline)
        covid_2020 = city_df[(city_df['Date'] >= '2020-03-24') & (city_df['Date'] <= '2020-06-30')]
        pre_covid = city_df[(city_df['Date'] >= '2018-03-24') & (city_df['Date'] <= '2019-06-30')]
        
        covid_avg = round(float(covid_2020['AQI'].mean()), 1) if not covid_2020.empty else 0.0
        pre_covid_avg = round(float(pre_covid['AQI'].mean()), 1) if not pre_covid.empty else 0.0
        pct_change = round(((covid_avg - pre_covid_avg) / (pre_covid_avg + 1e-5)) * 100.0, 1)

        covid_impact = {
            'period': 'March 24 - June 30, 2020',
            'covid_period_avg_aqi': covid_avg,
            'pre_covid_baseline_avg_aqi': pre_covid_avg,
            'percentage_reduction': abs(pct_change) if pct_change < 0 else 0.0,
            'summary': f"AQI dropped by {abs(pct_change)}% during the spring 2020 national lockdown due to reduced industrial activity and transport emissions."
        }

        return {
            'city': city,
            'monthly_trends': monthly,
            'category_distribution': dist,
            'pollutant_correlations': correlations,
            'seasonal_summary': seasonal,
            'covid_period_impact': covid_impact
        }
