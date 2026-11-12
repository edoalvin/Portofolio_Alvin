"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP, ScrollTrigger, SplitText } from "@/lib/gsap";
import { PROJECTS } from "@/lib/constants";

/*
  PROJECTS
  ─────────
  · Pure white background — no scrub, consistent with the whole site.
  · data-theme="light" so navbar shows dark text.
  · Compact header: label + heading, minimal bottom padding before first panel.
  · Desktop: stage pins to top of viewport and horizontal track scrolls.
    scrub: 2 gives smooth, deliberate scrolling — each panel stays visible
    long enough that users see the full project before the next arrives.
  · Images: object-contain so the full mockup is always visible, no cropping.
  · Counter (dot-nav + readout): rendered INSIDE the section as a sticky bar
    at the bottom of the stage — NOT as a fixed/global overlay. Completely
    hidden when the section is not in view (the pin handles this naturally
    because the elements are children of the stage).
*/

/* Cream palette matching Toolkit */
const BG   = "#ffffff";
const DARK = "#050505";

export default function Projects() {
  const sectionRef  = useRef<HTMLElement>(null);
  const headerRef   = useRef<HTMLDivElement>(null);
  const headingRef  = useRef<HTMLHeadingElement>(null);
  const eyebrowRef  = useRef<HTMLParagraphElement>(null);
  const stageRef    = useRef<HTMLDivElement>(null);
  const trackRef    = useRef<HTMLDivElement>(null);
  const indexRef    = useRef<HTMLSpanElement>(null);
  const triggerRef  = useRef<ScrollTrigger | null>(null);
  const [active, setActive] = useState(0);

  /* ── Background scrub dark → cream ──────────────────────────────────── */
  useEffect(() => {
    const r   = window.matchMedia("(prefers-reduced-motion:reduce)").matches;
    const sec = sectionRef.current;
    if (!sec) return;
    if (r) { sec.style.background = BG; return; }

    gsap.set(sec, { backgroundColor: DARK });
    const tl = gsap.timeline({
      scrollTrigger: { trigger: sec, start: "top 90%", end: "top 20%", scrub: 1.4 },
    });
    tl.to(sec,                { backgroundColor: BG,       ease: "none" }, 0)
      .to(eyebrowRef.current, { color: "rgba(0,0,0,0.35)", ease: "none" }, 0)
      .to(headingRef.current, { color: "#0a0a0a",          ease: "none" }, 0);

    return () => { tl.kill(); };
  }, []);

  /* ── Heading reveal + horizontal pin ────────────────────────────────── */
  useGSAP(() => {
    if (typeof window === "undefined") return;
    const reduced = window.matchMedia("(prefers-reduced-motion:reduce)").matches;

    /* Heading */
    const split = new SplitText(headingRef.current, {
      type: "words", mask: "words", aria: "auto",
    });
    const headTl = gsap.timeline({
      scrollTrigger: {
        trigger: stageRef.current,
        start: "top 90%",
        toggleActions: "play none none reverse",
      },
    });
    if (!reduced) {
      headTl
        .from(eyebrowRef.current, { opacity: 0, y: 10, duration: 0.5, ease: "power2.out" })
        .from(split.words, { yPercent: 115, duration: 0.9, ease: "expo-out", stagger: 0.07 }, "-=0.3");
    }

    const mm = gsap.matchMedia();

    /* ── Desktop horizontal pin ── */
    mm.add("(min-width: 768px) and (prefers-reduced-motion:no-preference)", () => {
      const track = trackRef.current!;
      const stage = stageRef.current!;

      const getAmount = () => track.scrollWidth - window.innerWidth;

      const tween = gsap.to(track, {
        x: () => -getAmount(),
        ease: "none",
        scrollTrigger: {
          trigger: stage,
          start: "top top",
          end: () => `+=${getAmount()}`,
          /*
            scrub: 2.5 — deliberate, unhurried scroll.
            Each panel is one full viewport wide; with scrub:2.5 the user
            needs to scroll ~2.5× the panel width to fully traverse it,
            giving ample time to read the content before the next panel
            enters. No snap, no lock — purely physical scroll mapping.
          */
          scrub: 2.5,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const i = Math.round(self.progress * (PROJECTS.length - 1));
            setActive(i);
            if (indexRef.current) indexRef.current.textContent = String(i + 1);
          },
        },
      });
      triggerRef.current = tween.scrollTrigger!;

      /* Per-panel reveals — tied to containerAnimation */
      gsap.utils.toArray<HTMLElement>(".project-panel").forEach((panel) => {
        const img = panel.querySelector<HTMLElement>(".project-img");
        const txt = panel.querySelectorAll<HTMLElement>(".project-reveal");

        if (img) {
          gsap.fromTo(img,
            { clipPath: "inset(0 0 100% 0)" },
            {
              clipPath: "inset(0 0 0% 0)", ease: "none",
              scrollTrigger: {
                trigger: panel, containerAnimation: tween,
                start: "left 90%", end: "left 10%", scrub: true,
              },
            }
          );
        }

        if (txt.length) {
          gsap.from(txt, {
            opacity: 0, y: 24,
            duration: 0.65, ease: "power2.out", stagger: 0.07,
            scrollTrigger: {
              trigger: panel, containerAnimation: tween,
              start: "left 75%",
              toggleActions: "play none none reverse",
            },
          });
        }
      });
    });

    /* ── Mobile vertical reveals ── */
    mm.add("(max-width: 767px), (prefers-reduced-motion:reduce)", () => {
      gsap.utils.toArray<HTMLElement>(".project-panel").forEach((panel) => {
        const img = panel.querySelector<HTMLElement>(".project-img");
        const txt = panel.querySelectorAll<HTMLElement>(".project-reveal");
        if (img && !reduced) {
          gsap.fromTo(img,
            { clipPath: "inset(0 0 100% 0)" },
            {
              clipPath: "inset(0 0 0% 0)", duration: 1, ease: "cinema",
              scrollTrigger: { trigger: panel, start: "top 82%", toggleActions: "play none none reverse" },
            }
          );
        }
        if (txt.length && !reduced) {
          gsap.from(txt, {
            opacity: 0, y: 22, duration: 0.6, ease: "power2.out", stagger: 0.07,
            scrollTrigger: { trigger: panel, start: "top 78%", toggleActions: "play none none reverse" },
          });
        }
      });
    });

    return () => { split.revert(); mm.revert(); };
  }, { scope: sectionRef });

  /* Navigate to panel (desktop) */
  const goToPanel = (p: number) => {
    const trigger = triggerRef.current;
    if (!trigger) return;
    const start = trigger.start ?? 0;
    const total = (trigger.end ?? 0) - start;
    const reduced = window.matchMedia("(prefers-reduced-motion:reduce)").matches;
    window.scrollTo({
      top: start + (PROJECTS.length > 1 ? p / (PROJECTS.length - 1) : 0) * total,
      behavior: reduced ? "auto" : "smooth",
    });
  };

  return (
    <section
      id="work"
      ref={sectionRef}
      data-theme="light"
      className="relative"
      style={{ background: DARK }}
    >
      {/* ── PINNED STAGE ── */}
      <div
        ref={stageRef}
        className="relative overflow-hidden md:h-screen md:flex md:flex-col"
      >
        {/* Section heading — flush at the top of the pinned viewport */}
        <div
          ref={headerRef}
          className="flex-shrink-0 px-6 pt-10 pb-6 md:px-16 md:pt-12 md:pb-8"
        >
          <p
            ref={eyebrowRef}
            className="label-mono mb-3"
            style={{ color: "rgba(0,0,0,0.38)" }}
          >
            Work
          </p>
          <div className="overflow-hidden">
            <h2
              ref={headingRef}
              className="font-display text-[clamp(2rem,4.5vw,3.75rem)] font-semibold leading-[0.9] tracking-[-0.04em]"
              style={{ color: "#0a0a0a" }}
            >
              Selected projects.
            </h2>
          </div>
        </div>

        {/* Horizontal track — fills remaining height after heading */}
        <div
          ref={trackRef}
          className="flex flex-col md:flex-1 md:w-max md:flex-row md:items-stretch"
        >
          {PROJECTS.map((project, i) => {
            const flip = i % 2 === 1;
            return (
              <article
                key={project.id}
                className={`project-panel flex flex-col justify-center
                  px-6 py-10
                  md:flex-row md:items-center md:h-full md:w-screen md:py-0 md:px-16
                  ${flip ? "md:flex-row-reverse" : ""}`}
              >
                {/* Image — 16:9 frame, object-contain, no white bands */}
                <div className="w-full flex-shrink-0 md:w-[52%]">
                  <div
                    className="project-img relative w-full overflow-hidden border aspect-video"
                    style={{ borderColor: "rgba(0,0,0,0.08)", background: "#f4f4f4" }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={project.imagePath ?? `https://picsum.photos/seed/${project.imageSeed}/1200/800`}
                      alt={project.title}
                      className="absolute inset-0 w-full h-full object-contain"
                      draggable={false}
                    />
                  </div>
                </div>

                {/* Text */}
                <div
                  className={`flex flex-col gap-4 mt-8 md:mt-0 md:w-[44%]
                    ${flip ? "md:pr-16 md:pl-0" : "md:pl-16 md:pr-0"}`}
                >
                  <p className="project-reveal label-mono" style={{ color: "rgba(0,0,0,0.38)" }}>
                    {project.category}, {project.year}
                  </p>

                  <h3
                    className="project-reveal font-display text-[clamp(1.75rem,3.5vw,3rem)] font-semibold leading-[0.95] tracking-[-0.03em]"
                    style={{ color: "#0a0a0a" }}
                  >
                    {project.title}
                  </h3>

                  <p
                    className="project-reveal text-sm font-medium md:text-base"
                    style={{ color: "rgba(0,0,0,0.65)" }}
                  >
                    {project.tagline}
                  </p>

                  <p
                    className="project-reveal text-sm leading-[1.8] max-w-[380px]"
                    style={{ color: "#7a7470" }}
                  >
                    {project.description}
                  </p>

                  <div className="project-reveal flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1.5 font-mono text-[0.6rem] uppercase tracking-[0.15em]"
                        style={{ border: "1px solid rgba(0,0,0,0.12)", color: "#7a7470" }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <button
                    className="project-reveal group mt-1 hidden w-fit items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.25em] transition-colors md:flex"
                    style={{ color: "rgba(0,0,0,0.38)" }}
                    onClick={() => goToPanel(Math.min(i + 1, PROJECTS.length - 1))}
                    aria-label="Next project"
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#0a0a0a")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(0,0,0,0.38)")}
                  >
                    View
                    <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        {/*
          COUNTER — absolute inside the stage (NOT fixed/global).
          Only visible while the stage is pinned = only while user is in
          the Projects section. Disappears naturally when pin releases.
        */}
        <div className="hidden md:flex absolute bottom-6 left-0 right-0 items-center justify-center gap-6 pointer-events-none">
          {/* Dot nav */}
          <div className="flex items-center gap-3 pointer-events-auto">
            {PROJECTS.map((_, i) => (
              <button
                key={i}
                onClick={() => goToPanel(i)}
                className={`h-1 rounded-full transition-all duration-300 ${
                  active === i ? "w-8" : "w-4"
                }`}
                style={{ background: active === i ? "#0a0a0a" : "rgba(0,0,0,0.20)" }}
                aria-label={`Go to project ${i + 1}`}
              />
            ))}
          </div>

          {/* Index readout */}
          <div
            className="font-mono text-xs tracking-[0.2em] pointer-events-none"
            style={{ color: "rgba(0,0,0,0.35)" }}
          >
            <span ref={indexRef}>1</span>
            <span className="mx-1 opacity-40">/</span>
            {String(PROJECTS.length)}
          </div>
        </div>
      </div>
    </section>
  );
}
