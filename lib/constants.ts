/* ==========================================================================
   CONTENT — single source of truth for the portfolio
   ========================================================================== */

export const PROFILE = {
  name: "Edoardo Alvin Nugroho",
  firstName: "Edoardo",
  lastName: "Alvin",
  title: "UI/UX Designer & Front-End Developer",
  shortTitle: "UI/UX Designer & Developer",
  location: "Indonesia",
  availability: "Available for opportunities",
  education: "Information Systems Graduate, Satya Wacana Christian University",
  tagline:
    "I design meaningful digital experiences and build functional interfaces with a focus on usability, creativity, and detail.",
} as const;

export const NAV_ITEMS = [
  { id: "home",    label: "Home",    index: "01" },
  { id: "about",   label: "About",   index: "02" },
  { id: "skills",  label: "Skills",  index: "03" },
  { id: "work",    label: "Work",    index: "04" },
  { id: "contact", label: "Contact", index: "05" },
] as const;

export const ABOUT_PARAGRAPHS = [
  "Hey, I'm Edoardo Alvin Nugroho, a UI/UX Designer and Front-End Developer based in Indonesia.",
  "I enjoy creating digital experiences and paying attention to the little details that make a difference. From layouts and typography to colors and interactions, I believe every element has a role in making a website feel right.",
  "I graduated in Information Systems from Satya Wacana Christian University. During my studies, I developed an interest in both design and web development, which led me to explore how ideas can go from a simple design in Figma to a working website.",
  "I'm always curious to try new things, explore different approaches, and improve the way I work. I enjoy experimenting with layouts, creating smooth interactions, and finding ways to make interfaces both visually appealing and easy to use.",
  "For me, good design isn't just about how something looks. It's about how it works, how it feels, and the experience people take away from it.",
] as const;

export type SkillCategory = {
  title: string;
  index: string;
  skills: SkillItem[];
};

export type SkillItem = {
  name: string;
  /** Simple Icons slug — used to construct CDN URL */
  icon: string;
  /** Brand hex color */
  color: string;
  /** One-line description shown in hover preview */
  desc: string;
};

export const SKILLS: SkillCategory[] = [
  {
    title: "Design",
    index: "01",
    skills: [
      { name: "Figma", icon: "figma", color: "#F24E1E", desc: "Collaborative UI design & prototyping" },
    ],
  },
  {
    title: "Development",
    index: "02",
    skills: [
      { name: "HTML",         icon: "html5",      color: "#E34F26", desc: "Semantic markup & web structure" },
      { name: "CSS",          icon: "css3",        color: "#1572B6", desc: "Styling, layout & visual design" },
      { name: "JavaScript",   icon: "javascript",  color: "#F7DF1E", desc: "Dynamic behaviour & browser APIs" },
      { name: "TypeScript",   icon: "typescript",  color: "#3178C6", desc: "Typed superset of JavaScript" },
      { name: "ReactJS",      icon: "react",       color: "#61DAFB", desc: "Component-based UI library" },
      { name: "Next.js",      icon: "nextdotjs",   color: "#FFFFFF", desc: "Full-stack React framework" },
      { name: "Tailwind CSS", icon: "tailwindcss", color: "#06B6D4", desc: "Utility-first CSS framework" },
      { name: "PHP",          icon: "php",         color: "#777BB4", desc: "Server-side scripting language" },
    ],
  },
  {
    title: "Database & Tools",
    index: "03",
    skills: [
      { name: "MySQL",          icon: "mysql",          color: "#4479A1", desc: "Relational database management" },
      { name: "PostgreSQL",     icon: "postgresql",     color: "#4169E1", desc: "Advanced open-source RDBMS" },
      { name: "Git",            icon: "git",            color: "#F05032", desc: "Distributed version control" },
      { name: "VS Code",        icon: "visualstudiocode", color: "#007ACC", desc: "Extensible code editor by Microsoft" },
    ],
  },
] as const;

/* Flat list of all 13 technologies — drives the new grid showcase */
export const TECH: SkillItem[] = SKILLS.flatMap((c) => [...c.skills]);

export type ExperienceItem = {
  company: string;
  role: string;
  period: string;
  responsibilities: string[];
};

export const EXPERIENCES: ExperienceItem[] = [
  {
    company: "AirNav Indonesia",
    role: "Work Practice / Internship",
    period: "August 2025 to December 2025",
    responsibilities: [
      "Updated and maintained employee operational data.",
      "Reviewed employee certifications and license validity.",
      "Assisted with monthly operational data recaps.",
      "Participated in developing an internal web-based operational data management system.",
    ],
  },
] as const;

export type Project = {
  id: string;
  index: string;
  title: string;
  tagline: string;
  description: string;
  tags: string[];
  year: string;
  category: string;
  /** local image path under /public, or null to use picsum */
  imagePath: string | null;
  /** placeholder image seed for picsum (used when imagePath is null) */
  imageSeed: string;
  /** layout variant controls the asymmetric grid placement */
  span: "wide" | "normal" | "tall";
};

export const PROJECTS: Project[] = [
  {
    id: "bina-widya",
    index: "01",
    title: "Bina Widya School",
    tagline: "A multilingual website concept for Bina Widya School.",
    description:
      "Designed with students, parents, and teachers in mind. The project covers the entire design process, from understanding user needs and creating wireframes to building a high-fidelity prototype in three languages: Indonesian, English, and Mandarin.",
    tags: ["UI/UX Design", "Design Thinking", "Wireframing", "Prototyping"],
    year: "2025, 2026",
    category: "Design",
    imagePath: "/image/Binwid mockup.png.jpeg",
    imageSeed: "bina-widya",
    span: "wide",
  },
  {
    id: "iatca-yogyakarta",
    index: "02",
    title: "IATCA Yogyakarta",
    tagline: "A website built for an aviation training association.",
    description:
      "A multi-page website for IATCA Yogyakarta, featuring Home, About, News, Gallery, and Contact pages. Built using PHP and MySQL, with a focus on making organizational information easy to access.",
    tags: ["Front-End Development", "PHP", "MySQL"],
    year: "2025",
    category: "Development",
    imagePath: "/image/IATCA mockup.png",
    imageSeed: "iatca",
    span: "normal",
  },
  {
    id: "bhstore",
    index: "03",
    title: "BHstore",
    tagline: "An online store built from the ground up.",
    description:
      "An e-commerce website built with Next.js, Prisma, and PostgreSQL, featuring product browsing, shopping cart, and checkout functionality.",
    tags: ["E-commerce", "Next.js", "Prisma", "PostgreSQL"],
    year: "2026",
    category: "Full-Stack",
    imagePath: "/image/Bhstore mockup,png.jpeg",
    imageSeed: "bhstore",
    span: "normal",
  },
] as const;

export type SocialLink = {
  label: string;
  href: string;
  type: "email" | "linkedin" | "github";
};

export const SOCIALS: SocialLink[] = [
  { label: "Email", href: "mailto:hello@edoardonalvin.com", type: "email" },
  { label: "LinkedIn", href: "https://www.linkedin.com/", type: "linkedin" },
  { label: "GitHub", href: "https://www.github.com/", type: "github" },
] as const;

/* Section transition copy shown during curtain navigation */
export const TRANSITION_COPY: Record<string, string> = {
  home:    "WELCOME",
  about:   "ABOUT ME",
  skills:  "THE TOOLKIT",
  work:    "SELECTED WORK",
  contact: "GET IN TOUCH",
};
