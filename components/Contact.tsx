"use client";

import { useRef, useEffect, useState } from "react";
import { gsap, useGSAP, SplitText } from "@/lib/gsap";
import { useMagnetic } from "@/hooks/useMagnetic";
import { PROFILE, SOCIALS } from "@/lib/constants";

export default function Contact() {
  const container = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const emailLinkRef = useRef<HTMLAnchorElement>(null);
  const { ref: magRef, attach: attachMagnetic } = useMagnetic<HTMLAnchorElement>({ strength: 0.45, radius: 200 });
  const [year, setYear] = useState(2026);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  useGSAP(
    () => {
      if (typeof window === "undefined") return;
      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      // Heading reveal
      const split = new SplitText(headingRef.current, { type: "words,lines", mask: "lines", aria: "auto" });
      const tl = gsap.timeline({
        scrollTrigger: { trigger: container.current, start: "top 65%", toggleActions: "play none none reverse" },
      });
      if (!prefersReduced) {
        tl.from(split.words, { yPercent: 115, duration: 1, ease: "expo-out", stagger: 0.04 });
      }

      // Magnetic email link
      const magneticCleanup = attachMagnetic();

      // Social links stagger
      const socials = gsap.utils.toArray<HTMLElement>(".contact-social");
      if (!prefersReduced) {
        tl.from(socials, { opacity: 0, y: 24, duration: 0.6, ease: "power2.out", stagger: 0.1 }, "-=0.3");
      }

      // Footer line
      const footer = gsap.utils.toArray<HTMLElement>(".contact-footer-item");
      if (!prefersReduced) {
        tl.from(footer, { opacity: 0, y: 12, duration: 0.5, ease: "power2.out", stagger: 0.08 }, "-=0.2");
      }

      return () => {
        split.revert();
        magneticCleanup?.();
      };
    },
    { scope: container }
  );

  const email = SOCIALS.find((s) => s.type === "email")!;

  return (
    <section
      id="contact"
      ref={container}
      className="relative flex min-h-[100svh] flex-col justify-between px-6 pt-24 md:px-12 md:pt-32 border-t border-[#1a1a1a]"
    >
      <div>
        <div className="mb-16 flex items-baseline gap-6 md:mb-24">
          <span className="font-mono text-xs tracking-[0.2em] text-white/40">(06)</span>
          <p className="label-mono text-white/50">Contact</p>
        </div>

        <div className="overflow-hidden">
          <h2
            ref={headingRef}
            className="font-display text-[clamp(2.25rem,8.5vw,8rem)] font-semibold leading-[0.9] tracking-[-0.04em] text-white"
          >
            Let&apos;s create something meaningful.
          </h2>
        </div>
      </div>

      {/* Main email magnetic link */}
      <div className="flex flex-col gap-12 py-16 md:py-24">
        <div className="flex flex-col gap-3">
          <p className="label-mono text-white/40">Get in touch</p>
          <div className="flex items-center">
            <a
              ref={(el) => {
                magRef.current = el;
                emailLinkRef.current = el;
              }}
              href={email.href}
              data-cursor="SEND"
              className="group inline-flex items-center gap-4 font-display text-[clamp(1.75rem,6vw,5rem)] font-semibold tracking-tight text-white"
            >
              <span className="relative">
                {email.label === "Email" ? "Say hello" : email.label}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-white transition-all duration-500 ease-out group-hover:w-full" />
              </span>
              <span className="text-white/40 transition-transform duration-500 group-hover:translate-x-2">
                →
              </span>
            </a>
          </div>
        </div>

        {/* Social links */}
        <div className="flex flex-wrap gap-x-10 gap-y-4">
          {SOCIALS.filter((s) => s.type !== "email").map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor=""
              className="contact-social group relative overflow-hidden py-1 font-mono text-xs uppercase tracking-[0.25em] text-[#a0a0a0]"
            >
              <span className="block transition-transform duration-300 group-hover:-translate-y-full">{s.label}</span>
              <span className="absolute left-0 top-full block text-white transition-transform duration-300 group-hover:-translate-y-full">
                {s.label} ↗
              </span>
            </a>
          ))}
        </div>
      </div>

      {/* Minimal footer */}
      <footer className="mt-auto border-t border-[#1a1a1a] py-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <p className="contact-footer-item font-mono text-[0.7rem] uppercase tracking-[0.2em] text-white/50">
            © {year} {PROFILE.name}
          </p>
          <p className="contact-footer-item font-mono text-[0.7rem] uppercase tracking-[0.2em] text-white/50">
            {PROFILE.location} — Designed &amp; Built with care
          </p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="contact-footer-item group flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.2em] text-white/50 transition-colors hover:text-white"
            data-cursor=""
          >
            Back to top
            <span className="transition-transform duration-300 group-hover:-translate-y-1">↑</span>
          </button>
        </div>
      </footer>
    </section>
  );
}
