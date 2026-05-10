import urllib.request
import json
import os
import django

# Django setup to update database later
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "sport_app.settings")
django.setup()
from competitions.models import Sponsor

folder = r"c:\Users\abden\Downloads\MOVEZ\frontend\public\sponsors"
headers = {'User-Agent': 'Mozilla/5.0'}

# 1. Fetch Maroc Telecom SVG URL via MediaWiki API
api_url = "https://commons.wikimedia.org/w/api.php?action=query&titles=File:Maroc_Telecom.svg&prop=imageinfo&iiprop=url&format=json"

req = urllib.request.Request(api_url, headers=headers)
with urllib.request.urlopen(req) as response:
    data = json.loads(response.read().decode())
    pages = data['query']['pages']
    page = list(pages.values())[0]
    if 'imageinfo' in page:
        svg_url = page['imageinfo'][0]['url']
        print(f"Found Maroc Telecom URL: {svg_url}")
        
        # Download it
        svg_path = os.path.join(folder, "maroc_telecom.svg")
        req2 = urllib.request.Request(svg_url, headers=headers)
        with urllib.request.urlopen(req2) as resp2, open(svg_path, 'wb') as f:
            f.write(resp2.read())
        print("Downloaded maroc_telecom.svg successfully")
    else:
        print("Could not find imageinfo for Maroc Telecom")

# 2. Update Database to point to .svg files for Red Bull and Maroc Telecom
updates = {
    'MAROC TELECOM': '/sponsors/maroc_telecom.svg',
    'RED BULL': '/sponsors/red_bull.svg',
}

for name, new_url in updates.items():
    if Sponsor.objects.filter(name=name).exists():
        Sponsor.objects.filter(name=name).update(logo_url=new_url)
        print(f"Updated {name} to {new_url}")

print("Fix completed!")
