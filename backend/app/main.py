"""
AIRGUARD AI FastAPI Main Application.
Registers API routers, CORS middleware, and database tables initialization.
"""

import os
import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.app.core.config import settings
from backend.app.core.database import Base, engine
from backend.app.api.v1.endpoints import (
    health,
    cities,
    historical,
    forecast,
    analytics,
    model
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("AirGuardBackendMain")

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.PROJECT_VERSION,
    description="Next-Day Air Quality Forecasting & Health Intelligence for Indian Cities"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Routers
app.include_router(health.router, prefix=settings.API_V1_STR, tags=["Health"])
app.include_router(cities.router, prefix=settings.API_V1_STR, tags=["Cities"])
app.include_router(historical.router, prefix=settings.API_V1_STR, tags=["Historical"])
app.include_router(forecast.router, prefix=settings.API_V1_STR, tags=["Forecast"])
app.include_router(analytics.router, prefix=settings.API_V1_STR, tags=["Analytics"])
app.include_router(model.router, prefix=settings.API_V1_STR, tags=["Model Insights"])

@app.get("/")
def root():
    return {
        "app": settings.PROJECT_NAME,
        "version": settings.PROJECT_VERSION,
        "docs_url": "/docs",
        "health_url": f"{settings.API_V1_STR}/health"
    }

from fastapi.responses import JSONResponse
from fastapi import Request

@app.exception_handler(404)
async def custom_404_handler(request: Request, exc):
    return JSONResponse(
        status_code=404,
        content={
            "error": "Page or API route not found",
            "path": request.url.path,
            "message": "The requested path could not be found. Please check API documentation at /docs or return to the main Dashboard."
        }
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app.main:app", host="0.0.0.0", port=8000, reload=True)
