"use client";

/**
 * Lightbox — preview foto layar penuh.
 *  - Tutup: tombol ×, klik latar, atau Escape.
 *  - Navigasi: tombol prev/next, panah kiri/kanan, atau geser di layar sentuh.
 *  - Dirender lewat portal ke <body>, karena di dalam slide ada transform
 *    (parallax) yang akan merusak position: fixed.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export default function Lightbox({ items, index, onClose, onIndex }) {
  const open = index !== null && index !== undefined;
  const count = items.length;

  const [mounted, setMounted] = useState(false);
  const [render, setRender] = useState(false);
  const [closing, setClosing] = useState(false);
  const lastIdx = useRef(0);
  const dialogRef = useRef(null);
  const closeRef = useRef(null);
  const swipeX = useRef(null);

  if (open) lastIdx.current = index; // simpan agar konten tetap ada saat animasi tutup
  const current = items[lastIdx.current] ?? null;

  useEffect(() => setMounted(true), []);

  // Animasi buka/tutup: tahan elemen di DOM sebentar saat menutup.
  useEffect(() => {
    if (open) {
      setRender(true);
      setClosing(false);
      return;
    }
    if (!render) return;
    setClosing(true);
    const t = setTimeout(() => {
      setRender(false);
      setClosing(false);
    }, 260);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Fokus ke tombol tutup saat buka; kembalikan fokus ke foto saat tutup.
  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement;
    const raf = requestAnimationFrame(() => closeRef.current?.focus({ preventScroll: true }));
    return () => {
      cancelAnimationFrame(raf);
      prev?.focus?.({ preventScroll: true });
    };
  }, [open]);

  const go = useCallback(
    (d) => {
      if (count > 1) onIndex((lastIdx.current + d + count) % count);
    },
    [count, onIndex],
  );

  // Keyboard: Escape, panah, dan jebakan fokus (Tab) di dalam dialog.
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      switch (e.key) {
        case "Escape":
          e.preventDefault();
          onClose();
          break;
        case "ArrowLeft":
          e.preventDefault();
          go(-1);
          break;
        case "ArrowRight":
          e.preventDefault();
          go(1);
          break;
        case "ArrowUp":
        case "ArrowDown":
        case "PageUp":
        case "PageDown":
        case "Home":
        case "End":
          e.preventDefault(); // jangan menggulir halaman di belakang
          break;
        case "Tab": {
          const f = dialogRef.current?.querySelectorAll("button");
          if (!f || f.length === 0) break;
          const first = f[0];
          const last = f[f.length - 1];
          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
          break;
        }
        default:
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, go, onClose]);

  // Kunci scroll (roda mouse & sentuhan) selama preview terbuka.
  useEffect(() => {
    if (!render) return;
    const el = dialogRef.current;
    if (!el) return;
    const stop = (e) => e.preventDefault();
    el.addEventListener("wheel", stop, { passive: false });
    el.addEventListener("touchmove", stop, { passive: false });
    return () => {
      el.removeEventListener("wheel", stop);
      el.removeEventListener("touchmove", stop);
    };
  }, [render, mounted]);

  if (!mounted || !render || !current) return null;

  return createPortal(
    <div
      ref={dialogRef}
      className={`lb${closing ? " is-closing" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label="Pratinjau foto"
      onClick={(e) => {
        if (!e.target.closest("[data-stop]")) onClose(); // klik latar = tutup
      }}
      onPointerDown={(e) => {
        swipeX.current = e.pointerType === "touch" ? e.clientX : null;
      }}
      onPointerUp={(e) => {
        if (swipeX.current === null) return;
        const dx = e.clientX - swipeX.current;
        swipeX.current = null;
        if (Math.abs(dx) > 50) go(dx > 0 ? -1 : 1);
      }}
    >
      <button ref={closeRef} type="button" data-stop className="lb__close" onClick={onClose} aria-label="Tutup pratinjau">
        <span aria-hidden="true">×</span>
      </button>

      {count > 1 && (
        <button type="button" data-stop className="lb__nav lb__nav--prev" onClick={() => go(-1)} aria-label="Foto sebelumnya">
          <span aria-hidden="true">‹</span>
        </button>
      )}

      <figure className="lb__fig">
        <img key={current.id} data-stop className="lb__img" src={current.src} alt={current.alt || current.caption || ""} draggable="false" />
        <figcaption data-stop className="lb__cap">
          <span className="lb__title">{current.caption}</span>
          {count > 1 && (
            <span className="lb__count">
              {lastIdx.current + 1} / {count}
            </span>
          )}
        </figcaption>
      </figure>

      {count > 1 && (
        <button type="button" data-stop className="lb__nav lb__nav--next" onClick={() => go(1)} aria-label="Foto berikutnya">
          <span aria-hidden="true">›</span>
        </button>
      )}
    </div>,
    document.body,
  );
}
