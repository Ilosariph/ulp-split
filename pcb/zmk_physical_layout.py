# Print ZMK physical-layout key entries from ergogen debug points:
#   ergogen . -o out --debug && python3 zmk_physical_layout.py out/points/points.yaml
# Paste into boards/shields/ulp_split/ulp_split-layouts.dtsi (drop the first line, the key count).
import sys, yaml
p = yaml.safe_load(open(sys.argv[1]))
L = lambda n: p[n]
R = lambda n: p['mirror_' + n]
cols = ['outer', 'pinky', 'ring', 'middle', 'index', 'inner']
order = []
for row in ['top', 'home', 'bottom']:
    order += [L(f'matrix_{c}_{row}') for c in cols] + [R(f'matrix_{c}_{row}') for c in reversed(cols)]
order += [L(f'matrix_{c}_lower') for c in cols[:4]]
order += [L(f'thumb_{t}_cluster') for t in ['near', 'mid', 'far']]
order += [R(f'thumb_{t}_cluster') for t in ['far', 'mid', 'near']]
order += [R(f'matrix_{c}_lower') for c in reversed(cols[:4])]
U = 18.0
minx = min(q['x'] for q in order); maxy = max(q['y'] for q in order)
out = []
for q in order:
    cx = (q['x'] - minx) / U + 0.5
    cy = (maxy - q['y']) / U + 0.5
    rot = -q['r']
    f = lambda v: f'({v})' if v < 0 else str(v)
    out.append((100, 100, round((cx - .5) * 100), round((cy - .5) * 100), round(rot * 100), round(cx * 100), round(cy * 100)))
print(len(out))
for i, k in enumerate(out):
    print(('= ' if i == 0 else ', ') + '<&key_physical_attrs ' + ' '.join(f'{v:>5}' if v >= 0 else f'{"(" + str(v) + ")":>7}' for v in k) + '>')
