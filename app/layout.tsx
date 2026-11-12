import type { Metadata } from "next";
import { Inter, Space_Grotesk, Geist_Mono } from "next/font/google";
import "./globals.css";

/* Body — neutral, highly readable neo-grotesque */
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

/* Display — editorial, characterful, oversized headings */
const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

/* Mono — technical labels & metadata */
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Edoardo Alvin Nugroho — UI/UX Designer & Front-End Developer",
  description:
    "Portfolio of Edoardo Alvin Nugroho — a UI/UX designer and front-end developer crafting meaningful digital experiences with a focus on usability, creativity, and detail.",
  keywords: [
    "Edoardo Alvin Nugroho",
    "UI/UX Designer",
    "Front-End Developer",
    "Portfolio",
    "Indonesia",
    "React",
    "Next.js",
  ],
  openGraph: {
    title: "Edoardo Alvin Nugroho — UI/UX Designer & Front-End Developer",
    description:
      "Designing meaningful digital experiences and building functional interfaces with a focus on usability, creativity, and detail.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-white text-[#0a0a0a] font-body selection:bg-[#0a0a0a] selection:text-white">
        {children}
      </body>
    </html>
  );
}
