// Halaman tunggal. Urutan & daftar slide diatur di array `sections` di bawah —
// hapus/ubah urutannya di sini kalau ingin menyesuaikan (mis. tanpa Cover).
import { Fragment } from "react";
import ScrollStage from "@/components/ScrollStage";
import Cover from "@/components/sections/Cover";
import Memories from "@/components/sections/Memories";
import Music from "@/components/sections/Music";

import site from "@/data/site.json";
import photoData from "@/data/photos.json";
import trackData from "@/data/music.json";

const photos = photoData.map((photo) => ({ ...photo, src: withBasePath(photo.src) }));
const tracks = trackData.map((track) => ({
  ...track,
  cover: withBasePath(track.cover),
  audioSrc: withBasePath(track.audioSrc),
}));

function withBasePath(path) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
  if (!basePath || !path.startsWith("/") || path.startsWith("//")) return path;
  return `${basePath}${path}`;
}

const sections = [
  { id: "beranda", label: "hommm", node: <Cover site={site} photos={photos} /> },
  { id: "kenangan", label: "memories", node: <Memories site={site} photos={photos} /> },
  { id: "musik", label: "music", node: <Music site={site} tracks={tracks} /> },
];

export default function Page() {
  return (
    <main>
      <ScrollStage
        labels={sections.map(({ id, label }) => ({ id, label }))}
        owner={site.owner}
        footer={site.footer}
      >
        {sections.map((s) => (
          <Fragment key={s.id}>{s.node}</Fragment>
        ))}
      </ScrollStage>
    </main>
  );
}
