import urllib.request
import re
import os
import pandas as pd

urls = [
    'https://raw.githubusercontent.com/rohanrao/air-quality-data-in-india/master/city_day.csv',
    'https://raw.githubusercontent.com/rohanrao/air-quality-data-in-india/main/city_day.csv',
    'https://raw.githubusercontent.com/datasets/air-quality-india/master/city_day.csv',
    'https://raw.githubusercontent.com/Swati2401/Air-Quality-Index-Prediction/main/city_day.csv',
    'https://raw.githubusercontent.com/Swati2401/Air-Quality-Index-Prediction/master/city_day.csv',
    'https://raw.githubusercontent.com/Shruti-Sharma20/Air-Quality-Index-Prediction/main/city_day.csv',
    'https://raw.githubusercontent.com/Shruti-Sharma20/Air-Quality-Index-Prediction/master/city_day.csv',
    'https://raw.githubusercontent.com/subhashree1602/Air-Quality-Index-Prediction/main/city_day.csv',
    'https://raw.githubusercontent.com/subhashree1602/Air-Quality-Index-Prediction/master/city_day.csv',
    'https://raw.githubusercontent.com/nitesh-12/Air-Quality-Index-Prediction/master/city_day.csv',
    'https://raw.githubusercontent.com/nitesh-12/Air-Quality-Index-Prediction/main/city_day.csv',
    'https://raw.githubusercontent.com/shubh-4/Air-Quality-Data-in-India-2015-2020/master/city_day.csv',
    'https://raw.githubusercontent.com/shubh-4/Air-Quality-Data-in-India-2015-2020/main/city_day.csv',
    'https://raw.githubusercontent.com/Kritika-Sharma/Air-Quality-Data-in-India-2015-2020/master/city_day.csv',
    'https://raw.githubusercontent.com/Kritika-Sharma/Air-Quality-Data-in-India-2015-2020/main/city_day.csv',
    'https://raw.githubusercontent.com/swapan-dash/Air-Quality-Data-in-India-2015-2020/master/city_day.csv',
    'https://raw.githubusercontent.com/swapan-dash/Air-Quality-Data-in-India-2015-2020/main/city_day.csv',
]

success = False
for u in urls:
    try:
        print(f"Trying {u}...")
        urllib.request.urlretrieve(u, 'city_day.csv')
        df = pd.read_csv('city_day.csv', nrows=5)
        print("Success! Columns:", df.columns.tolist())
        success = True
        break
    except Exception as e:
        print(f"Failed: {e}")

if not success:
    print("Could not download city_day.csv directly from predefined list. Checking workspace files.")
