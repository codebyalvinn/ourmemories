"use client";

/**
 * ScrollStage — "panggung" tunggal yang di-pin selama scroll.
 *
 * Cara kerja:
 *  - Seluruh stage di-pin (position fixed) oleh GSAP ScrollTrigger; scroll halaman
 *    hanya menggerakkan satu timeline (scrub), bukan menggulir konten.
 *  - Waktu timeline 0..n (n = jumlah slide). Slide i "penuh" pada t = i.
 *    Antara t = i+0.7 dan t = i+1 slide i keluar (terdorong ke atas + memudar)
 *    sementara slide i+1 masuk dari bawah.
 *  - Parallax: tiap elemen [data-depth] di dalam slide ikut bergeser dengan
 *    kedalaman berbeda (foto, judul, dekorasi), ditambah sedikit skew mengikuti
 *    kecepatan scroll.
 *  - Snap: setelah scroll berhenti, posisi "menempel" ke tengah slide terdekat.
 *  - prefers-reduced-motion: tanpa pin/parallax; slide tersusun biasa ke bawah.
 */

import { Children, useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const TRANS = 0.3; // lama transisi antar-slide (satuan timeline)
const MID = 0.35; // titik "istirahat" di dalam slide (untuk snap & tombol nav)
const DRIFT = 18; // px, simpangan parallax saat slide sedang tampil
const ENTER = 35; // %, jarak masuk/keluar lapisan (dikalikan depth)

export default function ScrollStage({ labels = [], owner = "", footer = "", children }) {
  const slides = Children.toArray(children);
  const n = slides.length;

  const rootRef = useRef(null);
  const triggerRef = useRef(null);
  const activeRef = useRef(0);
  const [reduced, setReduced] = useState(null); // null = belum diketahui (SSR)
  const [active, setActive] = useState(0);

  // 1) Deteksi preferensi reduced-motion (dan ikuti jika berubah).
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = (e) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // 2) Mode normal: pin + timeline scrub.
  useEffect(() => {
    if (reduced !== false) return;

    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true }); // cegah "loncat" saat address bar mobile naik-turun

    const root = rootRef.current;
    const D = n;
    // Jarak scroll per slide: 1 tinggi layar (sedikit lebih pendek di mobile).
    const pageLen = () => window.innerHeight * (window.innerWidth < 720 ? 0.85 : 1);

    const skewers = [];
    const resetSkew = () => skewers.forEach((s) => s.fn(0));

    // Snap ke tengah slide, dengan arah scroll: geser >20% sudah cukup pindah slide.
    const snapTo = (value, self) => {
      const f = value * D - MID;
      const dir = self?.direction || 0;
      let idx = dir > 0 ? Math.floor(f + 0.8) : dir < 0 ? Math.floor(f + 0.2) : Math.round(f);
      idx = Math.max(0, Math.min(n - 1, idx));
      return (idx + MID) / D;
    };

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: () => `+=${D * pageLen()}`,
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          snap: { snapTo, duration: { min: 0.25, max: 0.7 }, delay: 0.12, ease: "power2.inOut" },
          onUpdate: (self) => {
            const t = self.progress * D;
            const idx = Math.min(n - 1, Math.max(0, Math.floor(t + 0.15)));
            if (idx !== activeRef.current) {
              activeRef.current = idx;
              setActive(idx);
            }
            // Skew halus mengikuti kecepatan scroll.
            const v = gsap.utils.clamp(-2.5, 2.5, self.getVelocity() / -700);
            skewers.forEach((s) => s.fn(v * s.depth * 0.5));
          },
        },
      });
      triggerRef.current = tl.scrollTrigger;

      const slideEls = gsap.utils.toArray(".slide", root);
      slideEls.forEach((slide, i) => {
        const layers = gsap.utils.toArray("[data-depth]", slide);
        const tStart = i - TRANS; // slide ini "mulai hidup"
        const tEnd = i + 1; // dan "selesai" (parallax berakhir)
        const span = tEnd - tStart;
        const cut = Math.max(0, -tStart); // bagian drift yang terpotong sebelum t = 0

        // Posisi awal (slide setelah yang pertama menunggu di bawah, tak terlihat).
        if (i > 0) gsap.set(slide, { autoAlpha: 0, yPercent: 6 });

        layers.forEach((layer) => {
          const d = parseFloat(layer.dataset.depth) || 1;
          const from = DRIFT * d;
          const to = -DRIFT * d;
          const yFrom = from + (to - from) * (cut / span);

          gsap.set(layer, { y: yFrom, yPercent: i > 0 ? ENTER * d : 0 });
          skewers.push({ fn: gsap.quickTo(layer, "skewY", { duration: 0.6, ease: "power3" }), depth: d });

          // a) parallax melayang selama slide tampil
          tl.fromTo(
            layer,
            { y: yFrom },
            { y: to, duration: tEnd - Math.max(0, tStart), immediateRender: false },
            Math.max(0, tStart),
          );
          // b) lapisan masuk dari bawah (makin dalam = makin jauh)
          if (i > 0) {
            tl.fromTo(layer, { yPercent: ENTER * d }, { yPercent: 0, duration: TRANS, immediateRender: false }, i - TRANS);
          }
          // c) lapisan keluar ke atas
          if (i < n - 1) {
            tl.fromTo(layer, { yPercent: 0 }, { yPercent: -ENTER * d, duration: TRANS, immediateRender: false }, i + 1 - TRANS);
          }
        });

        // Slide secara keseluruhan: memudar & bergeser.
        if (i > 0) {
          tl.fromTo(slide, { yPercent: 6 }, { yPercent: 0, duration: TRANS, immediateRender: false }, i - TRANS);
          tl.fromTo(slide, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2, immediateRender: false }, i - 0.2);
        }
        if (i < n - 1) {
          tl.fromTo(slide, { yPercent: 0 }, { yPercent: -6, duration: TRANS, immediateRender: false }, i + 1 - TRANS);
          tl.fromTo(slide, { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.2, immediateRender: false }, i + 1 - TRANS);
        }
      });
    }, root);

    ScrollTrigger.addEventListener("scrollEnd", resetSkew);

    return () => {
      ScrollTrigger.removeEventListener("scrollEnd", resetSkew);
      triggerRef.current = null;
      ctx.revert(); // kembalikan DOM (hapus pin-spacer & style inline)
    };
  }, [reduced, n]);

  // 3) Mode reduced-motion: tandai slide yang sedang terlihat.
  useEffect(() => {
    if (reduced !== true) return;
    const els = rootRef.current.querySelectorAll(".slide");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(Array.prototype.indexOf.call(els, e.target));
        });
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [reduced]);

  const goTo = useCallback(
    (i) => {
      if (reduced) {
        rootRef.current?.querySelectorAll(".slide")[i]?.scrollIntoView({ behavior: "auto", block: "start" });
        return;
      }
      const st = triggerRef.current;
      if (!st) return;
      const y = st.start + (st.end - st.start) * ((i + MID) / n);
      window.scrollTo({ top: y, behavior: "smooth" });
    },
    [reduced, n],
  );

  return (
    <div ref={rootRef} className={`stage${reduced ? " is-flat" : ""}`}>
      <div className="stage__bg" aria-hidden="true" />
      <div className="frame">
        <div className="canvas">
          <header className="nav">
            <span className="nav__brand">{owner}</span>
            <nav className="nav__links" aria-label="Navigasi bagian">
              {labels.map((l, i) => (
                <button
                  key={l.id}
                  type="button"
                  className="nav__link"
                  aria-current={active === i ? "true" : undefined}
                  onClick={() => goTo(i)}
                >
                  {l.label}
                  <svg viewBox="0 0 60 8" preserveAspectRatio="none" aria-hidden="true">
                    <path d="M2 5C14 1 24 7 34 4s16-2 24 1" pathLength="1" />
                  </svg>
                </button>
              ))}
            </nav>
          </header>

          <div className="slides">
            {slides.map((s, i) => (
              <section key={labels[i]?.id ?? i} id={labels[i]?.id} className="slide" aria-label={labels[i]?.label}>
                {s}
              </section>
            ))}
          </div>

          <footer className="foot">
            <span>{footer}</span>
            <span className="foot__count" aria-hidden="true">
              {String(active + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
            </span>
          </footer>
        </div>
      </div>
    </div>
  );
}
