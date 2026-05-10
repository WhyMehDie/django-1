from PIL import Image
import os

folder = r"c:\Users\abden\Downloads\MOVEZ\frontend\public\sponsors"
# Only process the logos that looked good without background.
files = ['logitech.png', 'nike_sports.png', 'royal_air_maroc.png', 'sidi_ali.png']

for file in files:
    path = os.path.join(folder, file)
    if not os.path.exists(path):
        continue
    
    try:
        img = Image.open(path).convert("RGBA")
        datas = img.getdata()

        new_data = []
        for item in datas:
            r, g, b, a = item
            # Remove white and light gray (checkerboard)
            if abs(r - g) < 15 and abs(g - b) < 15 and r > 175:
                new_data.append((255, 255, 255, 0))
            else:
                new_data.append(item)

        img.putdata(new_data)
        img.save(path, "PNG")
        print(f"Removed fake checkerboard background from {file}")
    except Exception as e:
        print(f"Failed to process {file}: {e}")
