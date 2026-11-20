import "./globals.css";
import { Caveat, DM_Sans, Fraunces, Special_Elite } from "next/font/google";
import site from "@/data/site.json";

// Tipografi: serif untuk judul, handwritten untuk catatan, sans untuk teks biasa,
// dan typewriter untuk detail kecil (stempel, footer).
const serif = Fraunces({ subsets: ["latin"], style: ["normal", "italic"], variable: "--font-serif", display: "swap" });
const hand = Caveat({ subsets: ["latin"], variable: "--font-hand", display: "swap" });
const sans = DM_Sans({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const type = Special_Elite({ subsets: ["latin"], weight: "400", variable: "--font-type", display: "swap" });

export const metadata = {
  title: site.title,
  description: site.description,
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#4a2c1a",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={`${serif.variable} ${hand.variable} ${sans.variable} ${type.variable}`}>
      <body>{children}</body>
    </html>
  );
}
