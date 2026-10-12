'use strict';
const $=s=>document.querySelector(s), V=$('#view');
const LS={get:(k,d)=>{try{const v=localStorage.getItem('yb.'+k);return v==null?d:JSON.parse(v)}catch(e){return d}},set:(k,v)=>localStorage.setItem('yb.'+k,JSON.stringify(v))};
let BOOKS=[],EGGS={},cache={},cur=null,sel=null;
const DAILY=['PSA 23:1','JHN 3:16','PRO 3:5','ISA 40:31','PHP 4:13','ROM 8:28','JER 29:11','PSA 46:1','MAT 11:28','LAM 3:22','PSA 121:1','JOS 1:9','ISA 41:10','PSA 118:24','PHP 4:6','MAT 5:8','JHN 14:27','PSA 37:4','2CO 5:7','NUM 6:24','PSA 91:1','ROM 15:13','1PE 5:7','HEB 11:1','PSA 139:14','MIC 6:8','JHN 15:12','PSA 103:2','ECC 3:1','ZEP 3:17','1JN 4:19'];
const strip=h=>h.replace(/<h>.*?<\/h>/g,'').replace(/<[^>]+>/g,'').replace(/¶\s?/g,'');
const parse=r=>{const m=r.trim().match(/^(\w+)\s+(\d+):(\d+)$/);return m&&{b:m[1].toUpperCase(),c:+m[2],v:+m[3]}};
const bname=c=>(BOOKS.find(b=>b.code==c)||{}).name||c;
async function book(c){if(!cache[c])cache[c]=await (await fetch('data/'+c+'.json')).json();return cache[c]}
function applyPrefs(){document.documentElement.style.setProperty('--fs',LS.get('fs',24)+'px');let t=LS.get('theme','light');if(t=='dark')t='night';const n=t=='auto'?(matchMedia('(prefers-color-scheme: dark)').matches?'night':'light'):t;document.body.className=n;
  const m=document.querySelector('meta[name=theme-color]');if(m)m.content=getComputedStyle(document.body).getPropertyValue('--bar').trim();const mo=document.getElementById('moon');if(mo){mo.textContent=n=='night'?'☀':'☾';mo.setAttribute('aria-label',n=='night'?'Day mode':'Night mode')}}
matchMedia('(prefers-color-scheme: dark)').addEventListener('change',applyPrefs);
function toggleNight(){const night=document.body.className=='night';if(!night&&LS.get('theme','light')!='night')LS.set('dayTheme',LS.get('theme','light')=='auto'?'light':LS.get('theme','light'));LS.set('theme',night?(LS.get('dayTheme','light')):'night');applyPrefs();toast(night?'Day mode':'Night mode')}
function toast(t){const e=$('#toast');e.textContent=t;e.hidden=false;clearTimeout(e._t);e._t=setTimeout(()=>e.hidden=true,1800)}
function chrome(title,tab,back,reading){$('#title').textContent=title;$('#back').hidden=!back;document.querySelectorAll('#tabs button').forEach(b=>b.classList.toggle('on',b.dataset.t==tab));$('#readnav').hidden=!reading;V.scrollTop=0}
function go(h){location.hash=h}
$('#moon').onclick=toggleNight;
$('#back').onclick=()=>history.length>1?history.back():go('#/');
document.querySelectorAll('#tabs button').forEach(b=>b.onclick=()=>{const t=b.dataset.t;if(t=='text')return textSheet();go(t=='home'?'#/':'#/'+t)});

async function home(){chrome("Yvonne's Bible",'home');
  const day=Math.floor((Date.now()-new Date().getTimezoneOffset()*6e4)/864e5),d=parse(DAILY[day%DAILY.length]),last=LS.get('last');
  V.innerHTML=`<div class="wrap"><div class="cover"><div class="orn">✦ ✦ ✦</div><h2>Yvonne's Bible</h2><p class="ded">With love from your family</p><div class="muted">The Holy Bible · King James Version</div></div>
  <div class="card" id="daily"><h3>Today's verse</h3><p>…</p></div>${last?`<button class="cont" onclick="go('#/r/${last.b}/${last.c}')">Continue: ${bname(last.b)} ${last.c} ›</button>`:''}${bookGrid()}</div>`;
  const bk=await book(d.b);$('#daily').innerHTML=`<h3>Today's verse</h3><p>${bk.c[d.c-1][d.v-1].replace(/<h>.*?<\/h>/,'').replace(/¶\s?/,'')}</p><div class="ref">${bname(d.b)} ${d.c}:${d.v}</div>`;
  $('#daily').onclick=()=>go(`#/r/${d.b}/${d.c}/${d.v}`)}
function bookGrid(){const g=nt=>BOOKS.filter(b=>b.nt==nt).map(b=>`<button onclick="go('#/b/${b.code}')">${b.name}</button>`).join('');
  return `<div class="sect">Old Testament</div><div class="grid bk">${g(false)}</div><div class="sect">New Testament</div><div class="grid bk">${g(true)}</div>`}
function books(){chrome('Books','books');V.innerHTML=`<div class="wrap">${bookGrid()}</div>`}
function chapters(c){const b=BOOKS.find(x=>x.code==c);chrome(b.name,'books',true);
  if(b.ch==1)return go(`#/r/${c}/1`);
  V.innerHTML=`<div class="wrap"><div class="sect">Chapters</div><div class="grid nums">${Array.from({length:b.ch},(_,i)=>`<button onclick="go('#/r/${c}/${i+1}')">${i+1}</button>`).join('')}</div></div>`}
async function read(c,ch,vv,dir){ch=+ch;const b=BOOKS.find(x=>x.code==c),bk=await book(c);if(!bk.c[ch-1])return go('#/b/'+c);
  cur={b:c,c:ch};LS.set('last',cur);chrome(b.name,'books',true,true);$('#chap').textContent=`${b.name} ${ch}`;
  const hl=LS.get('hl',{}),hide=LS.get('hideEggs',false);
  V.innerHTML=`<div class="wrap ${dir?'pageturn '+(dir<0?'b':''):''}"><div class="chtitle">${b.ch>1?(c=='PSA'?'Psalm ':'Chapter ')+ch:b.name}</div><div class="text">${bk.c[ch-1].map((t,i)=>{const r=`${c} ${ch}:${i+1}`,e=EGGS[r];
    return `<span class="v${hl[r]?' hl':''}" data-r="${r}" id="v${i+1}">${(t.match(/^<h>.*?<\/h>/)||[''])[0]}<sup>${i+1}</sup>${t.replace(/^<h>.*?<\/h>/,'').replace(/¶\s?/,'')}${e&&!hide?`<button class="egg" data-egg="${r}" aria-label="A surprise">♥</button>`:''} </span>`}).join('')}</div>
  <p class="muted" style="margin-top:30px">${nextRef(1)?'Swipe or tap Next to continue':'The End'}</p></div>`;
  if(vv){const e=$('#v'+vv);if(e){e.scrollIntoView({block:'center'});e.classList.add('flash')}}}
function nextRef(d){if(!cur)return null;const i=BOOKS.findIndex(x=>x.code==cur.b),b=BOOKS[i];let c=cur.c+d;
  if(c>=1&&c<=b.ch)return[b.code,c];const nb=BOOKS[i+d];return nb?[nb.code,d>0?1:nb.ch]:null}
async function turn(d,keep){const n=nextRef(d);if(!n)return false;if(!keep)stopSpeak();history.replaceState(null,'',`#/r/${n[0]}/${n[1]}`);await read(n[0],n[1],null,d);return true}
// ---- Read aloud ----
const SS=window.speechSynthesis;let sp={on:false,i:0,tok:0},wake=null,VOICES=[];
function loadVoices(){if(!SS)return;VOICES=SS.getVoices().filter(v=>/^en[-_](US|GB|AU|IE|CA)/i.test(v.lang))}
if(SS){loadVoices();SS.addEventListener&&SS.addEventListener('voiceschanged',loadVoices)}
function score(v){let s=0;if(/premium/i.test(v.name))s+=40;if(/enhanced/i.test(v.name))s+=30;if(/en[-_]US/i.test(v.lang))s+=6;if(/en[-_]GB/i.test(v.lang))s+=4;if(/samantha|ava|allison|susan|karen|daniel|serena|zoe|evan|nathan/i.test(v.name))s+=5;if(/eloquence|grandma|grandpa|novelty|bells|bad news|bubbles|boing|cellos|jester|organ|trinoids|whisper|zarvox|albert|fred|junior|kathy|ralph|superstar|wobble|rocko|shelley|reed|sandy|flo|eddy/i.test(v.name))s-=50;if(v.localService)s+=2;return s}
function pickVoice(){const id=LS.get('voice','');return VOICES.find(v=>v.voiceURI==id)||[...VOICES].sort((a,b)=>score(b)-score(a))[0]||null}
function speechText(h){return h.replace(/<h>(.*?)<\/h>/,(m,t)=>t.replace(/[.\s]*$/,'')+'. ').replace(/<s>LORD<\/s>/g,'Lord').replace(/<s>GOD<\/s>/g,'God').replace(/<[^>]+>/g,'').replace(/¶\s?/g,'').replace(/\bLORD\b/g,'Lord')}
function playBtn(){const b=$('#play');b.textContent=sp.on?'❚❚':'▶\uFE0E';b.classList.toggle('on',sp.on);b.setAttribute('aria-label',sp.on?'Pause reading':'Read aloud')}
function mark(i){document.querySelectorAll('.v.speaking').forEach(x=>x.classList.remove('speaking'));const e=$('#v'+(i+1));if(e){e.classList.add('speaking');e.scrollIntoView({block:'center',behavior:'smooth'})}}
async function keepAwake(on){try{if(on&&'wakeLock' in navigator&&!wake){wake=await navigator.wakeLock.request('screen');wake.addEventListener('release',()=>wake=null)}if(!on&&wake){await wake.release();wake=null}}catch(e){}}
function speakFrom(i){if(!SS||!cur)return toast('Read aloud is not available');const tok=++sp.tok;SS.cancel();sp.on=true;sp.i=i;playBtn();keepAwake(true);
  const vs=cache[cur.b].c[cur.c-1];if(i>=vs.length){return endChapter(tok)}
  mark(i);const u=new SpeechSynthesisUtterance(speechText(vs[i]));const v=pickVoice();if(v){u.voice=v;u.lang=v.lang}else u.lang='en-US';u.rate=LS.get('rate',0.9);
  u.onend=()=>{if(tok==sp.tok&&sp.on)speakFrom(i+1)};u.onerror=e=>{if(tok==sp.tok&&sp.on&&e.error!='interrupted'&&e.error!='canceled')speakFrom(i+1)};
  setTimeout(()=>{if(tok==sp.tok)SS.speak(u)},SS.speaking?120:0)}
async function endChapter(tok){if(LS.get('autoNext',true)&&await turn(1,true)){if(tok==sp.tok&&sp.on)speakFrom(0)}else stopSpeak(true)}
function stopSpeak(keepPos){sp.tok++;sp.on=false;if(SS)SS.cancel();if(!keepPos)sp.i=0;keepAwake(false);if($('#play'))playBtn();document.querySelectorAll('.v.speaking').forEach(x=>x.classList.remove('speaking'))}
$('#play').onclick=()=>{if(sp.on)stopSpeak(true);else speakFrom(sp.i||firstVisible())};
function firstVisible(){const vs=[...document.querySelectorAll('.v')],top=V.getBoundingClientRect().top;const f=vs.findIndex(e=>e.getBoundingClientRect().bottom>top+10);return f<0?0:f}
document.addEventListener('visibilitychange',()=>{if(document.hidden&&sp.on)stopSpeak(true)});window.addEventListener('pagehide',()=>stopSpeak(true));
$('#prev').onclick=()=>turn(-1);$('#next').onclick=()=>turn(1);$('#chap').onclick=()=>go('#/b/'+cur.b);
let tx=0,ty=0;V.addEventListener('touchstart',e=>{tx=e.touches[0].clientX;ty=e.touches[0].clientY},{passive:true});
V.addEventListener('touchend',e=>{if($('#readnav').hidden)return;const dx=e.changedTouches[0].clientX-tx,dy=e.changedTouches[0].clientY-ty;if(Math.abs(dx)>80&&Math.abs(dx)>2*Math.abs(dy))turn(dx<0?1:-1)},{passive:true});
V.addEventListener('click',e=>{const eg=e.target.closest('.egg');if(eg){e.stopPropagation();return eggCard(eg.dataset.egg)}
  const v=e.target.closest('.v');if(v){if(sp.on)return speakFrom(+v.id.slice(1)-1);verseSheet(v.dataset.r)}});
function sheet(html){const s=$('#sheet');s.innerHTML=`<div class="panel">${html}</div>`;s.hidden=false;s.onclick=e=>{if(e.target==s)closeSheet()}}
function closeSheet(){$('#sheet').hidden=true;document.querySelectorAll('.v.sel').forEach(x=>x.classList.remove('sel'))}
function nice(r){const p=parse(r);return`${bname(p.b)} ${p.c}:${p.v}`}
function eggCard(r){const e=EGGS[r];sheet(`<div class="vref">${nice(r)}</div><h3>${e.title||'A little surprise'}</h3>${e.photo?`<img src="${e.photo}" alt="">`:''}${e.note?`<p class="msg">${e.note}</p>`:''}<button class="big" onclick="closeSheet()">Close</button>`)}
function verseSheet(r){const el=document.querySelector(`.v[data-r="${r}"]`);el.classList.add('sel');const hl=LS.get('hl',{}),bm=LS.get('bm',[]),p=parse(r);
  const txt=strip(cache[p.b].c[p.c-1][p.v-1]);
  sheet(`<div class="vref">${nice(r)}</div><p class="msg" style="font-style:normal">${txt}</p><div class="row" style="margin-top:16px"><button id="sh">${hl[r]?'Remove highlight':'Highlight'}</button><button id="sb">${bm.includes(r)?'Saved ♥':'Save'}</button></div>${EGGS[r]?'<button class="big" id="se">♥ Open the surprise</button>':''}<button class="big alt" onclick="closeSheet()">Close</button>`);
  $('#sh').onclick=()=>{hl[r]?delete hl[r]:hl[r]=1;LS.set('hl',hl);el.classList.toggle('hl',!!hl[r]);closeSheet()};
  $('#sb').onclick=()=>{const i=bm.indexOf(r);i<0?bm.unshift(r):bm.splice(i,1);LS.set('bm',bm);toast(i<0?'Saved':'Removed');closeSheet()};
  if(EGGS[r])$('#se').onclick=()=>eggCard(r)}
function textSheet(){const fs=LS.get('fs',24),th=LS.get('theme','light'),he=LS.get('hideEggs',false);
  sheet(`<h3>Text &amp; Display</h3><div class="sect">Text size</div><div class="row"><button id="fm" aria-label="Smaller">A−</button><button disabled style="border:0;font-size:${fs}px">Aa ${fs}</button><button id="fp" aria-label="Larger" style="font-size:26px">A+</button></div>
  <div class="sect">Page color</div><p class="muted" style="margin:-4px 0 10px;font-size:16px">Auto follows your iPhone's dark mode</p><div class="row">${[['light','Light'],['sepia','Sepia'],['night','Night'],['auto','Auto']].map(([t,l])=>`<button data-th="${t}" class="${t==th||(th=='dark'&&t=='night')?'on':''}">${l}</button>`).join('')}</div>
  <div class="sect">Reading aloud speed</div><div class="row">${[[0.75,'Slow'],[0.9,'Gentle'],[1,'Normal'],[1.25,'Quick']].map(([r,l])=>`<button data-rate="${r}" class="${LS.get('rate',0.9)==r?'on':''}">${l}</button>`).join('')}</div>
  <div class="sect">Voice</div><select id="voice"><option value="">Best available${pickVoice()?' ('+pickVoice().name+')':''}</option>${[...VOICES].sort((a,b)=>score(b)-score(a)).map(v=>`<option value="${v.voiceURI}" ${LS.get('voice','')==v.voiceURI?'selected':''}>${v.name} (${v.lang})</option>`).join('')}</select>
  <div class="row" style="margin-top:10px"><button id="tv">Hear sample</button></div>
  ${!VOICES.some(v=>/enhanced|premium/i.test(v.name))&&!LS.get('voiceHintDone',false)?`<div class="hint" id="vh">Tip: for a warmer voice, open iPhone Settings › Accessibility › Spoken Content › Voices › English and download an “Enhanced” or “Premium” voice (like Ava or Zoe), then reopen this app. <button id="vhok">Got it</button></div>`:''}
  <div class="sect">At end of chapter</div><div class="row"><button id="an1" class="${LS.get('autoNext',true)?'on':''}">Keep reading</button><button id="an0" class="${LS.get('autoNext',true)?'':'on'}">Stop</button></div>
  <div class="sect">Little surprises</div><div class="row"><button id="eg1" class="${he?'':'on'}">Show hearts</button><button id="eg0" class="${he?'on':''}">Hide until tapped</button></div><button class="big" onclick="closeSheet()" style="margin-top:20px">Done</button>`);
  const set=(k,v)=>{LS.set(k,v);applyPrefs();textSheet();if(cur&&!$('#readnav').hidden)read(cur.b,cur.c)};
  $('#fm').onclick=()=>set('fs',Math.max(16,fs-2));$('#fp').onclick=()=>set('fs',Math.min(44,fs+2));
  document.querySelectorAll('[data-th]').forEach(b=>b.onclick=()=>set('theme',b.dataset.th));
  document.querySelectorAll('[data-rate]').forEach(b=>b.onclick=()=>{LS.set('rate',+b.dataset.rate);textSheet()});
  if($('#vhok'))$('#vhok').onclick=()=>{LS.set('voiceHintDone',true);$('#vh').remove()};
  $('#voice').onchange=e=>LS.set('voice',e.target.value);$('#an1').onclick=()=>{LS.set('autoNext',true);textSheet()};$('#an0').onclick=()=>{LS.set('autoNext',false);textSheet()};
  $('#tv').onclick=()=>{if(!SS)return;stopSpeak(true);const u=new SpeechSynthesisUtterance('The Lord is my shepherd; I shall not want.');const v=pickVoice();if(v){u.voice=v;u.lang=v.lang}u.rate=LS.get('rate',0.9);SS.speak(u)};
  $('#eg1').onclick=()=>set('hideEggs',false);$('#eg0').onclick=()=>set('hideEggs',true)}
function saved(){chrome('Saved','saved');const bm=LS.get('bm',[]),hl=Object.keys(LS.get('hl',{}));
  const list=a=>a.map(r=>{const p=parse(r);return`<button class="res" onclick="go('#/r/${p.b}/${p.c}/${p.v}')"><b>${nice(r)}</b></button>`}).join('');
  V.innerHTML=`<div class="wrap"><div class="sect">Saved verses</div>${list(bm)||'<p class="muted">Tap any verse while reading, then tap Save.</p>'}<div class="sect">Highlights</div>${list(hl)||'<p class="muted">No highlights yet.</p>'}</div>`}
function search(){chrome('Search','search');V.innerHTML=`<div class="wrap"><input type="search" id="q" placeholder="Search words, e.g. shepherd" enterkeyhint="search" value="${LS.get('q','')}"><div id="out"><p class="muted">Type a word or phrase, then tap Search.</p></div></div>`;
  const q=$('#q');q.addEventListener('keydown',e=>{if(e.key=='Enter'){q.blur();run(q.value)}});if(q.value)run(q.value)}
async function run(q){q=q.trim();LS.set('q',q);if(q.length<2)return;const out=$('#out');out.innerHTML='<p class="muted">Searching…</p>';
  const ref=q.match(/^(\d?\s?[a-z]+)\s+(\d+)(?::(\d+))?$/i);if(ref){const n=ref[1].replace(/\s/g,'').toLowerCase(),b=BOOKS.find(b=>b.name.replace(/\s/g,'').toLowerCase().startsWith(n));if(b)return go(`#/r/${b.code}/${ref[2]}${ref[3]?'/'+ref[3]:''}`)}
  await Promise.all(BOOKS.map(b=>book(b.code)));const lq=q.toLowerCase(),res=[];
  for(const b of BOOKS)cache[b.code].c.forEach((ch,ci)=>ch.forEach((v,vi)=>{const t=strip(v);if(t.toLowerCase().includes(lq))res.push([b.code,ci+1,vi+1,t])}));
  const esc=q.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),re=new RegExp(esc,'gi');
  out.innerHTML=`<p class="muted">${res.length} verse${res.length==1?'':'s'}${res.length>300?' (showing first 300)':''}</p>`+res.slice(0,300).map(([b,c,v,t])=>`<button class="res" onclick="go('#/r/${b}/${c}/${v}')"><b>${bname(b)} ${c}:${v}</b>${t.replace(re,m=>'<mark>'+m+'</mark>')}</button>`).join('')}
function route(){closeSheet();stopSpeak();const p=location.hash.replace(/^#\/?/,'').split('/');
  if(p[0]=='books')books();else if(p[0]=='b')chapters(p[1]);else if(p[0]=='r')read(p[1],p[2],p[3]);else if(p[0]=='search')search();else if(p[0]=='saved')saved();else home()}
(async()=>{applyPrefs();BOOKS=await (await fetch('data/books.json')).json();
  try{const j=await (await fetch('eggs.json',{cache:'no-cache'})).json();(j.eggs||[]).forEach(e=>{const p=parse(e.ref);if(p)EGGS[`${p.b} ${p.c}:${p.v}`]=e})}catch(e){}
  window.addEventListener('hashchange',route);route();
  if('serviceWorker' in navigator)navigator.serviceWorker.register('sw.js')})();
