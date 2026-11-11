"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { NAV_ITEMS, PROFILE } from "@/lib/constants";
import { useNavigateTo } from "@/components/TransitionProvider";
import { prefersReducedMotion } from "@/lib/animations";

export default function Navigation() {
  const navigateTo = useNavigateTo();
  const [active, setActive]     = useState<string>("home");
  const [scrolled, setScrolled] = useState(false);
  const [onLight, setOnLight]   = useState(true);   // true = over the light hero
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef   = useRef<HTMLDivElement>(null);
  const itemsRef  = useRef<HTMLDivElement>(null);
  const burgerRef = useRef<HTMLButtonElement>(null);

  /* ── Detect scroll position to toggle bg + text colour ──────────────── */
  useEffect(() => {
    const heroEl = document.getElementById("home");

    const update = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      // "on light" while the hero section is still filling the viewport top
      const heroBottom = heroEl ? heroEl.getBoundingClientRect().bottom : 0;
      setOnLight(heroBottom > 60);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  /* ── Active section detection ────────────────────────────────────────── */
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

  /* ── Mobile menu open/close animation ───────────────────────────────── */
  useEffect(() => {
    const menu  = menuRef.current;
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
        .from(items.children, { y: 60, opacity: 0, stagger: 0.08, duration: 0.7, ease: "expo-out" }, "-=0.15");
      return () => { tl.kill(); };
    } else {
      document.body.style.overflow = "";
      if (prefersReducedMotion()) {
        gsap.set(menu, { display: "none" });
        return;
      }
      const tl = gsap.timeline();
      tl.to(items.children, { y: -40, opacity: 0, stagger: 0.04, duration: 0.3, ease: "power2.in" })
        .to(menu, { opacity: 0, duration: 0.3, ease: "power2.in" }, "-=0.1")
        .set(menu, { display: "none" });
    }
  }, [menuOpen]);

  const handleNav = (id: string) => {
    setMenuOpen(false);
    window.setTimeout(() => navigateTo(id), menuOpen ? 350 : 0);
  };

  /* ── Derived colour tokens ───────────────────────────────────────────── */
  // Over the light hero: dark text, light/transparent bg
  // Over dark sections (scrolled past hero): white text, dark bg
  const textColor   = onLight ? "text-[#111]"      : "text-white";
  const subColor    = onLight ? "text-[#555]"      : "text-[#a0a0a0]";
  const activeColor = onLight ? "text-[#111]"      : "text-white";
  const burgerBg    = onLight ? "bg-[#111]"        : "bg-white";

  const headerBg = scrolled && !onLight
    ? "bg-[#050505]/85 backdrop-blur-md border-b border-[#1a1a1a]"
    : onLight && scrolled
    ? "bg-[#e8e8e8]/85 backdrop-blur-md border-b border-[#ccc]"
    : "bg-transparent border-b border-transparent";

  return (
    <>
      <header className={`fixed top-0 left-0 z-[8000] w-full transition-colors duration-500 ${headerBg}`}>
        <nav className="mx-auto flex max-w-[1600px] items-center justify-between px-6 py-5 md:px-12 md:py-7">

          {/* Logo */}
          <button
            onClick={() => handleNav("home")}
            className={`font-display text-sm font-semibold tracking-tight transition-colors duration-500 md:text-base ${textColor}`}
            aria-label="Go to home"
          >
            EDOARDO ALVIN NUGROHO
          </button>

          {/* Desktop nav links */}
          <ul className="hidden md:flex items-center gap-10">
            {NAV_ITEMS.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => handleNav(item.id)}
                  data-cursor=""
                  className={`nav-link group flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.2em] transition-colors duration-300 ${
                    active === item.id ? activeColor : `${subColor} hover:${onLight ? "text-[#111]" : "text-white"}`
                  }`}
                >
                  <span className="relative">
                    {item.label}
                    <span className={`nav-link__underline ${active === item.id ? "is-active" : ""}`} />
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
              className={`block h-px w-6 transition-all duration-300 ${burgerBg} ${
                menuOpen ? "translate-y-[3.5px] rotate-45" : ""
              }`}
            />
            <span
              className={`block h-px w-6 transition-all duration-300 ${burgerBg} ${
                menuOpen ? "-translate-y-[3.5px] -rotate-45" : ""
              }`}
            />
          </button>
        </nav>
      </header>

      {/* Mobile fullscreen menu (always dark) */}
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
              <span className="font-display text-[clamp(2.5rem,12vw,4.5rem)] font-semibold leading-none tracking-tight text-white transition-colors group-hover:text-white/70">
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
