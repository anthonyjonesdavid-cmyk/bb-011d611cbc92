import sys,io
from PIL import Image
from playwright.sync_api import sync_playwright
B=sys.argv[1]
with sync_playwright() as p:
  b=p.webkit.launch()
  for w,h in [(390,844),(430,932)]:
   for th in ('light','sepia','night'):
    c=b.new_context(viewport={'width':w,'height':h},device_scale_factor=3,has_touch=True,is_mobile=True);pg=c.new_page()
    pg.goto(B);pg.evaluate(f"localStorage.setItem('yb.theme','\"{th}\"')");pg.reload();pg.wait_for_selector('#daily .ref')
    pg.add_style_tag(content='header#top{padding-top:59px!important}')  # simulate iPhone safe area
    pg.wait_for_timeout(300);hh=pg.evaluate("document.querySelector('#top').offsetHeight")
    im=Image.open(io.BytesIO(pg.screenshot(clip={'x':0,'y':0,'width':w,'height':120}))).convert('RGB');s=3
    band=set(im.getpixel((x,y)) for y in range(0,59*s) for x in range(0,w*s,7))
    side=set(im.getpixel((x,y)) for y in range(0,(hh-1)*s-2) for x in (5,w*s//4,w*s-5) )
    meta=pg.evaluate("document.querySelector('meta[name=theme-color]').content")
    print(w,th,'header h',hh,'status band colors',band,'header-bg column colors',side,'meta',meta)
    pg.screenshot(path=f'shots/top36-{th}-{w}.png',clip={'x':0,'y':0,'width':w,'height':260})
    c.close()
