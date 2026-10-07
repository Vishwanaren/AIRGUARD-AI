import urllib.request
import re

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
req = urllib.request.Request('https://html.duckduckgo.com/html/?q=site:github.com+city_day.csv+PM2.5', headers=headers)
try:
    content = urllib.request.urlopen(req).read().decode('utf-8')
    matches = re.findall(r'github\.com/([^/\s\"\']+)/([^/\s\"\']+)/(?:blob|raw)/([^/\s\"\']+)/.*?city_day\.csv', content)
    print("Found GitHub matches:", set(matches))
    for user, repo, branch in set(matches):
        raw_url = f"https://raw.githubusercontent.com/{user}/{repo}/{branch}/city_day.csv"
        print("Checking raw URL:", raw_url)
        try:
            r = urllib.request.urlopen(raw_url)
            if r.status == 200:
                with open('city_day.csv', 'wb') as f:
                    f.write(r.read())
                print("DOWNLOAD SUCCESSFUL FROM:", raw_url)
                break
        except Exception as err:
            print("Failed:", err)
except Exception as e:
    print("DDG search failed:", e)
