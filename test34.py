import sys
from playwright.sync_api import sync_playwright
B=sys.argv[1]
def vis(pg):
  return pg.evaluate("(()=>{const t=document.querySelector('#tabs').getBoundingClientRect();if(!t.height)return false;const x=t.left+t.width*0.1,y=t.top+t.height/2;const el=document.elementFromPoint(x,y);return !!el.closest('#tabs')})()")
with sync_playwright() as p:
  b=p.webkit.launch()
  for w,h in [(390,844),(430,932),(1366,1024),(1024,1366)]:
   for th in ('light','sepia','night'):
    c=b.new_context(viewport={'width':w,'height':h},device_scale_factor=2,has_touch=True,is_mobile=w<500);pg=c.new_page();e=[];pg.on('pageerror',lambda x:e.append(str(x)))
    pg.goto(B);pg.evaluate(f"localStorage.setItem('yb.theme','\"{th}\"')");pg.goto(B+'#/r/MAT/5');pg.reload();pg.wait_for_selector('#v3');r={}
    r['read']=vis(pg) and pg.is_visible('#readnav')
    pg.click('#tabs [data-t=text]');pg.wait_for_timeout(400);r['textopen']=vis(pg) and pg.is_visible('.panel')
    r['gold']=pg.evaluate("document.querySelector('#tabs .on').dataset.t")=='text'
    pb=pg.evaluate("document.querySelector('.panel').getBoundingClientRect().bottom<=document.querySelector('#tabs').getBoundingClientRect().top+1");r['above']=pb
    pg.screenshot(path=f'shots/textpanel-{th}-{w}.png')
    pg.click('#tabs [data-t=text]');pg.wait_for_timeout(200);r['toggle']=pg.is_hidden('#sheet') and pg.evaluate("document.querySelector('#tabs .on').dataset.t")=='books'
    pg.click('#tabs [data-t=text]');pg.wait_for_timeout(200);pg.click('#tabs [data-t=search]');pg.wait_for_timeout(300);r['nav']=pg.is_hidden('#sheet') and 'search' in pg.url
    pg.goto(B+'#/r/PSA/23');pg.wait_for_selector('.egg');pg.click('.egg');pg.wait_for_timeout(300);r['egg']=vis(pg) and pg.is_visible('.panel img');pg.click('text=Close')
    pg.goto(B+'#/b/GEN');pg.wait_for_timeout(300);r['chgrid']=vis(pg)
    pg.goto(B+'#/search');pg.wait_for_timeout(300);pg.focus('#q');r['kbd']=(not vis(pg)) if w<500 else vis(pg);pg.evaluate("document.activeElement.blur()");r['afterblur']=vis(pg)
    print(w,th,'OK' if all(r.values()) else r,e);c.close()
