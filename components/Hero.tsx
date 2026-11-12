"use client";

import { useEffect, useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/animations";

/* -------------------------------------------------------------------------
   HERO — full-bleed photo with giant outline marquee behind it
   Reference: photo fills full viewport height, centered. Behind it, a huge
   stroke-only (outline) text scrolls slowly left. Light gray background.
   ------------------------------------------------------------------------- */

// Text is intentionally large and partially clipped — only part shows.
// Use a short phrase so individual letters are very big on screen.
const MARQUEE_TEXT = "EDOARDO  ALVIN  NUGROHO  ·  ";
const MARQUEE_REPEAT = 6;

export default function Hero() {
  const container  = useRef<HTMLDivElement>(null);
  const textRef    = useRef<HTMLDivElement>(null);  // the scrolling outline text
  const photoRef   = useRef<HTMLDivElement>(null);  // the photo wrapper
  const labelsRef  = useRef<HTMLDivElement>(null);
  const introTl    = useRef<gsap.core.Timeline | null>(null);

  /* ── Entrance animation ──────────────────────────────────────────────── */
  useGSAP(() => {
    if (prefersReducedMotion()) {
      gsap.set([textRef.current, photoRef.current, labelsRef.current], { opacity: 1, y: 0 });
      return;
    }

    const tl = gsap.timeline({ paused: true });
    introTl.current = tl;

    // Start states
    tl.set(textRef.current,   { opacity: 0 })
      .set(photoRef.current,  { opacity: 0, y: 30 })
      .set(labelsRef.current, { opacity: 0 })

      // Outline text fades in slowly (the "pelan-pelan" feel)
      .to(textRef.current,   { opacity: 1, duration: 2.2, ease: "power1.inOut" })
      // Photo rises in
      .to(photoRef.current,  { opacity: 1, y: 0, duration: 1.4, ease: "expo-out" }, "-=1.8")
      // Labels follow
      .to(labelsRef.current, { opacity: 1, duration: 0.9, ease: "power2.out" }, "-=0.7");
  }, { scope: container });

  /* ── Fire on preloader signal ────────────────────────────────────────── */
  useEffect(() => {
    if (prefersReducedMotion()) return;
    let started = false;
    const start = () => { if (started) return; started = true; introTl.current?.play(); };
    window.addEventListener("app:ready", start, { once: true });
    const fallback = window.setTimeout(start, 3800);
    return () => { window.removeEventListener("app:ready", start); window.clearTimeout(fallback); };
  }, []);

  /* ── Marquee loop (slow horizontal drift) ───────────────────────────── */
  useEffect(() => {
    const track = textRef.current?.querySelector<HTMLElement>(".marquee-track");
    if (!track || prefersReducedMotion()) return;

    const raf = requestAnimationFrame(() => {
      const halfW = track.scrollWidth / 2;
      if (!halfW) return;
      const tween = gsap.to(track, {
        x: -halfW,
        duration: 140,        // very slow — cinematic drift
        ease: "none",
        repeat: -1,
        modifiers: { x: (v: string) => `${parseFloat(v) % -halfW}px` },
      });
      (track as HTMLElement & { _tween?: gsap.core.Tween })._tween = tween;
    });

    return () => {
      cancelAnimationFrame(raf);
      (textRef.current?.querySelector<HTMLElement & { _tween?: gsap.core.Tween }>(".marquee-track"))?._tween?.kill();
    };
  }, []);

  /* ── Semi-3D mouse tilt on photo ─────────────────────────────────────── */
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const photo   = photoRef.current;
    const section = container.current;
    if (!photo || !section) return;

    const onMove = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect();
      const dx = (e.clientX - rect.left - rect.width  / 2) / (rect.width  / 2);
      const dy = (e.clientY - rect.top  - rect.height / 2) / (rect.height / 2);
      gsap.to(photo, {
        rotateY:  dx * 10,
        rotateX: -dy * 6,
        duration: 0.9,
        ease: "power2.out",
        transformPerspective: 1000,
      });
    };

    const onLeave = () => {
      gsap.to(photo, {
        rotateY: 0, rotateX: 0,
        duration: 1.4,
        ease: "elastic.out(1, 0.4)",
        transformPerspective: 1000,
      });
    };

    section.addEventListener("mousemove", onMove, { passive: true });
    section.addEventListener("mouseleave", onLeave);
    return () => {
      section.removeEventListener("mousemove", onMove);
      section.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <section
      id="home"
      ref={container}
      data-theme="light"
      className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden bg-white"
      style={{ perspective: "1200px" }}
    >

      {/* ── OUTLINE TEXT LAYER — z-0, behind everything ──────────────────── */}
      {/*
        Absolutely positioned, vertically centered.
        Text uses -webkit-text-stroke so it renders as pure outline (no fill).
        Font size is massive so single characters fill the viewport height.
      */}
      <div
        ref={textRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-1/2 z-0 -translate-y-1/2 overflow-hidden"
      >
        <div
          className="marquee-track flex items-center whitespace-nowrap font-display font-bold leading-none tracking-tight select-none"
          style={{
            fontSize: "clamp(8rem, 24vw, 22rem)",
            WebkitTextStroke: "1.5px #cccccc",   // outline only — no fill
            color: "transparent",
            willChange: "transform",
            letterSpacing: "-0.02em",
          }}
        >
          {/* Two identical copies for seamless loop */}
          <span>{MARQUEE_TEXT.repeat(MARQUEE_REPEAT)}</span>
          <span aria-hidden="true">{MARQUEE_TEXT.repeat(MARQUEE_REPEAT)}</span>
        </div>
      </div>

      {/* ── PHOTO LAYER — z-10, in front of text ─────────────────────────── */}
      {/*
        Anchored to the bottom of the section, full height + a bit more so
        it bleeds edge-to-edge. The SVG portrait is dead-center of the
        landscape canvas so object-position:center crops it naturally.
      */}
      <div
        ref={photoRef}
        className="absolute bottom-0 left-1/2 z-10 -translate-x-1/2"
        style={{ transformStyle: "preserve-3d", height: "105svh", width: "auto" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/image/Header Image.svg"
          alt="Edoardo Alvin Nugroho"
          style={{
            height: "100%",
            width: "auto",
            maxWidth: "none",
            display: "block",
            userSelect: "none",
            pointerEvents: "none",
            filter: "drop-shadow(0 24px 48px rgba(0,0,0,0.18))",
          }}
        />
      </div>

      {/* ── ROLE LABELS — z-20, over everything ─────────────────────────── */}
      {/*
        "UI/UX Designer" bottom-left, "Front-End Developer" bottom-right.
        Horizontal this time — no vertical rotation — matching the ref style.
      */}
      <div
        ref={labelsRef}
        aria-hidden="true"
        className="pointer-events-none absolute bottom-10 left-0 right-0 z-20 flex items-end justify-between px-8 md:px-16"
      >
        <span className="font-mono text-[0.65rem] uppercase tracking-[0.28em] text-[#333]">
          UI/UX Designer
        </span>
        <span className="font-mono text-[0.65rem] uppercase tracking-[0.28em] text-[#333]">
          Front-End Developer
        </span>
      </div>

    </section>
  );
}
