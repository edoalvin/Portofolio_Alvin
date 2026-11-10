"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP, ScrollTrigger, SplitText } from "@/lib/gsap";
import { ABOUT_PARAGRAPHS, PROFILE } from "@/lib/constants";

export default function About() {
  const container = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const imgWrapRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (typeof window === "undefined") return;
      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      // Heading word reveal with mask
      const headingSplit = new SplitText(headingRef.current, {
        type: "words",
        mask: "words",
        aria: "auto",
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container.current,
          start: "top 70%",
          toggleActions: "play none none reverse",
        },
      });

      if (!prefersReduced) {
        tl.from(headingSplit.words, {
          yPercent: 115,
          duration: 1,
          ease: "expo-out",
          stagger: 0.08,
        });
      }

      // Intro label
      tl.from(introRef.current, { opacity: 0, y: 16, duration: 0.7, ease: "power2.out" }, prefersReduced ? 0 : "-=0.5");

      // Paragraph stagger
      const paras = gsap.utils.toArray<HTMLElement>(".about-para");
      if (!prefersReduced) {
        tl.from(paras, { opacity: 0, y: 30, duration: 0.8, ease: "power2.out", stagger: 0.12 }, "-=0.3");
      }

      // Image reveal (clip-path open + parallax)
      if (!prefersReduced) {
        tl.fromTo(
          imgWrapRef.current,
          { clipPath: "inset(0 0 100% 0)" },
          { clipPath: "inset(0 0 0% 0)", duration: 1, ease: "cinema" },
          "-=0.6"
        );

        // Parallax on the inner image
        gsap.to(imgRef.current, {
          yPercent: -12,
          ease: "none",
          scrollTrigger: {
            trigger: imgWrapRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      }

      // Hover lift on image
      const wrap = imgWrapRef.current;
      if (wrap) {
        wrap.addEventListener("mouseenter", () => gsap.to(wrap, { scale: 1.01, duration: 0.6, ease: "power2.out" }));
        wrap.addEventListener("mouseleave", () => gsap.to(wrap, { scale: 1, duration: 0.6, ease: "power2.out" }));
      }

      return () => headingSplit.revert();
    },
    { scope: container }
  );

  return (
    <section
      id="about"
      ref={container}
      className="relative px-6 py-24 md:px-12 md:py-40"
    >
      {/* Section header */}
      <div className="mb-16 flex items-baseline gap-6 md:mb-24">
        <span className="font-mono text-xs tracking-[0.2em] text-white/40">(02)</span>
        <div ref={introRef}>
          <p className="label-mono text-white/50">About</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-16">
        {/* Left sticky column — heading + meta */}
        <div className="md:col-span-5">
          <div className="md:sticky md:top-28">
            <div className="overflow-hidden">
              <h2
                ref={headingRef}
                className="font-display text-[clamp(2.5rem,7vw,6rem)] font-semibold leading-[0.9] tracking-[-0.04em] text-white"
              >
                Beyond the screen.
              </h2>
            </div>

            <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-[#1a1a1a] pt-8 md:mt-16">
              <div>
                <p className="label-mono text-white/40">Education</p>
                <p className="mt-2 text-sm text-white/80 leading-relaxed">
                  {PROFILE.education}
                </p>
              </div>
              <div>
                <p className="label-mono text-white/40">Based in</p>
                <p className="mt-2 text-sm text-white/80">{PROFILE.location}</p>
              </div>
              <div>
                <p className="label-mono text-white/40">Focus</p>
                <p className="mt-2 text-sm text-white/80">
                  UI/UX Design &amp; Front-End
                </p>
              </div>
              <div>
                <p className="label-mono text-white/40">Status</p>
                <p className="mt-2 text-sm text-white/80">
                  {PROFILE.availability}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right column — paragraphs + image */}
        <div className="md:col-span-7 flex flex-col gap-8 md:gap-10">
          {ABOUT_PARAGRAPHS.map((para, i) => (
            <p
              key={i}
              className={`about-para text-base leading-relaxed text-[#a0a0a0] md:text-lg ${
                i === 0 ? "first-letter:font-display first-letter:text-[3.5rem] first-letter:font-semibold first-letter:text-white first-letter:mr-2 first-letter:float-left first-letter:leading-[0.8]" : ""
              }`}
            >
              {para}
            </p>
          ))}

          {/* Parallax image */}
          <div
            ref={imgWrapRef}
            className="relative my-4 aspect-[16/9] w-full overflow-hidden border border-[#1a1a1a]"
          >
            <div ref={imgRef} className="absolute inset-0 h-[118%] -top-[9%]">
              <Image
                src="https://picsum.photos/seed/about-editorial/1200/700"
                alt="Editorial workspace placeholder"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 60vw"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
