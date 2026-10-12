import sys
from playwright.sync_api import sync_playwright
B=sys.argv[1]
with sync_playwright() as p:
  b=p.webkit.launch()
  for w,h in [(390,844),(430,932)]:
   for th in ('light','sepia','night'):
    c=b.new_context(viewport={'width':w,'height':h},device_scale_factor=3,has_touch=True,is_mobile=True);pg=c.new_page()
    pg.goto(B);pg.evaluate(f"localStorage.setItem('yb.theme','\"{th}\"')");pg.reload();pg.wait_for_selector('#daily .ref');pg.wait_for_timeout(300)
    pg.screenshot(path=f'shots/hometop-{th}-{w}.png',clip={'x':0,'y':0,'width':w,'height':420})
    r=pg.evaluate("({emoji:/[\\u2600\\u263E\\u2B50]/.test(document.body.innerText),moon:document.querySelector('#moon svg')!=null,h2:document.querySelectorAll('.cover h2').length,html:getComputedStyle(document.documentElement).backgroundColor,hdr:getComputedStyle(document.querySelector('#top')).backgroundColor,meta:document.querySelector('meta[name=theme-color]').content,mb:document.querySelector('#moon').offsetWidth})")
    print(w,th,r)
    c.close()
