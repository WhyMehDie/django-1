from PIL import Image
import os

folder = r"c:\Users\abden\Downloads\MOVEZ\frontend\public\sponsors"
files = ['maroc_telecom.png', 'red_bull.png']

def is_checkerboard(r, g, b, a):
    if a == 0: return True
    # Is it white or light gray?
    return abs(r - g) < 20 and abs(g - b) < 20 and r > 170

for file in files:
    path = os.path.join(folder, file)
    if not os.path.exists(path):
        continue
    
    try:
        img = Image.open(path).convert("RGBA")
        width, height = img.size
        pixels = img.load()
        
        visited = set()
        queue = []
        
        # Add all border pixels that match checkerboard criteria
        for x in range(width):
            if is_checkerboard(*pixels[x, 0]):
                queue.append((x, 0))
                visited.add((x, 0))
            if is_checkerboard(*pixels[x, height-1]):
                queue.append((x, height-1))
                visited.add((x, height-1))
                
        for y in range(height):
            if is_checkerboard(*pixels[0, y]):
                queue.append((0, y))
                visited.add((0, y))
            if is_checkerboard(*pixels[width-1, y]):
                queue.append((width-1, y))
                visited.add((width-1, y))
                
        # BFS traversal to remove connected background
        head = 0
        while head < len(queue):
            cx, cy = queue[head]
            head += 1
            
            pixels[cx, cy] = (255, 255, 255, 0)
            
            for nx, ny in [(cx-1, cy), (cx+1, cy), (cx, cy-1), (cx, cy+1)]:
                if 0 <= nx < width and 0 <= ny < height:
                    if (nx, ny) not in visited:
                        visited.add((nx, ny))
                        if is_checkerboard(*pixels[nx, ny]):
                            queue.append((nx, ny))
                            
        img.save(path, "PNG")
        print(f"Smart background removal applied to {file}")
    except Exception as e:
        print(f"Failed to process {file}: {e}")
