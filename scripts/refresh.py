"""Refresh reading times, related links, and RSS after editing posts. Standard library only."""
from pathlib import Path
import json,re,html,math
from email.utils import format_datetime
from datetime import datetime,timezone
from xml.etree import ElementTree as ET
R=Path(__file__).resolve().parents[1]
p=R/'assets/js/posts.js'
posts=json.loads(p.read_text().split('var POSTS = ',1)[1].strip().removesuffix(';'))
for post in posts:
 s=(R/post['url']).read_text(); body=s.split('<div class="post__body">',1)[1].split('<footer class="post__footer">')[0].split('<aside class="revision-note"',1)[0]
 words=html.unescape(re.sub('<[^>]+>',' ',body)).split()
 post['readingMinutes']=max(1,math.ceil(len(words)/220))
p.write_text('// Published entries. Run python3 scripts/refresh.py after editing.\nvar POSTS = '+json.dumps(posts,indent=2,ensure_ascii=False)+';\n')
for post in posts:
 page=R/post['url'];s=page.read_text()
 title=html.escape(post['title'], quote=True)
 s=re.sub(r'<title>.*?</title>',lambda m:'<title>'+title+' · Compounding</title>',s)
 s=re.sub(r'(<h1 class="post__title">).*?(</h1>)',lambda m:m[1]+title+m[2],s)
 for attr in ['property="og:title"','name="twitter:title"']:
  s=re.sub('(<meta '+attr+' content=")[^"]*("[^>]*>)',lambda m:m[1]+title+m[2],s)
 s=re.sub(r'\n\s*<p class="post__reading[^\"]*">.*?</p>','',s)
 s=s.replace('</header>\n\n      <div class="post__body">',f'</header>\n        <p class="post__reading section__note">{html.escape(post["topic"])} · About {post["readingMinutes"]} min read</p>\n\n      <div class="post__body">')
 s=re.sub(r'\s*<aside class="revision-note".*?</aside>','',s,flags=re.S)
 s=re.sub(r'\s*<meta property="article:modified_time"[^>]*>','',s)
 if post.get('revision'):
  when=datetime.fromisoformat(post['updated'])
  label=when.strftime('%B ') + str(when.day) + when.strftime(', %Y')
  note=f'<aside class="revision-note" aria-label="Revision note"><p><strong>Updated <time datetime="{post["updated"]}">{label}</time></strong></p><p>{html.escape(post["revision"])}</p></aside>'
  s=s.replace('<footer class="post__footer">',note+'\n\n      <footer class="post__footer">')
  s=s.replace('</head>',f'<meta property="article:modified_time" content="{post["updated"]}" />\n</head>')
 related=next((x for x in posts if x['topic']==post['topic'] and x['url']!=post['url'] and not x.get('draft')),None)
 s=re.sub(r'<div class="read-next">.*?</div>\s*','',s,flags=re.S)
 if related:
  block=f'<div class="read-next"><p class="eyebrow">Read next</p><a href="{Path(related["url"]).name}">{html.escape(related["title"])}</a></div>'
  s=s.replace('<footer class="post__footer">','<footer class="post__footer">\n        '+block)
 page.write_text(s)
base='https://compoundingwithliam.com/'
root=ET.Element('rss',version='2.0');channel=ET.SubElement(root,'channel')
for k,v in [('title','Compounding by Liam Rodgers'),('link',base),('description','Research, trading reflections, and field notes from learning finance.'),('language','en-us')]:ET.SubElement(channel,k).text=v
for post in sorted(posts,key=lambda x:x['date'],reverse=True):
 if post.get('draft'):continue
 item=ET.SubElement(channel,'item')
 for k,v in [('title',post['title']),('link',base+post['url']),('guid',base+post['url']),('description',post['excerpt']),('category',post['topic']),('pubDate',format_datetime(datetime.fromisoformat(post['date']).replace(tzinfo=timezone.utc)))]:ET.SubElement(item,k).text=v
ET.indent(root);ET.ElementTree(root).write(R/'feed.xml',encoding='utf-8',xml_declaration=True)
# Keep the static archive available when JavaScript is unavailable.
for page,limit in [('index.html',3),('journal.html',None)]:
 path=R/page;s=path.read_text()
 items=sorted((x for x in posts if not x.get('draft')),key=lambda x:x['date'],reverse=True)
 if limit: items=items[:limit]
 fallback='<noscript><ul class="plainlist">'+''.join(f'<li><a href="{x["url"]}">{html.escape(x["title"])}</a></li>' for x in items)+'</ul></noscript>'
 s=re.sub(r'<noscript>.*?</noscript>',lambda m:fallback,s,flags=re.S)
 path.write_text(s)
print(f'Refreshed {len(posts)} posts and RSS feed.')
