import sys
from playwright.sync_api import sync_playwright
B=sys.argv[1]
with sync_playwright() as p:
  for bt in (p.webkit,p.chromium):
    b=bt.launch()
    for w,h in [(390,844),(430,932),(1024,1366),(1366,1024),(1920,1200)]:
      c=b.new_context(viewport={'width':w,'height':h},has_touch=w<1100,is_mobile=(w<500 and bt.name=='chromium'));pg=c.new_page();e=[];pg.on('pageerror',lambda x:e.append(str(x)))
      out=[]
      for n,hs in (('home','#/'),('read','#/r/MAT/5'),('books','#/b/PSA')):
        pg.goto(B+hs);pg.wait_for_timeout(700)
        m=pg.evaluate("""(()=>{const r=s=>document.querySelector(s).getBoundingClientRect();const t=r('#tabs'),hd=r('#top'),b=r('body');
          const small=[...document.querySelectorAll('button')].filter(x=>x.offsetParent&&x.getBoundingClientRect().height>0&&(x.getBoundingClientRect().height<40||x.getBoundingClientRect().width<40)).length;
          return [Math.round(b.width)==innerWidth&&Math.round(b.height)==innerHeight, Math.round(t.width)==innerWidth&&Math.round(t.bottom)==innerHeight, Math.round(hd.width)==innerWidth&&hd.top==0, small, document.documentElement.scrollWidth<=innerWidth]})()""")
        out.append(n+':'+('OK' if m[0] and m[1] and m[2] and m[3]==0 and m[4] else str(m)))
        if w in(1920,390): pg.screenshot(path=f'shots/fill-{bt.name}-{n}-{w}.png')
      pg.goto(B+'#/r/MAT/5');pg.wait_for_selector('#v3');pg.click('#tabs [data-t=text]');pg.wait_for_timeout(300)
      if w in(1920,390): pg.screenshot(path=f'shots/fill-{bt.name}-text-{w}.png')
      print(bt.name,w,h,' '.join(out),e[:1]);c.close()
