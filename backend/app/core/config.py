"""
Configuration settings for AIRGUARD AI Backend.
"""

import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "AIRGUARD AI"
    PROJECT_VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    
    # Paths
    BASE_DIR: str = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
    ARTIFACTS_DIR: str = os.path.join(BASE_DIR, "artifacts")
    DATA_PATH: str = os.path.join(BASE_DIR, "city_day.csv")
    
    # SQLite Database
    DATABASE_URL: str = f"sqlite:///{os.path.join(BASE_DIR, 'airguard.db')}"
    
    # CORS
    CORS_ORIGINS: list[str] = ["*"]
    DATA_GOV_API_KEY: str = ""

    class Config:
        env_file = ".env"
        extra = "allow"

settings = Settings()
