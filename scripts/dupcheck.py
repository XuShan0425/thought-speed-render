
import re,glob,os
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
subs=open(os.path.join(ROOT,"src","common","subs.ts"),encoding="utf-8").read()
lines=re.findall(r'"([^"]{2,60})"',subs)+re.findall(r"'([^']{2,60})'",subs)
subtxt="\n".join(lines)
hits={}
for f in sorted(glob.glob(os.path.join(ROOT,"src","shots","G*","SC*.tsx"))):
    src=open(f,encoding="utf-8").read()
    sid=os.path.basename(f)[:4]
    cand=re.findall(r"<(?:CText|TechText|MonoText)[^>]*>([^<>{]{2,40})</",src)
    cand+=re.findall(r'<(?:TechSub|CText|TechText)[^>]*text="([^"]{2,40})"',src)
    for c in cand:
        c=c.strip()
        if c and c in subtxt: hits.setdefault(sid,set()).add(c)
for k,v in hits.items(): print(k,sorted(v))
print("hits",len(hits))
