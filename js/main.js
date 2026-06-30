/* Universal Engineering & Solution — Main JS */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initReveal();
  initCounters();
  initTabs();
  initMobileMenu();
  initBackToTop();
  initSmoothScroll();
  initPipelineAnimation();
  initScrollHighlight();
  initProductModal();
  initVerticalTabs();
  init3DTilt();
  initInteractiveOrgChart();
  initProductShowcase();
  initAboutHeroCarousel();
  initServicesPage();
  initContactPage();
});

/* Navbar scroll effect */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  let lastScrollY = window.scrollY;

  const onScroll = () => {
    const currentScrollY = window.scrollY;

    // Add scrolled class when scrolling past 40px
    if (currentScrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Smart navbar: hide on scroll down, show on scroll up (only if scrolled past 150px)
    if (currentScrollY > 150) {
      if (currentScrollY > lastScrollY) {
        navbar.classList.add('nav-hidden');
      } else {
        navbar.classList.remove('nav-hidden');
      }
    } else {
      navbar.classList.remove('nav-hidden');
    }

    lastScrollY = currentScrollY;
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* Intersection Observer for reveal animations */
function initReveal() {
  const elements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  if (elements.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    elements.forEach((el) => observer.observe(el));
  }

  // Section level scroll reveals
  const sections = document.querySelectorAll('.section-reveal');
  if (sections.length) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            sectionObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -60px 0px' }
    );
    sections.forEach((sec) => sectionObserver.observe(sec));
  }

  // About page: ensure director & roadmap sections are always visible
  document.querySelectorAll('.director-section, .roadmap-section').forEach((el) => {
    el.classList.add('revealed');
  });
  document.querySelectorAll(
    '.director-section .reveal, .director-section .reveal-left, .director-section .reveal-right, ' +
    '.roadmap-section .reveal, .roadmap-section .reveal-left, .roadmap-section .reveal-right'
  ).forEach((el) => {
    el.classList.add('visible');
  });
}

/* Animated counters */
function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const animateCounter = (el) => {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix || '';
    const duration = 2000;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = target < 10 ? (target * eased).toFixed(1) : Math.floor(target * eased);
      el.textContent = prefix + current + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach((el) => observer.observe(el));
}

/* Product tabs */
function initTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');
  if (!tabBtns.length || !tabPanels.length) return;

  tabBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;

      tabBtns.forEach((b) => b.classList.remove('active'));
      tabPanels.forEach((p) => p.classList.remove('active'));

      btn.classList.add('active');
      document.getElementById(target)?.classList.add('active');
    });
  });
}

/* Mobile menu hamburger toggle */
function initMobileMenu() {
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  if (!hamburger || !navLinks) return;

  hamburger.addEventListener('click', (e) => {
    e.stopPropagation();
    navLinks.classList.toggle('mobile-open');
    hamburger.classList.toggle('active');
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('mobile-open');
      hamburger.classList.remove('active');
    });
  });

  // Close when clicking outside navbar menu
  document.addEventListener('click', (e) => {
    if (!navLinks.contains(e.target) && !hamburger.contains(e.target) && navLinks.classList.contains('mobile-open')) {
      navLinks.classList.remove('mobile-open');
      hamburger.classList.remove('active');
    }
  });
}

/* Back to top scroll button */
function initBackToTop() {
  const btn = document.querySelector('.back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 600);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* Smooth scroll for anchor links */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const id = anchor.getAttribute('href');
      if (id === '#') return;
      
      const target = document.querySelector(id);
      if (!target) return;
      
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

/* Scroll-linked pipeline value timeline animation */
function initPipelineAnimation() {
  const pipeline = document.querySelector('.pipeline-section');
  if (!pipeline) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  observer.observe(pipeline);
}

/* Active navigation highlight based on scrolling position (Scroll Spy) */
function initScrollHighlight() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');
  if (!sections.length || !navLinks.length) return;

  window.addEventListener('scroll', () => {
    let currentId = '';
    const scrollPos = window.scrollY + 120; // offsets for standard header navbar height

    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = section.getAttribute('id');
      }
    });

    if (currentId) {
      navLinks.forEach((link) => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (href === `#${currentId}`) {
          link.classList.add('active');
        }
      });
    }
  }, { passive: true });
}

/* Technical Specs modal script */
function initProductModal() {
  const modal = document.getElementById('tech-modal');
  if (!modal) return;
  const closeBtn = modal.querySelector('.modal-close');
  const overlay = modal.querySelector('.modal-overlay');
  const modalTitle = modal.querySelector('#modal-title');
  const modalBody = modal.querySelector('#modal-body');
  const specButtons = document.querySelectorAll('.view-specs-btn');
  if (!closeBtn || !overlay || !modalTitle || !modalBody || !specButtons.length) return;

  const openModal = (title, contentHtml) => {
    modalTitle.textContent = title;
    modalBody.innerHTML = contentHtml;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  };

  specButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.product-grid-card');
      if (!card) return;
      const title = card.querySelector('h3').textContent;
      const content = card.querySelector('.technical-details-hidden').innerHTML;
      openModal(title, content);
    });
  });

  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', closeModal);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });
}

/* Vertical Tabs switcher script for Capabilities section */
function initVerticalTabs() {
  const tabItems = document.querySelectorAll('.v-tab-item');
  const tabPanels = document.querySelectorAll('.v-tab-panel');
  if (!tabItems.length || !tabPanels.length) return;

  tabItems.forEach((tab) => {
    tab.addEventListener('click', () => {
      const targetId = tab.dataset.target;
      const targetPanel = document.getElementById(targetId);
      if (!targetPanel) return;

      // Reset active classes
      tabItems.forEach((t) => t.classList.remove('active'));
      tabPanels.forEach((p) => p.classList.remove('active'));

      // Activate selected tab and panel
      tab.classList.add('active');
      targetPanel.classList.add('active');
    });
  });
}

/* 3D Tilt effect for cards */
function init3DTilt() {
  const cards = document.querySelectorAll('.tilt-card');
  if (!cards.length) return;

  cards.forEach((card) => {
    const max = parseFloat(card.dataset.tiltMax) || 10;
    const speed = parseFloat(card.dataset.tiltSpeed) || 300;

    card.style.transition = `transform ${speed}ms cubic-bezier(0.16, 1, 0.3, 1)`;

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((centerY - y) / centerY) * max;
      const rotateY = ((x - centerX) / centerX) * max;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  });
}

/* Interactive Org Chart */
function initInteractiveOrgChart() {
  const nodes = document.querySelectorAll('.org-node');
  const roleName = document.getElementById('org-role-name');
  const roleDept = document.getElementById('org-role-dept');
  const roleDesc = document.getElementById('org-role-desc');
  const roleDuties = document.getElementById('org-role-duties');

  if (!nodes.length || !roleName || !roleDept || !roleDesc || !roleDuties) return;

  const data = {
    md: {
      name: "Managing Director",
      dept: "Executive Management",
      desc: "Directs the company's long-term business roadmap, oversees safety protocol compliance, and manages core partnerships with global MNC engineering clients. Guides the operational strategy with commitment, precision, and trust.",
      duties: [
        "Visionary planning & business scaling across India.",
        "MNC Client alignment and compliance oversight.",
        "Overall corporate governance, safety policy mandate."
      ]
    },
    ops: {
      name: "Operations Head",
      dept: "Project Executions",
      desc: "Coordinates project execution timelines, oversees fabrication operations, directs technical site layouts, and manages site supervisors to ensure on-time delivery with zero error.",
      duties: [
        "Manage fabrication logistics & resources.",
        "On-Site coordination of turnkey execution teams.",
        "Timeline management and project commissioning."
      ]
    },
    tech: {
      name: "Technical Head",
      dept: "Engineering & Standards",
      desc: "Supervises QA/QC engineers, validates weld procedures and standard certifications, conducts testing protocol reviews, and resolves complex mechanical piping challenges.",
      duties: [
        "Review hydro-testing and NDT reports.",
        "Oversee QA/QC pipeline compliance.",
        "Research material grade suitability & certifications."
      ]
    },
    store: {
      name: "Store & Procurement",
      dept: "Inventory Management",
      desc: "Manages raw material inventories, procures structural pipes, flanges, fittings, and valves, verifies dispatch inspection files, and handles vendor communication.",
      duties: [
        "Maintain inventory levels for quick dispatch.",
        "Verify mill test certificates.",
        "Manage logistics for on-site material supply."
      ]
    },
    supervisors: {
      name: "Site Supervisors",
      dept: "Field Operations",
      desc: "Manages day-to-day site installation tasks, coordinates direct labor, enforces rigorous safety protocol adherence, and keeps operations on track.",
      duties: [
        "On-site daily execution management.",
        "Enforce field safety rules (zero accidents).",
        "Coordinate between operations and fabricators."
      ]
    },
    qaqc: {
      name: "QA/QC Engineer",
      dept: "Testing & Compliance",
      desc: "Performs rigorous hydro-testing, pneumatic checks, ultrasonic examinations, and dye-penetrant checks on joints, producing full quality reports.",
      duties: [
        "Run NDT (UT, DPT) testing procedures.",
        "Issue compliance reports & test certificates.",
        "Perform inspection checks on raw materials."
      ]
    },
    welders: {
      name: "Fabricators & Welders",
      dept: "Execution Workforce",
      desc: "Highly skilled, qualified technicians executing Arc, TIG, and MIG welding procedures, structural piping alignments, and mechanical fabrication.",
      duties: [
        "Execute qualified ASME standard welds.",
        "Precisely shape, cut, and fit pipes.",
        "Erect steel structural support frames."
      ]
    }
  };

  nodes.forEach((node) => {
    node.addEventListener('click', () => {
      const role = node.dataset.role;
      if (!data[role]) return;

      // Update active state
      nodes.forEach((n) => n.classList.remove('active'));
      node.classList.add('active');

      // Animate card glow
      const detailCard = document.getElementById('org-detail-card');
      if (detailCard) {
        detailCard.style.transform = 'perspective(1000px) scale(0.97)';
        detailCard.style.opacity = '0.7';
        setTimeout(() => {
          detailCard.style.transform = '';
          detailCard.style.opacity = '1';
        }, 150);
      }

      // Update text
      roleName.textContent = data[role].name;
      roleDept.textContent = data[role].dept;
      roleDesc.textContent = data[role].desc;

      // Update duties list
      roleDuties.innerHTML = '';
      data[role].duties.forEach((duty) => {
        const li = document.createElement('li');
        li.textContent = duty;
        roleDuties.appendChild(li);
      });
    });
  });
}

/* About page hero — product image carousel */
function initAboutHeroCarousel() {
  const carousel = document.getElementById('about-hero-carousel');
  if (!carousel) return;

  const slides = carousel.querySelectorAll('.hero-carousel-slide');
  const thumbStrip = document.getElementById('hero-thumb-strip');
  const captionCat = document.getElementById('hero-caption-cat');
  const captionTitle = document.getElementById('hero-caption-title');
  const counter = document.getElementById('hero-carousel-counter');
  const progressBar = document.getElementById('hero-carousel-progress');
  const prevBtn = carousel.querySelector('.hero-carousel-prev');
  const nextBtn = carousel.querySelector('.hero-carousel-next');

  if (!slides.length || !thumbStrip) return;

  const total = slides.length;
  let current = 0;
  let intervalId = null;
  const cycleMs = 4500;

  slides.forEach((slide, i) => {
    const img = slide.querySelector('img');
    const thumb = document.createElement('button');
    thumb.type = 'button';
    thumb.className = 'hero-thumb-btn' + (i === 0 ? ' active' : '');
    thumb.setAttribute('aria-label', slide.dataset.title || 'Product ' + (i + 1));
    if (img) {
      const thumbImg = document.createElement('img');
      thumbImg.src = img.src;
      thumbImg.alt = '';
      thumb.appendChild(thumbImg);
    }
    thumb.addEventListener('click', () => goTo(i));
    thumbStrip.appendChild(thumb);
  });

  const thumbs = thumbStrip.querySelectorAll('.hero-thumb-btn');

  function pad(n) {
    return String(n).padStart(2, '0');
  }

  function updateSlides() {
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === current);
    });

    thumbs.forEach((thumb, i) => thumb.classList.toggle('active', i === current));

    const active = slides[current];
    if (captionCat) captionCat.textContent = active.dataset.category || '';
    if (captionTitle) captionTitle.textContent = active.dataset.title || '';
    if (counter) counter.textContent = pad(current + 1) + ' / ' + pad(total);
  }

  function resetProgress() {
    if (!progressBar) return;
    progressBar.style.transition = 'none';
    progressBar.style.width = '0%';
    progressBar.offsetHeight;
    progressBar.style.transition = 'width ' + cycleMs + 'ms linear';
    progressBar.style.width = '100%';
  }

  function goTo(index) {
    current = ((index % total) + total) % total;
    updateSlides();
    resetProgress();
    restartAuto();
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  function restartAuto() {
    clearInterval(intervalId);
    intervalId = setInterval(next, cycleMs);
  }

  if (prevBtn) prevBtn.addEventListener('click', prev);
  if (nextBtn) nextBtn.addEventListener('click', next);

  carousel.addEventListener('mouseenter', () => clearInterval(intervalId));
  carousel.addEventListener('mouseleave', restartAuto);

  updateSlides();
  resetProgress();
  restartAuto();
}

/* Auto-cycling Interactive Product Showcase Slider */
function initProductShowcase() {
  const slides = document.querySelectorAll('.showcase-slide');
  const dots = document.querySelectorAll('.showcase-dot');
  const progressBar = document.querySelector('.showcase-progress-bar');
  if (!slides.length || !dots.length) return;

  let currentIdx = 0;
  let intervalId = null;
  const cycleTime = 4000; // 4 seconds

  const showSlide = (index) => {
    slides.forEach((slide) => slide.classList.remove('active'));
    dots.forEach((dot) => dot.classList.remove('active'));

    slides[index].classList.add('active');
    dots[index].classList.add('active');

    // Reset progress bar animation
    if (progressBar) {
      progressBar.style.transition = 'none';
      progressBar.style.width = '0%';
      // Trigger reflow to restart transition
      progressBar.offsetHeight; 
      progressBar.style.transition = `width ${cycleTime}ms linear`;
      progressBar.style.width = '100%';
    }
  };

  const nextSlide = () => {
    currentIdx = (currentIdx + 1) % slides.length;
    showSlide(currentIdx);
  };

  const startInterval = () => {
    intervalId = setInterval(nextSlide, cycleTime);
  };

  const stopInterval = () => {
    if (intervalId) clearInterval(intervalId);
  };

  // Click handler for dot navigation
  dots.forEach((dot, idx) => {
    dot.addEventListener('click', () => {
      stopInterval();
      currentIdx = idx;
      showSlide(currentIdx);
      startInterval();
    });
  });

  // Start cycling
  showSlide(currentIdx);
  startInterval();
}

/* Services page — banner carousel & service details */
function initServicesPage() {
  const banner = document.querySelector('.svc-banner');
  if (banner) {
    const bannerObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            bannerObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    bannerObserver.observe(banner);
    if (banner.getBoundingClientRect().top < window.innerHeight) {
      banner.classList.add('revealed');
    }
  }

  const catalog = document.querySelector('.svc-catalog');
  if (catalog) {
    const catalogObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            catalogObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 }
    );
    catalogObserver.observe(catalog);
    if (catalog.getBoundingClientRect().top < window.innerHeight) {
      catalog.classList.add('revealed');
    }
  }

  initSvcHeroCarousel();
  initSvcDetails();
  initSvcModal();
  initSvcPortfolioRail();
}

const SVC_DETAILS = {
  'svc-01': {
    num: '01',
    title: 'Turnkey Piping Solutions',
    image: 'image/videp/Piping Project Execution.png',
    lead: 'Complete piping support — from planning and procurement through fabrication, installation, testing, and handover — delivered under one accountable partner so your plant moves from design intent to operational readiness without coordination gaps.',
    scope: [
      'Project planning, BOQ, and material take-off',
      'MS, SS, and alloy pipe & fitting supply',
      'Workshop and on-site fabrication',
      'Installation, alignment, and support',
      'Hydro / pneumatic testing & NDT',
      'Documentation and commissioning handover'
    ],
    ideal: [
      'New process lines and plant expansions',
      'Owners seeking single-contract accountability',
      'Fast-track industrial projects',
      'Multi-system piping across plant zones'
    ],
    tags: ['Turnkey', 'End-to-End', 'Single Partner', 'Commissioning']
  },
  'svc-02': {
    num: '02',
    title: 'Brownfield Project Execution',
    image: 'image/videp/Brownfield Project Execution.png',
    lead: 'Expansion, modification, and live integration for existing plants — engineered to minimise downtime, protect running operations, and execute safely in congested, operational environments.',
    scope: [
      'Live plant tie-ins and retrofits',
      'Shutdown and phased execution planning',
      'Hot-work and permit-to-work coordination',
      'Existing line isolation and flushing',
      'Precision routing in constrained sites',
      'Post-modification testing and recommissioning'
    ],
    ideal: [
      'Operating refineries, chemical & pharma plants',
      'Capacity expansion without greenfield land',
      'Line modifications and debottlenecking',
      'Shutdown-window critical work'
    ],
    tags: ['Brownfield', 'Expansion', 'Live Plant', 'Minimal Downtime']
  },
  'svc-03': {
    num: '03',
    title: 'Piping Project Execution',
    image: 'image/videp/Piping Project Execution.png',
    lead: 'End-to-end piping execution — network planning, supply, fabrication, and installation — executed under strict safety and mechanical codes with field teams that understand industrial tolerances.',
    scope: [
      'Routing, isometrics, and install planning',
      'Pipe, valve, and fitting procurement',
      'Field fabrication and erection',
      'Welding per WPS / qualified procedures',
      'NDT, pressure testing, and punch-list closure',
      'As-built documentation and QA records'
    ],
    ideal: [
      'EPC contractors needing execution partners',
      'Process and utility piping networks',
      'High-pressure and coded piping systems',
      'Sites requiring certified field teams'
    ],
    tags: ['Fabrication', 'Installation', 'Field Execution', 'QA/QC']
  },
  'svc-04': {
    num: '04',
    title: '360° Piping EPC Services',
    image: 'image/videp/global export.png',
    lead: 'Full EPC under one roof — Design → Supply → Erection → Commissioning — with in-house mechanical experts and procurement from 100+ trusted brands for plant-ready handover.',
    scope: [
      'Engineering support and design coordination',
      'Bulk and tagged material procurement',
      'Fabrication, logistics, and site erection',
      'Electrical / civil interface coordination',
      'Pre-commissioning and system flushing',
      'Final commissioning and client handover'
    ],
    ideal: [
      'Greenfield and large brownfield complexes',
      'Owners wanting unified EPC accountability',
      'Multi-discipline industrial facilities',
      'Export and global project standards'
    ],
    tags: ['EPC', 'Commissioning', 'Design-Build', 'Global Standards']
  },
  'svc-05': {
    num: '05',
    title: 'Greenfield Project Execution',
    image: 'image/videp/Greenfield Projects.png',
    lead: 'Ground-up plant setup with coordinated piping, structure, electrical, and insulation workstreams — scalable execution for new manufacturing hubs from first civil tie-in to production readiness.',
    scope: [
      'Early-phase layout and routing studies',
      'Multi-discipline site coordination',
      'Bulk piping install across plant zones',
      'Structural and equipment interface work',
      'Insulation, tracing, and finishing',
      'Integrated testing and startup support'
    ],
    ideal: [
      'New manufacturing and process plants',
      'Industrial parks and SEZ developments',
      'First-time plant owners',
      'Large-scale parallel workfront projects'
    ],
    tags: ['Greenfield', 'New Plants', 'Multi-Discipline', 'Scalable']
  },
  'svc-06': {
    num: '06',
    title: 'Testing & Certifications',
    image: 'image/videp/Testing & Certifications.png',
    lead: 'Hydro and pneumatic testing, NDT inspection, and complete certification packages — ensuring every system meets code, client spec, and regulatory compliance before go-live.',
    scope: [
      'Hydrostatic and pneumatic pressure tests',
      'Leak detection and hold-point witnessing',
      'Radiography, UT, MT, PT as applicable',
      'Test packs, certificates, and MDRs',
      'Third-party inspection coordination',
      'Final QA/QC sign-off documentation'
    ],
    ideal: [
      'Pre-commissioning and handover phases',
      'Regulated industries (pharma, food, chemical)',
      'Client and TPI witness requirements',
      'Systems requiring code-compliant records'
    ],
    tags: ['Hydro Test', 'NDT', 'Certification', 'Compliance']
  },
  'svc-07': {
    num: '07',
    title: 'On-Site Consultation',
    image: 'image/videp/On-Site Consultation.png',
    lead: 'On-ground assessment with practical material, routing, and fitting recommendations — bridging engineering intent and field reality before capital is committed.',
    scope: [
      'Plant walkdowns and condition assessment',
      'Material grade and spec recommendations',
      'Routing feasibility and constructability review',
      'Bill-of-material and scope estimation support',
      'Risk identification for live-plant work',
      'Technical advisory reports and follow-ups'
    ],
    ideal: [
      'Feasibility and front-end planning stages',
      'Troubleshooting recurring line failures',
      'Upgrade decisions before tendering',
      'Owners without in-house piping expertise'
    ],
    tags: ['Site Visit', 'Advisory', 'Feasibility', 'Technical Review']
  },
  'svc-08': {
    num: '08',
    title: 'Preventive Maintenance',
    image: 'image/videp/Preventive Maintenance.png',
    lead: 'Scheduled valve, pipe, and fitting care programmes that extend system life, reduce unplanned downtime, and keep critical lines operating within design parameters.',
    scope: [
      'Scheduled inspection and maintenance plans',
      'Valve exercising, packing, and overhaul',
      'Joint integrity and flange management',
      'Corrosion and leak surveys',
      'Spare parts and replacement planning',
      'Maintenance logs and lifecycle tracking'
    ],
    ideal: [
      'Aging piping infrastructure',
      'Plants with high downtime costs',
      'Critical utility and process loops',
      'Annual shutdown maintenance windows'
    ],
    tags: ['Maintenance', 'Lifecycle', 'Reliability', 'Downtime Reduction']
  },
  'svc-09': {
    num: '09',
    title: 'Fabrication & Erection Solutions',
    image: 'image/videp/prodcut image/buttweld.png',
    lead: 'Workshop and on-site fabrication, qualified welding, and precision erection — custom spools and assemblies built to drawing with field teams ready for immediate install.',
    scope: [
      'Custom spool and skid fabrication',
      'Arc, TIG, and MIG welding services',
      'Fit-up, alignment, and tack welding',
      'On-site erection and support structures',
      'Dimensional checks and weld mapping',
      'Coating / wrapping as per spec'
    ],
    ideal: [
      'Custom piping assemblies and skids',
      'Sites with limited workshop access',
      'High-spec alloy fabrication',
      'Erection-heavy shutdown campaigns'
    ],
    tags: ['Welding', 'Fabrication', 'Spools', 'Erection']
  },
  'svc-10': {
    num: '10',
    title: 'Safety & Execution Protocols',
    image: 'image/videp/safety.png',
    lead: 'MNC-grade safety culture with strict site protocols, audits, and permit-to-work systems — targeting zero incidents on critical industrial projects.',
    scope: [
      'Project-specific HSE plans and inductions',
      'Permit-to-work and hot-work controls',
      'Toolbox talks and safety observations',
      'PPE compliance and site audits',
      'Emergency response and incident reporting',
      'Client and statutory safety alignment'
    ],
    ideal: [
      'High-risk industrial environments',
      'MNC and global client projects',
      'Live-plant and shutdown execution',
      'Sites requiring audited safety records'
    ],
    tags: ['Safety', 'MNC Standards', 'HSE', 'Zero Incident']
  }
};

function initSvcDetails() {
  const items = document.querySelectorAll('.svc-rect-card');
  if (!items.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const delay = parseInt(entry.target.dataset.delay, 10) || 0;
          setTimeout(() => entry.target.classList.add('visible'), delay);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -20px 0px' }
  );

  items.forEach((item) => observer.observe(item));
}

function initSvcPortfolioRail() {
  const wrap = document.getElementById('svc-portfolio-wrap');
  const fill = document.getElementById('svc-portfolio-rail-fill');
  if (!wrap || !fill) return;

  const updateFill = () => {
    const rect = wrap.getBoundingClientRect();
    const vh = window.innerHeight;
    const start = vh * 0.85;
    const end = vh * 0.15;
    const total = rect.height + start - end;
    const scrolled = start - rect.top;
    const pct = Math.min(100, Math.max(0, (scrolled / total) * 100));
    fill.style.height = pct + '%';
  };

  updateFill();
  window.addEventListener('scroll', updateFill, { passive: true });
  window.addEventListener('resize', updateFill, { passive: true });
}

function initSvcModal() {
  const modal = document.getElementById('svc-modal');
  const cards = document.querySelectorAll('.svc-rect-card[data-service]');
  if (!modal || !cards.length) return;

  const imgEl = document.getElementById('svc-modal-img');
  const numEl = document.getElementById('svc-modal-num');
  const titleEl = document.getElementById('svc-modal-title');
  const leadEl = document.getElementById('svc-modal-lead');
  const scopeEl = document.getElementById('svc-modal-scope');
  const idealEl = document.getElementById('svc-modal-ideal');
  const tagsEl = document.getElementById('svc-modal-tags');
  const closeBtn = modal.querySelector('.svc-modal-close');
  let activeCard = null;

  const fillList = (ul, items) => {
    ul.innerHTML = '';
    items.forEach((text) => {
      const li = document.createElement('li');
      li.textContent = text;
      ul.appendChild(li);
    });
  };

  const fillTags = (container, tags) => {
    container.innerHTML = '';
    tags.forEach((text) => {
      const span = document.createElement('span');
      span.className = 'svc-tag';
      span.textContent = text;
      container.appendChild(span);
    });
  };

  const openModal = (id, card) => {
    const data = SVC_DETAILS[id];
    if (!data) return;

    if (activeCard) activeCard.classList.remove('is-active');
    activeCard = card || null;
    if (activeCard) activeCard.classList.add('is-active');

    imgEl.src = data.image;
    imgEl.alt = data.title;
    numEl.textContent = data.num;
    titleEl.textContent = data.title;
    leadEl.textContent = data.lead;
    fillList(scopeEl, data.scope);
    fillList(idealEl, data.ideal);
    fillTags(tagsEl, data.tags);

    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  };

  const closeModal = () => {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (activeCard) {
      activeCard.classList.remove('is-active');
      activeCard = null;
    }
  };

  cards.forEach((card) => {
    const open = () => openModal(card.dataset.service, card);

    card.addEventListener('click', open);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        open();
      }
    });
  });

  closeBtn.addEventListener('click', closeModal);
  modal.querySelectorAll('[data-close-modal]').forEach((el) => {
    el.addEventListener('click', closeModal);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) {
      closeModal();
    }
  });
}

function initSvcHeroCarousel() {
  const banner = document.getElementById('svc-hero');
  const carousel = document.getElementById('svc-hero-carousel');
  if (!carousel || !banner) return;

  const slides = carousel.querySelectorAll('.svc-showcase-slide');
  const tabs = document.querySelectorAll('#svc-banner-tabs .svc-tab');
  const thumbs = document.querySelectorAll('#svc-thumb-strip .svc-thumb');
  const prevBtn = banner.querySelector('.svc-showcase-prev');
  const nextBtn = banner.querySelector('.svc-showcase-next');
  const counter = document.getElementById('svc-showcase-counter');
  const slideNum = document.getElementById('svc-slide-num');
  const progressBar = document.getElementById('svc-showcase-progress');
  const accentEl = document.getElementById('svc-banner-accent');
  const descEl = document.getElementById('svc-banner-desc');

  if (!slides.length) return;

  const total = slides.length;
  const cycleMs = 5000;
  let current = 0;
  let intervalId = null;

  const pad = (n) => String(n).padStart(2, '0');

  const updateCopy = (slide) => {
    if (!slide) return;
    const accent = slide.dataset.accent || slide.dataset.title || '';
    const desc = slide.dataset.desc || '';

    if (accentEl && accentEl.textContent !== accent) {
      accentEl.textContent = accent;
    }

    if (descEl && desc !== descEl.textContent) {
      descEl.classList.add('is-fading');
      setTimeout(() => {
        descEl.textContent = desc;
        descEl.classList.remove('is-fading');
      }, 180);
    }
  };

  const updateUI = () => {
    slides.forEach((slide, i) => slide.classList.toggle('active', i === current));
    tabs.forEach((tab, i) => tab.classList.toggle('active', i === current));
    thumbs.forEach((thumb, i) => thumb.classList.toggle('active', i === current));
    if (counter) counter.textContent = pad(current + 1) + ' / ' + pad(total);
    if (slideNum) slideNum.textContent = pad(current + 1);
    updateCopy(slides[current]);
  };

  const resetProgress = () => {
    if (!progressBar) return;
    progressBar.style.transition = 'none';
    progressBar.style.width = '0%';
    progressBar.offsetHeight;
    progressBar.style.transition = 'width ' + cycleMs + 'ms linear';
    progressBar.style.width = '100%';
  };

  const goTo = (index) => {
    current = ((index % total) + total) % total;
    updateUI();
    resetProgress();
    restartAuto();
  };

  const next = () => goTo(current + 1);
  const prev = () => goTo(current - 1);

  const restartAuto = () => {
    clearInterval(intervalId);
    intervalId = setInterval(next, cycleMs);
  };

  if (prevBtn) prevBtn.addEventListener('click', prev);
  if (nextBtn) nextBtn.addEventListener('click', next);

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const idx = parseInt(tab.dataset.index, 10);
      if (!Number.isNaN(idx)) goTo(idx);
    });
  });

  thumbs.forEach((thumb) => {
    thumb.addEventListener('click', () => {
      const idx = parseInt(thumb.dataset.index, 10);
      if (!Number.isNaN(idx)) goTo(idx);
    });
  });

  banner.addEventListener('mouseenter', () => clearInterval(intervalId));
  banner.addEventListener('mouseleave', restartAuto);

  updateUI();
  resetProgress();
  restartAuto();
}

/* Contact page — banner reveal */
function initContactPage() {
  const banner = document.querySelector('.ct-banner');
  if (!banner) return;

  const revealBanner = () => banner.classList.add('revealed');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          revealBanner();
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  observer.observe(banner);
  if (banner.getBoundingClientRect().top < window.innerHeight) {
    revealBanner();
  }
}

// Product Page Carousel
document.addEventListener('DOMContentLoaded', () => {
  const prdBanner = document.getElementById('prd-banner-carousel');
  if (!prdBanner) return;

  const slides = prdBanner.querySelectorAll('.prd-slider-slide');
  const dots = prdBanner.querySelectorAll('.prd-slider-dots .dot');
  const prevBtn = prdBanner.querySelector('.prd-slider-btn.prev');
  const nextBtn = prdBanner.querySelector('.prd-slider-btn.next');
  const container = prdBanner.querySelector('.prd-slider-container');
  
  if (!slides.length) return;

  let currentSlide = 0;
  let slideInterval;
  const slideDuration = 5000;

  const showSlide = (index) => {
    slides.forEach(s => s.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));
    
    currentSlide = (index + slides.length) % slides.length;
    
    slides[currentSlide].classList.add('active');
    if (dots[currentSlide]) {
      dots[currentSlide].classList.add('active');
    }
  };

  const nextSlide = () => showSlide(currentSlide + 1);
  const prevSlide = () => showSlide(currentSlide - 1);

  const startAutoSlide = () => {
    stopAutoSlide();
    slideInterval = setInterval(nextSlide, slideDuration);
  };

  const stopAutoSlide = () => {
    clearInterval(slideInterval);
  };

  // Click events for buttons
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      nextSlide();
      startAutoSlide();
    });
  }
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      prevSlide();
      startAutoSlide();
    });
  }

  // Click events for dots
  dots.forEach((dot, idx) => {
    dot.addEventListener('click', () => {
      showSlide(idx);
      startAutoSlide();
    });
  });

  // Pause on hover
  if (container) {
    container.addEventListener('mouseenter', stopAutoSlide);
    container.addEventListener('mouseleave', startAutoSlide);
  }

  startAutoSlide();
});
