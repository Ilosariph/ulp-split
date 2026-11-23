# ULP Split

Wireless split keyboard: 25 keys per half (6 columns, 4/4/4/4/3/3 + 3 thumbs), choc spacing (18 x 17 mm),
Cherry MX ULP switches (through-hole, double-sided footprint), Seeed XIAO nRF52840, ZMK.

## Layout

```
pcb/        ergogen config, footprints, autorouting + Gerber build
config/     ZMK keymap + conf (Colemak-DH-ish + Swiss German, ported from the tightarc Vial layout)
boards/     ZMK shield ulp_split (left = central)
case/       OpenSCAD tray case with 401525 LiPo pocket
```

## PCB

`pcb/build.sh` runs ergogen, autoroutes both halves with Freerouting, runs DRC and writes JLCPCB zips:

- `pcb/build/{left,right}.kicad_pcb` routed boards
- `pcb/build/jlcpcb-{left,right}.zip` Gerbers + drill

JLCPCB: 2 layers, 0.8 mm, LeadFree HASL, tented vias, Remove Mark.

Parts per half: 25 Cherry MX ULP, 25 1N4148WS (SOD-323, LCSC C2128), XIAO nRF52840, C&K PCM12SMTR power switch,
Molex 78171-0002 Pico-EZmate header + 36920-0200 cable (cut in half), LiPo with protection circuit (401525).
Trackpad half: 2x 4.7k 0805 (R1, R2).

Diodes sit on top, outside every keycap (strips at the column ends, beside the inner column, thumb gap), each
labelled with its key (column O/P/R/M/I/N/T + row T/H/B/L, thumbs TN/TM/TF; bar = cathode). The bottom only has
solder from the switch, battery and NFC pads. `pcb/place_diodes.py` picks the spots (>= 0.25 mm from the keycap
outlines, both halves) and rewrites the generated block in `config.yaml`; rerun it after `build.sh` when keys or parts
move, then build again.
Backup: SOD-123 pads (1N4148W, `DB*`) on the back under each switch, in parallel with the top diode. Fit one diode
per key. Back diodes need the 2 mm gap under the PCB; under the index-bottom and inner-home keys they sit close to
the `mount_opt` bosses, print the case with `use_opt = false` if you use those two.

## Case

`case/case.scad`: 5 mm tall tray (1.2 floor, 2 mm under the PCB, 0.8 PCB, 1 mm lip). The PCB drops in on a perimeter
ledge + a post under each key and is screwed down from the top: M2 x 4 screws into heat-set inserts (M2 x 3, 3.2 mm OD)
in bosses under the board (`screw_hole = 1.7` for self-tapping instead).
9 holes have the screw head clear of the keycaps (small tabs on the outer edge, gap above the thumbs, controller column).
7 more (`mount_opt_*`) sit between switch housings under the keycaps: only for low heads (wafer / ISO 7380), check
keycap clearance first; `use_opt = false` drops their bosses. The 401525 LiPo sits in its own pocket in the
notch between the far thumb key and the bottom of the controller column. The battery connector sits at the bottom edge of
the controller column with its plug facing the notch, so the wires drop straight into the pocket (no cable hole).
The notch takes a cell up to ~25 x 26 x 4 mm: set `bat` in `case.scad`. Openings for USB-C and the power switch lever.

```
openscad -o left.stl case/case.scad
openscad -D 'side="right"' -o right.stl case/case.scad
```

`case/pcb_left.dxf` is a copy of `pcb/output/outlines/left.dxf`; copy it again after changing the board outline.

## Matrix

col2row, 5 x 5 on D0..D9. Columns D0..D4 = outer, pinky, ring, middle, index.
Rows D7 top, D8 home, D9 bottom, D6 lower (outer 4 columns + near thumb on D4), D5 extra
(inner top/home/bottom on D3/D4/D2, mid thumb on D1, far thumb on D0).
D10 and the XIAO's NFC pads (NFC1 = P0.09, NFC2 = P0.10, plated through like the battery pads) drive the trackpad.

## Trackpad

Right half (firmware), pads on both: TP1 below the XIAO, 1x5 2.54 mm, GND / 3V3 / DR / SDA / SCL.
SDA = NFC1, SCL = NFC2 (UICR `nfct-pins-as-gpios`), DR = D10, R1/R2 = 4.7k 0805 pull-ups to 3V3.
Firmware: Cirque Pinnacle (`cirque,pinnacle` from petejohanson/cirque-input-module, I2C 0x2A) on the right half,
forwarded to the left through `zmk,input-split`. A TM040040 runs in I2C mode with R1 not fitted; wire VDD, GND, SCL,
SDA and DR from its test pads straight to TP1 (skip 5 V adapter boards). An Azoteq IQS5xx pad (TPS43/TPS65) fits
the same pads (RDY on DR, NRST tied to 3V3) with an IQS5xx driver module instead.

## Firmware

GitHub Actions builds `ulp_split_left`, `ulp_split_right` and `settings_reset` for `seeeduino_xiao_ble` (ZMK v0.3).
Flash: double-tap reset, copy the uf2 to the XIAO drive. Edit the keymap with https://nickcoutsos.github.io/keymap-editor.

The battery charges over USB only while the power switch is on (the switch sits between battery and XIAO).
