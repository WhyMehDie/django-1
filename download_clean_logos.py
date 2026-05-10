import urllib.request
import os

images = {
    'maroc_telecom.png': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Maroc_Telecom_logo.svg/512px-Maroc_Telecom_logo.svg.png',
    'red_bull.png': 'https://upload.wikimedia.org/wikipedia/en/thumb/f/f5/RedBullEnergyDrink.svg/512px-RedBullEnergyDrink.svg.png',
    'logitech.png': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Logitech_G_logo.svg/512px-Logitech_G_logo.svg.png',
    'royal_air_maroc.png': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Royal_Air_Maroc_Logo.svg/512px-Royal_Air_Maroc_Logo.svg.png',
    'nike_sports.png': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Logo_NIKE.svg/512px-Logo_NIKE.svg.png',
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
        print(f"Downloaded clean transparent version of {name}")
    except Exception as e:
        print(f"Failed to download {name}: {e}")
