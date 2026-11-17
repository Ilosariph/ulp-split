# Autoroute a KiCad board with Freerouting (headless).
# usage: python3 route.py <in.kicad_pcb> <out.kicad_pcb> <workdir>
import os, subprocess, sys
import pcbnew

src, dst, work = sys.argv[1:4]
name = os.path.splitext(os.path.basename(dst))[0]
dsn = os.path.join(work, name + '.dsn')
ses = os.path.join(work, name + '.ses')

for f in (dsn, ses):
    if os.path.exists(f):
        os.remove(f)

board = pcbnew.LoadBoard(src)
ds = board.GetDesignSettings()
nc = ds.m_NetSettings.GetDefaultNetclass()
nc.SetTrackWidth(pcbnew.FromMM(0.25))
nc.SetClearance(pcbnew.FromMM(0.2))
nc.SetViaDiameter(pcbnew.FromMM(0.6))
nc.SetViaDrill(pcbnew.FromMM(0.3))
# Freerouting necks traces down to ~0.19 mm at pads; fine for any fab (JLCPCB min 0.127 mm)
ds.m_TrackMinWidth = pcbnew.FromMM(0.15)

# Freerouting ignores KiCad's board-edge clearance and routes right along Edge.Cuts.
# ergogen puts an outline shrunk by 0.7 mm on Eco1.User: swap it in as the edge for routing.
def swap_edge(a, b):
    items = [d for d in board.GetDrawings() if d.GetLayer() in (a, b)]
    for d in items:
        d.SetLayer(b if d.GetLayer() == a else a)

swap_edge(pcbnew.Edge_Cuts, pcbnew.Eco1_User)
if not pcbnew.ExportSpecctraDSN(board, dsn):
    sys.exit('DSN export failed')
swap_edge(pcbnew.Edge_Cuts, pcbnew.Eco1_User)

# Freerouting occasionally aborts (SIGABRT) for no reason; a rerun works
for attempt in range(3):
    r = subprocess.run([
        'freerouting', '-de', dsn, '-do', ses, '-mp', '20',
        '--gui.enabled=false',
        '--usage_and_diagnostic_data.disable_analytics=true',
    ])
    if r.returncode == 0 and os.path.exists(ses):
        break
    print(f'freerouting failed (exit {r.returncode}), retrying', file=sys.stderr)
else:
    sys.exit('freerouting failed 3 times')

if not pcbnew.ImportSpecctraSES(board, ses):
    sys.exit('SES import failed')
# tent all vias (solder mask over them): the switch base frame is metal and sits on the top layer
ds.m_TentViasFront = True
ds.m_TentViasBack = True

board.Save(dst)
print('routed ->', dst)
