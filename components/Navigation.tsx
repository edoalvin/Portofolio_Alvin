"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { NAV_ITEMS, PROFILE } from "@/lib/constants";
import { useNavigateTo } from "@/components/TransitionProvider";
import { prefersReducedMotion } from "@/lib/animations";

export default function Navigation() {
  const navigateTo = useNavigateTo();
  const [active, setActive] = useState<string>("home");
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLDivElement>(null);
  const burgerRef = useRef<HTMLButtonElement>(null);

  /* Scroll-adaptive background */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Active section detection */
  useEffect(() => {
    const sections = NAV_ITEMS.map((n) => document.getElementById(n.id)).filter(
      Boolean
    ) as HTMLElement[];
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.5, 1] }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  /* Mobile menu open/close animation */
  useEffect(() => {
    const menu = menuRef.current;
    const items = itemsRef.current;
    if (!menu || !items) return;

    if (menuOpen) {
      document.body.style.overflow = "hidden";
      if (prefersReducedMotion()) {
        gsap.set(menu, { display: "flex", opacity: 1 });
        gsap.set(items.children, { opacity: 1, y: 0 });
        return;
      }
      const tl = gsap.timeline();
      tl.set(menu, { display: "flex" })
        .fromTo(menu, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: "power2.out" })
        .from(
          items.children,
          { y: 60, opacity: 0, stagger: 0.08, duration: 0.7, ease: "expo-out" },
          "-=0.15"
        );
      return () => {
        tl.kill();
      };
    } else {
      document.body.style.overflow = "";
      if (prefersReducedMotion()) {
        gsap.set(menu, { display: "none" });
        return;
      }
      const tl = gsap.timeline();
      tl.to(items.children, {
        y: -40,
        opacity: 0,
        stagger: 0.04,
        duration: 0.3,
        ease: "power2.in",
      }).to(menu, { opacity: 0, duration: 0.3, ease: "power2.in" }, "-=0.1");
    }
  }, [menuOpen]);

  const handleNav = (id: string) => {
    setMenuOpen(false);
    // small delay so the menu can close first on mobile
    window.setTimeout(() => navigateTo(id), menuOpen ? 350 : 0);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 z-[8000] w-full transition-colors duration-500 ${
          scrolled
            ? "bg-[#050505]/80 backdrop-blur-md border-b border-[#1a1a1a]"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <nav className="mx-auto flex max-w-[1600px] items-center justify-between px-6 py-5 md:px-12 md:py-7">
          {/* Logo / name */}
          <button
            onClick={() => handleNav("home")}
            className="font-display text-sm font-semibold tracking-tight text-white md:text-base"
            aria-label="Go to home"
          >
            EDOARDO<span className="text-white/40">.</span>ALVIN
          </button>

          {/* Desktop nav */}
          <ul className="hidden md:flex items-center gap-10">
            {NAV_ITEMS.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => handleNav(item.id)}
                  data-cursor=""
                  className={`nav-link group flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.2em] transition-colors duration-300 ${
                    active === item.id ? "text-white" : "text-[#a0a0a0] hover:text-white"
                  }`}
                >
                  <span className="text-white/30">{item.index}</span>
                  <span className="relative">
                    {item.label}
                    <span
                      className={`nav-link__underline ${
                        active === item.id ? "is-active" : ""
                      }`}
                    />
                  </span>
                </button>
              </li>
            ))}
          </ul>

          {/* Mobile burger */}
          <button
            ref={burgerRef}
            onClick={() => setMenuOpen((o) => !o)}
            className="md:hidden relative z-[8100] flex h-8 w-8 flex-col items-center justify-center gap-[6px]"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            <span
              className={`block h-px w-6 bg-white transition-transform duration-300 ${
                menuOpen ? "translate-y-[3.5px] rotate-45" : ""
              }`}
            />
            <span
              className={`block h-px w-6 bg-white transition-transform duration-300 ${
                menuOpen ? "-translate-y-[3.5px] -rotate-45" : ""
              }`}
            />
          </button>
        </nav>
      </header>

      {/* Mobile fullscreen menu */}
      <div
        ref={menuRef}
        className="fixed inset-0 z-[7900] hidden flex-col items-start justify-center gap-2 bg-[#050505] px-6 md:hidden"
      >
        <div ref={itemsRef} className="flex flex-col gap-3 w-full">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              className="group flex items-baseline gap-4 py-2 text-left"
            >
              <span className="font-mono text-xs text-white/30">{item.index}</span>
              <span className="font-display text-[clamp(2.5rem,12vw,4.5rem)] font-semibold leading-none tracking-tight text-white transition-colors group-hover:text-white/70">
                {item.label}
              </span>
            </button>
          ))}
          <div className="mt-10 font-mono text-xs uppercase tracking-[0.2em] text-[#a0a0a0]">
            {PROFILE.location} — {PROFILE.availability}
          </div>
        </div>
      </div>
    </>
  );
}
