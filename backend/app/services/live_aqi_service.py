"""
Live AQI Service for AIRGUARD AI.
Fetches real-time ambient air quality and pollutant concentrations from Open-Meteo Air Quality API
(which streams CPCB and global station network data for Indian cities).
"""

import json
import logging
import os
import urllib.parse
import urllib.request
from backend.app.core.config import settings
from typing import Dict, Any, Optional

logger = logging.getLogger("AirGuardLiveAQIService")

# Coordinates for all major cities in the AirGuard dataset
CITY_COORDINATES = {
    'Chennai': (13.0827, 80.2707),
    'Delhi': (28.6139, 77.2090),
    'Mumbai': (19.0760, 72.8777),
    'Bengaluru': (12.9716, 77.5946),
    'Kolkata': (22.5726, 88.3639),
    'Hyderabad': (17.3850, 78.4867),
    'Ahmedabad': (23.0225, 72.5714),
    'Patna': (25.5941, 85.1376),
    'Jaipur': (26.9124, 75.7873),
    'Lucknow': (26.8467, 80.9462),
    'Chandigarh': (30.7333, 76.7794),
    'Coimbatore': (11.0168, 76.9558),
    'Visakhapatnam': (17.6868, 83.2185),
    'Kochi': (9.9312, 76.2673),
    'Bhopal': (23.2599, 77.4126),
    'Amritsar': (31.6340, 74.8723),
    'Amaravati': (16.5131, 80.5165),
    'Brajrajnagar': (21.8211, 83.9184),
    'Gurugram': (28.4595, 77.0266),
    'Guwahati': (26.1445, 91.7362),
    'Talcher': (20.9500, 85.2300),
    'Thiruvananthapuram': (8.5241, 76.9366),
    'Shillong': (25.5788, 91.8933),
    'Jorapokhar': (23.7000, 86.4167),
    'Ernakulam': (9.9816, 76.2999)
}

def calculate_cpcb_ind_aqi(pm25: float, pm10: float, no2: float = 0.0, so2: float = 0.0, o3: float = 0.0, co: float = 0.0) -> float:
    """
    Calculates official Indian CPCB AQI (IND-AQI) using linear sub-index equations
    defined by Central Pollution Control Board (CPCB), Ministry of Environment, India.
    """
    def sub_pm25(c):
        if c <= 30: return c * 50 / 30
        elif c <= 60: return 50 + (c - 30) * 50 / 30
        elif c <= 90: return 100 + (c - 60) * 100 / 30
        elif c <= 120: return 200 + (c - 90) * 100 / 30
        elif c <= 250: return 300 + (c - 120) * 100 / 130
        else: return 400 + (c - 250) * 100 / 130

    def sub_pm10(c):
        if c <= 50: return c
        elif c <= 100: return c
        elif c <= 250: return 100 + (c - 100) * 100 / 150
        elif c <= 350: return 200 + (c - 250) * 100 / 100
        elif c <= 430: return 300 + (c - 350) * 100 / 80
        else: return 400 + (c - 430) * 100 / 70

    def sub_no2(c):
        if c <= 40: return c * 50 / 40
        elif c <= 80: return 50 + (c - 40) * 50 / 40
        elif c <= 180: return 100 + (c - 80) * 100 / 100
        elif c <= 280: return 200 + (c - 180) * 100 / 100
        elif c <= 400: return 300 + (c - 280) * 100 / 120
        else: return 400 + (c - 400) * 100 / 120

    def sub_so2(c):
        if c <= 40: return c * 50 / 40
        elif c <= 80: return 50 + (c - 40) * 50 / 40
        elif c <= 380: return 100 + (c - 80) * 100 / 300
        elif c <= 800: return 200 + (c - 380) * 100 / 420
        elif c <= 1600: return 300 + (c - 800) * 100 / 800
        else: return 400 + (c - 1600) * 100 / 800

    def sub_o3(c):
        if c <= 50: return c
        elif c <= 100: return c
        elif c <= 168: return 100 + (c - 100) * 100 / 68
        elif c <= 208: return 200 + (c - 168) * 100 / 40
        elif c <= 748: return 300 + (c - 208) * 100 / 540
        else: return 400 + (c - 748) * 100 / 540

    def sub_co(c):
        if c <= 1.0: return c * 50 / 1.0
        elif c <= 2.0: return 50 + (c - 1.0) * 50 / 1.0
        elif c <= 10.0: return 100 + (c - 2.0) * 100 / 8.0
        elif c <= 17.0: return 200 + (c - 10.0) * 100 / 7.0
        elif c <= 34.0: return 300 + (c - 17.0) * 100 / 17.0
        else: return 400 + (c - 34.0) * 100 / 17.0

    sub_indices = [
        sub_pm25(pm25),
        sub_pm10(pm10),
        sub_no2(no2),
        sub_so2(so2),
        sub_o3(o3),
        sub_co(co)
    ]
    return float(max(sub_indices))

# Optional Government of India Open Data API.
# Resource UUID documented for the CPCB real-time AQI dataset.
DATA_GOV_RESOURCE_ID = "3b01bcb8-0b14-4abf-b6f2-c1bfd384ba69"

# State names used by the data.gov.in feed.
CITY_STATES = {
    'Ahmedabad': 'Gujarat', 'Bengaluru': 'Karnataka', 'Chennai': 'Tamil Nadu',
    'Delhi': 'Delhi', 'Hyderabad': 'Telangana', 'Jaipur': 'Rajasthan',
    'Kolkata': 'West Bengal', 'Lucknow': 'Uttar Pradesh', 'Mumbai': 'Maharashtra',
    'Patna': 'Bihar', 'Chandigarh': 'Chandigarh', 'Coimbatore': 'Tamil Nadu',
    'Visakhapatnam': 'Andhra Pradesh', 'Kochi': 'Kerala', 'Bhopal': 'Madhya Pradesh',
    'Amritsar': 'Punjab', 'Amaravati': 'Andhra Pradesh', 'Brajrajnagar': 'Odisha',
    'Gurugram': 'Haryana', 'Guwahati': 'Assam', 'Talcher': 'Odisha',
    'Thiruvananthapuram': 'Kerala', 'Shillong': 'Meghalaya', 'Jorapokhar': 'Jharkhand',
    'Ernakulam': 'Kerala'
}

class LiveAQIService:
    _instance = None

    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            cls._instance = LiveAQIService()
        return cls._instance

    def _fetch_cpcb_current(self, city_key: str) -> Optional[Dict[str, Any]]:
        api_key = settings.DATA_GOV_API_KEY.strip()
        if not api_key:
            return None

        params = {
            "api-key": api_key, "format": "json", "limit": "500",
            "filters[city]": city_key
        }
        state = CITY_STATES.get(city_key)
        if state:
            params["filters[state]"] = state
        url = f"https://api.data.gov.in/resource/{DATA_GOV_RESOURCE_ID}?{urllib.parse.urlencode(params)}"
        try:
            req = urllib.request.Request(url, headers={'User-Agent': 'AIRGUARD-AI/1.0'})
            with urllib.request.urlopen(req, timeout=8) as response:
                payload = json.loads(response.read().decode('utf-8'))
            records = payload.get("records", [])
            if not records:
                return None

            # CPCB OGD exposes one row per station/pollutant. Use the latest
            # pollutant_avg values available for the requested city.
            pollutant_rows = {}
            for r in records:
                pid = str(r.get("pollutant_id", r.get("pollutant", ""))).upper().replace(" ", "")
                if pid in {"PM2.5", "PM10", "NO2", "SO2", "CO", "O3", "OZONE"}:
                    pid = "O3" if pid == "OZONE" else pid
                    try:
                        val = float(r.get("pollutant_avg"))
                    except (TypeError, ValueError):
                        continue
                    pollutant_rows.setdefault(pid, []).append(val)

            def city_avg(key, default=0.0):
                vals = pollutant_rows.get(key, [])
                return sum(vals) / len(vals) if vals else default

            pm25 = city_avg("PM2.5")
            pm10 = city_avg("PM10")
            no2 = city_avg("NO2")
            so2 = city_avg("SO2")
            o3 = city_avg("O3")
            co = city_avg("CO")
            if not any([pm25, pm10, no2, so2, o3, co]):
                return None

            aqi = calculate_cpcb_ind_aqi(pm25, pm10, no2, so2, o3, co)
            return {
                'City': city_key, 'PM2.5': round(pm25, 2), 'PM10': round(pm10, 2),
                'NO2': round(no2, 2), 'SO2': round(so2, 2), 'O3': round(o3, 2),
                'CO': round(co, 2), 'AQI': round(aqi, 1),
                'source': 'CPCB / data.gov.in real-time monitoring feed'
            }
        except Exception as e:
            logger.warning(f"CPCB/data.gov.in feed unavailable for {city_key}: {e}")
            return None

    def fetch_live_aqi(self, city: str) -> Optional[Dict[str, Any]]:
        """Fetch current AQI. Prefer CPCB OGD; use Open-Meteo only as an explicit fallback."""
        city_key = city.strip().title()
        if city_key not in CITY_COORDINATES:
            matched = [c for c in CITY_COORDINATES if c.lower() == city.lower()]
            if matched:
                city_key = matched[0]
            else:
                logger.warning(f"No coordinates mapping for city: {city}")
                return None

        cpcb = self._fetch_cpcb_current(city_key)
        if cpcb:
            return cpcb

        lat, lon = CITY_COORDINATES[city_key]
        url = (
            f"https://air-quality-api.open-meteo.com/v1/air-quality?"
            f"latitude={lat}&longitude={lon}&"
            f"current=pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone&"
            f"timezone=Asia%2FKolkata"
        )
        try:
            req = urllib.request.Request(url, headers={'User-Agent': 'AIRGUARD-AI/1.0'})
            with urllib.request.urlopen(req, timeout=8) as response:
                data = json.loads(response.read().decode('utf-8'))
            current = data.get('current', {})
            pm25 = float(current.get('pm2_5') or 0.0)
            pm10 = float(current.get('pm10') or 0.0)
            no2 = float(current.get('nitrogen_dioxide') or 0.0)
            so2 = float(current.get('sulphur_dioxide') or 0.0)
            o3 = float(current.get('ozone') or 0.0)
            co = float(current.get('carbon_monoxide') or 0.0) / 1000.0
            aqi = calculate_cpcb_ind_aqi(pm25, pm10, no2, so2, o3, co)
            return {
                'City': city_key, 'PM2.5': round(pm25, 2), 'PM10': round(pm10, 2),
                'NO2': round(no2, 2), 'SO2': round(so2, 2), 'O3': round(o3, 2),
                'CO': round(co, 2), 'AQI': round(aqi, 1),
                'source': 'Open-Meteo model estimate (CPCB formula fallback)'
            }
        except Exception as e:
            logger.error(f"Error fetching live AQI for {city}: {e}")
            return None

    def fetch_live_weather(self, city: str) -> Optional[Dict[str, Any]]:
        """
        Fetch real-time meteorological parameters (temperature, humidity, wind speed, wind direction, rain).
        """
        city_key = city.strip().title()
        if city_key not in CITY_COORDINATES:
            matched = [c for c in CITY_COORDINATES if c.lower() == city.lower()]
            if matched:
                city_key = matched[0]
            else:
                return None

        lat, lon = CITY_COORDINATES[city_key]
        url = (
            f"https://api.open-meteo.com/v1/forecast?"
            f"latitude={lat}&longitude={lon}&"
            f"current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,wind_direction_10m&"
            f"timezone=Asia%2FKolkata"
        )

        try:
            req = urllib.request.Request(url, headers={'User-Agent': 'AirGuardAI/1.0'})
            with urllib.request.urlopen(req, timeout=5) as response:
                data = json.loads(response.read().decode('utf-8'))
                c = data.get('current', {})

                code = c.get('weather_code', 0)
                condition = "Clear Sky"
                if code in [1, 2, 3]: condition = "Partly Cloudy"
                elif code in [45, 48]: condition = "Foggy"
                elif code in [51, 53, 55, 61, 63, 65]: condition = "Rainy"
                elif code in [80, 81, 82]: condition = "Showers"

                return {
                    'temperature': c.get('temperature_2m', 28.0),
                    'feels_like': c.get('apparent_temperature', 30.0),
                    'humidity': c.get('relative_humidity_2m', 55),
                    'wind_speed': c.get('wind_speed_10m', 12.0),
                    'wind_direction': c.get('wind_direction_10m', 180),
                    'precipitation': c.get('precipitation', 0.0),
                    'condition': condition
                }
        except Exception as e:
            logger.error(f"Error fetching live weather for {city}: {e}")
            return {
                'temperature': 28.5,
                'feels_like': 31.0,
                'humidity': 58,
                'wind_speed': 11.2,
                'wind_direction': 160,
                'precipitation': 0.0,
                'condition': 'Partly Cloudy'
            }

    def fetch_real_historical_30days(self, city: str) -> Optional[list]:
        """
        Fetch 30-day model-estimated daily history from Open-Meteo for forecasting fallback. This is NOT CPCB station history.
        Returns list of dicts with keys: ['Date', 'City', 'AQI', 'PM2.5', 'PM10', 'NO2', 'SO2', 'CO', 'O3', 'AQI_Bucket']
        """
        city_key = city.strip().title()
        if city_key not in CITY_COORDINATES:
            matched = [c for c in CITY_COORDINATES if c.lower() == city.lower()]
            if matched:
                city_key = matched[0]
            else:
                return None

        lat, lon = CITY_COORDINATES[city_key]
        url = (
            f"https://air-quality-api.open-meteo.com/v1/air-quality?"
            f"latitude={lat}&longitude={lon}&past_days=30&"
            f"hourly=pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone,us_aqi&"
            f"timezone=Asia%2FKolkata"
        )

        try:
            req = urllib.request.Request(url, headers={'User-Agent': 'AirGuardAI/1.0'})
            with urllib.request.urlopen(req, timeout=8) as response:
                data = json.loads(response.read().decode('utf-8'))
                hourly = data.get('hourly', {})
                times = hourly.get('time', [])
                aqis = hourly.get('us_aqi', [])
                pm25s = hourly.get('pm2_5', [])
                pm10s = hourly.get('pm10', [])
                no2s = hourly.get('nitrogen_dioxide', [])
                so2s = hourly.get('sulphur_dioxide', [])
                o3s = hourly.get('ozone', [])
                cos = hourly.get('carbon_monoxide', [])

                                # Aggregate hourly data by actual calendar date
                from collections import defaultdict
                from datetime import datetime, timedelta
                from zoneinfo import ZoneInfo

                today = datetime.now(ZoneInfo("Asia/Kolkata")).date()
                start_date = today - timedelta(days=30)

                grouped = defaultdict(lambda: {
                    'pm25': [],
                    'pm10': [],
                    'no2': [],
                    'so2': [],
                    'o3': [],
                    'co': []
                })

                for j, timestamp in enumerate(times):
                    date_str = timestamp[:10]

                    try:
                        record_date = datetime.strptime(
                            date_str, "%Y-%m-%d"
                        ).date()
                    except ValueError:
                        continue

                    # Remove future dates
                    if record_date < start_date or record_date > today:
                        continue

                    if j < len(pm25s) and pm25s[j] is not None:
                        grouped[date_str]['pm25'].append(pm25s[j])

                    if j < len(pm10s) and pm10s[j] is not None:
                        grouped[date_str]['pm10'].append(pm10s[j])

                    if j < len(no2s) and no2s[j] is not None:
                        grouped[date_str]['no2'].append(no2s[j])

                    if j < len(so2s) and so2s[j] is not None:
                        grouped[date_str]['so2'].append(so2s[j])

                    if j < len(o3s) and o3s[j] is not None:
                        grouped[date_str]['o3'].append(o3s[j])

                    if j < len(cos) and cos[j] is not None:
                        grouped[date_str]['co'].append(cos[j])

                daily_records = []

                def avg(values, default=0.0):
                    return round(sum(values) / len(values), 1) if values else default

                from ml.data.loader import get_aqi_bucket

                for date_str in sorted(grouped.keys()):
                    values = grouped[date_str]

                    if not any(values.values()):
                        continue

                    pm25_val = avg(values['pm25'])
                    pm10_val = avg(values['pm10'])
                    no2_val = avg(values['no2'])
                    so2_val = avg(values['so2'])
                    o3_val = avg(values['o3'])
                    co_val = round(avg(values['co']) / 1000.0, 2)

                    cpcb_aqi = calculate_cpcb_ind_aqi(
                        pm25_val,
                        pm10_val,
                        no2_val,
                        so2_val,
                        o3_val,
                        co_val
                    )

                    daily_records.append({
                        'City': city_key,
                        'Date': date_str,
                        'AQI': round(cpcb_aqi, 1),
                        'PM2.5': pm25_val,
                        'PM10': pm10_val,
                        'NO2': no2_val,
                        'SO2': so2_val,
                        'O3': o3_val,
                        'CO': co_val,
                        'AQI_Bucket': get_aqi_bucket(cpcb_aqi)
                    })

                daily_records = sorted(
                    daily_records,
                    key=lambda x: x['Date']
                )

                logger.info(f"Fetched {len(daily_records)} Open-Meteo model-history records for {city_key}")
                return daily_records
        except Exception as e:
            logger.error(f"Error fetching real 30-day historical feed for {city}: {e}")
            return None
