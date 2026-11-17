#!/usr/bin/env bash
# Generate PCBs with ergogen, autoroute them with Freerouting, run DRC.
# Result (in pcb/): build/{left,right}.kicad_pcb (routed), build/*.drc.txt, build/jlcpcb-{left,right}.zip (Gerbers + drill)
set -euo pipefail
cd "$(dirname "$0")"
# any ergogen 4.x works: all footprints (incl. cherry_ulp) are in footprints/
ERGOGEN=${ERGOGEN:-$HOME/Projects/ergogen/src/cli.js}

nix-shell -p nodejs --run "node '$ERGOGEN' . -o output --svg --clean"

rm -rf build && mkdir -p build/work
nix-shell -p 'python3.withPackages(p: [p.kicad])' freerouting kicad zip --run '
  set -e
  for h in left right; do
    python3 route.py output/pcbs/$h.kicad_pcb build/$h.kicad_pcb build/work
    kicad-cli pcb drc --severity-error -o build/$h.drc.txt build/$h.kicad_pcb >/dev/null
    echo "$h: $(grep -c "^\[" build/$h.drc.txt || true) DRC errors (see build/$h.drc.txt)"

    # JLCPCB fab files: Gerbers (Protel extensions) + Excellon drill (mm, separate PTH/NPTH), zipped
    g=build/gerbers/$h
    mkdir -p $g
    kicad-cli pcb export gerbers -o $g --no-x2 --subtract-soldermask \
      --layers F.Cu,B.Cu,F.Paste,B.Paste,F.SilkS,B.SilkS,F.Mask,B.Mask,Edge.Cuts \
      build/$h.kicad_pcb >/dev/null
    kicad-cli pcb export drill -o $g/ --format excellon --excellon-units mm \
      --excellon-zeros-format decimal --excellon-oval-format alternate \
      --drill-origin absolute --excellon-separate-th build/$h.kicad_pcb >/dev/null
    (cd $g && zip -q ../../jlcpcb-$h.zip *)
    echo "$h: build/jlcpcb-$h.zip"
  done
'
