import urllib.request
import json

headers = {'User-Agent': 'Mozilla/5.0'}
ds_ids = ['tor24/india-air-quality-mini-001', 'tor24/indian-cities-air-quality', 'omkarrkr/indian-cities-air-quality']
for ds in ds_ids:
    url = f"https://huggingface.co/api/datasets/{ds}/tree/main"
    try:
        r = urllib.request.urlopen(urllib.request.Request(url, headers=headers))
        tree = json.loads(r.read())
        files = [item['path'] for item in tree if item['type'] == 'file']
        print(f"Dataset {ds} files:", files)
        for fpath in files:
            if fpath.endswith('.csv'):
                raw_u = f"https://huggingface.co/datasets/{ds}/raw/main/{fpath}"
                print("Downloading CSV from HF:", raw_u)
                urllib.request.urlretrieve(raw_u, 'city_day.csv')
                print("Downloaded successfully!")
                break
    except Exception as e:
        print("Error checking tree for", ds, e)
