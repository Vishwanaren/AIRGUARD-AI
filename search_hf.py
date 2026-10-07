import urllib.request
import json

headers = {'User-Agent': 'Mozilla/5.0'}
url = "https://huggingface.co/api/datasets?search=air-quality-india"
req = urllib.request.Request(url, headers=headers)
try:
    res = urllib.request.urlopen(req)
    datasets = json.loads(res.read())
    print("Found HF datasets:", [d['id'] for d in datasets])
    for d in datasets[:5]:
        ds_id = d['id']
        file_url = f"https://huggingface.co/datasets/{ds_id}/raw/main/city_day.csv"
        print("Checking HF file:", file_url)
        try:
            r = urllib.request.urlopen(urllib.request.Request(file_url, headers=headers))
            with open('city_day.csv', 'wb') as f:
                f.write(r.read())
            print("DOWNLOADED city_day.csv FROM HF:", ds_id)
            break
        except Exception as e:
            print("Failed:", file_url, e)
except Exception as e:
    print("HF API search failed:", e)
