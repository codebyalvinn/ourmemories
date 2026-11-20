// Posisi foto di "papan scrapbook".
// Semua nilai dalam persen terhadap ukuran papan: x/y = posisi kiri-atas,
// w = lebar foto, r = rotasi (derajat), deco = hiasan tangan di foto tsb.
//
// Foto ke-N otomatis memakai slot ke-N. Kalau ingin posisi khusus untuk satu foto,
// tambahkan "layout" (desktop) atau "layoutMobile" di data/photos.json, mis.:
//   { "id": "p1", ..., "layout": { "x": 10, "y": 20, "w": 18, "r": -4 } }

// Desktop / layar lebar (papan rasio 16:10) — maksimal 8 foto tanpa menumpuk.
export const SLOTS = [
  { x: 5, y: 14, w: 17, r: -5, deco: "tape", z: 2 },
  { x: 25, y: 4, w: 19, r: 3, deco: "clip", z: 3 },
  { x: 47, y: 12, w: 20, r: -2, deco: "tape", z: 2 },
  { x: 70, y: 5, w: 18, r: 5, deco: "stamp", z: 3 },
  { x: 12, y: 52, w: 19, r: 4, deco: "tape", z: 3 },
  { x: 36, y: 47, w: 21, r: -4, deco: "clip", z: 2 },
  { x: 61, y: 50, w: 18, r: 2, deco: "tape", z: 3 },
  { x: 81, y: 45, w: 15, r: -6, deco: "stamp", z: 2 },
];

// Mobile / layar sempit (papan rasio 5:7) — 6 foto pertama tampil di papan,
// sisanya tetap bisa dilihat lewat preview (tombol prev/next).
export const SLOTS_MOBILE = [
  { x: 4, y: 3, w: 38, r: -4 },
  { x: 54, y: 2, w: 38, r: 3 },
  { x: 7, y: 34, w: 38, r: 3 },
  { x: 52, y: 33, w: 38, r: -3 },
  { x: 5, y: 64, w: 38, r: -2 },
  { x: 55, y: 64, w: 38, r: 4 },
];

export const MOBILE_VISIBLE = SLOTS_MOBILE.length;
