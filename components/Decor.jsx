// Dekorasi bergaya gambar tangan: selotip, paperclip, stempel, coretan, kupu-kupu, dll.
// Semuanya SVG/CSS ringan tanpa gambar eksternal. Warna mengikuti palet hangat.

export function Tape({ variant = "a" }) {
  return <span className={`tape tape--${variant}`} aria-hidden="true" />;
}

export function Paperclip() {
  return (
    <svg className="clip" viewBox="0 0 30 80" aria-hidden="true">
      <path
        d="M10 62V18a8 8 0 0 1 16 0v42a12 12 0 0 1-24 0V22"
        fill="none"
        stroke="#b9532f"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Stempel bulat dengan teks melingkar. `id` harus unik di halaman.
export function Stamp({ id, text = "KENANGAN", sub = "2024", color = "#b9532f" }) {
  const pathId = `stamp-path-${id}`;
  return (
    <svg className="stamp" viewBox="0 0 100 100" aria-hidden="true">
      <circle cx="50" cy="50" r="46" fill="none" stroke={color} strokeWidth="2.5" />
      <circle cx="50" cy="50" r="27" fill="none" stroke={color} strokeWidth="1" />
      <path id={pathId} d="M50 50m-36 0a36 36 0 1 1 72 0a36 36 0 1 1-72 0" fill="none" />
      <text fill={color} fontSize="10.5" letterSpacing="2.2" style={{ fontFamily: "var(--f-type)" }}>
        <textPath href={`#${pathId}`}>{`${text} • ${text} •`}</textPath>
      </text>
      <text x="50" y="55" textAnchor="middle" fill={color} fontSize="14" style={{ fontFamily: "var(--f-type)" }}>
        {sub}
      </text>
    </svg>
  );
}

// Garis bawah/coretan bergelombang; warna dari `currentColor`.
export function Scribble({ className = "" }) {
  return (
    <svg className={`scribble ${className}`} viewBox="0 0 200 12" preserveAspectRatio="none" aria-hidden="true">
      <path
        d="M3 8C35 2 62 11 100 6s66-3 97 2"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

export function Butterfly({ className = "" }) {
  return (
    <svg className={`bf ${className}`} viewBox="0 0 80 70" aria-hidden="true">
      <g className="bf__wings">
        <path d="M40 35C28 8 4 6 6 24c1 12 18 18 34 11Z" fill="#d9a21b" opacity=".9" />
        <path d="M40 35C52 8 76 6 74 24c-1 12-18 18-34 11Z" fill="#d9a21b" opacity=".9" />
        <path d="M40 35C26 40 14 62 26 62c8 0 12-14 14-27Z" fill="#b9532f" opacity=".9" />
        <path d="M40 35c14 5 26 27 14 27-8 0-12-14-14-27Z" fill="#b9532f" opacity=".9" />
      </g>
      <path d="M40 28v22" stroke="#4a2c1a" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M40 28c-3-8-8-11-11-11M40 28c3-8 8-11 11-11" fill="none" stroke="#4a2c1a" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

export function Cherries({ className = "" }) {
  return (
    <svg className={`cherries ${className}`} viewBox="0 0 70 80" aria-hidden="true">
      <path d="M20 62C22 40 30 22 44 8M50 66C48 44 46 26 44 8" fill="none" stroke="#6b7a3a" strokeWidth="2.2" strokeLinecap="round" />
      <circle cx="19" cy="63" r="10" fill="#b9532f" />
      <circle cx="50" cy="67" r="10" fill="#c2603a" />
      <path d="M44 8c8-4 16 0 18 6-8 2-15 0-18-6Z" fill="#7d8a45" />
      <circle cx="16" cy="60" r="2.6" fill="#f4ead8" opacity=".55" />
      <circle cx="47" cy="64" r="2.6" fill="#f4ead8" opacity=".55" />
    </svg>
  );
}

export function Sparkle({ className = "", color = "#d9a21b" }) {
  return (
    <svg className={`sparkle ${className}`} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 1l2 9 9 2-9 2-2 9-2-9-9-2 9-2z" fill={color} />
    </svg>
  );
}

export function Camera({ className = "" }) {
  return (
    <svg className={`camera ${className}`} viewBox="0 0 100 72" aria-hidden="true">
      <rect x="4" y="14" width="92" height="54" rx="8" fill="#5a3722" />
      <rect x="4" y="14" width="92" height="20" rx="8" fill="#d9a21b" />
      <rect x="14" y="6" width="22" height="10" rx="3" fill="#b9532f" />
      <circle cx="58" cy="43" r="19" fill="#2f1b0f" />
      <circle cx="58" cy="43" r="13" fill="#7a5236" />
      <circle cx="58" cy="43" r="6" fill="#f4ead8" opacity=".5" />
      <circle cx="18" cy="26" r="3.5" fill="#f4ead8" />
    </svg>
  );
}

export function MusicNote({ className = "" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M9 18V6l10-2v12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="7" cy="18" r="2.6" fill="currentColor" />
      <circle cx="17" cy="16" r="2.6" fill="currentColor" />
    </svg>
  );
}

// Panah lengkung gambar tangan.
export function HandArrow({ className = "" }) {
  return (
    <svg className={`hand-arrow ${className}`} viewBox="0 0 60 56" aria-hidden="true">
      <path d="M4 8C30 2 52 22 38 46" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M29 40l9 7 7-10" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
