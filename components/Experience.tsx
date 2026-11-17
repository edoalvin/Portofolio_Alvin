"use client";

import { useRef } from "react";
import { gsap, useGSAP, SplitText } from "@/lib/gsap";
import { EXPERIENCES } from "@/lib/constants";

/*
  EXPERIENCE — two-column editorial layout
  Left (55%): label → heading → divider → stacked experience entries → footer
  Right (45%): photo column, two images stacked, each aligned to its entry
  Background: #080808
*/

const IMAGES = [
  /* Brantas Abipraya — construction / infrastructure */
  "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&q=80&auto=format&fit=crop",
  /* AirNav Indonesia — ATC tower / aviation */
  "https://images.unsplash.com/photo-1587019158091-1a103c5dd17f?w=1200&q=80&auto=format&fit=crop",
];

const SPECIALTY = [
  "Infrastructure & Project Management",
  "Operational Data & Web Development",
];

export default function Experience() {
  const container  = useRef<HTMLElement>(null);
  const labelRef   = useRef<HTMLParagraphElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const entriesRef = useRef<HTMLDivElement>(null);
  const footerRef  = useRef<HTMLDivElement>(null);
  const imgColRef  = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (typeof window === "undefined") return;
    const r = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const split = new SplitText(headingRef.current, {
      type: "words", mask: "words", aria: "auto",
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container.current,
        start: "top 70%",
        toggleActions: "play none none reverse",
      },
    });

    if (!r) {
      tl.from(labelRef.current,  { opacity: 0, y: 10, duration: 0.5, ease: "power2.out" }, 0)
        .from(split.words,       { yPercent: 115, duration: 1, ease: "expo-out", stagger: 0.07 }, 0.1)
        .from(dividerRef.current,{ scaleX: 0, transformOrigin: "left", duration: 0.8, ease: "expo-out" }, 0.5)
        .from(".exp-entry",      { opacity: 0, y: 22, duration: 0.7, ease: "power2.out", stagger: 0.18 }, 0.65)
        .from(footerRef.current, { opacity: 0, y: 14, duration: 0.6, ease: "power2.out" }, 1.0)
        .from(imgColRef.current, { opacity: 0, x: 28, duration: 1.1, ease: "power3.out" }, 0.2);
    }

    /* Hover zoom on each image */
    if (!r) {
      container.current?.querySelectorAll<HTMLDivElement>(".exp-img-wrap").forEach((wrap) => {
        const img = wrap.querySelector<HTMLImageElement>("img");
        if (!img) return;
        wrap.addEventListener("mouseenter", () => gsap.to(img, { scale: 1.05, duration: 0.9, ease: "power2.out" }));
        wrap.addEventListener("mouseleave", () => gsap.to(img, { scale: 1,    duration: 0.9, ease: "power2.out" }));
      });
    }

    return () => { split.revert(); };
  }, { scope: container });

  return (
    <section
      id="experience"
      ref={container}
      data-theme="dark"
      className="relative overflow-hidden"
      style={{ background: "#080808" }}
    >
      <div className="h-px bg-white/[0.07]" />

      <div className="grid grid-cols-1 md:grid-cols-[1fr_42%]">

        {/* ── LEFT: text ─────────────────────────────────────────────────── */}
        <div className="flex flex-col justify-center px-6 py-20 md:px-14 md:py-24">

          {/* Label */}
          <p ref={labelRef} className="label-mono mb-10 md:mb-12"
             style={{ color: "rgba(255,255,255,0.35)" }}>
            Experience
          </p>

          {/* Heading */}
          <div className="overflow-hidden mb-8 md:mb-10">
            <h2 ref={headingRef}
                className="font-display text-[clamp(2.75rem,6.5vw,5.5rem)] font-semibold leading-[0.88] tracking-[-0.04em] text-white">
              The path so far.
            </h2>
          </div>

          {/* Divider */}
          <div ref={dividerRef} className="h-px w-full origin-left mb-10 md:mb-12"
               style={{ background: "rgba(255,255,255,0.12)" }} />

          {/* Stacked experience entries */}
          <div ref={entriesRef} className="flex flex-col gap-0">
            {EXPERIENCES.map((exp, i) => (
              <div key={i}>
                {/* Entry row */}
                <div className="exp-entry flex flex-col gap-5 py-7 md:flex-row md:items-start md:gap-8">
                  {/* Date */}
                  <div className="flex-shrink-0 md:w-44">
                    <p className="font-mono text-[0.62rem] uppercase tracking-[0.25em] leading-relaxed"
                       style={{ color: "rgba(255,255,255,0.38)" }}>
                      {exp.period}
                    </p>
                    {/* "Current" badge for the first entry */}
                    {i === 0 && (
                      <span className="inline-flex items-center gap-1.5 mt-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="font-mono text-[0.55rem] uppercase tracking-[0.2em]"
                              style={{ color: "rgba(52,211,153,0.8)" }}>
                          Current
                        </span>
                      </span>
                    )}
                  </div>

                  {/* Vertical separator */}
                  <div className="hidden md:block w-px flex-shrink-0 self-stretch"
                       style={{ background: "rgba(255,255,255,0.10)" }} />

                  {/* Company info */}
                  <div className="flex flex-col gap-1.5">
                    <h3 className="font-display text-[clamp(1.3rem,2.6vw,1.85rem)] font-semibold tracking-tight text-white leading-tight">
                      {exp.company}
                    </h3>
                    <p className="font-mono text-[0.62rem] uppercase tracking-[0.22em]"
                       style={{ color: "rgba(255,255,255,0.42)" }}>
                      {exp.role}
                    </p>
                    <p className="font-mono text-[0.6rem] uppercase tracking-[0.2em] mt-0.5"
                       style={{ color: "rgba(255,255,255,0.22)" }}>
                      {SPECIALTY[i]}
                    </p>
                  </div>
                </div>

                {/* Divider between entries (not after the last) */}
                {i < EXPERIENCES.length - 1 && (
                  <div className="h-px" style={{ background: "rgba(255,255,255,0.07)" }} />
                )}
              </div>
            ))}
          </div>

          {/* Footer */}
          <div ref={footerRef} className="mt-14 md:mt-16 flex items-center gap-4">
            <span className="flex-shrink-0 h-5 w-5 rounded-full border flex items-center justify-center"
                  style={{ borderColor: "rgba(255,255,255,0.2)" }}>
              <span className="h-1.5 w-1.5 rounded-full"
                    style={{ background: "rgba(255,255,255,0.5)" }} />
            </span>
            <span className="font-mono text-[0.6rem] uppercase tracking-[0.25em]"
                  style={{ color: "rgba(255,255,255,0.35)" }}>
              Open to new chapters
            </span>
            <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.08)" }} />
            <span className="font-mono text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>→</span>
          </div>
        </div>

        {/* ── RIGHT: two stacked photos, one per experience ──────────────── */}
        <div ref={imgColRef}
             className="relative order-first md:order-last grid grid-rows-2 md:grid-rows-[1fr_1fr]
               h-[70vw] min-h-[320px] md:h-auto">

          {IMAGES.map((src, i) => (
            <div key={i}
                 className="exp-img-wrap relative overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={EXPERIENCES[i].company}
                className="absolute inset-0 h-full w-full object-cover"
                style={{ transformOrigin: "center", willChange: "transform" }}
                draggable={false}
              />
              {/* Left gradient — blends into bg */}
              <div className="absolute inset-y-0 left-0 w-24 md:w-40 pointer-events-none"
                   style={{ background: "linear-gradient(to right, #080808 0%, transparent 100%)" }} />
              {/* Thin divider between the two images */}
              {i === 0 && (
                <div className="absolute bottom-0 left-0 right-0 h-px"
                     style={{ background: "rgba(255,255,255,0.08)" }} />
              )}
              {/* Company label overlay — bottom-left corner */}
              <div className="absolute bottom-3 left-4 md:bottom-4 md:left-6">
                <p className="font-mono text-[0.55rem] uppercase tracking-[0.22em]"
                   style={{ color: "rgba(255,255,255,0.35)" }}>
                  {EXPERIENCES[i].company}
                </p>
              </div>
            </div>
          ))}

          {/* Mobile bottom fade */}
          <div className="absolute inset-x-0 bottom-0 h-20 pointer-events-none md:hidden"
               style={{ background: "linear-gradient(to top, #080808 0%, transparent 100%)" }} />
        </div>

      </div>

      <div className="h-px bg-white/[0.07]" />
    </section>
  );
}
