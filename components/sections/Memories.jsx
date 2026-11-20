"use client";

// Slide "Kenangan" — papan scrapbook (referensi -39.jpg): foto sepia bertepi lusuh,
// disusun asimetris dengan selotip, paperclip, stempel, dan coretan tangan.
// Parallax: dekorasi (0.5) · foto (1) · judul (1.6).
import { useState } from "react";
import Lightbox from "../Lightbox";
import { Butterfly, Cherries, HandArrow, Paperclip, Scribble, Sparkle, Stamp, Tape } from "../Decor";
import { MOBILE_VISIBLE, SLOTS, SLOTS_MOBILE } from "@/lib/layout";

export default function Memories({ photos, site }) {
  const [openIdx, setOpenIdx] = useState(null);

  return (
    <div className="mem">
      {/* Lapisan jauh: hiasan di atas kertas */}
      <div className="layer" data-depth="0.5" aria-hidden="true">
        <span className="stain" />
        <Butterfly className="mem-deco mem-bf1" />
        <Butterfly className="mem-deco mem-bf2" />
        <Cherries className="mem-deco mem-cherries" />
        <Sparkle className="mem-deco mem-sp1" />
        <Sparkle className="mem-deco mem-sp2" color="#b9532f" />
        <Sparkle className="mem-deco mem-sp3" />
      </div>

      {/* Lapisan tengah: papan foto */}
      <div className="layer" data-depth="1">
        <div className="board">
          {photos.length === 0 && <p className="board__empty">Belum ada foto — tambahkan di data/photos.json</p>}
          {photos.map((p, i) => {
            const d = { ...SLOTS[i % SLOTS.length], ...p.layout };
            const m = { ...SLOTS_MOBILE[i % SLOTS_MOBILE.length], ...p.layoutMobile };
            const style = {
              "--x": `${d.x}%`,
              "--y": `${d.y}%`,
              "--w": `${d.w}%`,
              "--r": `${d.r}deg`,
              "--mx": `${m.x}%`,
              "--my": `${m.y}%`,
              "--mw": `${m.w}%`,
              "--mr": `${m.r}deg`,
              "--z": d.z ?? 1,
            };
            const stampSub = p.stamp || (p.date ? p.date.slice(-4) : "");
            return (
              <button
                key={p.id}
                type="button"
                className={`photo${i >= MOBILE_VISIBLE ? " photo--extra" : ""}`}
                style={style}
                onClick={() => setOpenIdx(i)}
                aria-label={`Buka foto: ${p.caption}`}
              >
                <span className="photo__tilt">
                  <span className="photo__paper">
                    <span className="photo__img">
                      <img src={p.src} alt={p.alt || p.caption} loading="lazy" decoding="async" draggable="false" />
                    </span>
                    <span className="photo__cap">{p.caption}</span>
                  </span>
                  {d.deco === "tape" && <Tape variant={i % 2 ? "b" : "a"} />}
                  {d.deco === "clip" && <Paperclip />}
                  {d.deco === "stamp" && <Stamp id={p.id} sub={stampSub} />}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Lapisan dekat: judul */}
      <div className="layer" data-depth="1.6">
        <div className="mem__title">
          <h2>
            {site.memoriesTitle}
            <Scribble />
          </h2>
          <p className="mem__note">
            {site.memoriesNote}
            <HandArrow />
          </p>
        </div>
      </div>

      <Lightbox items={photos} index={openIdx} onClose={() => setOpenIdx(null)} onIndex={setOpenIdx} />
    </div>
  );
}
