// Seeed Studio XIAO nRF52840, surface mounted (castellated edge pads)
// Pad geometry from Seeed's official KiCad footprint XIAO-nRF52840-SMD
// (https://github.com/Seeed-Studio/OPL_Kicad_Library, CC BY-SA 4.0), re-centered on the module.
// USB faces -y (top), component side up.
//
// Bottom pads of the module: VBAT/GND battery pads get a plated hole so they can be
// soldered from the back of the PCB. SWD/NFC pads are present without nets so copper
// pours keep clear of them.
//
// Params: one net per pin, D0..D10, VBUS (5V), GND, V3 (3V3 out), BAT (battery +)

module.exports = {
  params: {
    designator: 'MCU',
    D0: {type: 'net', value: 'D0'},
    D1: {type: 'net', value: 'D1'},
    D2: {type: 'net', value: 'D2'},
    D3: {type: 'net', value: 'D3'},
    D4: {type: 'net', value: 'D4'},
    D5: {type: 'net', value: 'D5'},
    D6: {type: 'net', value: 'D6'},
    D7: {type: 'net', value: 'D7'},
    D8: {type: 'net', value: 'D8'},
    D9: {type: 'net', value: 'D9'},
    D10: {type: 'net', value: 'D10'},
    V3: {type: 'net', value: '3V3'},
    GND: {type: 'net', value: 'GND'},
    VBUS: {type: 'net', value: 'VBUS'},
    BAT: {type: 'net', value: 'BAT'}
  },
  body: p => {
    const L = -8.0825
    const R = 8.0825
    const castellated = (num, x, y, net, label) => `
      (pad ${num} smd roundrect (at ${x} ${y} ${p.r}) (size 2.75 2) (layers F.Cu F.Paste F.Mask) (roundrect_rratio 0.25) ${net})
      (fp_text user ${label} (at ${x < 0 ? x + 2.6 : x - 2.6} ${y} ${p.r}) (layer F.Fab) (effects (font (size 0.8 0.8) (thickness 0.12))))`
    return `
    (module Seeed_XIAO_nRF52840_SMD (layer F.Cu) (tedit 6519A6A6)
      ${p.at /* parametric position */}

      (fp_text reference "${p.ref}" (at 0 12.5) (layer F.SilkS) ${p.ref_hide} (effects (font (size 1 1) (thickness 0.15))))
      (fp_text value XIAO_nRF52840 (at 0 14) (layer F.Fab) hide (effects (font (size 1 1) (thickness 0.15))))

      ${'' /* module outline (17.8 x 21) */}
      (fp_line (start -8.9175 -10.55) (end 8.8825 -10.55) (layer F.Fab) (width 0.12))
      (fp_line (start 8.8825 -10.55) (end 8.8825 10.4) (layer F.Fab) (width 0.12))
      (fp_line (start 8.8825 10.4) (end -8.9175 10.4) (layer F.Fab) (width 0.12))
      (fp_line (start -8.9175 10.4) (end -8.9175 -10.55) (layer F.Fab) (width 0.12))
      ${'' /* USB-C overhang */}
      (fp_line (start -4.52 -10.55) (end -4.52 -12.05) (layer F.SilkS) (width 0.12))
      (fp_line (start -4.52 -12.05) (end 4.48 -12.05) (layer F.SilkS) (width 0.12))
      (fp_line (start 4.48 -12.05) (end 4.48 -10.55) (layer F.SilkS) (width 0.12))
      (fp_text user USB (at 0 -9.3 ${p.r}) (layer F.Fab) (effects (font (size 0.8 0.8) (thickness 0.12))))

      ${'' /* left edge: D0..D6, from USB end */}
      ${castellated(1, L, -7.62, p.D0, 'D0')}
      ${castellated(2, L, -5.08, p.D1, 'D1')}
      ${castellated(3, L, -2.54, p.D2, 'D2')}
      ${castellated(4, L, 0, p.D3, 'D3')}
      ${castellated(5, L, 2.54, p.D4, 'D4')}
      ${castellated(6, L, 5.08, p.D5, 'D5')}
      ${castellated(7, L, 7.62, p.D6, 'D6')}

      ${'' /* right edge: 5V, GND, 3V3, D10..D7, from USB end */}
      ${castellated(14, R, -7.62, p.VBUS, '5V')}
      ${castellated(13, R, -5.08, p.GND, 'GND')}
      ${castellated(12, R, -2.54, p.V3, '3V3')}
      ${castellated(11, R, 0, p.D10, 'D10')}
      ${castellated(10, R, 2.54, p.D9, 'D9')}
      ${castellated(9, R, 5.08, p.D8, 'D8')}
      ${castellated(8, R, 7.62, p.D7, 'D7')}

      ${'' /* battery pads under the module, plated through for soldering from the back */}
      (pad 19 thru_hole roundrect (at -4.4725 -0.3135 ${p.r}) (size 2.5 1.1) (drill 0.6) (layers *.Cu *.Mask) (roundrect_rratio 0.25) ${p.BAT})
      (pad 20 thru_hole roundrect (at -4.4725 -2.2185 ${p.r}) (size 2.5 1.1) (drill 0.6) (layers *.Cu *.Mask) (roundrect_rratio 0.25) ${p.GND})
      (fp_text user BAT+ (at -4.4725 1.2 ${p.r}) (layer B.SilkS) (effects (font (size 0.8 0.8) (thickness 0.12)) (justify mirror)))
      (fp_text user BAT- (at -4.4725 -3.7 ${p.r}) (layer B.SilkS) (effects (font (size 0.8 0.8) (thickness 0.12)) (justify mirror)))

      ${'' /* other bottom pads, unconnected */}
      (pad 15 smd circle (at -1.2975 -8.5685 ${p.r}) (size 1.7 1.7) (layers F.Cu F.Mask))
      (pad 16 smd circle (at 1.2425 -8.5685 ${p.r}) (size 1.7 1.7) (layers F.Cu F.Mask))
      (pad 17 smd circle (at -1.2975 -6.0285 ${p.r}) (size 1.7 1.7) (layers F.Cu F.Mask))
      (pad 18 smd circle (at 1.2425 -6.0285 ${p.r}) (size 1.7 1.7) (layers F.Cu F.Mask))
      (pad 21 smd roundrect (at 3.7825 9.2369 ${p.r + 90}) (size 2.5 1.1) (layers F.Cu F.Mask) (roundrect_rratio 0.25))
      (pad 22 smd roundrect (at 5.6875 9.2369 ${p.r + 90}) (size 2.5 1.1) (layers F.Cu F.Mask) (roundrect_rratio 0.25))
    )
    `
  }
}
