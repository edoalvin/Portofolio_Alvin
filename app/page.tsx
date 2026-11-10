import { TransitionProvider } from "@/components/TransitionProvider";
import Preloader from "@/components/Preloader";
import Cursor from "@/components/Cursor";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Experience from "@/components/Experience";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <TransitionProvider>
      <Preloader />
      <Cursor />
      <Navigation />
      <main className="relative">
        <Hero />
        <About />
        <Skills />
        <Experience />
        <Projects />
        <Contact />
      </main>
    </TransitionProvider>
  );
}
