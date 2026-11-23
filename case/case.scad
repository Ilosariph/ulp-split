// ULP split: thin tray case with LiPo pocket (401525) in the notch between thumb cluster and battery connector.
// Coordinates = ergogen points (left half, mm, y up). Right half = mirror image.
// Board outline: pcb_left.dxf (copy of pcb/output/outlines/left.dxf, re-copy after changing pcb/config.yaml).
//
// Stack (z, from bottom):  floor | gap (solder bumps, battery connector if fitted underneath) | PCB | lip
// PCB rests on a perimeter ledge + one post per key and is held by M2 screws from the top into bosses
// (heat-set inserts M2 x 3 x 3.2 OD, or self-tapping with screw_hole = 1.7). Screws M2 x 4.
// mounts: heads clear of the keycaps. mounts_opt: under the keycaps, between switch housings (low head only).
// Battery sits beside the PCB (no PCB above it), so it can be thicker than the gap under the board.
//
// openscad -D 'side="right"' -o right.stl case.scad

side = "left";          // "left" | "right"

/* [Case] */
wall    = 1.6;          // outer wall
clr     = 0.3;          // PCB edge clearance
floor_t = 1.2;          // floor under the PCB
gap     = 2.0;          // floor to PCB bottom (Pico-EZmate underneath: 1.65 mated; otherwise only solder bumps)
pcb_t   = 0.8;
lip     = 1.0;          // wall height above PCB top
ledge   = 1.5;          // perimeter shelf under the PCB edge
post_r  = 1.5;          // support post under each key
boss_d  = 4.6;          // screw boss under the PCB
screw_hole = 3.2;       // 3.2 heat-set insert, 1.7 self-tapping M2
use_opt = true;         // bosses for the optional under-keycap holes

/* [Battery 401525] */
bat     = [25, 15, 4.0];  // nominal L x W x T (check your cell incl. protection PCB + tape); notch fits up to ~25 x 26
bat_clr = 0.4;          // per side (L, W)
pocket_floor = 0.6;     // floor under the battery

/* [Cutouts] */
usb_w   = 13;           // USB-C plug overmold opening
usb_z   = 2.0;          // opening starts this high above case bottom
sw_w    = 9;            // power switch lever opening
conn_w  = 6.5;          // pass-through pocket -> under the PCB for the battery plug (connector fitted underneath)

$fn = 48;

h       = floor_t + gap + pcb_t + lip;   // total height
z_pcb   = floor_t + gap;                 // PCB bottom
pocket_d = h - pocket_floor;
assert(pocket_d >= bat[2] + 0.2, str("pocket too shallow: ", pocket_d, " mm for ", bat[2], " mm cell, raise lip/gap"));

// --- key positions from ergogen points (x, y, rotation) ---
keys = [
  [0, 0, 0], [0, 17, 0], [0, 34, 0], [0, 51, 0],              // outer
  [18, 0, 0], [18, 17, 0], [18, 34, 0], [18, 51, 0],          // pinky
  [36, 8.5, 0], [36, 25.5, 0], [36, 42.5, 0], [36, 59.5, 0],  // ring
  [54, 12.75, 0], [54, 29.75, 0], [54, 46.75, 0], [54, 63.75, 0], // middle
  [72, 25.5, 0], [72, 42.5, 0], [72, 59.5, 0],                // index
  [90, 22.95, 0], [90, 39.95, 0], [90, 56.95, 0],             // inner
  [76.5, 5, -6], [95.3512, 1.676, -14], [113.5563, -4.2392, -22], // thumbs near, mid, far
];
post_off = [0, 2];      // key-local spot clear of the switch pads (y -2.3)

// M2 holes, same as pcb/config.yaml mount_* / mount_opt_*
mounts = [[-11, 42.5], [-11, 8.5], [9, 61.5], [9, -10.5],         // outer side tabs
          [65.9, 14.5], [77.7, 15.2], [98.0, 12.6],               // thumb gap
          [105.8, 50.2], [120.5, 43.5]];                          // controller column
mounts_opt = [[9, 25.5], [27.8, 17], [27.8, 51], [44.1, 34], [63.8, 51], [72, 34.4], [86.7, 48.8]];
holes = concat(mounts, use_opt ? mounts_opt : []);

// parts referenced to matrix_inner_top (90, 56.95)
mcu_c   = [112, 69.45];  // XIAO, USB-C at +y board edge (y 79.95)
conn_c  = [112, 46];     // Pico-EZmate header, plug faces -y, wires leave over the column's bottom edge
power_c = [122.9, 50.95];// slide switch, lever towards +x
usb_edge = 79.95;
mcu_x1   = 125;          // MCU column outer edge (x)

// --- battery pocket: in the notch below the MCU column, above the far thumb ---
pk_w = bat[0] + 2*bat_clr;
pk_h = bat[1] + 2*bat_clr;
pk_x0 = 101 + clr;               // inner column edge
col_y0 = 39.25;                  // MCU column bottom edge (PCB)
pk_y1 = col_y0 - clr;
pk = [pk_x0, pk_y1 - pk_h, pk_w, pk_h];   // x, y, w, h

module pcb2d() { import("pcb_left.dxf"); }

module notch_fill() {
  px1 = pk[0] + pk[2];
  // points sit inside the inner/MCU/thumb outlines so the union has no slivers
  polygon([[100, col_y0 + 2], [mcu_x1, col_y0 + 2], [px1, pk[1] + pk[3] - 2], [px1, 1], [107, 8.5], [100, 11]]);
}

module outer2d() { offset(r = clr + wall) union() { pcb2d(); notch_fill(); } }

module pocket2d() { translate([pk[0], pk[1]]) square([pk[2], pk[3]]); }

module key_posts() {
  for (k = keys) translate([k[0], k[1]]) rotate(k[2]) translate(post_off) circle(r = post_r);
}

module case_left() {
  difference() {
    linear_extrude(h) outer2d();

    // PCB pocket
    translate([0, 0, z_pcb]) linear_extrude(h) offset(r = clr) pcb2d();
    // space under PCB, minus ledge and posts
    translate([0, 0, floor_t]) linear_extrude(gap + 0.01) difference() {
      offset(r = -ledge) pcb2d();
      key_posts();
      for (m = holes) translate(m) circle(d = boss_d);
    }
    // screw holes through bosses and floor
    for (m = holes) translate([m[0], m[1], -1]) cylinder(d = screw_hole, h = z_pcb + 1.01);
    // battery pocket
    translate([0, 0, pocket_floor]) linear_extrude(h) pocket2d();
    // pass-through under the PCB edge, pocket -> connector (courtyard ends at the edge, reaches 2.8 mm past its centre)
    translate([conn_c[0] - conn_w/2, pk[1] + pk[3] - 1, pocket_floor])
      cube([conn_w, conn_c[1] + 2.8 + 0.5 - (pk[1] + pk[3] - 1), z_pcb - pocket_floor + 0.01]);
    // USB-C
    translate([mcu_c[0] - usb_w/2, usb_edge - 3, usb_z]) cube([usb_w, 10, h]);
    // power switch lever (only above PCB top, ledge keeps supporting the edge)
    translate([mcu_x1 - 1, power_c[1] - sw_w/2, z_pcb + pcb_t - 0.2]) cube([10, sw_w, h]);
  }
}

if (side == "right") mirror([1, 0, 0]) case_left();
else case_left();

// ghost parts for checking fit (F5 preview only)
%if (side == "left") {
  translate([0, 0, z_pcb]) linear_extrude(pcb_t) pcb2d();
  translate([pk[0] + bat_clr, pk[1] + bat_clr, pocket_floor]) cube([bat[0], bat[1], bat[2]]);
}
