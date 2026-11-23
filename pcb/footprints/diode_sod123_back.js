// SOD-123 diode, SMD pads on the back side only (sits under the switch)
// Nets
//    from: anode
//    to: cathode (marked by the bar)

module.exports = {
  params: {
    designator: 'D',
    from: undefined,
    to: undefined
  },
  body: p => `
    (module D_SOD-123_Back (layer B.Cu) (tedit 6519A6A6)
      ${p.at /* parametric position */}
      (fp_text reference "${p.ref}" (at 0 1.6 ${p.r}) (layer B.SilkS) ${p.ref_hide} (effects (font (size 0.8 0.8) (thickness 0.12)) (justify mirror)))
      (fp_text value D_SOD-123 (at 0 -1.6) (layer B.Fab) hide (effects (font (size 1 1) (thickness 0.15)) (justify mirror)))

      ${'' /* body outline + cathode bar */}
      (fp_line (start -2.35 -0.85) (end 1.4 -0.85) (layer B.SilkS) (width 0.12))
      (fp_line (start -2.35 0.85) (end 1.4 0.85) (layer B.SilkS) (width 0.12))
      (fp_line (start -2.35 -0.85) (end -2.35 0.85) (layer B.SilkS) (width 0.12))
      (fp_line (start -2.6 -1.1) (end 2.6 -1.1) (layer B.CrtYd) (width 0.05))
      (fp_line (start 2.6 -1.1) (end 2.6 1.1) (layer B.CrtYd) (width 0.05))
      (fp_line (start 2.6 1.1) (end -2.6 1.1) (layer B.CrtYd) (width 0.05))
      (fp_line (start -2.6 1.1) (end -2.6 -1.1) (layer B.CrtYd) (width 0.05))

      (pad 1 smd roundrect (at -1.65 0 ${p.r}) (size 0.9 1.2) (layers B.Cu B.Paste B.Mask) (roundrect_rratio 0.25) ${p.to})
      (pad 2 smd roundrect (at 1.65 0 ${p.r}) (size 0.9 1.2) (layers B.Cu B.Paste B.Mask) (roundrect_rratio 0.25) ${p.from})
    )
  `
}
