# Делает иконки приложения для Android из icon.png (запускается автоматически на GitHub)
from PIL import Image, ImageDraw
import os
src = Image.open('icon.png').convert('RGBA')
for d, s in {'mdpi': 48, 'hdpi': 72, 'xhdpi': 96, 'xxhdpi': 144, 'xxxhdpi': 192}.items():
    p = f'android/app/src/main/res/mipmap-{d}'
    os.makedirs(p, exist_ok=True)
    im = src.resize((s, s), Image.LANCZOS)
    for name, round_ in (('ic_launcher.png', False), ('ic_launcher_round.png', True)):
        m = Image.new('L', (s * 4, s * 4), 0)
        dr = ImageDraw.Draw(m)
        if round_:
            dr.ellipse((0, 0, s * 4 - 1, s * 4 - 1), fill=255)
        else:
            dr.rounded_rectangle((0, 0, s * 4 - 1, s * 4 - 1), radius=int(s * 0.8), fill=255)
        o = im.copy()
        o.putalpha(m.resize((s, s), Image.LANCZOS))
        o.save(f'{p}/{name}')
