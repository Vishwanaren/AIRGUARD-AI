"""
Cities Endpoint for AIRGUARD AI.
GET /api/cities
"""

from fastapi import APIRouter
from typing import List
from backend.app.models.schemas import CityInfo
from backend.app.services.data_service import DataService

router = APIRouter()

@router.get("/cities", response_model=List[CityInfo])
def get_cities():
    ds = DataService.get_instance()
    return ds.get_all_cities()
