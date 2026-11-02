import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  Code2,
  Database,
  Download,
  Github,
  Globe2,
  Layers3,
  Linkedin,
  Mail,
  MapPin,
  Moon,
  Palette,
  Send,
  Server,
  Smartphone,
  Sparkles,
  Sun,
  Zap,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const skills = [
  { name: "React / JavaScript", level: "Advanced", icon: Code2 },
  { name: "Node.js / Express", level: "Advanced", icon: Server },
  { name: "MongoDB / Mongoose", level: "Advanced", icon: Database },
  { name: "Responsive UI / UX", level: "Advanced", icon: Smartphone },
  { name: "REST APIs / JWT", level: "Strong", icon: Globe2 },
  { name: "Design Systems", level: "Strong", icon: Palette },
];

const projects = [
  {
    number: "01",
    title: "ElectroShop",
    type: "MERN E-commerce",
    description:
      "A complete electronics shopping experience with product discovery, cart, checkout, authentication and an admin dashboard.",
    tags: ["React", "Node.js", "MongoDB"],
    gradient: "portfolio-gradient-one",
  },
  {
    number: "02",
    title: "MyBank",
    type: "Fintech Dashboard",
    description:
      "A modern banking platform for account opening, deposits, withdrawals, transaction history, passbook and receipt generation.",
    tags: ["MERN", "JWT", "jsPDF"],
    gradient: "portfolio-gradient-two",
  },
  {
    number: "03",
    title: "ChatAI",
    type: "AI Chat Platform",
    description:
      "A responsive AI assistant interface with sessions, recent conversations, authentication, markdown replies and a focused chat workflow.",
    tags: ["React", "Express", "AI"],
    gradient: "portfolio-gradient-three",
  },
];

export default function Portfolio() {
  const { theme, toggleTheme } = useTheme();

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="portfolio-shell">
      <header className="portfolio-header">
        <div className="portfolio-container portfolio-nav">
          <button className="portfolio-logo" onClick={() => scrollTo("home")} aria-label="Go to top">
            <span className="portfolio-logo-mark"><Sparkles size={17} /></span>
            <span>DEV<span>.</span></span>
          </button>

          <nav className="portfolio-nav-links" aria-label="Main navigation">
            <button onClick={() => scrollTo("about")}>About</button>
            <button onClick={() => scrollTo("skills")}>Skills</button>
            <button onClick={() => scrollTo("projects")}>Projects</button>
            <button onClick={() => scrollTo("contact")}>Contact</button>
          </nav>

          <div className="portfolio-nav-actions">
            <button className="portfolio-icon-btn" onClick={toggleTheme} aria-label="Toggle theme">
              {theme === "light" ? <Moon size={17} /> : <Sun size={17} />}
            </button>
            <button className="portfolio-nav-cta" onClick={() => scrollTo("contact")}>
              Let's talk <ArrowUpRight size={16} />
            </button>
          </div>
        </div>
      </header>

      <main>
        <section id="home" className="portfolio-hero">
          <div className="portfolio-container portfolio-hero-grid">
            <div className="portfolio-hero-copy">
              <div className="portfolio-kicker">
                <span className="status-dot" /> Available for new opportunities
              </div>

              <h1>
                I build <span>digital products</span> that feel simple, fast and memorable.
              </h1>

              <p className="portfolio-hero-text">
                Full-stack developer focused on modern React interfaces, scalable Node.js
                APIs and polished user experiences.
              </p>

              <div className="portfolio-hero-actions">
                <button className="portfolio-primary-btn" onClick={() => scrollTo("projects")}>
                  View my work <ArrowUpRight size={18} />
                </button>
                <button className="portfolio-secondary-btn" onClick={() => scrollTo("contact")}>
                  <Mail size={17} /> Contact me
                </button>
              </div>

              <div className="portfolio-mini-stats">
                <div><strong>10+</strong><span>Projects built</span></div>
                <div><strong>3+</strong><span>Core stacks</span></div>
                <div><strong>100%</strong><span>Responsive UI</span></div>
              </div>
            </div>

            <div className="portfolio-visual" aria-label="Developer workspace illustration">
              <div className="portfolio-orbit orbit-one" />
              <div className="portfolio-orbit orbit-two" />
              <div className="portfolio-code-card">
                <div className="code-window-bar">
                  <span /><span /><span />
                  <small>developer.js</small>
                </div>
                <pre>{`const developer = {
  role: "Full Stack",
  frontend: ["React", "UI/UX"],
  backend: ["Node", "Express"],
  database: "MongoDB",
  mindset: "Build. Learn. Improve."
};`}</pre>
                <div className="code-status"><Zap size={14} /> clean code · thoughtful UX</div>
              </div>
              <div className="floating-badge badge-top"><Layers3 size={17} /> Full Stack</div>
              <div className="floating-badge badge-bottom"><Sparkles size={17} /> Modern UI</div>
            </div>
          </div>
        </section>

        <section id="about" className="portfolio-section">
          <div className="portfolio-container">
            <div className="portfolio-section-label">01 — About</div>
            <div className="portfolio-about-grid">
              <div>
                <h2>Turning ideas into <em>useful experiences.</em></h2>
              </div>
              <div className="portfolio-about-copy">
                <p>
                  I enjoy taking an idea from a rough concept to a production-ready web
                  experience. My approach combines clean architecture, accessible UI,
                  responsive layouts and practical business logic.
                </p>
                <p>
                  I care about the details users notice: hierarchy, spacing, loading states,
                  forms, feedback, mobile behavior and the small interactions that make a
                  product feel finished.
                </p>
                <div className="portfolio-location"><MapPin size={16} /> India · Open to remote opportunities</div>
              </div>
            </div>
          </div>
        </section>

        <section id="skills" className="portfolio-section portfolio-skills-section">
          <div className="portfolio-container">
            <div className="portfolio-section-heading">
              <div>
                <div className="portfolio-section-label">02 — Expertise</div>
                <h2>Tools I use to <em>ship.</em></h2>
              </div>
              <p>Focused on practical full-stack development and high-quality frontend experiences.</p>
            </div>

            <div className="portfolio-skills-grid">
              {skills.map(({ name, level, icon: Icon }) => (
                <div className="portfolio-skill-card" key={name}>
                  <div className="skill-icon"><Icon size={21} /></div>
                  <div>
                    <h3>{name}</h3>
                    <span>{level}</span>
                  </div>
                  <ArrowUpRight size={16} className="skill-arrow" />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="projects" className="portfolio-section">
          <div className="portfolio-container">
            <div className="portfolio-section-heading">
              <div>
                <div className="portfolio-section-label">03 — Selected work</div>
                <h2>Projects built with <em>purpose.</em></h2>
              </div>
              <span className="portfolio-project-note">MERN · React · Node · MongoDB</span>
            </div>

            <div className="portfolio-projects">
              {projects.map((project) => (
                <article className="portfolio-project-card" key={project.title}>
                  <div className={`portfolio-project-art ${project.gradient}`}>
                    <span className="project-number">{project.number}</span>
                    <div className="project-art-ui">
                      <div className="art-bar" />
                      <div className="art-grid">
                        <span /><span /><span />
                        <span /><span /><span />
                      </div>
                    </div>
                    <ArrowUpRight className="project-art-arrow" size={22} />
                  </div>
                  <div className="portfolio-project-content">
                    <span>{project.type}</span>
                    <h3>{project.title}</h3>
                    <p>{project.description}</p>
                    <div className="project-tags">
                      {project.tags.map((tag) => <b key={tag}>{tag}</b>)}
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="portfolio-food-link">
              <div>
                <strong>Want to see the original HealthyFood app?</strong>
                <span>The existing ordering experience is still included in this project.</span>
              </div>
              <Link to="/food" className="portfolio-secondary-btn">Open app <ArrowUpRight size={16} /></Link>
            </div>
          </div>
        </section>

        <section className="portfolio-process">
          <div className="portfolio-container">
            <div className="portfolio-section-label">04 — Process</div>
            <div className="portfolio-process-grid">
              <div><b>01</b><h3>Understand</h3><p>Clarify the user, problem, goals and constraints before writing code.</p></div>
              <div><b>02</b><h3>Design</h3><p>Create a visual hierarchy, responsive layout and interaction direction.</p></div>
              <div><b>03</b><h3>Build</h3><p>Turn the design into maintainable components and reliable APIs.</p></div>
              <div><b>04</b><h3>Refine</h3><p>Test, polish, optimize and make every screen feel intentional.</p></div>
            </div>
          </div>
        </section>

        <section id="contact" className="portfolio-contact">
          <div className="portfolio-container portfolio-contact-card">
            <div>
              <div className="portfolio-section-label">05 — Contact</div>
              <h2>Have an idea?<br /><em>Let's build it.</em></h2>
              <p>Available for freelance work, collaborations and full-stack opportunities.</p>
            </div>
            <div className="portfolio-contact-actions">
              <a className="portfolio-primary-btn" href="mailto:hello@example.com"><Mail size={18} /> hello@example.com</a>
              <div className="portfolio-socials">
                <a href="https://github.com" target="_blank" rel="noreferrer" aria-label="GitHub"><Github size={19} /></a>
                <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn"><Linkedin size={19} /></a>
                <a href="mailto:hello@example.com" aria-label="Email"><Send size={19} /></a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="portfolio-footer">
        <div className="portfolio-container">
          <span>© {new Date().getFullYear()} · Developer Portfolio</span>
          <span>Designed & built with React</span>
        </div>
      </footer>
    </div>
  );
}
