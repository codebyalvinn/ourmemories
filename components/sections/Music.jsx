"use client";

// Slide "Musik" — tumpukan album retro. Klik album = putar cuplikan lagu.
//  - Hanya satu <audio> untuk seluruh playlist, jadi otomatis hanya satu lagu yang berbunyi.
//  - Album aktif terangkat, piringan hitam keluar dari sampul dan berputar, equalizer menari.
//  - Petunjuk untuk pengunjung baru: teks berdenyut, ikon nada berpulsa di album yang belum
//    pernah diputar, dan cahaya/angkat halus saat hover.
// Data lagu ada di data/music.json.
import { useCallback, useEffect, useRef, useState } from "react";
import { HandArrow, MusicNote } from "../Decor";

export default function Music({ tracks, site }) {
  const audioRef = useRef(null);
  const [currentId, setCurrentId] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [heard, setHeard] = useState(() => new Set());
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");

  const current = tracks.find((t) => t.id === currentId) || null;

  const play = useCallback(
    (track) => {
      const audio = audioRef.current;
      if (!audio) return;
      setError("");

      // Klik album yang sedang aktif = jeda / lanjut.
      if (currentId === track.id) {
        if (audio.paused) audio.play().catch(() => {});
        else audio.pause();
        return;
      }

      // Ganti lagu. play() dipanggil langsung dari event klik (syarat autoplay di mobile).
      audio.pause();
      audio.src = track.audioSrc;
      audio.currentTime = 0;
      setCurrentId(track.id);
      setProgress(0);
      audio
        .play()
        .then(() => setHeard((prev) => new Set(prev).add(track.id)))
        .catch(() => {
          setIsPlaying(false);
          setError("Lagu ini belum bisa diputar. Mungkin file audionya belum ditambahkan, atau browser memblokirnya.");
        });
    },
    [currentId],
  );

  // Hentikan suara saat komponen dilepas.
  useEffect(() => {
    const audio = audioRef.current;
    return () => audio?.pause();
  }, []);

  const hasPlayedAny = heard.size > 0;

  return (
    <div className="music">
      {/* Lapisan jauh: garis grid bergaya kolase */}
      <div className="layer" data-depth="0.4" aria-hidden="true">
        <div className="music__grid" />
      </div>

      {/* Lapisan dekat: judul + petunjuk */}
      <div className="layer" data-depth="1.5">
        <div className="music__title">
          <h2>
            {site.musicTitle.map((l, i) => (
              <span key={i}>{l}</span>
            ))}
          </h2>
          <p className={`hint${hasPlayedAny ? " is-done" : ""}`} aria-hidden={hasPlayedAny}>
            <MusicNote className="hint__note" />
            {site.musicHint}
            <HandArrow />
          </p>
        </div>
      </div>

      {/* Lapisan tengah: rak album */}
      <div className="layer" data-depth="1">
        <div className="music__shelf">
          <ul className="albums">
            {tracks.map((t, i) => {
              const isActive = t.id === currentId;
              const playing = isActive && isPlaying;
              const isNew = !heard.has(t.id);
              return (
                <li
                  key={t.id}
                  className={`album${isActive ? " is-active" : ""}${playing ? " is-playing" : ""}`}
                  style={{ "--i": i }}
                >
                  <button
                    type="button"
                    className="album__btn"
                    onClick={() => play(t)}
                    aria-pressed={playing}
                    aria-label={`${playing ? "Jeda" : "Putar"} ${t.title} oleh ${t.artist}`}
                  >
                    <span className="album__lift">
                      <span className="album__disc" aria-hidden="true">
                        <span className="album__label" style={{ backgroundImage: `url(${t.cover})` }} />
                      </span>
                      <span className="album__sleeve">
                        <img src={t.cover} alt="" loading="lazy" decoding="async" draggable="false" />
                        <span className="album__sheen" aria-hidden="true" />
                        {isNew && (
                          <span className="album__pulse" aria-hidden="true">
                            <MusicNote />
                          </span>
                        )}
                        {isActive && (
                          <span className="eq" aria-hidden="true">
                            <i />
                            <i />
                            <i />
                            <i />
                          </span>
                        )}
                      </span>
                    </span>
                    <span className="album__meta">
                      <strong>{t.title}</strong>
                      <small>{t.artist}</small>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* Pemutar mini */}
      <div className="np" role="group" aria-label="Pemutar musik">
        <button
          type="button"
          className="np__btn"
          disabled={!current}
          onClick={() => current && play(current)}
          aria-label={isPlaying ? "Jeda" : "Putar"}
        >
          {isPlaying ? (
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M7 5h4v14H7zM13 5h4v14h-4z" fill="currentColor" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M8 5l11 7-11 7z" fill="currentColor" />
            </svg>
          )}
        </button>
        <div className="np__info" aria-live="polite">
          {error ? (
            <span className="np__error">{error}</span>
          ) : current ? (
            <>
              <strong>{current.title}</strong>
              <small>{current.artist}</small>
            </>
          ) : (
            <small>Belum ada lagu yang diputar</small>
          )}
        </div>
        <span className="np__bar" aria-hidden="true">
          <span style={{ transform: `scaleX(${progress})` }} />
        </span>
      </div>

      <audio
        ref={audioRef}
        preload="none"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => {
          setIsPlaying(false);
          setProgress(0);
          setCurrentId(null);
        }}
        onTimeUpdate={(e) => {
          const a = e.currentTarget;
          if (a.duration) setProgress(Math.min(1, a.currentTime / a.duration));
        }}
        onError={() => {
          if (audioRef.current?.getAttribute("src")) {
            setIsPlaying(false);
            setError("Lagu ini belum bisa diputar. Mungkin file audionya belum ditambahkan.");
          }
        }}
      />
    </div>
  );
}
