import sys
sys.path.insert(0, '.')

from backend.app.services.data_service import DataService
from backend.app.services.forecast_service import ForecastService

ds = DataService.get_instance()
fs = ForecastService.get_instance()

for city in ['Chennai', 'Delhi', 'Mumbai', 'Bengaluru']:
    fc = fs.get_forecast(city)
    print(f"City: {fc['city']}")
    print(f"  Today ({fc['current_date']}): Current AQI = {fc['current_aqi']}")
    print(f"  Tomorrow ({fc['forecast_date']}): Forecast AQI = {fc['predicted_aqi']} [{fc['predicted_category']}]")
