import re,json,glob,os
files=sorted(glob.glob('src/usfm/*.usfm'))
files=[f for f in files if (0<int(os.path.basename(f)[:2])<41) or 70<=int(os.path.basename(f)[:2])<=96]
idx=[]
def inline(s):
    s=re.sub(r'\\f .*?\\f\*','',s)
    s=re.sub(r'\\\+?w ([^|\\]*?)(\|[^\\]*)?\\\+?w\*',r'\1',s)
    s=s.replace('\\+add ','<i>').replace('\\+add*','</i>').replace('\\add ','<i>').replace('\\add*','</i>')
    s=re.sub(r'\\\+?nd ','<s>',s); s=re.sub(r'\\\+?nd\*','</s>',s)
    s=s.replace('\\wj ','<r>').replace('\\wj*','</r>')
    s=re.sub(r'\\[a-z0-9+]+\*?','',s)
    s=re.sub(r'\s+',' ',s).replace('<i> ','<i>').replace('<r> ','<r>').strip()
    s=re.sub(r' ([,.;:?!])',r'\1',s)
    return s
for i,f in enumerate(files):
    t=open(f,encoding='utf-8').read()
    code=re.search(r'\\id (\w+)',t).group(1); name=re.search(r'\\h (.+)',t).group(1).strip()
    chs=[];cur=None;title=None;para=False
    for line in t.split('\n'):
        m=re.match(r'\\(\w+)\s?(.*)',line.strip())
        if not m: 
            if cur is not None and cur and line.strip(): cur[-1]+=' '+inline(line)
            continue
        tag,rest=m.groups()
        if tag=='c': cur=[];chs.append(cur);title=None
        elif tag=='d': title=inline(rest)
        elif tag in('p','q','q1','q2','m'):
            para=True
            if rest.startswith('\\v'): line=rest; m=re.match(r'\\(\w+)\s?(.*)',rest); tag,rest=m.groups()
        if tag=='v':
            n,txt=rest.split(' ',1) if ' ' in rest else (rest,'')
            v=inline(txt)
            if title and not cur: v='<h>'+title+'</h>'+v

            para=False; cur.append(v)
    json.dump({'code':code,'name':name,'c':chs},open(f'public/data/{code}.json','w'),ensure_ascii=False,separators=(',',':'))
    idx.append({'code':code,'name':name,'ch':len(chs),'nt':int(os.path.basename(f)[:2])>=70})
json.dump(idx,open('public/data/books.json','w'),separators=(',',':'))
print(len(idx))
