"""Check all local pages, links, assets, labels, IDs and common header/footer."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit,unquote
import re
root=Path(__file__).resolve().parent.parent
class Page(HTMLParser):
 def __init__(self,text):
  super().__init__();self.ids=[];self.links=[];self.assets=[];self.images=[];self.controls=[];self.labels=[];self.styles=[];self.h1=0;self.feed(text)
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if 'id' in a:self.ids.append(a['id'])
  if tag=='h1':self.h1+=1
  if tag=='a' and 'href' in a:self.links.append(a['href'])
  if tag=='link' and a.get('rel')=='stylesheet':self.styles.append(a.get('href'))
  if tag in ['script','img'] and 'src' in a:self.assets.append(a['src'])
  if tag=='link' and 'href' in a:self.assets.append(a['href'])
  if tag=='img':self.images.append(a)
  if tag in ['input','select','textarea'] and a.get('type') not in ['hidden','submit','button']:self.controls.append(a)
  if tag=='label':self.labels.append(a.get('for'))
pages={p.name:Page(p.read_text()) for p in root.glob('*.html')};errors=[]
headers=set();footers=set()
for name,p in pages.items():
 text=(root/name).read_text()
 headers.add(re.search(r'<header.*?</header>',text,re.S).group())
 footers.add(re.search(r'<footer.*?</footer>',text,re.S).group())
 if p.h1!=1:errors.append(f'{name}: {p.h1} h1 elements')
 if len(p.ids)!=len(set(p.ids)):errors.append(f'{name}: duplicate IDs')
 if p.styles!=['assets/css/main.css']:errors.append(f'{name}: not exactly one local CSS file')
 for img in p.images:
  if not img.get('alt'):errors.append(f'{name}: missing image alt')
 for c in p.controls:
  if c.get('id') not in p.labels and not c.get('aria-label'):errors.append(f'{name}: unlabeled {c}')
 for link in p.links+p.assets:
  url=urlsplit(link)
  if url.scheme or url.netloc:
   if link in p.assets:errors.append(f'{name}: remote asset {link}')
   continue
  target=unquote(url.path) or name
  if not (root/target).exists():errors.append(f'{name}: missing {target}')
  if url.fragment and target in pages and url.fragment not in pages[target].ids:errors.append(f'{name}: missing anchor {link}')
 if ' style=' in text:errors.append(f'{name}: inline CSS')
assert len(headers)==1,'Headers differ'
assert len(footers)==1,'Footers differ'
assert not errors,'\n'.join(errors)
print(f'OK: {len(pages)} pages; links, anchors, assets, labels, headings, IDs, shared header/footer and single local CSS checked.')
