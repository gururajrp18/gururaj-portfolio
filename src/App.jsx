
import { useState, useEffect } from 'react';
import './App.css';

const projects = [
  {
    number: '01',
    name: 'ResearchAI',
    category: 'Artificial Intelligence',
    description:
      'An AI-powered research platform for discovering information, analyzing sources and generating evidence-based research.',
    tech: ['React', 'TypeScript', 'Node.js', 'AI'],
    github: 'https://github.com/gururajrp18/RESEARCH-TOOL',
    image: '/projects/researchai.png',
    mark: '✦',
  },
  {
    number: '02',
    name: 'MYTUNE / JARVIS',
    category: 'Personal AI Assistant',
    description:
      'A personal AI assistant focused on voice interaction, productivity and intelligent computer automation.',
    tech: ['Python', 'AI', 'APIs', 'Automation'],
    github: 'https://github.com/gururajrp18/PersonalAI_Website',
    image: '/projects/jarvis.png',
    mark: '⌘',
  },
  {
    number: '03',
    name: 'Home Interior Website',
    category: 'Web Development',
    description:
      'A website showcasing home interior design ideas through a modern digital experience.',
    tech: ['HTML', 'CSS', 'JavaScript', 'Web'],
    github: 'https://github.com/gururajrp18/Home-interior-website',
    image: '/projects/home-interior.png',
    mark: '⌂',
  },
];

const navigation = [
  { label: 'Home', id: 'home' },
  { label: 'About', id: 'about' },
  { label: 'Skills', id: 'skills' },
  { label: 'Projects', id: 'projects' },
  { label: 'Contact', id: 'contact' },
];

const titles = [
  'Aspiring AI Engineer',
  'Full Stack Developer',
  'AI Enthusiast',
];

function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [typingText, setTypingText] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Brief branded intro on the first page load
  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const timeoutId = window.setTimeout(() => setIsLoading(false), reducedMotion ? 100 : 850);
    return () => window.clearTimeout(timeoutId);
  }, []);

  // Show the back-to-top control after the visitor scrolls
  useEffect(() => {
    const updateBackToTop = () => setShowBackToTop(window.scrollY > 450);
    window.addEventListener('scroll', updateBackToTop, { passive: true });
    updateBackToTop();
    return () => window.removeEventListener('scroll', updateBackToTop);
  }, []);

  // Typing and deleting animation
  useEffect(() => {
    let titleIndex = 0;
    let characterIndex = titles[0].length;
    let deleting = true;
    let timeoutId;

    const animateTyping = () => {
      const currentTitle = titles[titleIndex];

      if (!deleting) {
        characterIndex++;
        setTypingText(currentTitle.substring(0, characterIndex));

        if (characterIndex === currentTitle.length) {
          deleting = true;
          timeoutId = setTimeout(animateTyping, 1600);
          return;
        }

        timeoutId = setTimeout(animateTyping, 90);
      } else {
        characterIndex--;
        setTypingText(currentTitle.substring(0, characterIndex));

        if (characterIndex === 0) {
          deleting = false;
          titleIndex = (titleIndex + 1) % titles.length;
          timeoutId = setTimeout(animateTyping, 400);
          return;
        }

        timeoutId = setTimeout(animateTyping, 45);
      }
    };

    timeoutId = setTimeout(animateTyping, 1800);

    return () => clearTimeout(timeoutId);
  }, []);

  // Keep the active navigation item in sync with scrolling and direct hash links.
  useEffect(() => {
    const updateActiveSection = () => {
      const marker = 150;
      let currentSection = 'home';

      navigation.forEach(({ id }) => {
        const section = document.getElementById(id);
        if (section && section.getBoundingClientRect().top <= marker) {
          currentSection = id;
        }
      });

      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 8;
      if (atBottom) currentSection = 'contact';

      setActiveSection(currentSection);
    };

    const syncFromHash = () => {
      const targetId = window.location.hash.replace('#', '');
      if (navigation.some((item) => item.id === targetId)) {
        setActiveSection(targetId);
      }
      requestAnimationFrame(updateActiveSection);
    };

    window.addEventListener('scroll', updateActiveSection, { passive: true });
    window.addEventListener('resize', updateActiveSection);
    window.addEventListener('hashchange', syncFromHash);
    window.addEventListener('pageshow', syncFromHash);
    syncFromHash();
    const initialSync = window.setTimeout(updateActiveSection, 120);

    return () => {
      window.clearTimeout(initialSync);
      window.removeEventListener('scroll', updateActiveSection);
      window.removeEventListener('resize', updateActiveSection);
      window.removeEventListener('hashchange', syncFromHash);
      window.removeEventListener('pageshow', syncFromHash);
    };
  }, []);

  // Handle navigation clicks
  const handleNavigation = (id) => {
    setActiveSection(id);
    setIsMenuOpen(false);
  };

  // Close the mobile menu with Escape and prevent stale open state on desktop
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setIsMenuOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Reveal sections and project cards when they enter the screen
  useEffect(() => {
    const elements = document.querySelectorAll('.reveal');

    if (!('IntersectionObserver' in window)) {
      elements.forEach((element) => {
        element.classList.add('visible');
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
      }
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  return (
    <div className={`portfolio${isLoading ? ' is-loading' : ' is-ready'}`}>

      {isLoading && (
        <div className="site-loader" role="status" aria-label="Loading portfolio">
          <div className="loader-mark">GR<span>.</span></div>
          <div className="loader-track"><span></span></div>
          <p>LOADING PORTFOLIO</p>
        </div>
      )}

      {/* Navigation */}
      <nav className={`navbar${isMenuOpen ? ' menu-open' : ''}`} aria-label="Main navigation">
        <a
          className="logo"
          href="#home"
          onClick={() => handleNavigation('home')}
          aria-label="Go to homepage"
        >
          GR<span>.</span>
        </a>

        <button
          className={`nav-toggle${isMenuOpen ? ' is-open' : ''}`}
          type="button"
          aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={isMenuOpen}
          aria-controls="primary-navigation"
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          <span></span><span></span><span></span>
        </button>

        <div id="primary-navigation" className={`nav-links${isMenuOpen ? ' is-open' : ''}`}>
          {navigation.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={activeSection === item.id ? 'active' : ''}
              aria-current={activeSection === item.id ? 'location' : undefined}
              onClick={() => handleNavigation(item.id)}
            >
              {item.label}
            </a>
          ))}
        </div>
      </nav>

      <main>

        {/* Hero Section */}
        <section className="hero editorial-hero" id="home">
          <div className="editorial-orbit editorial-orbit-one" aria-hidden="true"></div>
          <div className="editorial-orbit editorial-orbit-two" aria-hidden="true"></div>
          <div className="editorial-spark editorial-spark-one" aria-hidden="true">✳</div>
          <div className="editorial-spark editorial-spark-two" aria-hidden="true">✦</div>

          <div className="editorial-hero-inner">
            <div className="editorial-topline">
              <span><i></i> OPEN TO LEARNING & COLLABORATION</span>
              <span>AI · DEVELOPMENT · INNOVATION</span>
            </div>

            <div className="editorial-main">
              <div className="editorial-copy">
                <p className="eyebrow">GURURAJ RP / DIGITAL PORTFOLIO</p>
                <h1>Building <em>intelligent</em> experiences<span className="editorial-period">.</span></h1>
                <p className="hero-greeting">Hi, I am Gururaj RP.</p>
                <h2 className="typing-heading" aria-label={`I am a ${typingText}`}>
                  <span className="typing-text">{typingText}</span>
                  <span className="typing-cursor" aria-hidden="true">|</span>
                </h2>
                <p className="hero-description">
                  I turn ideas into practical digital products through Artificial Intelligence,
                  thoughtful engineering and modern web development.
                </p>
                <div className="hero-buttons">
                  <a href="#projects" className="btn primary">Explore My Work <span aria-hidden="true">↗</span></a>
                  <a href="/Gururaj.Resume.pdf" download="Gururaj.Resume.pdf" className="btn secondary">Download Resume <span aria-hidden="true">↓</span></a>
                </div>
                <div className="hero-social-row">
                  <span className="hero-social-label">FIND ME ON</span>
                  <div className="social-links">
                    <a href="https://github.com/gururajrp18" target="_blank" rel="noreferrer">GitHub ↗</a>
                    <a href="https://www.linkedin.com/in/gururaj-rp-a51a393a7/" target="_blank" rel="noreferrer">LinkedIn ↗</a>
                  </div>
                </div>
              </div>

              <div className="editorial-art" aria-label="Creative technology disciplines">
                <div className="editorial-art-glow"></div>
                <div className="editorial-verticals" aria-hidden="true"><i></i><i></i><i></i><i></i></div>
                <div className="editorial-tag editorial-tag-one"><b></b> Artificial Intelligence</div>
                <div className="editorial-tag editorial-tag-two"><b></b> Full Stack Development</div>
                <div className="editorial-tag editorial-tag-three"><b></b> ResearchAI</div>
                <div className="editorial-tag editorial-tag-four"><b></b> Python & Automation</div>
                <div className="editorial-word">Ideas<span> into</span><br/><em>innovation.</em></div>
                <div className="editorial-ring"><span>BUILD · LEARN · CREATE · REPEAT · </span></div>
                <div className="editorial-art-index">01 <small> / 03 PROJECTS</small></div>
              </div>
            </div>

            <div className="editorial-bottomline">
              <span>2026 / PORTFOLIO EDITION</span>
              <a href="#about">SCROLL TO EXPLORE <span aria-hidden="true">↓</span></a>
              <span>BASED IN INDIA</span>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="section about-section reveal" id="about">
          <p className="eyebrow">GET TO KNOW ME</p>

          <h2>
            About <span>Me</span>
          </h2>

          <div className="about-layout">
            <div className="about-intro">
              <p className="about-lead">
                I enjoy turning ideas into useful, thoughtful technology.
              </p>
              <p className="section-description about-description">
                I am an engineering student focused on Artificial Intelligence
                and Full Stack Development. I like exploring how intelligent
                systems work, building practical web applications, and learning
                by taking ideas from concept to working projects.
              </p>
              <p className="section-description about-description">
                My current goal is to strengthen my engineering skills while
                creating applications that solve real-world problems.
              </p>
            </div>

            <div className="about-highlights">
              <article className="about-highlight">
                <span className="about-icon" aria-hidden="true">✦</span>
                <div>
                  <h3>Artificial Intelligence</h3>
                  <p>Exploring AI-powered tools, intelligent workflows and automation.</p>
                </div>
              </article>

              <article className="about-highlight">
                <span className="about-icon" aria-hidden="true">⌘</span>
                <div>
                  <h3>Full Stack Development</h3>
                  <p>Building responsive interfaces and connecting them with application logic.</p>
                </div>
              </article>

              <article className="about-highlight">
                <span className="about-icon" aria-hidden="true">↗</span>
                <div>
                  <h3>Continuous Learning</h3>
                  <p>Learning through hands-on projects, experimentation and iteration.</p>
                </div>
              </article>
            </div>
          </div>

          <div className="about-stats" aria-label="Portfolio highlights">
            <div className="about-stat">
              <strong>03</strong>
              <span>Featured Projects</span>
            </div>
            <div className="about-stat">
              <strong>08</strong>
              <span>Core Skills</span>
            </div>
            <div className="about-stat">
              <strong>02</strong>
              <span>Focus Areas</span>
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section className="section skills-section reveal" id="skills">
          <p className="eyebrow">WHAT I WORK WITH</p>

          <h2>
            My <span>Skills</span>
          </h2>

          <p className="section-description skills-intro">
            Technologies I use while building projects and the areas I am
            continuing to explore and improve.
          </p>

          <div className="skills-grid">
            {[
              {
                name: 'Python',
                category: 'Programming',
                icon: 'Py',
                description: 'Writing scripts and building automation features.',
                status: 'Hands-on',
              },
              {
                name: 'JavaScript',
                category: 'Frontend',
                icon: 'JS',
                description: 'Creating interactive behaviour for web applications.',
                status: 'Hands-on',
              },
              {
                name: 'React',
                category: 'Frontend',
                icon: 'Re',
                description: 'Building reusable components and user interfaces.',
                status: 'Hands-on',
              },
              {
                name: 'HTML & CSS',
                category: 'Frontend',
                icon: '</>',
                description: 'Structuring pages and styling responsive layouts.',
                status: 'Hands-on',
              },
              {
                name: 'TypeScript',
                category: 'Development',
                icon: 'TS',
                description: 'Working with typed code in application projects.',
                status: 'Project experience',
              },
              {
                name: 'Node.js',
                category: 'Backend',
                icon: 'N',
                description: 'Connecting frontend experiences to backend logic.',
                status: 'Project experience',
              },
              {
                name: 'AI & Automation',
                category: 'Artificial Intelligence',
                icon: '✦',
                description: 'Exploring AI-powered tools and automated workflows.',
                status: 'Exploring',
              },
            ].map((skill, index) => (
              <article
                className="skill-card reveal"
                key={skill.name}
                style={{ transitionDelay: `${index * 0.08}s` }}
              >
                <div className="skill-card-top">
                  <span className="skill-icon" aria-hidden="true">
                    {skill.icon}
                  </span>
                  <span className="skill-category">{skill.category}</span>
                </div>
                <h3>{skill.name}</h3>
                <p>{skill.description}</p>
                <div className="skill-card-bottom">
                  <span className="skill-status-dot" aria-hidden="true"></span>
                  <span>{skill.status}</span>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Projects Section */}
        <section className="section projects-section reveal" id="projects">
          <p className="eyebrow">MY RECENT WORK</p>

          <h2>
            Featured <span>Projects</span>
          </h2>

          <p className="section-description projects-intro">
            A selection of projects where I explore AI, automation and modern web development.
          </p>

          <div className="projects-grid">
            {projects.map((project, index) => (
              <article
                className="project-card reveal"
                key={project.number}
                style={{ transitionDelay: `${index * 0.15}s` }}
              >
                <div className="project-card-heading">
                  <span className="project-number">PROJECT {project.number}</span>
                  <span className="project-mark" aria-hidden="true">{project.mark}</span>
                </div>

                {project.image && (
                  <div className="project-image">
                    <img
                      src={project.image}
                      alt={`${project.name} project screenshot`}
                      loading="lazy"
                    />
                    <span className="project-image-overlay">PROJECT PREVIEW</span>
                  </div>
                )}

                <div className="project-card-content">
                  <p className="project-category">{project.category}</p>
                  <h3>{project.name}</h3>
                  <p className="project-description">{project.description}</p>
                  <div className="tech-list" aria-label="Technologies used">
                    {project.tech.map((item) => (
                      <span key={item}>{item}</span>
                    ))}
                  </div>
                  <div className="project-actions">
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noreferrer"
                      className="project-link project-github"
                    >
                      <span aria-hidden="true">⌘</span>
                      View Source Code
                      <span aria-hidden="true">↗</span>
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <section className="section contact contact-section reveal" id="contact">
          <p className="eyebrow">LET'S CONNECT</p>

          <h2>
            Have a project in <span>mind?</span>
          </h2>

          <p className="section-description contact-intro">
            I'm interested in learning, collaborating and building
            innovative technology solutions. Feel free to connect with me
            through any of the platforms below.
          </p>

          <div className="contact-layout">
            <div className="contact-copy">
              <span className="contact-status">
                <span className="contact-status-dot" aria-hidden="true"></span>
                OPEN TO LEARNING & COLLABORATION
              </span>
              <h3>Let's build something meaningful.</h3>
              <p>
                Whether you have an idea, an opportunity or simply want to
                discuss technology, I'd be happy to connect.
              </p>
              <a
                href="https://www.linkedin.com/in/gururaj-rp-a51a393a7/"
                target="_blank"
                rel="noreferrer"
                className="btn primary contact-main-button"
              >
                Let's Talk <span aria-hidden="true">↗</span>
              </a>
            </div>

            <div className="contact-links">
              <a
                href="https://github.com/gururajrp18"
                target="_blank"
                rel="noreferrer"
                className="contact-link-card"
              >
                <span className="contact-link-icon" aria-hidden="true">⌘</span>
                <span className="contact-link-text">
                  <strong>GitHub</strong>
                  <small>Explore my code and projects</small>
                </span>
                <span className="contact-link-arrow" aria-hidden="true">↗</span>
              </a>

              <a
                href="https://www.linkedin.com/in/gururaj-rp-a51a393a7/"
                target="_blank"
                rel="noreferrer"
                className="contact-link-card"
              >
                <span className="contact-link-icon" aria-hidden="true">in</span>
                <span className="contact-link-text">
                  <strong>LinkedIn</strong>
                  <small>Connect with me professionally</small>
                </span>
                <span className="contact-link-arrow" aria-hidden="true">↗</span>
              </a>

              <a
                href="/Gururaj.Resume.pdf"
                download="Gururaj.Resume.pdf"
                className="contact-link-card"
              >
                <span className="contact-link-icon" aria-hidden="true">↓</span>
                <span className="contact-link-text">
                  <strong>My Resume</strong>
                  <small>Download my latest resume</small>
                </span>
                <span className="contact-link-arrow" aria-hidden="true">↓</span>
              </a>
            </div>
          </div>
        </section>

      </main>

      {showBackToTop && (
        <button
          className="back-to-top"
          type="button"
          aria-label="Back to top"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <span aria-hidden="true">↑</span>
        </button>
      )}

      {/* Footer */}
      <footer>
        © 2026 Gururaj RP. Built with React.
      </footer>

    </div>
  );
}

export default App;
