"""Compute sampled contrast from task-owned transparent-text background captures."""
import json,re
from pathlib import Path
from PIL import Image
p=Path(__file__).resolve().parents[1]/'qa'
def lum(rgb):
    c=[x/255 for x in rgb]
    c=[x/12.92 if x<=.04045 else ((x+.055)/1.055)**2.4 for x in c]
    return sum(a*b for a,b in zip(c,[.2126,.7152,.0722]))
rows=json.loads((p/'site-review-background-samples.json').read_text(encoding='utf-8'))
for row in rows:
    fg=lum([float(x) for x in re.findall(r'[\d.]+',row['color'])][:3])
    im=Image.open(row['file']).convert('RGB');ratios=[]
    for y in range(max(1,int(im.height*.25)),int(im.height*.75),2):
        for x in range(max(1,int(im.width*.08)),int(im.width*.92),2):
            bg=lum(im.getpixel((x,y)))
            ratios.append((max(fg,bg)+.05)/(min(fg,bg)+.05))
    row.update(min_ratio=round(min(ratios),2),pass_check=min(ratios)>=4.5,samples=len(ratios),method='Rendered background sampled in central text region with only target text color transparent; crop inset excludes adjacent glyphs from rotated bounding box. Not full WCAG audit.')
(p/'site-review-rendered-contrast.json').write_text(json.dumps(rows,ensure_ascii=False,indent=2),encoding='utf-8')
print([(r['theme'],r['name'],r['min_ratio'],r['pass_check']) for r in rows])
