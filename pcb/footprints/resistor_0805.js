// 0805 resistor, hand-solder pads (KiCad R_0805_2012Metric_Pad1.20x1.40mm_HandSolder), top side
// Nets
//    from, to: the two ends (no polarity)

module.exports = {
  params: {
    designator: 'R',
    from: undefined,
    to: undefined
  },
  body: p => `
    (module R_0805_HandSolder (layer F.Cu) (tedit 6519A6A6)
      ${p.at /* parametric position */}
      (fp_text reference "${p.ref}" (at 0 -1.6 ${p.r}) (layer F.SilkS) ${p.ref_hide} (effects (font (size 0.8 0.8) (thickness 0.12))))
      (fp_text value R_0805 (at 0 1.6) (layer F.Fab) hide (effects (font (size 1 1) (thickness 0.15))))

      (fp_line (start -0.25 -0.85) (end 0.25 -0.85) (layer F.SilkS) (width 0.12))
      (fp_line (start -0.25 0.85) (end 0.25 0.85) (layer F.SilkS) (width 0.12))
      (fp_line (start -1.85 -0.95) (end 1.85 -0.95) (layer F.CrtYd) (width 0.05))
      (fp_line (start 1.85 -0.95) (end 1.85 0.95) (layer F.CrtYd) (width 0.05))
      (fp_line (start 1.85 0.95) (end -1.85 0.95) (layer F.CrtYd) (width 0.05))
      (fp_line (start -1.85 0.95) (end -1.85 -0.95) (layer F.CrtYd) (width 0.05))

      (pad 1 smd roundrect (at -1.0375 0 ${p.r}) (size 1.175 1.45) (layers F.Cu F.Paste F.Mask) (roundrect_rratio 0.2127) ${p.from})
      (pad 2 smd roundrect (at 1.0375 0 ${p.r}) (size 1.175 1.45) (layers F.Cu F.Paste F.Mask) (roundrect_rratio 0.2127) ${p.to})
    )
  `
}
