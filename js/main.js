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


