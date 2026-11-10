"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { gsap, useGSAP, ScrollTrigger, SplitText } from "@/lib/gsap";
import { PROJECTS } from "@/lib/constants";

export default function Projects() {
  const container = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const indexRef = useRef<HTMLSpanElement>(null);
  const mainTrigger = useRef<ScrollTrigger | null>(null);
  const [active, setActive] = useState(0);

  useGSAP(
    () => {
      if (typeof window === "undefined") return;
      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      // Heading reveal
      const split = new SplitText(headingRef.current, { type: "words", mask: "words", aria: "auto" });
      const headTl = gsap.timeline({
        scrollTrigger: { trigger: container.current, start: "top 75%", toggleActions: "play none none reverse" },
      });
      if (!prefersReduced) {
        headTl.from(split.words, { yPercent: 115, duration: 1, ease: "expo-out", stagger: 0.06 });
      }

      const mm = gsap.matchMedia();

      // ---- Desktop: horizontal pinned showcase ----
      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        const track = trackRef.current!;
        const getScrollAmount = () => track.scrollWidth - window.innerWidth;

        const tween = gsap.to(track, {
          x: () => -getScrollAmount(),
          ease: "none",
          scrollTrigger: {
            trigger: container.current,
            start: "top top",
            end: () => "+=" + getScrollAmount(),
            scrub: 1,
            pin: true,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const i = Math.round(self.progress * (PROJECTS.length - 1));
              setActive(i);
              if (indexRef.current) indexRef.current.textContent = String(i + 1).padStart(2, "0");
            },
          },
        });
        mainTrigger.current = tween.scrollTrigger!;

        // Per-panel image reveal tied to horizontal scroll
        const panels = gsap.utils.toArray<HTMLElement>(".project-panel");
        panels.forEach((panel) => {
          const img = panel.querySelector<HTMLElement>(".project-img");
          const txt = panel.querySelectorAll<HTMLElement>(".project-reveal");
          if (img) {
            gsap.fromTo(
              img,
              { clipPath: "inset(0 0 100% 0)" },
              {
                clipPath: "inset(0 0 0% 0)",
                ease: "none",
                scrollTrigger: {
                  trigger: panel,
                  containerAnimation: tween,
                  start: "left 80%",
                  end: "left 30%",
                  scrub: true,
                },
              }
            );
          }
          if (txt.length) {
            gsap.from(txt, {
              opacity: 0,
              y: 40,
              duration: 0.8,
              ease: "power2.out",
              stagger: 0.1,
              scrollTrigger: {
                trigger: panel,
                containerAnimation: tween,
                start: "left 70%",
                toggleActions: "play none none reverse",
              },
            });
          }
        });
        // mm.revert() handles ScrollTrigger cleanup automatically.
      });

      // ---- Mobile / reduced-motion: vertical stack reveals ----
      mm.add("(max-width: 767px), (prefers-reduced-motion: reduce)", () => {
        const panels = gsap.utils.toArray<HTMLElement>(".project-panel");
        panels.forEach((panel) => {
          const img = panel.querySelector<HTMLElement>(".project-img");
          const txt = panel.querySelectorAll<HTMLElement>(".project-reveal");
          if (img && !prefersReduced) {
            gsap.fromTo(
              img,
              { clipPath: "inset(0 0 100% 0)" },
              {
                clipPath: "inset(0 0 0% 0)",
                duration: 1,
                ease: "cinema",
                scrollTrigger: { trigger: panel, start: "top 80%", toggleActions: "play none none reverse" },
              }
            );
          }
          if (txt.length && !prefersReduced) {
            gsap.from(txt, {
              opacity: 0,
              y: 30,
              duration: 0.7,
              ease: "power2.out",
              stagger: 0.08,
              scrollTrigger: { trigger: panel, start: "top 75%", toggleActions: "play none none reverse" },
            });
          }
        });
        // mm.revert() handles ScrollTrigger cleanup automatically.
      });

      return () => {
        split.revert();
        mm.revert();
      };
    },
    { scope: container }
  );

  // Navigate to a specific panel (desktop horizontal mode)
  const goToPanel = (p: number) => {
    const trigger = mainTrigger.current;
    const track = trackRef.current;
    if (!trigger || !track) return;
    const start = trigger.start ?? 0;
    const total = (trigger.end ?? 0) - start;
    const progress = PROJECTS.length > 1 ? p / (PROJECTS.length - 1) : 0;
    window.scrollTo({ top: start + progress * total, behavior: prefersReducedMotionGlobal() ? "auto" : "smooth" });
  };

  return (
    <section
      id="work"
      ref={container}
      className="relative overflow-hidden border-t border-[#1a1a1a] md:flex md:h-screen md:flex-col"
    >
      {/* Header */}
      <div className="px-6 pt-24 md:flex-shrink-0 md:px-12 md:pt-12">
        <div className="mb-8 flex items-baseline gap-6 md:mb-6">
          <span className="font-mono text-xs tracking-[0.2em] text-white/40">(05)</span>
          <p className="label-mono text-white/50">Selected Work</p>
        </div>
        <div className="overflow-hidden">
          <h2
            ref={headingRef}
            className="font-display text-[clamp(2rem,5vw,4rem)] font-semibold leading-[0.9] tracking-[-0.04em] text-white"
          >
            Selected projects.
          </h2>
        </div>
      </div>

      {/* Horizontal track (desktop) / vertical stack (mobile) */}
      <div className="mt-16 md:mt-0 md:flex-1 md:overflow-hidden">
        <div
          ref={trackRef}
          className="flex flex-col md:h-full md:w-max md:flex-row md:items-center"
        >
          {PROJECTS.map((project, i) => (
            <article
              key={project.id}
              className={`project-panel relative flex min-h-[80vh] flex-col justify-center px-6 py-16 md:h-full md:min-h-0 md:w-screen md:flex-row md:items-center md:px-12 ${
                i % 2 === 1 ? "md:flex-row-reverse" : ""
              }`}
            >
              {/* Image */}
              <div className="relative w-full md:w-[52%]">
                <div
                  data-cursor="VIEW PROJECT"
                  className="project-img relative aspect-[4/3] w-full overflow-hidden border border-[#1a1a1a] md:aspect-[3/4] md:h-[68vh]"
                >
                  <div className="project-img-inner absolute inset-0 h-[110%] -top-[5%] transition-transform duration-700 ease-out hover:scale-[1.04]">
                    <Image
                      src={`https://picsum.photos/seed/${project.imageSeed}/900/1100`}
                      alt={`${project.title} — ${project.tagline}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 55vw"
                    />
                  </div>
                  {/* Index badge */}
                  <span className="absolute left-4 top-4 font-mono text-xs tracking-[0.2em] text-white/80 mix-blend-difference">
                    {project.index} / {String(PROJECTS.length).padStart(2, "0")}
                  </span>
                </div>
              </div>

              {/* Text */}
              <div className="mt-8 flex w-full flex-col md:mt-0 md:w-[44%] md:px-12">
                <p className="project-reveal label-mono text-white/40">{project.category} — {project.year}</p>
                <h3 className="project-reveal mt-3 font-display text-[clamp(2rem,5vw,4rem)] font-semibold leading-[0.95] tracking-tight text-white">
                  {project.title}
                </h3>
                <p className="project-reveal mt-3 text-base text-white/80">{project.tagline}</p>
                <p className="project-reveal mt-5 max-w-md text-sm leading-relaxed text-[#a0a0a0] md:text-[0.95rem]">
                  {project.description}
                </p>

                <div className="project-reveal mt-7 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="border border-[#232323] px-3 py-1.5 font-mono text-[0.65rem] uppercase tracking-[0.15em] text-[#a0a0a0]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <button
                  data-cursor="VIEW PROJECT"
                  className="project-reveal group mt-8 hidden w-fit items-center gap-3 text-sm uppercase tracking-[0.2em] text-white md:flex"
                  onClick={() => goToPanel(Math.min(i + 1, PROJECTS.length - 1))}
                  aria-label={`Next project`}
                >
                  <span className="h-px w-10 bg-white transition-all duration-500 group-hover:w-16" />
                  View
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Active index nav (desktop horizontal) */}
      <div className="pointer-events-none fixed bottom-8 left-1/2 z-[100] hidden -translate-x-1/2 items-center gap-4 md:flex">
        {PROJECTS.map((_, i) => (
          <button
            key={i}
            onClick={() => goToPanel(i)}
            className={`h-1.5 w-8 transition-colors duration-300 ${
              active === i ? "bg-white" : "bg-white/20 hover:bg-white/40"
            }`}
            aria-label={`Go to project ${i + 1}`}
          />
        ))}
      </div>

      {/* Progress index readout */}
      <div className="pointer-events-none fixed right-8 bottom-8 z-[100] hidden font-mono text-xs tracking-[0.2em] text-white/60 md:block">
        <span ref={indexRef}>01</span> — {String(PROJECTS.length).padStart(2, "0")}
      </div>
    </section>
  );
}

/* helper to check reduced motion from a non-hook context */
function prefersReducedMotionGlobal() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
