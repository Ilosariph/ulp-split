// M2 mounting hole: 2.2 mm plated hole with a 4.4 mm unconnected copper ring on both sides.
// The ring keeps the autorouter's traces out from under the screw head (top) and the case boss (bottom).
module.exports = {
  params: {
    designator: 'H',
  },
  body: p => `
    (footprint "mounting_hole_m2" (layer "F.Cu")
      ${p.at}
      (property "Reference" "${p.ref}" (at 0 3.2 ${p.r}) (layer "F.SilkS") ${p.ref_hide}
        (effects (font (size 0.8 0.8) (thickness 0.12))))
      (attr exclude_from_pos_files exclude_from_bom)
      (fp_circle (center 0 0) (end 2.4 0) (layer "F.CrtYd") (stroke (width 0.05) (type solid)) (fill none))
      (fp_circle (center 0 0) (end 2.4 0) (layer "B.CrtYd") (stroke (width 0.05) (type solid)) (fill none))
      (pad "" thru_hole circle (at 0 0 ${p.r}) (size 4.4 4.4) (drill 2.2) (layers "*.Cu" "*.Mask"))
    )
  `
}
