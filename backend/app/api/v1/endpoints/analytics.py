"""
Analytics Endpoint for AIRGUARD AI.
GET /api/analytics/{city}
"""

from fastapi import APIRouter, HTTPException
from backend.app.models.schemas import AnalyticsResponse
from backend.app.services.analytics_service import AnalyticsService

router = APIRouter()

@router.get("/analytics/{city}", response_model=AnalyticsResponse)
def get_analytics(city: str):
    ans = AnalyticsService.get_instance()
    try:
        return ans.get_city_analytics(city)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch analytics for '{city}': {e}")
