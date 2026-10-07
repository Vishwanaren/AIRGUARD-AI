"""
Historical Endpoint for AIRGUARD AI.
GET /api/historical/{city}
"""

from fastapi import APIRouter, HTTPException, Query
from typing import Optional
from backend.app.models.schemas import HistoricalResponse, HistoricalPoint
from backend.app.services.data_service import DataService

router = APIRouter()

@router.get("/historical/{city}", response_model=HistoricalResponse)
def get_historical(city: str, days: Optional[int] = Query(30, ge=1, le=2000)):
    ds = DataService.get_instance()
    city_df = ds.get_city_history(city, days=days)
    if city_df.empty:
        raise HTTPException(status_code=404, detail=f"Historical data for city '{city}' not found.")

    points = []
    for _, row in city_df.iterrows():
        points.append(HistoricalPoint(
            date=row['Date'].strftime('%Y-%m-%d'),
            aqi=float(row['AQI']),
            aqi_bucket=str(row['AQI_Bucket']),
            pm25=float(row['PM2.5']) if 'PM2.5' in row and not pd_isna(row['PM2.5']) else None,
            pm10=float(row['PM10']) if 'PM10' in row and not pd_isna(row['PM10']) else None,
            no2=float(row['NO2']) if 'NO2' in row and not pd_isna(row['NO2']) else None,
            so2=float(row['SO2']) if 'SO2' in row and not pd_isna(row['SO2']) else None,
            co=float(row['CO']) if 'CO' in row and not pd_isna(row['CO']) else None,
            o3=float(row['O3']) if 'O3' in row and not pd_isna(row['O3']) else None
        ))

    return HistoricalResponse(
        city=city,
        count=len(points),
        data=points
    )

def pd_isna(val):
    import pandas as pd
    return pd.isna(val)
