"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP, SplitText } from "@/lib/gsap";
import { ABOUT_PARAGRAPHS, PROFILE } from "@/lib/constants";

export default function About() {
  const container  = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const metaRef    = useRef<HTMLDivElement>(null);
  const imgWrapRef = useRef<HTMLDivElement>(null);
  const imgRef     = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (typeof window === "undefined") return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const split = new SplitText(headingRef.current, {
      type: "words", mask: "words", aria: "auto",
    });

    const tl = gsap.timeline({
      scrollTrigger: { trigger: container.current, start: "top 70%", toggleActions: "play none none reverse" },
    });

    if (!reduced) {
      tl.from(split.words, { yPercent: 115, duration: 1, ease: "expo-out", stagger: 0.08 });
    }

    tl.from(metaRef.current, { opacity: 0, y: 18, duration: 0.7, ease: "power2.out" }, reduced ? 0 : "-=0.5");

    if (!reduced) {
      tl.from(
        gsap.utils.toArray<HTMLElement>(".about-para"),
        { opacity: 0, y: 28, duration: 0.8, ease: "power2.out", stagger: 0.1 },
        "-=0.4"
      );

      tl.fromTo(
        imgWrapRef.current,
        { clipPath: "inset(0 0 100% 0)" },
        { clipPath: "inset(0 0 0% 0)", duration: 1.1, ease: "cinema" },
        "-=0.5"
      );

      gsap.to(imgRef.current, {
        yPercent: -10,
        ease: "none",
        scrollTrigger: { trigger: imgWrapRef.current, start: "top bottom", end: "bottom top", scrub: true },
      });
    }

    const wrap = imgWrapRef.current;
    if (wrap) {
      wrap.addEventListener("mouseenter", () => gsap.to(wrap, { scale: 1.015, duration: 0.5, ease: "power2.out" }));
      wrap.addEventListener("mouseleave", () => gsap.to(wrap, { scale: 1,     duration: 0.5, ease: "power2.out" }));
    }

    return () => split.revert();
  }, { scope: container });

  return (
    <section
      id="about"
      ref={container}
      data-theme="dark"
      className="relative px-6 py-24 md:px-12 md:py-36"
    >
      {/* ── Section label ── */}
      <p className="label-mono text-white/40 mb-14 md:mb-20">About</p>

      {/* ── Main grid ── */}
      <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-16">

        {/* ── LEFT: heading + meta (sticky) ── */}
        <div className="md:col-span-5 md:sticky md:top-28 md:self-start">

          <div className="overflow-hidden mb-12 md:mb-16">
            <h2
              ref={headingRef}
              className="font-display text-[clamp(2.5rem,7vw,6rem)] font-semibold leading-[0.9] tracking-[-0.04em] text-white"
            >
              Beyond the screen.
            </h2>
          </div>

          {/* Meta grid */}
          <div
            ref={metaRef}
            className="grid grid-cols-2 gap-x-8 gap-y-8 border-t border-[#1a1a1a] pt-8"
          >
            {[
              { label: "Education", value: PROFILE.education },
              { label: "Based in",  value: PROFILE.location },
              { label: "Focus",     value: "UI/UX Design & Front-End" },
              { label: "Status",    value: PROFILE.availability },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="label-mono text-white/35 mb-2">{label}</p>
                <p className="text-sm leading-relaxed text-white/70">{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT: paragraphs + image ── */}
        <div className="md:col-span-7 flex flex-col gap-8">

          {ABOUT_PARAGRAPHS.map((para, i) => (
            <p
              key={i}
              className="about-para text-[0.95rem] leading-[1.85] text-[#a0a0a0] md:text-base"
            >
              {para}
            </p>
          ))}

          {/* Parallax image */}
          <div
            ref={imgWrapRef}
            className="mt-4 relative aspect-[16/9] w-full overflow-hidden border border-[#1a1a1a]"
          >
            <div ref={imgRef} className="absolute inset-0 h-[118%] -top-[9%]">
              <Image
                src="https://picsum.photos/seed/about-editorial/1200/700"
                alt="Editorial workspace"
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
