# Place the 25 top-side SOD-323 diodes outside all keycaps and parts, each close to its switch.
# usage (needs boards from build.sh for the other parts' positions):
#   python3 place_diodes.py build/left.kicad_pcb build/right.kicad_pcb config.yaml
# Rewrites the block between the "# >>> diodes" / "# <<< diodes" markers in config.yaml.
# A spot counts as free when the diode courtyard (+ GAP) stays clear of every keycap (17.5 x 16.5, rotated with
# the key, + CAP), every other footprint's bounding box (+ 0.3) and the board edge (EDGE), on both halves.
import sys, re
import pcbnew
from shapely.geometry import Polygon, box
from shapely.ops import unary_union
from shapely import affinity
from scipy.optimize import linear_sum_assignment

CY = (3.5, 1.45)   # diode courtyard (diode_sod323.js)
CAP = 0.25         # keep-out around each keycap outline (wobble, tilt)
GAP = 0.6          # courtyard to courtyard (~1.3 mm pad to pad)
EDGE = 0.5         # courtyard to board edge (pads >= 1 mm from the edge, inside the 0.7 mm routing boundary)
STEP = 0.25
mm = pcbnew.ToMM


def load(path):
    b = pcbnew.LoadBoard(path)
    so = pcbnew.SHAPE_POLY_SET()
    b.GetBoardPolygonOutlines(so, True)
    ol = so.Outline(0)
    board = Polygon([(mm(ol.CPoint(i).x), mm(ol.CPoint(i).y)) for i in range(ol.PointCount())])
    blocked, switches = [], {}
    for f in b.GetFootprints():
        r = f.GetReference()
        x, y, a = mm(f.GetPosition().x), mm(f.GetPosition().y), f.GetOrientationDegrees()
        if r.startswith('S'):
            # KiCad y points down: a positive orientation turns clockwise in these coordinates
            blocked.append(affinity.rotate(box(x - 8.75, y - 8.25, x + 8.75, y + 8.25), -a, origin=(x, y)).buffer(CAP, join_style=2))
            pad2 = [p for p in f.Pads() if p.GetNumber() == '2'][0]
            pad1 = [p for p in f.Pads() if p.GetNumber() == '1'][0]
            switches[pad2.GetNetname().removeprefix('mirror_')] = (mm(pad2.GetPosition().x), mm(pad2.GetPosition().y), x, y, a)
        elif r.startswith('D'):
            continue
        else:
            bb = f.GetBoundingBox(False)
            blocked.append(box(mm(bb.GetX()), mm(bb.GetY()), mm(bb.GetRight()), mm(bb.GetBottom())).buffer(0.3))
    return board.buffer(-EDGE).difference(unary_union(blocked)), switches, b


free_l, sw_l, bl = load(sys.argv[1])
free_r, sw_r, _ = load(sys.argv[2])
# mirror axis: x of a key on the left + x of the same key on the right = 2 * axis
k0 = next(iter(sw_l))
axis2 = sw_l[k0][2] + sw_r[k0][2]  # switch centres (pads are not mirrored)

# candidate spots (greedy fill, both orientations), valid on both halves
cands, taken = [], []
minx, miny, maxx, maxy = free_l.bounds
y = miny
while y < maxy:
    x = minx
    while x < maxx:
        for w, h, rot in ((CY[0], CY[1], 0), (CY[1], CY[0], 90)):
            r = box(x, y, x + w, y + h)
            rm = box(axis2 - x - w, y, axis2 - x, y + h)
            if free_l.contains(r) and free_r.contains(rm) and not any(r.intersects(t) for t in taken):
                taken.append(r.buffer(GAP))
                cands.append((x + w / 2, y + h / 2, rot))
                break
        x += STEP
    y += STEP
keys = sorted(sw_l)
print(f'{len(cands)} free spots for {len(keys)} diodes', file=sys.stderr)
cost = [[((sw_l[k][0] - c[0]) ** 2 + (sw_l[k][1] - c[1]) ** 2) ** 0.5 for c in cands] for k in keys]
ki, ci = linear_sum_assignment(cost)

# each diode is anchored on its own key point (so {{colrow}} / {{row_net}} and the mirrored half just work):
# undo the key's rotation (orient), then shift in board coordinates (ergogen y = -KiCad y)
COL = {'outer': 'O', 'pinky': 'P', 'ring': 'R', 'middle': 'M', 'index': 'I', 'inner': 'N', 'near': 'T', 'mid': 'T', 'far': 'T'}
ROW = {'top': 'T', 'home': 'H', 'bottom': 'B', 'lower': 'L'}
TH = {'near': 'N', 'mid': 'M', 'far': 'F'}
out, worst = [], 0
for i, j in sorted(zip(ki, ci), key=lambda t: keys[t[0]]):
    k = keys[i]; x, y, rot = cands[j]
    _, _, kx, ky, ka = sw_l[k]
    c, r = k.split('_')
    label = COL[c] + (TH[c] if r == 'cluster' else ROW[r])
    point = ('thumb_' if r == 'cluster' else 'matrix_') + k
    worst = max(worst, cost[i][j])
    out.append(f"""      diode_{k}:
        what: diode_sod323
        where:
          ref: {point}
          orient: {-ka:g}
          shift: [{x - kx:.2f}, {-(y - ky):.2f}]
          rotate: {rot:g}
        params:
          from: "{{{{colrow}}}}"
          to: "{{{{row_net}}}}"
          label: {label}""")
print(f'longest switch -> diode distance {worst:.1f} mm', file=sys.stderr)
clones = '\n'.join(f'      diode_{k}.asym: clone' for k in keys)

cfg = open(sys.argv[3]).read()
cfg = re.sub(r'(      # >>> diodes[^\n]*\n).*?(      # <<< diodes)', lambda m: m.group(1) + '\n'.join(out) + '\n' + m.group(2), cfg, count=1, flags=re.S)
cfg = re.sub(r'(      # >>> diode clones[^\n]*\n).*?(      # <<< diode clones)', lambda m: m.group(1) + clones + '\n' + m.group(2), cfg, count=1, flags=re.S)
open(sys.argv[3], 'w').write(cfg)
