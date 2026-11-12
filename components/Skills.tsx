"use client";

/*
  TOOLKIT — WARM CREAM EDITORIAL LAYOUT
  ───────────────────────────────────────────────
  Background: #F5F0E8 (warm cream), data-theme="light" for navbar sync.

  4 alternating category blocks (logos-left/text-right, then flip):
    1. Front-End   — logos left, text right
    2. Design      — text left, logos right
    3. Frameworks  — logos left, text right
    4. Back-End &  Data — text left, logos right

  PER-BLOCK ANIMATIONS (each has its own ScrollTrigger ctx):
    ① Hairline border draws across (scaleX 0→1)
    ② Category heading word-mask reveal (SplitText)
    ③ Description fades + rises
    ④ Logo circles pop in with spring + ±10° rotation, stagger 0.08s
    ⑤ Scrub parallax: logo group drifts ±16px over block scroll

  LOGO CIRCLES: 86px, #EAE5DC bg, thin dark border, greyscale→colour on hover.
  3D tilt on hover: cursor-relative rotateX/Y (max ±3°), scale 1.07.

  Navbar: data-theme="light" → dark text. Navigation reads this.
*/

import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP, SplitText, ScrollTrigger } from "@/lib/gsap";
import { type SkillItem } from "@/lib/constants";

const iconSrc = (slug: string) => `https://cdn.simpleicons.org/${slug}`;

/* ── Palette ─────────────────────────────────────────────────────────── */
const C = {
  bg:          "#ffffff",
  bgCircle:    "#f0f0f0",
  border:      "rgba(0,0,0,0.09)",
  borderHover: "rgba(0,0,0,0.20)",
  separator:   "rgba(0,0,0,0.10)",
  eyebrow:     "rgba(0,0,0,0.35)",
  heading:     "#0a0a0a",
  subtitle:    "#6b6660",
  catHead:     "#0a0a0a",
  catDesc:     "#7a7470",
  techName:    "#8a8480",
};

/* ── Categories ──────────────────────────────────────────────────────── */
type Category = { label: string; desc: string; flip: boolean; items: SkillItem[] };

const CATEGORIES: Category[] = [
  {
    label: "Front-End",
    desc:  "Markup, scripted interactivity, and modern frameworks built to be fast, accessible, and precise.",
    flip:  false,
    items: [
      { name: "HTML",         icon: "html5",       color: "#E34F26", desc: "" },
      { name: "JavaScript",   icon: "javascript",  color: "#F7DF1E", desc: "" },
      { name: "TypeScript",   icon: "typescript",  color: "#3178C6", desc: "" },
      { name: "ReactJS",      icon: "react",       color: "#61DAFB", desc: "" },
      { name: "Next.js",      icon: "nextdotjs",   color: "#111111", desc: "" },
      { name: "Tailwind CSS", icon: "tailwindcss", color: "#06B6D4", desc: "" },
    ],
  },
  {
    label: "Design & Tools",
    desc:  "Craft-first tools for research, wireframing, high-fidelity prototypes, and creative production.",
    flip:  true,
    items: [
      { name: "Figma",  icon: "figma",  color: "#F24E1E", desc: "" },
      { name: "Canva",  icon: "canva",  color: "#00C4CC", desc: "" },
      { name: "GitHub", icon: "github", color: "#181717", desc: "" },
    ],
  },
  {
    label: "Back-End & Data",
    desc:  "Server-side scripting, relational databases, and version control that keeps everything in order.",
    flip:  false,
    items: [
      { name: "PHP",        icon: "php",        color: "#777BB4", desc: "" },
      { name: "MySQL",      icon: "mysql",      color: "#4479A1", desc: "" },
      { name: "PostgreSQL", icon: "postgresql", color: "#4169E1", desc: "" },
      { name: "Git",        icon: "git",        color: "#F05032", desc: "" },
    ],
  },
];

const TOTAL = CATEGORIES.reduce((n, c) => n + c.items.length, 0);

/* ════════════════════════════════════════════════════════════════════════
   MAIN SECTION
   ════════════════════════════════════════════════════════════════════════ */
export default function Skills() {
  const sectionRef  = useRef<HTMLElement>(null);
  const headingRef  = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const eyebrowRef  = useRef<HTMLParagraphElement>(null);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(hover:none),(pointer:coarse)");
    const handler = () => setIsTouch(mq.matches);
    setIsTouch(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  /* ── Background scrub: dark → cream ──────────────────────────────── */
  useEffect(() => {
    const r   = window.matchMedia("(prefers-reduced-motion:reduce)").matches;
    const sec = sectionRef.current;
    if (!sec) return;
    if (r) { sec.style.background = C.bg; return; }

    gsap.set(sec, { backgroundColor: "#050505" });
    const tl = gsap.timeline({
      scrollTrigger: { trigger: sec, start: "top 90%", end: "top 20%", scrub: 1.4 },
    });
    tl.to(sec,                { backgroundColor: C.bg,      ease: "none" }, 0)
      .to(eyebrowRef.current, { color: C.eyebrow,           ease: "none" }, 0)
      .to(headingRef.current, { color: C.heading,           ease: "none" }, 0)
      .to(subtitleRef.current,{ color: C.subtitle,          ease: "none" }, 0);

    return () => { tl.kill(); };
  }, []);

  /* ── Cinematic header entrance ───────────────────────────────────── */
  useGSAP(() => {
    const r = window.matchMedia("(prefers-reduced-motion:reduce)").matches;

    const split = new SplitText(headingRef.current, {
      type: "chars,words", mask: "chars", aria: "auto",
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 62%",
        toggleActions: "play none none reverse",
      },
    });

    if (!r) {
      tl.from(eyebrowRef.current,
          { opacity: 0, y: 12, duration: 0.5, ease: "power2.out" }, 0)
        .from(split.chars, {
          yPercent: 120, duration: 0.85, ease: "expo-out",
          stagger: { each: 0.016, from: "start" },
        }, 0.2)
        .from(subtitleRef.current,
          { opacity: 0, x: 30, duration: 0.75, ease: "power3.out" }, 0.45);
    }

    return () => { split.revert(); };
  }, { scope: sectionRef });

  return (
    <section
      id="skills"
      ref={sectionRef}
      data-theme="light"
      className="relative overflow-hidden px-6 py-24 md:px-12 md:py-36"
      style={{ background: C.bg }}
    >
      {/* Section header */}
      <div className="mb-16 md:mb-28">
        <p ref={eyebrowRef} className="label-mono mb-7" style={{ color: C.eyebrow }}>
          Capabilities
        </p>
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between md:gap-16">
          <div className="overflow-hidden">
            <h2
              ref={headingRef}
              className="font-display text-[clamp(2.5rem,7vw,6rem)] font-semibold leading-[0.9] tracking-[-0.04em]"
              style={{ color: C.heading }}
            >
              The toolkit.
            </h2>
          </div>
          <p
            ref={subtitleRef}
            className="max-w-sm text-sm leading-relaxed md:text-base md:text-right"
            style={{ color: C.subtitle }}
          >
      {TOTAL} technologies across design,
            development, and data.
            The stack I reach for every day.
          </p>
        </div>
      </div>

      {/* Category blocks */}
      <div className="flex flex-col">
        {CATEGORIES.map((cat, ci) => (
          <CategoryBlock
            key={cat.label}
            cat={cat}
            isTouch={isTouch}
            isLast={ci === CATEGORIES.length - 1}
          />
        ))}
      </div>

      {/* Bottom line */}
      <div className="mt-16 h-px md:mt-24" style={{ background: C.separator }} />
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   CATEGORY BLOCK
   ════════════════════════════════════════════════════════════════════════ */
interface CBProps { cat: Category; isTouch: boolean; isLast: boolean; }

function CategoryBlock({ cat, isTouch, isLast }: CBProps) {
  const blockRef = useRef<HTMLDivElement>(null);
  const lineRef  = useRef<HTMLDivElement>(null);
  const textRef  = useRef<HTMLDivElement>(null);
  const headRef  = useRef<HTMLHeadingElement>(null);
  const descRef  = useRef<HTMLParagraphElement>(null);
  const logosRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const r = window.matchMedia("(prefers-reduced-motion:reduce)").matches;
    if (r) return;

    const logos = logosRef.current?.querySelectorAll<HTMLElement>(".logo-wrap");

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: blockRef.current,
          start:   "top 82%",
          toggleActions: "play none none reverse",
        },
      });

      // ① Border line draws
      tl.fromTo(lineRef.current,
        { scaleX: 0, transformOrigin: "left" },
        { scaleX: 1, duration: 0.65, ease: "power3.out" }, 0);

      // ② Heading word-mask reveal
      if (headRef.current) {
        const split = new SplitText(headRef.current, { type: "words", mask: "words", aria: "auto" });
        tl.from(split.words,
          { yPercent: 115, duration: 0.8, ease: "expo-out", stagger: 0.07 }, 0.15);
      }

      // ③ Description fade + rise
      tl.from(descRef.current,
        { opacity: 0, y: 16, duration: 0.65, ease: "power2.out" }, 0.35);

      // ④ Logo circles pop in with spring + alternating rotation
      if (logos?.length) {
        logos.forEach((logo, i) => {
          tl.from(logo, {
            opacity: 0, scale: 0.5, y: 40,
            rotation: i % 2 === 0 ? -10 : 10,
            duration: 0.6, ease: "back.out(2)",
          }, 0.1 + i * 0.08);
        });
      }

      // ⑤ Scrub parallax on logo group
      gsap.to(logosRef.current, {
        y: cat.flip ? -16 : 16,
        ease: "none",
        scrollTrigger: {
          trigger: blockRef.current,
          start: "top bottom", end: "bottom top", scrub: 2,
        },
      });
    }, blockRef);

    return () => ctx.revert();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cat.flip]);

  const logoCol = (
    <div ref={logosRef} className="flex flex-wrap gap-5 items-start content-start">
      {cat.items.map((tech) => (
        <LogoCircle key={tech.name} tech={tech} isTouch={isTouch} />
      ))}
    </div>
  );

  const textCol = (
    <div ref={textRef} className="flex flex-col justify-center gap-5">
      <div className="overflow-hidden">
        <h3
          ref={headRef}
          className="font-display text-[clamp(1.5rem,3.5vw,2.75rem)] font-semibold leading-[0.95] tracking-[-0.03em]"
          style={{ color: C.catHead }}
        >
          {cat.label}
        </h3>
      </div>
      <p
        ref={descRef}
        className="text-sm leading-[1.85] max-w-[300px] md:text-[0.95rem]"
        style={{ color: C.catDesc }}
      >
        {cat.desc}
      </p>
    </div>
  );

  return (
    <div ref={blockRef}>
      <div ref={lineRef} className="h-px origin-left" style={{ background: C.separator }} />
      <div className="grid grid-cols-1 gap-10 py-14 md:grid-cols-12 md:gap-16 md:py-20">
        {cat.flip ? (
          <>
            <div className="md:col-span-5">{textCol}</div>
            <div className="md:col-span-7 md:flex md:items-center">{logoCol}</div>
          </>
        ) : (
          <>
            <div className="md:col-span-7 md:flex md:items-center">{logoCol}</div>
            <div className="md:col-span-5">{textCol}</div>
          </>
        )}
      </div>
      {!isLast && <div className="h-px" style={{ background: C.separator }} />}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   LOGO CIRCLE
   ════════════════════════════════════════════════════════════════════════ */
interface LCProps { tech: SkillItem; isTouch: boolean; }

function LogoCircle({ tech, isTouch }: LCProps) {
  const circleRef = useRef<HTMLDivElement>(null);
  const imgRef    = useRef<HTMLImageElement>(null);
  const nameRef   = useRef<HTMLSpanElement>(null);

  const onEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = window.matchMedia("(prefers-reduced-motion:reduce)").matches;
    const dur = r ? 0 : 0.28;
    const el = circleRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const rx = ((e.clientY - rect.top)  / rect.height - 0.5) * -6;
    const ry = ((e.clientX - rect.left) / rect.width  - 0.5) *  6;
    gsap.to(el, {
      rotateX: rx, rotateY: ry, scale: 1.07,
      boxShadow: "0 12px 32px rgba(0,0,0,0.13), 0 2px 8px rgba(0,0,0,0.07)",
      borderColor: C.borderHover,
      duration: dur, ease: "power2.out", transformPerspective: 500,
    });
    gsap.to(imgRef.current,  { filter: "grayscale(0) brightness(1)",   duration: dur, ease: "power2.out" });
    gsap.to(nameRef.current, { color: C.catHead, duration: dur * 0.8, ease: "power2.out" });
  };

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = window.matchMedia("(prefers-reduced-motion:reduce)").matches;
    if (r) return;
    const el = circleRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const rx = ((e.clientY - rect.top)  / rect.height - 0.5) * -6;
    const ry = ((e.clientX - rect.left) / rect.width  - 0.5) *  6;
    gsap.to(el, { rotateX: rx, rotateY: ry, duration: 0.16, ease: "power1.out", transformPerspective: 500 });
  };

  const onLeave = () => {
    const r = window.matchMedia("(prefers-reduced-motion:reduce)").matches;
    const dur = r ? 0 : 0.6;
    gsap.to(circleRef.current, {
      rotateX: 0, rotateY: 0, scale: 1,
      boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
      borderColor: C.border,
      duration: dur, ease: "elastic.out(1, 0.45)", transformPerspective: 500,
    });
    gsap.to(imgRef.current,  { filter: "grayscale(1) brightness(0.42)", duration: dur * 0.5, ease: "power2.out" });
    gsap.to(nameRef.current, { color: C.techName, duration: dur * 0.5, ease: "power2.out" });
  };

  return (
    <div className="logo-wrap flex flex-col items-center gap-3">
      <div
        ref={circleRef}
        className="logo-circle relative flex items-center justify-center rounded-full"
        style={{
          width: 86, height: 86,
          background: C.bgCircle,
          border: `1px solid ${C.border}`,
          boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
          transformStyle: "preserve-3d",
        }}
        onMouseEnter={isTouch ? undefined : onEnter}
        onMouseMove={isTouch  ? undefined : onMove}
        onMouseLeave={isTouch ? undefined : onLeave}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={imgRef}
          src={iconSrc(tech.icon)}
          alt={tech.name}
          width={38} height={38}
          className="relative block h-[38px] w-[38px] select-none"
          style={{ filter: "grayscale(1) brightness(0.42)", pointerEvents: "none" }}
          loading="lazy"
          draggable={false}
        />
      </div>
      <span
        ref={nameRef}
        className="font-mono text-[0.57rem] uppercase tracking-[0.2em] leading-none"
        style={{ color: C.techName }}
      >
        {tech.name}
      </span>
    </div>
  );
}
