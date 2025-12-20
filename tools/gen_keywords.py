import re, json, pathlib
root = pathlib.Path(__file__).resolve().parents[1]
text = (root / 'src' / 'patients' / 'gregory' / 'dialogue' / 'turn1.session').read_text()
keywords = {}
for display, kid in re.findall(r'\[([^\]]+)\]<keyword:([^>]+)>', text):
    parts = kid.split('.')
    cat = parts[1] if len(parts) > 1 else 'general'
    key_name = ''.join(parts[2:]) if len(parts) > 2 else (parts[1] if len(parts) > 1 else 'item')
    keywords.setdefault(cat, {'_category': {'label': cat.title(), 'icon': 'tag', 'description': f'Auto-generated category for {cat}'}})
    keywords[cat][key_name] = {
        'id': kid,
        'displayText': display.strip(),
        'description': f'Auto-generated from turn1.session for {kid}',
        'importance': 'medium'
    }

auto = {
    '$schema': './keyword-schema.json',
    'source': 'gregory-turn1-auto',
    'displayName': 'Gregory Turn 1 Auto Keywords',
    'description': 'Auto-generated from turn1.session to satisfy references',
    'version': '0.1.0',
    'keywords': keywords,
}
out_path = root / 'src' / 'data' / 'keywords' / 'definitions' / 'gregory-turn1-auto.keywords.json'
out_path.write_text(json.dumps(auto, indent=4))
print('Wrote', out_path)
