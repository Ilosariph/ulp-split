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

Parts per half: 25 Cherry MX ULP, 25 1N4148W (SOD-123), XIAO nRF52840, C&K PCM12SMTR power switch,
Molex 78171-0002 Pico-EZmate header + 36920-0200 cable (cut in half), LiPo with protection circuit.

## Case

`case/case.scad`: 5 mm tall tray (1.2 floor, 2 mm under the PCB, 0.8 PCB, 1 mm lip). The PCB drops in on a perimeter
ledge + a post under each key; fix it with thin double-sided tape. The 401525 LiPo sits in its own pocket in the
notch between the far thumb key and the bottom of the controller column, next to the battery connector; a channel
under the PCB runs from the cable hole to the pocket. Openings for USB-C and the power switch lever.

```
openscad -o left.stl case/case.scad
openscad -D 'side="right"' -o right.stl case/case.scad
```

`case/pcb_left.dxf` is a copy of `pcb/output/outlines/left.dxf`; copy it again after changing the board outline.

## Matrix

col2row. Columns D0..D5 = outer, pinky, ring, middle, index, inner.
Rows D7 top, D8 home, D9 bottom, D6 lower (outer 4 columns), D10 thumbs
(near = index column, mid = inner, far = ring).

## Firmware

GitHub Actions builds `ulp_split_left`, `ulp_split_right` and `settings_reset` for `seeeduino_xiao_ble` (ZMK v0.3).
Flash: double-tap reset, copy the uf2 to the XIAO drive. Edit the keymap with https://nickcoutsos.github.io/keymap-editor.

The battery charges over USB only while the power switch is on (the switch sits between battery and XIAO).
