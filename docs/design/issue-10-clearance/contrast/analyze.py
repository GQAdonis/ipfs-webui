"""Offline retained-evidence analysis. Never launches a browser or changes input files."""
import collections
import hashlib
import json
import pathlib
import re
from PIL import Image

OUT = pathlib.Path(__file__).resolve().parent
ROOT = OUT.parents[3]
SUMMARY = ROOT / 'evidence/agentic-ui-frontend/correction-batch/frontend-accessibility-family-isolation/task3/measured-correction/confirmation-summary.json'

def binding(path):
    path = pathlib.Path(path)
    return {'path': str(path), 'sha256': hashlib.sha256(path.read_bytes()).hexdigest()}

def luminance(value):
    channels = [int(value[i:i+2], 16) / 255 for i in (1, 3, 5)]
    linear = [v / 12.92 if v <= .04045 else ((v + .055) / 1.055) ** 2.4 for v in channels]
    return sum(a * b for a, b in zip(linear, [.2126, .7152, .0722]))

def contrast(a, b):
    lo, hi = sorted((luminance(a), luminance(b)))
    return (hi + .05) / (lo + .05)

tokens_path = ROOT / 'mcp/ui/src/styles/tokens.css'
css = tokens_path.read_text()
blocks = re.findall(r'\[data-ipfs-ui\](?:\[data-theme=\'light\'\])?\s*\{([^}]+)', css)
tokens = {theme: dict(re.findall(r'--([\w-]+):\s*(#[0-9a-fA-F]{6})', block)) for theme, block in zip(['dark', 'light'], blocks)}
assert tokens['dark']['surface'] == '#171614' and tokens['light']['surface'] == '#fbf9f6'

pair_sets = {
    'neutral-text-bound': [(fg, bg) for fg in ['text', 'text-muted'] for bg in ['ground', 'surface', 'raised', 'control']],
    'primary-label': [('on-accent', 'accent')],
    'ok-badge': [('ok', 'ok-tint')],
    'info-badge': [('info', 'info-tint')],
    'link-or-active-tab': [('accent-text', bg) for bg in ['surface', 'raised']],
    'fixture-heading': [('text', 'ground')],
    'clipped-event': [(fg, 'ground') for fg in ['text', 'text-muted']],
}
ratios = {theme: {name: [{'foregroundToken': fg, 'backgroundToken': bg, 'foreground': palette[fg], 'background': palette[bg], 'ratio': contrast(palette[fg], palette[bg])} for fg, bg in pairs] for name, pairs in pair_sets.items()} for theme, palette in tokens.items()}

summary = json.loads(SUMMARY.read_text())
records = pathlib.Path(summary['axe'][0]['path']).parents[1]
inspected = {
    'a2ui-a2ui-axe-light-375', 'a2ui-a2ui-axe-dark-1440',
    'context-context-axe-light-375', 'context-context-axe-dark-1440',
    'inbox-inbox-axe-inbox-light-375', 'inbox-inbox-axe-activity-dark-1440',
}
rows, reports = [], []
for entry in summary['axe']:
    report_path = pathlib.Path(entry['path'])
    bound = binding(report_path)
    assert bound['sha256'] == entry['sha256'], entry['name']
    report = json.loads(report_path.read_text())
    assert not report['violations']
    theme = 'light' if '-light-' in entry['name'] else 'dark'
    pngs = list(records.rglob(entry['name'] + '.png'))
    assert len(pngs) == 1, (entry['name'], pngs)
    png = pngs[0]
    im = Image.open(png).convert('RGB')
    # Exact stored pixels support palette presence, not per-node background assignment.
    pixel_counts = collections.Counter(im.getdata())
    png_info = {**binding(png), 'dimensions': list(im.size), 'visuallyInspected': entry['name'] in inspected,
                'paletteExactPixelCounts': {name: pixel_counts[tuple(int(color[i:i+2], 16) for i in (1, 3, 5))] for name, color in tokens[theme].items()}}
    start = len(rows)
    for rule in report['incomplete']:
        assert rule['id'] == 'color-contrast'
        for index, node in enumerate(rule['nodes']):
            checks = node['any'] + node['all'] + node['none']
            reasons = sorted(set(check['data']['messageKey'] for check in checks))
            assert len(reasons) == 1
            html = node['html']
            if reasons[0] == 'pseudoContent':
                category = 'sidebar-edge-pseudo-element'
                assert all('ac-sidebar' in related['html'] for check in checks for related in check['relatedNodes'])
                pair = 'neutral-text-bound'
                if 'iu-btn--primary' in html: pair = 'primary-label'
                elif 'iu-badge--ok' in html: pair = 'ok-badge'
                elif 'iu-badge--info' in html: pair = 'info-badge'
                elif html == '<summary>Arguments</summary>' or html == '<span>Copy</span>' or ('iu-control-tabs-trigger' in html and 'data-state="active"' in html): pair = 'link-or-active-tab'
            elif reasons[0] == 'elmPartiallyObscured' and html == '<h1>Current frontend host fixture</h1>':
                category, pair = 'fixture-only-heading-obscuration', 'fixture-heading'
            else:
                assert reasons[0] == 'elmPartiallyObscured'
                assert ('Safe bounded event ' in html or html == '<code>pin_ls</code>' or html == '<p class="text-muted-foreground">Time not reported</p>')
                category, pair = 'virtual-event-overscan-clipping', 'clipped-event'
            candidates = ratios[theme][pair]
            rows.append({'report': str(report_path), 'reportSha256': bound['sha256'], 'nodeIndex': index,
                         'theme': theme, 'category': category, 'reason': reasons[0], 'html': html,
                         'target': node['target'], 'checks': checks, 'candidatePairSet': pair,
                         'sourceCandidateMinimumRatio': min(p['ratio'] for p in candidates),
                         'candidateThreshold': 3 if pair == 'fixture-heading' else 4.5,
                         'disposition': 'retained-incomplete; source-bound-only; no manual clearance'})
    reports.append({'name': entry['name'], **bound, 'violations': 0, 'incompleteNodeOccurrences': len(rows)-start,
                    'categoryCounts': dict(collections.Counter(row['category'] for row in rows[start:])), 'png': png_info})

sources = ['mcp/ui/src/styles/tokens.css', 'mcp/ui/src/styles/base.css', 'mcp/ui/src/styles/components.css', 'mcp/ui/src/styles/chat.css', 'mcp/chat/src/styles/island.css', 'mcp/chat/src/ui/sidebar.tsx', 'mcp/chat/src/island/RunInspector.tsx', 'mcp/chat/src/island/Composer.tsx', '../ipfs-webui/test/boundary/chat-runtime/fixture.tsx', '../ipfs-webui/test/boundary/chat-runtime/browser.mjs', '../ipfs-webui/test/boundary/host-fixtures/entry.jsx']
producer_bindings = []
for path in sorted(records.rglob('*binding*.json')):
    data = json.loads(path.read_text())
    inputs = data.get('report', {}).get('inputs', [])
    producer_bindings.append({**binding(path), 'producedInputsCurrent': [{**item, 'exists': pathlib.Path(item['path']).exists(), 'currentSha256': binding(item['path'])['sha256'] if pathlib.Path(item['path']).exists() else None} for item in inputs if 'path' in item and 'sha256' in item]})

assert len(rows) == 384
result = {'schemaVersion': 1, 'kind': 'retained-incomplete-contrast-assessment', 'acceptanceAuthority': False,
          'method': 'Offline report classification, source token pair calculation, original PNG inspection and exact palette-pixel inventory; no browser, axe, runtime fixture, export or production changes.',
          'summaryBinding': binding(SUMMARY), 'reportCount': len(reports), 'occurrences': len(rows),
          'categoryCounts': dict(collections.Counter(row['category'] for row in rows)),
          'manualClearances': 0, 'retainedIncompleteOccurrences': len(rows),
          'sourceCandidateThresholdFailures': sum(row['sourceCandidateMinimumRatio'] < row['candidateThreshold'] for row in rows),
          'sources': [binding((ROOT / path).resolve()) for path in sources], 'producerBindings': producer_bindings,
          'ratios': ratios, 'reports': reports, 'nodes': rows,
          'limitations': ['Source candidate ratios are not computed runtime colors.', 'Exact palette pixel counts are image-wide, not per-node contrast measurements.', 'No geometry/computed style snapshot is retained for these incomplete nodes.', 'Virtual events 2 through 10 are clipped out of the retained screenshots.', 'Fixture sidebar geometry is overridden; this does not certify deployed WebUI layout.', 'All original incomplete records remain unchanged. No full WCAG, physical AT, or phase acceptance claim.']}
(OUT / 'assessment.json').write_text(json.dumps(result, indent=2) + '\n')
print(json.dumps({key: result[key] for key in ['reportCount', 'occurrences', 'categoryCounts', 'manualClearances', 'retainedIncompleteOccurrences', 'sourceCandidateThresholdFailures']}, indent=2))
print(json.dumps({theme: {name: min(p['ratio'] for p in pairs) for name, pairs in values.items()} for theme, values in ratios.items()}, indent=2))
