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
    '.sec-hdr, .card, .gallery-item, .contact-info, .contact-form-wrap, .join-panel, .hero-content, .hero-event-card, .event-flip-card'
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

  /* ─── HERO EVENT FLIP CARD ─────────────────────────────── */
  const heroEventCard = document.getElementById('heroEventCard');
  const heroFlipToBackBtn = document.getElementById('heroFlipToBackBtn');
  const heroFlipToFrontBtn = document.getElementById('heroFlipToFrontBtn');
  const heroCardFront = document.getElementById('heroCardFront');
  const heroCardBack = document.getElementById('heroCardBack');

  const updateHeroCardHeight = (toBack) => {
    if (!heroEventCard || !heroCardFront || !heroCardBack) return;
    if (toBack) {
      heroCardBack.style.position = 'static';
      heroCardBack.style.height = 'auto';
      const targetH = heroCardBack.offsetHeight;
      heroCardBack.style.position = '';
      heroCardBack.style.height = '';
      heroEventCard.style.height = targetH + 'px';
    } else {
      heroEventCard.style.height = heroCardFront.offsetHeight + 'px';
      setTimeout(() => {
        if (heroEventCard && !heroEventCard.classList.contains('is-flipped')) {
          heroEventCard.style.height = '';
        }
      }, 700);
    }
  };

  const flipHeroCard = (toBack = true) => {
    if (!heroEventCard) return;

    if (toBack) {
      updateHeroCardHeight(true);
      heroEventCard.classList.add('is-flipped');
      if (heroFlipToBackBtn) heroFlipToBackBtn.setAttribute('aria-expanded', 'true');
      if (heroCardFront) heroCardFront.setAttribute('aria-hidden', 'true');
      if (heroCardBack) {
        heroCardBack.setAttribute('aria-hidden', 'false');
        if (heroFlipToFrontBtn) heroFlipToFrontBtn.focus();
      }
    } else {
      updateHeroCardHeight(false);
      heroEventCard.classList.remove('is-flipped');
      if (heroFlipToBackBtn) {
        heroFlipToBackBtn.setAttribute('aria-expanded', 'false');
        heroFlipToBackBtn.focus();
      }
      if (heroCardFront) heroCardFront.setAttribute('aria-hidden', 'false');
      if (heroCardBack) heroCardBack.setAttribute('aria-hidden', 'true');
    }
  };

  const flipCard = flipHeroCard; // Alias for backward compatibility

  if (heroFlipToBackBtn) {
    heroFlipToBackBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      flipHeroCard(true);
    });
  }

  if (heroFlipToFrontBtn) {
    heroFlipToFrontBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      flipHeroCard(false);
    });
  }

  window.addEventListener('resize', () => {
    if (heroEventCard && heroEventCard.classList.contains('is-flipped')) {
      updateHeroCardHeight(true);
    }
  }, { passive: true });

  /* ─── UPCOMING EVENT FLIP CARD ─────────────────────────── */
  const upcomingEventCard = document.getElementById('upcomingEventCard');
  const upcomingAboutBtn = document.getElementById('upcomingAboutBtn');
  const upcomingBackBtn = document.getElementById('upcomingBackBtn');
  const upcomingCardFront = document.getElementById('upcomingCardFront');
  const upcomingCardBack = document.getElementById('upcomingCardBack');

  const flipUpcomingCard = (toBack = true) => {
    if (!upcomingEventCard) return;

    if (toBack) {
      upcomingEventCard.classList.add('is-flipped');
      if (upcomingAboutBtn) upcomingAboutBtn.setAttribute('aria-expanded', 'true');
      if (upcomingCardFront) upcomingCardFront.setAttribute('aria-hidden', 'true');
      if (upcomingCardBack) {
        upcomingCardBack.setAttribute('aria-hidden', 'false');
        if (upcomingBackBtn) upcomingBackBtn.focus();
      }
    } else {
      upcomingEventCard.classList.remove('is-flipped');
      if (upcomingAboutBtn) {
        upcomingAboutBtn.setAttribute('aria-expanded', 'false');
        upcomingAboutBtn.focus();
      }
      if (upcomingCardFront) upcomingCardFront.setAttribute('aria-hidden', 'false');
      if (upcomingCardBack) upcomingCardBack.setAttribute('aria-hidden', 'true');
    }
  };

  if (upcomingAboutBtn) {
    upcomingAboutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      flipUpcomingCard(true);
    });
  }

  if (upcomingBackBtn) {
    upcomingBackBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      flipUpcomingCard(false);
    });
  }

  /* ─── PAST EVENT FLIP CARD (CLOUD IGNITE) ────────────────── */
  const pastEventCard = document.getElementById('pastEventCard');
  const pastAboutBtn = document.getElementById('pastAboutBtn');
  const pastBackBtn = document.getElementById('pastBackBtn');
  const pastCardFront = document.getElementById('pastCardFront');
  const pastCardBack = document.getElementById('pastCardBack');

  const flipPastCard = (toBack = true) => {
    if (!pastEventCard) return;

    if (toBack) {
      pastEventCard.classList.add('is-flipped');
      if (pastAboutBtn) pastAboutBtn.setAttribute('aria-expanded', 'true');
      if (pastCardFront) pastCardFront.setAttribute('aria-hidden', 'true');
      if (pastCardBack) {
        pastCardBack.setAttribute('aria-hidden', 'false');
        if (pastBackBtn) pastBackBtn.focus();
      }
    } else {
      pastEventCard.classList.remove('is-flipped');
      if (pastAboutBtn) {
        pastAboutBtn.setAttribute('aria-expanded', 'false');
        pastAboutBtn.focus();
      }
      if (pastCardFront) pastCardFront.setAttribute('aria-hidden', 'false');
      if (pastCardBack) pastCardBack.setAttribute('aria-hidden', 'true');
    }
  };

  if (pastAboutBtn) {
    pastAboutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      flipPastCard(true);
    });
  }

  if (pastBackBtn) {
    pastBackBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      flipPastCard(false);
    });
  }

  // Prevent external links & buttons from bubbling to card flip or modal
  const cardExternalLinks = document.querySelectorAll(
    '.hec-register-btn, .uec-register-btn, .efc-register-btn, .hec-linkedin-btn, .uec-linkedin-btn, .speaker-box, .meetup-btn, .efc-back-actions a'
  );
  cardExternalLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  });

  // Dynamic Event Status based on Target Date (10 Oct 2026 4:00 PM IST)
  const updateEventStatus = () => {
    const now = new Date();
    const eventStart = new Date('2026-10-10T16:00:00+05:30');
    const eventEnd = new Date('2026-10-10T18:00:00+05:30');
    const statusTag = document.getElementById('heroEventStatusTag');
    const statusText = document.getElementById('heroStatusText');

    if (!statusTag || !statusText) return;

    if (now > eventEnd) {
      statusTag.classList.remove('premium-tag');
      statusTag.classList.add('tag-completed');
      statusText.textContent = 'EVENT COMPLETED';
      const dot = statusTag.querySelector('.live-indicator-dot');
      if (dot) dot.style.display = 'none';
    } else if (now >= eventStart && now <= eventEnd) {
      statusText.textContent = 'HAPPENING NOW';
    } else {
      statusText.textContent = 'UPCOMING EVENT';
    }
  };

  updateEventStatus();

  /* ─── POSTER LIGHTBOX MODAL ────────────────────────────── */
  const posterModal = document.getElementById('posterModal');
  const heroImgWrapper = document.getElementById('heroImgWrapper');
  const upcomingEventImgWrap = document.getElementById('upcomingEventImgWrap');
  const pastEventImgWrap = document.getElementById('pastEventImgWrap');
  const posterModalClose = document.getElementById('posterModalClose');
  const posterModalBackdrop = document.getElementById('posterModalBackdrop');

  const openPosterModal = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!posterModal) return;
    
    if (e && e.currentTarget) {
      let img = null;
      if (e.currentTarget.classList.contains('maximize-btn')) {
        img = e.currentTarget.parentElement.querySelector('img');
      } else {
        img = e.currentTarget.querySelector('img');
      }
      
      const modalImg = posterModal.querySelector('.pm-img');
      if (img && modalImg) {
        modalImg.src = img.src;
        modalImg.alt = img.alt || "Full screen view";
      }
    }

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

  // Wire up hero poster & event wrappers
  if (heroImgWrapper) heroImgWrapper.addEventListener('click', openPosterModal);
  if (upcomingEventImgWrap) upcomingEventImgWrap.addEventListener('click', openPosterModal);
  if (pastEventImgWrap) pastEventImgWrap.addEventListener('click', openPosterModal);

  // Prevent modal from overriding Meetup link
  const meetupBtns = document.querySelectorAll('.meetup-btn');
  meetupBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  });

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
    if (e.key === 'Escape') {
      if (posterModal && posterModal.classList.contains('active')) {
        closePosterModal();
      } else {
        if (heroEventCard && heroEventCard.classList.contains('is-flipped')) {
          flipHeroCard(false);
        }
        if (upcomingEventCard && upcomingEventCard.classList.contains('is-flipped')) {
          flipUpcomingCard(false);
        }
        if (pastEventCard && pastEventCard.classList.contains('is-flipped')) {
          flipPastCard(false);
        }
      }
    }
  });
});

