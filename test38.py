import sys
from playwright.sync_api import sync_playwright
B=sys.argv[1]
with sync_playwright() as p:
  b=p.webkit.launch()
  for w,h,top in [(390,844,47),(430,932,59)]:
   for th in ('light','night'):
    c=b.new_context(viewport={'width':w,'height':h},device_scale_factor=3,has_touch=True,is_mobile=True);pg=c.new_page()
    pg.goto(B);pg.evaluate(f"localStorage.setItem('yb.theme','\"{th}\"')");pg.reload();pg.wait_for_selector('#daily .ref')
    pg.add_style_tag(content=f':root{{--sat:{top}px!important;--sab:34px!important}}');pg.wait_for_timeout(300)
    m=pg.evaluate("""(()=>{const t=document.querySelector('#tabs').getBoundingClientRect(),s=document.querySelector('#tabs svg').getBoundingClientRect(),b=document.body.getBoundingClientRect(),hd=document.querySelector('#top').getBoundingClientRect();
      return {tabsBottom:t.bottom,vh:innerHeight,bodyBottom:b.bottom,tabsH:t.height,iconBottom:Math.round(s.bottom),gapBelowIcons:Math.round(innerHeight-s.bottom),aboveHomeZone:Math.round(innerHeight-34-s.bottom),hdrTop:hd.top,hdrH:hd.height}})()""")
    print(w,th,m)
    pg.screenshot(path=f'shots/safe-{th}-{w}.png')
    c.close()
