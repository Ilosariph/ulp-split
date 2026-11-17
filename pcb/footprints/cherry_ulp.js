// Cherry MX ULP (Ultra Low Profile), through-hole, double sided
// Source: https://github.com/ThePurox/Cherry_MX_ULP (Cherry_ULP_TH_Double_Sided, MIT)
// The footprint is symmetric and fully through-hole, so the switch can be
// mounted on either side of the board without needing a separate reverse variant.
// Switch pin pads enlarged from upstream 1 x 2 mm to 1.2 x 2.2 mm (0.2 mm annular ring, upstream 0.1 is below most fabs minimum).
// Nets
//    from: corresponds to pin 1
//    to: corresponds to pin 2
// Params
//    keycaps: default is false
//      if true, will add a keycap outline on Dwgs.User
//    keycap_width / keycap_height: keycap outline size, default 17.5 x 16.5
//      (choc-spaced caps, e.g. Chicago Steno for ULP); stock Cherry ULP caps are 15.25 x 15.25

module.exports = {
  params: {
    designator: 'S',
    keycaps: false,
    keycap_width: 17.5,
    keycap_height: 16.5,
    from: undefined,
    to: undefined
  },
  body: p => {
    const standard = `
      (module Cherry_ULP_TH_Double_Sided (layer F.Cu) (tedit 6519A6A6)
      ${p.at /* parametric position */}

      ${'' /* footprint reference */}
      (fp_text reference "${p.ref}" (at 0 8.9) (layer F.SilkS) ${p.ref_hide} (effects (font (size 1 1) (thickness 0.15))))
      (fp_text value Cherry_Ultra_Low_Profile_TH (at 0 10.25) (layer F.Fab) hide (effects (font (size 1 1) (thickness 0.15))))

      ${'' /* outline */}
      (fp_line (start -7.75 -7.75) (end 7.75 -7.75) (layer Dwgs.User) (width 0.1))
      (fp_line (start 7.75 -7.75) (end 7.75 7.75) (layer Dwgs.User) (width 0.1))
      (fp_line (start 7.75 7.75) (end -7.75 7.75) (layer Dwgs.User) (width 0.1))
      (fp_line (start -7.75 7.75) (end -7.75 -7.75) (layer Dwgs.User) (width 0.1))

      ${'' /* courtyard */}
      (fp_line (start -7.75 -7.75) (end 7.75 -7.75) (layer F.CrtYd) (width 0.05))
      (fp_line (start 7.75 -7.75) (end 7.75 7.75) (layer F.CrtYd) (width 0.05))
      (fp_line (start 7.75 7.75) (end -7.75 7.75) (layer F.CrtYd) (width 0.05))
      (fp_line (start -7.75 7.75) (end -7.75 -7.75) (layer F.CrtYd) (width 0.05))

      ${'' /* locating holes */}
      (pad "" np_thru_hole circle (at -5.8 -3.26) (size 1.2 1.2) (drill 1.2) (layers *.Cu *.Mask))
      (pad "" np_thru_hole circle (at -5.8 1.2) (size 1.05 1.05) (drill 1.05) (layers *.Cu *.Mask))
      (pad "" np_thru_hole circle (at -5.8 3.26) (size 1.2 1.2) (drill 1.2) (layers *.Cu *.Mask))
      (pad "" np_thru_hole circle (at 5.8 -3.26) (size 1.2 1.2) (drill 1.2) (layers *.Cu *.Mask))
      (pad "" np_thru_hole circle (at 5.8 1.2) (size 1.05 1.05) (drill 1.05) (layers *.Cu *.Mask))
      (pad "" np_thru_hole circle (at 5.8 3.26) (size 1.2 1.2) (drill 1.2) (layers *.Cu *.Mask))

      ${'' /* switch pins */}
      (pad 1 thru_hole roundrect (at -1.8 2.3 ${p.r}) (size 1.2 2.2) (drill 0.8) (layers *.Cu *.Mask) (roundrect_rratio 0.5) ${p.from})
      (pad 2 thru_hole roundrect (at 1.8 2.3 ${p.r}) (size 1.2 2.2) (drill 0.8) (layers *.Cu *.Mask) (roundrect_rratio 0.5) ${p.to})

      ${'' /* mounting tabs */}
      (pad "" thru_hole rect (at -6.2 -5.075 ${p.r}) (size 1.6 1.85) (drill 1.2) (layers *.Cu *.Mask))
      (pad "" thru_hole rect (at -6.2 -0.5 ${p.r}) (size 1.6 1.85) (drill 1.2) (layers *.Cu *.Mask))
      (pad "" thru_hole rect (at -6.2 5.075 ${p.r}) (size 1.6 1.85) (drill 1.2) (layers *.Cu *.Mask))
      (pad "" thru_hole rect (at 6.2 -5.075 ${p.r}) (size 1.6 1.85) (drill 1.2) (layers *.Cu *.Mask))
      (pad "" thru_hole rect (at 6.2 -0.5 ${p.r}) (size 1.6 1.85) (drill 1.2) (layers *.Cu *.Mask))
      (pad "" thru_hole rect (at 6.2 5.075 ${p.r}) (size 1.6 1.85) (drill 1.2) (layers *.Cu *.Mask))
      `
    const kw = p.keycap_width / 2
    const kh = p.keycap_height / 2
    const keycap = `
      ${'' /* keycap outline */}
      (fp_line (start ${-kw} ${-kh}) (end ${kw} ${-kh}) (layer Dwgs.User) (width 0.15))
      (fp_line (start ${kw} ${-kh}) (end ${kw} ${kh}) (layer Dwgs.User) (width 0.15))
      (fp_line (start ${kw} ${kh}) (end ${-kw} ${kh}) (layer Dwgs.User) (width 0.15))
      (fp_line (start ${-kw} ${kh}) (end ${-kw} ${-kh}) (layer Dwgs.User) (width 0.15))
      `
    return `
      ${standard}
      ${p.keycaps ? keycap : ''})
      `
  }
}
