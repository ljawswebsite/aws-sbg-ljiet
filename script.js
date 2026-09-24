document.addEventListener('DOMContentLoaded', () => {
  /* ─── NAVBAR SCROLL EFFECT & PROGRESS BAR ───────────────── */
  const navbar = document.getElementById('navbar');
  const scrollProgress = document.getElementById('scrollProgress');
  
  const updateScrollState = () => {
    const scrollY = window.scrollY;

    if (scrollY > 15) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    if (scrollProgress) {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = (scrollY / totalHeight) * 100;
        scrollProgress.style.width = `${Math.min(100, Math.max(0, progress))}%`;
      }
    }
  };

  updateScrollState();
  window.addEventListener('scroll', updateScrollState, { passive: true });

  /* ─── MOBILE MENU ──────────────────────────────────────── */
  const navLinks = document.getElementById('navLinks');
  const menuToggle = document.getElementById('menuToggle');

  const toggleMenu = (forceClose = false) => {
    if (!navLinks || !menuToggle) return;
    const isOpen = navLinks.classList.contains('open');

    if (isOpen || forceClose) {
      navLinks.classList.remove('open');
      menuToggle.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    } else {
      navLinks.classList.add('open');
      menuToggle.classList.add('open');
      menuToggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }
  };

  if (menuToggle) {
    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMenu();
    });
  }

  // Close menu when a link is clicked
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      if (navLinks && navLinks.classList.contains('open')) toggleMenu(true);
    });
  });

  // Close menu on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks && navLinks.classList.contains('open')) {
      toggleMenu(true);
    }
  });

  // Close mobile menu if clicked outside
  document.addEventListener('click', (e) => {
    if (navLinks && navLinks.classList.contains('open') && !navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
      toggleMenu(true);
    }
  });

  // Close mobile menu on desktop window resize
  window.addEventListener('resize', () => {
    if (window.innerWidth > 1240 && navLinks && navLinks.classList.contains('open')) {
      toggleMenu(true);
    }
  }, { passive: true });

  /* ─── ACTIVE NAV LINK HIGHLIGHTING & SCROLL SPY ─────────── */
  const anchors = document.querySelectorAll('.nav-links a[href^="#"]');
  const sections = document.querySelectorAll('main section[id]');

  const handleScrollSpy = () => {
    const scrollPosition = window.scrollY + 120;

    let currentSectionId = '';

    if (window.scrollY < 80) {
      currentSectionId = 'home';
    } else {
      sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        if (scrollPosition >= top && scrollPosition < top + height) {
          currentSectionId = section.getAttribute('id');
        }
      });
    }

    if (currentSectionId) {
      anchors.forEach(a => {
        const href = a.getAttribute('href');
        const isMatch = href === '#' + currentSectionId;
        a.classList.toggle('active', isMatch);
      });
    }
  };

  window.addEventListener('scroll', handleScrollSpy, { passive: true });
  handleScrollSpy();

  /* ─── SMOOTH SCROLL REVEAL ANIMATIONS ─────────────────── */
  const revealElements = document.querySelectorAll(
    '.sec-hdr, .card, .gallery-item, .contact-info, .contact-form-wrap, .join-panel, .hero-content, .hero-event-card'
  );

  revealElements.forEach(el => el.classList.add('reveal'));

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  /* ─── CONTACT FORM SUBMISSION ──────────────────────────── */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = e.currentTarget.querySelector('button[type="submit"]');
      const originalText = btn.innerHTML;
      
      btn.innerHTML = 'Sending...';
      btn.disabled = true;
      btn.style.opacity = '0.7';
      
      setTimeout(() => {
        btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> Sent Successfully!';
        btn.style.background = '#1E9E5A';
        btn.style.color = '#FFF';
        btn.style.opacity = '1';
        
        setTimeout(() => {
          btn.innerHTML = originalText;
          btn.disabled = false;
          btn.style.background = '';
          btn.style.color = '';
          contactForm.reset();
        }, 3000);
      }, 1500);
    });
  }

  /* ─── POSTER LIGHTBOX MODAL ────────────────────────────── */
  const posterModal = document.getElementById('posterModal');
  const openPosterArrow = document.getElementById('openPosterArrow');
  const heroInviteBox = document.getElementById('heroInviteBox');
  const heroImgWrapper = document.getElementById('heroImgWrapper');
  const posterModalClose = document.getElementById('posterModalClose');
  const posterModalBackdrop = document.getElementById('posterModalBackdrop');

  const openPosterModal = (e) => {
    if (e) e.preventDefault();
    if (!posterModal) return;
    posterModal.classList.add('active');
    posterModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closePosterModal = () => {
    if (!posterModal) return;
    posterModal.classList.remove('active');
    posterModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  if (openPosterArrow) openPosterArrow.addEventListener('click', openPosterModal);
  if (heroInviteBox) heroInviteBox.addEventListener('click', openPosterModal);
  
  // Prevent modal from overriding Meetup link
  const meetupBtns = document.querySelectorAll('.meetup-btn');
  meetupBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  });
  if (heroImgWrapper) heroImgWrapper.addEventListener('click', openPosterModal);

  // Ensure all maximize buttons open the modal
  const maxBtns = document.querySelectorAll('.maximize-btn');
  maxBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      openPosterModal(e);
    });
  });
  if (posterModalClose) posterModalClose.addEventListener('click', closePosterModal);
  if (posterModalBackdrop) posterModalBackdrop.addEventListener('click', closePosterModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && posterModal && posterModal.classList.contains('active')) {
      closePosterModal();
    }
  });
});

