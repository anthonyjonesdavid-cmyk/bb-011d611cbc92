import sys
from playwright.sync_api import sync_playwright
B=sys.argv[1]
with sync_playwright() as p:
  b=p.webkit.launch()
  for w,h in [(390,844),(430,932),(1366,1024),(1024,1366)]:
   for th in ('light','sepia','night'):
    c=b.new_context(viewport={'width':w,'height':h},device_scale_factor=2,has_touch=True,is_mobile=w<500);pg=c.new_page();e=[];pg.on('pageerror',lambda x:e.append(str(x)))
    pg.goto(B);pg.evaluate(f"localStorage.setItem('yb.theme','\"{th}\"')");res=[]
    for hsh,exp in [('#/','home'),('#/books','books'),('#/b/GEN','books'),('#/r/MAT/5','books'),('#/search','search'),('#/saved','saved')]:
      pg.goto(B+hsh);pg.reload();pg.wait_for_timeout(500);act=pg.evaluate("[...document.querySelectorAll('#tabs .on')].map(b=>b.dataset.t).join()");res.append(act==exp)
      if hsh=='#/r/MAT/5':pg.locator('#tabs').screenshot(path=f'shots/tabs-{th}-{w}.png')
    pg.click('#tabs [data-t=text]');pg.wait_for_timeout(200);res.append(pg.evaluate("document.querySelector('#tabs .on').dataset.t")=='text');pg.click('text=Done');res.append(pg.evaluate("document.querySelector('#tabs .on').dataset.t")=='saved')
    m=pg.evaluate("({tabs:[...document.querySelectorAll('#tabs button')].map(b=>[Math.round(b.offsetWidth),b.offsetHeight]),lab:[...document.querySelectorAll('#tabs button')].map(b=>b.getAttribute('aria-label')),hdr:document.querySelector('#top').getBoundingClientRect().top+','+document.querySelector('#top').offsetHeight,bg:getComputedStyle(document.querySelector('#tabs')).backgroundColor,gold:getComputedStyle(document.querySelector('#tabs .on')).color})")
    print(w,th,all(res),m['tabs'][0],m['hdr'],m['bg'],m['gold'],e)
    if w==390 and th=='light':print(m['lab'])
    pg.screenshot(path=f'shots/saved-{th}-{w}.png');c.close()
