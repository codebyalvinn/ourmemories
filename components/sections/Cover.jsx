// Slide pembuka — gaya kolase grid editorial (referensi -40.jpg):
// teks sans besar yang melangkah diagonal di atas garis grid, diselingi foto kecil & stiker.
// Tiga lapisan parallax: dekorasi (0.4), foto (1), teks (1.5).
import { Butterfly, Camera, HandArrow, Sparkle } from "../Decor";

export default function Cover({ site, photos }) {
  const lines = site.coverLines || [];
  const tiles = photos.slice(0, 3);

  return (
    <div className="cover">
      {/* Lapisan jauh: garis grid + stiker */}
      <div className="layer" data-depth="0.4">
        <div className="cgrid cgrid--lines" aria-hidden="true">
          <Camera className="cv-deco cv-camera" />
          <Butterfly className="cv-deco cv-butterfly" />
          <Sparkle className="cv-deco cv-spark1" />
          <Sparkle className="cv-deco cv-spark2" color="#b9532f" />
        </div>
      </div>

      {/* Lapisan tengah: foto-foto kecil bergaya sepia */}
      <div className="layer" data-depth="1">
        <div className="cgrid">
          {tiles.map((p, i) => (
            <div key={p.id} className={`cv-img cv-img${i + 1}`}>
              <img src={p.src} alt="" loading="eager" decoding="async" draggable="false" />
            </div>
          ))}
        </div>
      </div>

      {/* Lapisan dekat: teks besar */}
      <div className="layer" data-depth="1.5">
        <div className="cgrid">
          <h1 className="sr-only">{site.title}</h1>
          {lines.map((line, i) => (
            <p key={i} className={`cv-t cv-t${i + 1}${i === lines.length - 1 ? " cv-t--hand" : ""}`}>
              {line}
            </p>
          ))}
          <p className="cv-hint">
            {site.coverHint}
            <HandArrow />
          </p>
        </div>
      </div>
    </div>
  );
}
