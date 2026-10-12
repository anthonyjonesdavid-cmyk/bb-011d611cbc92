import sys
exec(open('test_tts.py').read().split('with sync_playwright')[0])
MOCK2=MOCK.replace("{name:'Ava (Premium)',lang:'en-US',voiceURI:'ava',localService:true},","")
from playwright.sync_api import sync_playwright
B=sys.argv[1]
with sync_playwright() as p:
  b=p.webkit.launch()
  for w,h in [(390,844),(430,932),(1366,1024),(1024,1366)]:
   for th in ('light','sepia','night'):
    c=b.new_context(viewport={'width':w,'height':h},device_scale_factor=2,has_touch=True);c.add_init_script(MOCK2);pg=c.new_page();e=[];pg.on('pageerror',lambda x:e.append(str(x)))
    pg.goto(B+'#/r/MAT/5');pg.wait_for_selector('#v3');pg.evaluate(f"localStorage.setItem('yb.theme','\"{th}\"')");pg.reload();pg.wait_for_selector('#v3')
    pg.locator('#readnav').screenshot(path=f'shots/bar-idle-{th}-{w}.png');pg.screenshot(path=f'shots/read-idle-{th}-{w}.png')
    pg.click('#play');pg.wait_for_timeout(100);pg.click('#v3');pg.wait_for_timeout(600)
    pg.locator('#readnav').screenshot(path=f'shots/bar-playing-{th}-{w}.png');pg.screenshot(path=f'shots/read-playing-{th}-{w}.png')
    bb=pg.locator('#play').bounding_box();pg.click('#play')
    pg.click('#tabs [data-t=text]');pg.wait_for_selector('#vh');pg.click('#vhok');hint=pg.locator('#vh').count();pg.click('text=Done');pg.click('#tabs [data-t=text]');again=pg.locator('#vh').count()
    print(w,th,bb['width'],bb['height'],'hint gone',hint,again,e)
    c.close()
