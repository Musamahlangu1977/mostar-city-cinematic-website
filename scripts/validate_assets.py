#!/usr/bin/env python3
"""Basic local asset validation for the static Mostar website."""
from pathlib import Path
import re
import sys
root = Path(__file__).resolve().parents[1]
required = ['index.html','styles.css','script.js','gallery.css','gallery.js','assets/photos/credits.json']
errors=[]
for f in required:
    if not (root/f).is_file(): errors.append('Missing '+f)
for name in ['index.html','styles.css','gallery.css']:
    p=root/name
    if not p.exists(): continue
    src=p.read_text(encoding='utf-8')
    refs=re.findall(r'''(?:src|href)\s*=\s*['\"]([^'\"]+)['\"]|url\(\s*['\"]?([^)'\"]+)''',src)
    for parts in refs:
        ref=next(filter(None,parts),'').split('?')[0].split('#')[0]
        if not ref or ref.startswith(('http:','https:','data:','#','mailto:','//')): continue
        if not (root / ref.lstrip('/')).exists(): errors.append(f'{name}: missing {ref}')
print('\n'.join(errors) if errors else 'Local asset checks completed successfully')
sys.exit(bool(errors))
