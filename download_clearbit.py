import urllib.request
import os

folder = r"c:\Users\abden\Downloads\MOVEZ\frontend\public\sponsors"
images = {
    'maroc_telecom.png': 'https://logo.clearbit.com/iam.ma',
    'red_bull.png': 'https://logo.clearbit.com/redbull.com',
}

headers = {'User-Agent': 'Mozilla/5.0'}

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
