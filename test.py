import sys
from playwright.sync_api import sync_playwright
base=sys.argv[1] if len(sys.argv)>1 else 'http://localhost:8765/'
with sync_playwright() as p:
  b=p.webkit.launch()
  for w,h in [(390,844),(430,932),(1366,1024),(1024,1366)]:
    c=b.new_context(viewport={'width':w,'height':h},device_scale_factor=2,is_mobile=w<500,has_touch=True)
    pg=c.new_page();errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.goto(base);pg.wait_for_selector('#daily .ref');pg.screenshot(path=f'shots/home-{w}.png');pg.screenshot(path=f'shots/home-full-{w}.png',full_page=False)
    pg.evaluate("localStorage.setItem('yb.theme','\"auto\"')")
    pg.goto(base+'#/r/MAT/5');pg.wait_for_selector('#v3');pg.wait_for_timeout(400)
    red=pg.eval_on_selector('#v3 r','e=>getComputedStyle(e).color');pg.screenshot(path=f'shots/matt5-{w}.png')
    pg.click('#moon');pg.wait_for_timeout(300);nred=pg.eval_on_selector('#v3 r','e=>getComputedStyle(e).color');bg=pg.evaluate('getComputedStyle(document.body).backgroundColor');pg.screenshot(path=f'shots/night-matt5-{w}.png');pg.click('#moon');pg.wait_for_timeout(300)
    pg.goto(base+'#/r/PSA/23');pg.wait_for_selector('.egg');pg.click('.egg');pg.wait_for_selector('.panel img');pg.wait_for_timeout(500);pg.screenshot(path=f'shots/egg-{w}.png')
    pg.goto(base+'#/books');pg.wait_for_timeout(300);pg.screenshot(path=f'shots/books-{w}.png')
    small=pg.evaluate("[...document.querySelectorAll('button')].filter(b=>b.offsetParent&&(b.offsetHeight<44||b.offsetWidth<44)).map(b=>b.textContent).slice(0,5)")
    print(w,h,'red',red,'night',nred,bg,'small',small,'errs',errs)
    if False:
      pg.goto(base);pg.wait_for_timeout(2500);pg.reload();pg.wait_for_timeout(800)
      sw=pg.evaluate("navigator.serviceWorker.controller!=null");c.set_offline(True)
      pg.evaluate("location.hash='#/r/REV/22'");pg.wait_for_selector('#v16');print('offline sw',sw,pg.inner_text('#v16')[:60])
      pg.goto(base+'#/search');pg.fill('#q','shepherd');pg.press('#q','Enter');pg.wait_for_selector('.res');print('offline search',pg.inner_text('#out .muted'))
    c.close()
