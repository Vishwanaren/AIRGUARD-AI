"""
Health Check Endpoint for AIRGUARD AI.
GET /api/health
"""

from fastapi import APIRouter
from datetime import datetime
from backend.app.models.schemas import HealthResponse
from backend.app.services.data_service import DataService
from backend.app.services.forecast_service import ForecastService

router = APIRouter()

@router.get("/health", response_model=HealthResponse)
def get_health():
    ds = DataService.get_instance()
    fs = ForecastService.get_instance()
    rows = len(ds.df) if ds.df is not None else 0
    models_ok = bool(fs.reg_model is not None and fs.clf_model is not None)
    
    return HealthResponse(
        status="healthy" if models_ok else "degraded",
        timestamp=datetime.utcnow().isoformat(),
        dataset_rows=rows,
        models_loaded=models_ok,
        version="1.0.0"
    )
