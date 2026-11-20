# Memories — website kenangan satu halaman

Website statis bergaya scrapbook retro-hangat: **Kenangan** (galeri foto) dan **Musik** (klik album untuk memutar lagu). Dibangun dengan **Next.js App Router + GSAP ScrollTrigger**, tanpa backend atau database.

## Menjalankan di komputer

Butuh Node.js 18.18 atau lebih baru.

```bash
npm ci
npm run dev
```

Build static site lokal:

```bash
npm run build
```

Hasil export ada di folder `out/`.

## Deploy ke GitHub Pages

1. Push repo ke GitHub pada branch `main` atau `master`.
2. Buka **Settings → Pages**, lalu pada **Build and deployment → Source** pilih **GitHub Actions**.
3. Setiap push akan menjalankan workflow `.github/workflows/deploy.yml`; URL Pages akan muncul di bagian **Settings → Pages**.

Workflow otomatis mengatur base path untuk repo project (`https://<user>.github.io/<nama-repo>/`) dan root untuk repo user site (`https://<user>.github.io/`). Untuk deploy dengan custom domain atau base path khusus, isi `NEXT_PUBLIC_BASE_PATH` pada environment build. Kosongkan nilainya untuk custom domain yang menyajikan situs dari root.

## Struktur proyek

```
app/
  page.jsx                 daftar & urutan slide
  layout.jsx               font, metadata
  globals.css              seluruh gaya
components/
  ScrollStage.jsx          pin + transisi antar-slide + parallax
  Lightbox.jsx             preview foto layar penuh
  Decor.jsx                ilustrasi SVG
  sections/                Cover · Memories · Music
data/
  site.json                teks situs
  photos.json              daftar foto
  music.json               daftar lagu
lib/
  layout.js                posisi foto pada papan scrapbook
public/
  photos/  covers/  audio/ aset situs
```

## Mengganti teks & nama

Edit `data/site.json` (nama, judul, kalimat halaman pembuka, petunjuk, dan footer). Judul tab browser juga diambil dari file ini.

## Menambah foto

1. Taruh file di `public/photos/` (disarankan `.jpg`/`.webp`, lebar sekitar 1200 px, < 400 KB).
2. Tambahkan objek di `data/photos.json`:

```json
{ "id": "p7", "src": "/photos/liburan.jpg", "caption": "Liburan 2023", "date": "05 Mei 2023", "alt": "Kita berdua di pantai" }
```

- `id` harus unik. `caption` tampil di bawah foto dan di preview; `date` opsional.
- Foto otomatis menempati slot di `lib/layout.js`. Posisi manual bisa diatur dengan `"layout": { "x": 10, "y": 20, "w": 18, "r": -4 }` dan/atau `"layoutMobile": { ... }`.
- Jangan tambahkan nama repo ke `src`; base path GitHub Pages ditambahkan otomatis saat build.

## Menambah musik

1. Taruh cuplikan lagu di `public/audio/` dan sampul di `public/covers/`.
2. Tambahkan data di `data/music.json`:

```json
{ "id": "t5", "title": "Judul Lagu", "artist": "Nama Artis", "cover": "/covers/lagu-1.jpg", "audioSrc": "/audio/lagu-1.mp3" }
```

Hanya satu lagu yang bisa berbunyi sekaligus. Pastikan kamu punya hak/izin memakai lagu dan sampul yang diunggah.

## Catatan

- Website sepenuhnya statis: tidak ada form pesan, endpoint API, penyimpanan pesan, atau rahasia server yang perlu dikonfigurasi.
- Animasi scroll menghormati `prefers-reduced-motion`; mode tersebut menyusun slide biasa ke bawah.
- Font Google diunduh Next.js saat proses build lalu disertakan sebagai aset lokal.
- Jika lagu tidak berbunyi, periksa path `audioSrc`, keberadaan file di `public/audio/`, serta izin penggunaan audio oleh browser.
