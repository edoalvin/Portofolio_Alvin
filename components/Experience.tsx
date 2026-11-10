"use client";

import { useRef } from "react";
import { gsap, useGSAP, ScrollTrigger, SplitText } from "@/lib/gsap";
import { EXPERIENCES } from "@/lib/constants";

export default function Experience() {
  const container = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const lineFillRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (typeof window === "undefined") return;
      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const split = new SplitText(headingRef.current, { type: "words", mask: "words", aria: "auto" });

      const tl = gsap.timeline({
        scrollTrigger: { trigger: container.current, start: "top 70%", toggleActions: "play none none reverse" },
      });
      if (!prefersReduced) {
        tl.from(split.words, { yPercent: 115, duration: 1, ease: "expo-out", stagger: 0.08 });
      }

      // The timeline line fills as you scroll through it
      if (!prefersReduced && lineFillRef.current && timelineRef.current) {
        gsap.fromTo(
          lineFillRef.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            transformOrigin: "top",
            scrollTrigger: {
              trigger: timelineRef.current,
              start: "top 60%",
              end: "bottom 80%",
              scrub: true,
            },
          }
        );
      }

      // Reveal each timeline entry
      const entries = gsap.utils.toArray<HTMLElement>(".timeline-entry");
      entries.forEach((entry) => {
        const node = entry.querySelector<HTMLElement>(".timeline-node");
        const content = entry.querySelectorAll<HTMLElement>(".timeline-reveal");
        const subTl = gsap.timeline({
          scrollTrigger: {
            trigger: entry,
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        });
        if (prefersReduced) {
          subTl.set([node, ...Array.from(content)], { opacity: 1, scale: 1, y: 0 });
          return;
        }
        subTl
          .from(node, { scale: 0, duration: 0.5, ease: "back.out(2)" })
          .from(content, { opacity: 0, y: 28, duration: 0.7, ease: "power2.out", stagger: 0.1 }, "-=0.2")
          .from(entry.querySelectorAll<HTMLElement>(".timeline-li"), { opacity: 0, x: -10, duration: 0.5, ease: "power2.out", stagger: 0.08 }, "-=0.4");
      });

      return () => split.revert();
    },
    { scope: container }
  );

  return (
    <section
      id="experience"
      ref={container}
      className="relative px-6 py-24 md:px-12 md:py-40 border-t border-[#1a1a1a]"
    >
      <div className="mb-16 flex items-baseline gap-6 md:mb-24">
        <span className="font-mono text-xs tracking-[0.2em] text-white/40">(04)</span>
        <p className="label-mono text-white/50">Experience</p>
      </div>

      <div className="overflow-hidden">
        <h2
          ref={headingRef}
          className="font-display text-[clamp(2.5rem,7vw,6rem)] font-semibold leading-[0.9] tracking-[-0.04em] text-white mb-20 md:mb-28"
        >
          The path so far.
        </h2>
      </div>

      {/* Timeline */}
      <div ref={timelineRef} className="relative ml-1 md:ml-3">
        {/* Track */}
        <div className="absolute left-0 top-0 h-full w-px bg-[#1a1a1a]" />
        {/* Fill line */}
        <div
          ref={lineFillRef}
          className="absolute left-0 top-0 h-full w-px origin-top bg-white"
          style={{ transform: "scaleY(0)" }}
        />

        <div className="space-y-16 pl-10 md:pl-16">
          {EXPERIENCES.map((exp, i) => (
            <div key={i} className="timeline-entry relative">
              {/* Node */}
              <span
                className="timeline-node absolute -left-[1.5rem] top-1 flex h-3 w-3 -translate-x-1/2 items-center justify-center md:-left-[2.1rem]"
                style={{ opacity: 0 }}
              >
                <span className="block h-3 w-3 rounded-full border border-white bg-[#050505]" />
                <span className="absolute h-7 w-7 rounded-full border border-white/20 animate-ping opacity-30" />
              </span>

              <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:gap-12">
                {/* Period column */}
                <div className="md:col-span-3">
                  <p className="timeline-reveal font-mono text-xs uppercase tracking-[0.2em] text-[#a0a0a0]">
                    {exp.period}
                  </p>
                </div>

                {/* Content column */}
                <div className="md:col-span-9 group">
                  <h3 className="timeline-reveal font-display text-3xl font-semibold tracking-tight text-white md:text-5xl">
                    {exp.company}
                  </h3>
                  <p className="timeline-reveal mt-2 text-sm uppercase tracking-[0.15em] text-white/60">
                    {exp.role}
                  </p>

                  <ul className="mt-8 space-y-3">
                    {exp.responsibilities.map((r, j) => (
                      <li
                        key={j}
                        className="timeline-li flex gap-3 text-base leading-relaxed text-[#a0a0a0] transition-colors duration-300 group-hover:text-white/80"
                      >
                        <span className="mt-2 h-px w-5 flex-shrink-0 bg-white/30" />
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}

          {/* Continuing marker */}
          <div className="relative">
            <span className="absolute -left-[1.5rem] top-0 flex h-3 w-3 -translate-x-1/2 items-center justify-center md:-left-[2.1rem]">
              <span className="block h-2 w-2 rounded-full bg-white/40" />
            </span>
            <p className="pl-0 font-mono text-xs uppercase tracking-[0.2em] text-white/40">
              — Currently open to new chapters
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
