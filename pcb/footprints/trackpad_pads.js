// Solder pads for a trackpad: 1x5 plated holes, 2.54 mm pitch (wires or a pin header), labelled on both sides.
// Pin order GND, 3V3, DR, SDA, SCL. Fits a Cirque Pinnacle (DR) or an Azoteq IQS5xx (RDY) over I2C.

module.exports = {
  params: {
    designator: 'TP',
    GND: {type: 'net', value: 'GND'},
    V3: {type: 'net', value: '3V3'},
    DR: {type: 'net', value: 'DR'},
    SDA: {type: 'net', value: 'SDA'},
    SCL: {type: 'net', value: 'SCL'}
  },
  body: p => {
    const pins = [['GND', p.GND], ['3V3', p.V3], ['DR', p.DR], ['SDA', p.SDA], ['SCL', p.SCL]]
    const pads = pins.map(([label, net], i) => {
      const x = (i - 2) * 2.54
      const shape = i === 0 ? 'rect' : 'circle'
      return `
      (pad ${i + 1} thru_hole ${shape} (at ${x} 0 ${p.r}) (size 1.7 1.7) (drill 1.0) (layers *.Cu *.Mask) ${net})
      (fp_text user ${label} (at ${x} 1.8 ${p.r}) (layer F.SilkS) (effects (font (size 0.6 0.6) (thickness 0.1))))
      (fp_text user ${label} (at ${x} 1.8 ${p.r}) (layer B.SilkS) (effects (font (size 0.6 0.6) (thickness 0.1)) (justify mirror)))`
    }).join('')
    return `
    (module Trackpad_Pads_1x5 (layer F.Cu) (tedit 6519A6A6)
      ${p.at /* parametric position */}
      (fp_text reference "${p.ref}" (at 0 -1.8 ${p.r}) (layer F.SilkS) ${p.ref_hide} (effects (font (size 0.8 0.8) (thickness 0.12))))
      (fp_line (start -6.45 -1.1) (end 6.45 -1.1) (layer F.CrtYd) (width 0.05))
      (fp_line (start 6.45 -1.1) (end 6.45 1.1) (layer F.CrtYd) (width 0.05))
      (fp_line (start 6.45 1.1) (end -6.45 1.1) (layer F.CrtYd) (width 0.05))
      (fp_line (start -6.45 1.1) (end -6.45 -1.1) (layer F.CrtYd) (width 0.05))
      ${pads}
    )
    `
  }
}
