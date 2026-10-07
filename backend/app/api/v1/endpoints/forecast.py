"""
Forecast Endpoints for AIRGUARD AI.
GET /api/forecast/{city}
GET /api/forecast/{city}/explanation
"""

from fastapi import APIRouter, HTTPException
from backend.app.models.schemas import ForecastResponse, ExplanationResponse
from backend.app.services.forecast_service import ForecastService

router = APIRouter()

@router.get("/forecast/{city}", response_model=ForecastResponse)
def get_forecast(city: str):
    fs = ForecastService.get_instance()
    try:
        return fs.get_forecast(city)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate forecast for '{city}': {e}")

@router.get("/forecast/{city}/explanation", response_model=ExplanationResponse)
def get_explanation(city: str):
    fs = ForecastService.get_instance()
    try:
        return fs.get_explanation_only(city)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate explanation for '{city}': {e}")
