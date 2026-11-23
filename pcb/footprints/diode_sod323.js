// SOD-323 diode (e.g. 1N4148WS), top side, pads slightly longer than KiCad's D_SOD-323 for hand soldering.
// Sits outside the keycaps (see place_diodes.py), labelled with its key.
// Nets
//    from: anode (switch side)
//    to: cathode (row, marked by the bar)
// Params
//    label: short key name (3 chars) printed between the pads, under the part

module.exports = {
  params: {
    designator: 'D',
    from: undefined,
    to: undefined,
    label: ''
  },
  body: p => `
    (module D_SOD-323_Top (layer F.Cu) (tedit 6519A6A6)
      ${p.at /* parametric position */}
      (fp_text reference "${p.ref}" (at 0 1.5 ${p.r}) (layer F.Fab) (effects (font (size 0.6 0.6) (thickness 0.1))))
      (fp_text value D_SOD-323 (at 0 -1.5) (layer F.Fab) hide (effects (font (size 1 1) (thickness 0.15))))
      (fp_text user "${p.label}" (at 0 0 ${p.r}) (layer F.SilkS) (effects (font (size 0.4 0.4) (thickness 0.07))))

      ${'' /* cathode bar just past the pad 1 end; courtyard 3.5 x 1.45 (body 1.25 wide + 0.1) */}
      (fp_line (start -1.7 -0.6) (end -1.7 0.6) (layer F.SilkS) (width 0.12))
      (fp_line (start -1.75 -0.725) (end 1.75 -0.725) (layer F.CrtYd) (width 0.05))
      (fp_line (start 1.75 -0.725) (end 1.75 0.725) (layer F.CrtYd) (width 0.05))
      (fp_line (start 1.75 0.725) (end -1.75 0.725) (layer F.CrtYd) (width 0.05))
      (fp_line (start -1.75 0.725) (end -1.75 -0.725) (layer F.CrtYd) (width 0.05))

      (pad 1 smd roundrect (at -1.15 0 ${p.r}) (size 0.8 0.7) (layers F.Cu F.Paste F.Mask) (roundrect_rratio 0.25) ${p.to})
      (pad 2 smd roundrect (at 1.15 0 ${p.r}) (size 0.8 0.7) (layers F.Cu F.Paste F.Mask) (roundrect_rratio 0.25) ${p.from})
    )
  `
}
