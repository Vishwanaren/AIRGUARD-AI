import urllib.request
import json

cities = {
    'Chennai': (13.0827, 80.2707),
    'Delhi': (28.6139, 77.2090),
    'Mumbai': (19.0760, 72.8777)
}

print('=== OPEN-METEO WEATHER TEST ===')
for city, (lat, lon) in cities.items():
    try:
        url = f'https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,wind_direction_10m&timezone=Asia%2FKolkata'
        req = urllib.request.Request(url, headers={'User-Agent': 'AirGuard/1.0'})
        res = urllib.request.urlopen(req, timeout=5)
        data = json.loads(res.read().decode('utf-8'))
        c = data.get('current', {})
        print(f"{city}: Temp = {c.get('temperature_2m')} °C | Humidity = {c.get('relative_humidity_2m')} % | Wind = {c.get('wind_speed_10m')} km/h")
    except Exception as e:
        print(city, 'error:', e)
