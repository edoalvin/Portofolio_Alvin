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
  education: "Information Systems Graduate — Satya Wacana Christian University",
  tagline:
    "I design meaningful digital experiences and build functional interfaces with a focus on usability, creativity, and detail.",
} as const;

export const NAV_ITEMS = [
  { id: "home", label: "Home", index: "01" },
  { id: "about", label: "About", index: "02" },
  { id: "work", label: "Work", index: "03" },
  { id: "contact", label: "Contact", index: "04" },
] as const;

export const ABOUT_PARAGRAPHS = [
  "I'm Edoardo Alvin Nugroho, a UI/UX designer and front-end developer based in Indonesia. I care about the small details that turn a good interface into a great experience — the rhythm of a layout, the weight of a typeface, the moment a page responds to a gesture.",
  "I graduated in Information Systems from Satya Wacana Christian University, where I built a foundation in both design thinking and software development. That dual perspective lets me move comfortably between Figma and code, reasoning about the user and the system at once.",
  "My professional interest sits at the intersection of usability and craft. I'm drawn to editorial layouts, motion that earns its place, and interfaces that feel considered rather than assembled. I prototype early, question assumptions, and refine until the result feels inevitable.",
  "My approach is methodical but never rigid. I research before I design, design before I build, and measure what I make. I believe the best work happens when structure and spontaneity meet — when a clear system leaves room for a single, deliberate surprise.",
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
    period: "August 2025 – December 2025",
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
  /** placeholder image seed for picsum */
  imageSeed: string;
  /** layout variant controls the asymmetric grid placement */
  span: "wide" | "normal" | "tall";
};

export const PROJECTS: Project[] = [
  {
    id: "bina-widya",
    index: "01",
    title: "Bina Widya School",
    tagline: "A multilingual school website concept.",
    description:
      "A bilingual school website designed end-to-end through a design-thinking process — from user research and wireframes to a high-fidelity multilingual prototype that serves both local and international audiences.",
    tags: ["UI/UX Design", "Design Thinking", "User Research", "Wireframing", "Prototyping"],
    year: "2024",
    category: "Design",
    imageSeed: "school-editorial",
    span: "wide",
  },
  {
    id: "iatca-yogyakarta",
    index: "02",
    title: "IATCA Yogyakarta",
    tagline: "An association website, built front to back.",
    description:
      "A full multi-page website for an aviation training association — Home, About, News, Gallery, and Contact — built with PHP and MySQL and styled with Tailwind CSS.",
    tags: ["Front-End Development", "PHP", "MySQL", "Tailwind CSS"],
    year: "2024",
    category: "Development",
    imageSeed: "aviation-architecture",
    span: "normal",
  },
  {
    id: "airnav-ops",
    index: "03",
    title: "AirNav Operations System",
    tagline: "An internal operational data platform.",
    description:
      "An internal, web-based operational data management system for AirNav Indonesia. It centralises employee data management and operational information so staff can maintain records and recaps in one place.",
    tags: ["Internal System", "Employee Data", "Operational Data", "Web App"],
    year: "2025",
    category: "Development",
    imageSeed: "ops-dashboard",
    span: "tall",
  },
  {
    id: "bhstore",
    index: "04",
    title: "BHstore",
    tagline: "A full-stack e-commerce experience.",
    description:
      "A full-stack e-commerce storefront built with Next.js, with Prisma managing the data layer and PostgreSQL as the database — covering products, cart, and a clean, conversion-focused checkout flow.",
    tags: ["E-commerce", "Next.js", "Prisma", "PostgreSQL"],
    year: "2025",
    category: "Full-Stack",
    imageSeed: "ecommerce-store",
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
  home: "WELCOME",
  about: "ABOUT ME",
  work: "SELECTED WORK",
  contact: "GET IN TOUCH",
};
