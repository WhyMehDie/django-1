import urllib.request
import os

images = {
    'maroc_telecom.svg': 'https://upload.wikimedia.org/wikipedia/commons/c/ca/Maroc_Telecom_logo.svg',
    'red_bull.svg': 'https://upload.wikimedia.org/wikipedia/en/f/f5/RedBullEnergyDrink.svg',
    'logitech.svg': 'https://upload.wikimedia.org/wikipedia/commons/2/2a/Logitech_G_logo.svg',
    'royal_air_maroc.svg': 'https://upload.wikimedia.org/wikipedia/commons/4/46/Royal_Air_Maroc_Logo.svg',
    'nike_sports.svg': 'https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg',
}

folder = r"c:\Users\abden\Downloads\MOVEZ\frontend\public\sponsors"
headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

for name, url in images.items():
    path = os.path.join(folder, name)
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req) as response, open(path, 'wb') as out_file:
            data = response.read()
            out_file.write(data)
        print(f"Downloaded {name}")
    except Exception as e:
        print(f"Failed to download {name}: {e}")
