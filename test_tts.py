import sys
from playwright.sync_api import sync_playwright
base=sys.argv[1] if len(sys.argv)>1 else 'http://localhost:8765/'
MOCK="""(()=>{const said=[];window.__said=said;let cur=null,t=null;
const ss={speaking:false,paused:false,pending:false,getVoices:()=>[{name:'Samantha',lang:'en-US',voiceURI:'sam',localService:true},{name:'Ava (Premium)',lang:'en-US',voiceURI:'ava',localService:true},{name:'Daniel',lang:'en-GB',voiceURI:'dan',localService:true},{name:'Zarvox',lang:'en-US',voiceURI:'z'}],
speak(u){said.push(u.text+'|'+(u.voice&&u.voice.name)+'|'+u.rate);cur=u;ss.speaking=true;t=setTimeout(()=>{ss.speaking=false;u.onend&&u.onend()},250)},
cancel(){clearTimeout(t);if(cur){const u=cur;cur=null;ss.speaking=false;u.onerror&&u.onerror({error:'interrupted'})}},pause(){},resume(){},addEventListener(){}};
Object.defineProperty(window,'speechSynthesis',{value:ss});window.SpeechSynthesisUtterance=function(t){this.text=t}})()"""
with sync_playwright() as p:
  b=p.webkit.launch()
  for w,h in [(390,844),(430,932),(1366,1024),(1024,1366)]:
    c=b.new_context(viewport={'width':w,'height':h},device_scale_factor=2,has_touch=True);c.add_init_script(MOCK);pg=c.new_page();errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.goto(base+'#/r/PSA/23');pg.wait_for_selector('#v1');pg.click('#play');pg.wait_for_timeout(700)
    pg.click('#v5');pg.wait_for_timeout(100);sp=pg.evaluate("document.querySelector('.v.speaking').id")
    pg.evaluate("document.body.className='night'");pg.wait_for_timeout(300);pg.screenshot(path=f'shots/playing-night-{w}.png');pg.evaluate("document.body.className='light'")
    pg.screenshot(path=f'shots/playing-{w}.png')
    pg.wait_for_timeout(1200);loc=pg.evaluate('location.hash');btn=pg.inner_text('#play')
    pg.click('#play');n=pg.evaluate('__said.length');pg.wait_for_timeout(600);n2=pg.evaluate('__said.length')
    said=pg.evaluate('__said')
    print(w,'jump',sp,'hash',loc,'btn',btn,'paused stable',n==n2,'errs',errs);
    if w==390: print('\n'.join(said[:3]),'...',said[-1])
    c.close()
