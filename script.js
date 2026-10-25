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
    '.sec-hdr, .card, .gallery-card, .gallery-item, .contact-info, .contact-form-wrap, .join-panel, .hero-content, .hero-event-card, .event-flip-card'
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

  /* ─── EXPANDABLE EVENT CARDS ────────────────────────────── */
  function initExpandableCard({
    cardId,
    toggleBtnId,
    panelId,
    collapseBtnClass,
    textClass,
    defaultText,
    expandedText = 'Show Less'
  }) {
    const card = document.getElementById(cardId);
    const toggleBtn = document.getElementById(toggleBtnId);
    const panel = document.getElementById(panelId);
    if (!card || !toggleBtn || !panel) return null;

    const labelEl = toggleBtn.querySelector(textClass) || toggleBtn;
    const bottomCollapseBtn = panel.querySelector(collapseBtnClass);

    const setExpanded = (expand) => {
      if (expand) {
        card.classList.add('is-expanded');
        panel.classList.add('is-open');
        panel.setAttribute('aria-hidden', 'false');
        toggleBtn.setAttribute('aria-expanded', 'true');
        if (labelEl) labelEl.textContent = expandedText;
      } else {
        card.classList.remove('is-expanded');
        panel.classList.remove('is-open');
        panel.setAttribute('aria-hidden', 'true');
        toggleBtn.setAttribute('aria-expanded', 'false');
        if (labelEl) labelEl.textContent = defaultText;
      }
    };

    toggleBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const isExpanded = card.classList.contains('is-expanded');
      setExpanded(!isExpanded);
    });

    if (bottomCollapseBtn) {
      bottomCollapseBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        setExpanded(false);
        const rect = card.getBoundingClientRect();
        if (rect.top < 70) {
          card.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    }

    return { setExpanded, isExpanded: () => card.classList.contains('is-expanded') };
  }

  // 1. Upcoming Event Card (AWS Certification Roadmap)
  const upcomingCardController = initExpandableCard({
    cardId: 'upcomingEventCard',
    toggleBtnId: 'upcomingAboutBtn',
    panelId: 'upcomingExpandedDetails',
    collapseBtnClass: '.efc-collapse-btn',
    textClass: '.efc-expand-text',
    defaultText: 'About Event',
    expandedText: 'Show Less'
  });

  // 2. Past Event Card (Cloud Ignite)
  const pastCardController = initExpandableCard({
    cardId: 'pastEventCard',
    toggleBtnId: 'pastAboutBtn',
    panelId: 'pastExpandedDetails',
    collapseBtnClass: '.efc-collapse-btn',
    textClass: '.efc-expand-text',
    defaultText: 'About Event',
    expandedText: 'Show Less'
  });

  // Prevent external links & buttons from bubbling to card expansion or modal
  const cardExternalLinks = document.querySelectorAll(
    '.uec-register-btn, .efc-register-btn, .hec-linkedin-btn-card, .speaker-box, .meetup-btn'
  );
  cardExternalLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  });

  /* ─── GALLERY CAROUSEL REEL & CATEGORY FILTERING ───────── */
  const galleryFilterBtns = document.querySelectorAll('.gallery-filter-btn');
  const galleryCards = Array.from(document.querySelectorAll('.gallery-card'));
  const galleryTrack = document.getElementById('galleryGrid');
  const galleryReelPrev = document.getElementById('galleryReelPrev');
  const galleryReelNext = document.getElementById('galleryReelNext');
  const galleryScrollThumb = document.getElementById('galleryScrollThumb');

  let currentGalleryFilter = 'all';

  const updateCarouselState = () => {
    if (!galleryTrack) return;
    const maxScroll = galleryTrack.scrollWidth - galleryTrack.clientWidth;
    const currentScroll = galleryTrack.scrollLeft;

    if (galleryReelPrev) {
      galleryReelPrev.disabled = currentScroll <= 6;
    }
    if (galleryReelNext) {
      galleryReelNext.disabled = currentScroll >= maxScroll - 6 || maxScroll <= 0;
    }

    if (galleryScrollThumb) {
      if (maxScroll > 0) {
        const visibleRatio = galleryTrack.clientWidth / galleryTrack.scrollWidth;
        const thumbWidthPercent = Math.max(16, Math.min(100, visibleRatio * 100));
        const progress = Math.max(0, Math.min(1, currentScroll / maxScroll));
        const maxOffsetPercent = 100 - thumbWidthPercent;
        galleryScrollThumb.style.width = `${thumbWidthPercent}%`;
        galleryScrollThumb.style.transform = `translateX(${progress * (maxOffsetPercent / thumbWidthPercent) * 100}%)`;
      } else {
        galleryScrollThumb.style.width = '100%';
        galleryScrollThumb.style.transform = 'translateX(0)';
      }
    }
  };

  if (galleryTrack) {
    galleryTrack.addEventListener('scroll', updateCarouselState, { passive: true });
    window.addEventListener('resize', updateCarouselState, { passive: true });
    setTimeout(updateCarouselState, 100);
  }

  if (galleryReelPrev && galleryTrack) {
    galleryReelPrev.addEventListener('click', () => {
      const scrollStep = Math.max(280, galleryTrack.clientWidth * 0.75);
      galleryTrack.scrollBy({ left: -scrollStep, behavior: 'smooth' });
    });
  }

  if (galleryReelNext && galleryTrack) {
    galleryReelNext.addEventListener('click', () => {
      const scrollStep = Math.max(280, galleryTrack.clientWidth * 0.75);
      galleryTrack.scrollBy({ left: scrollStep, behavior: 'smooth' });
    });
  }

  const getVisibleGalleryCards = () => {
    return galleryCards.filter(card => !card.classList.contains('is-hidden'));
  };

  const setGalleryFilter = (filter, pushHistory = true) => {
    currentGalleryFilter = filter;

    galleryFilterBtns.forEach(btn => {
      const isMatch = btn.getAttribute('data-filter') === filter;
      btn.classList.toggle('active', isMatch);
      btn.setAttribute('aria-selected', isMatch ? 'true' : 'false');
    });

    galleryCards.forEach(card => {
      const cardEvent = card.getAttribute('data-event');
      const show = filter === 'all' || cardEvent === filter;
      card.classList.toggle('is-hidden', !show);
    });

    if (galleryTrack) {
      galleryTrack.scrollTo({ left: 0, behavior: 'smooth' });
      setTimeout(updateCarouselState, 120);
    }

    if (pushHistory) {
      const targetHash = filter === 'all' ? '#gallery' : '#' + filter;
      if (window.location.hash !== targetHash) {
        history.pushState({ galleryFilter: filter }, '', targetHash);
      }
    }
  };

  galleryFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');
      setGalleryFilter(filter);
    });
  });

  // Global functions to preserve event card links
  window.openAlbum = function(albumId, pushHistory = true) {
    setGalleryFilter(albumId, pushHistory);
    const gallerySection = document.getElementById('gallery');
    if (gallerySection) {
      gallerySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  window.closeAlbums = function(updateHistory = true) {
    setGalleryFilter('all', updateHistory);
  };

  // Hash & history listener
  window.addEventListener('popstate', () => {
    const hash = window.location.hash;
    if (hash === '#event1' || hash === '#event2') {
      setGalleryFilter(hash.replace('#', ''), false);
    } else {
      setGalleryFilter('all', false);
    }
  });

  if (window.location.hash === '#event1' || window.location.hash === '#event2') {
    setGalleryFilter(window.location.hash.replace('#', ''), false);
  } else {
    updateCarouselState();
  }

  /* ─── ENHANCED POSTER & GALLERY LIGHTBOX MODAL ─────────── */
  const posterModal = document.getElementById('posterModal');
  const upcomingEventImgWrap = document.getElementById('upcomingEventImgWrap');
  const pastEventImgWrap = document.getElementById('pastEventImgWrap');
  const posterModalClose = document.getElementById('posterModalClose');
  const posterModalBackdrop = document.getElementById('posterModalBackdrop');

  const pmImg = document.getElementById('pmImg');
  const pmBadge = document.getElementById('pmBadge');
  const pmHeading = document.getElementById('pmHeading');
  const pmCounter = document.getElementById('pmCounter');
  const pmCaption = document.getElementById('pmCaption');
  const pmNavPrev = document.getElementById('pmNavPrev');
  const pmNavNext = document.getElementById('pmNavNext');

  let currentLightboxMode = 'single'; // 'gallery' | 'single'
  let currentLightboxIndex = 0;

  const updateLightboxContent = () => {
    if (currentLightboxMode === 'gallery') {
      const visibleCards = getVisibleGalleryCards();
      if (!visibleCards.length) return;
      if (currentLightboxIndex < 0) currentLightboxIndex = visibleCards.length - 1;
      if (currentLightboxIndex >= visibleCards.length) currentLightboxIndex = 0;

      const card = visibleCards[currentLightboxIndex];
      const img = card.querySelector('.gallery-card-media img');
      const badge = card.querySelector('.gallery-badge');
      const title = card.querySelector('.gallery-card-title');
      const meta = card.querySelector('.gallery-card-meta');

      if (pmImg && img) {
        pmImg.src = img.src;
        pmImg.alt = img.alt || 'Gallery photo';
      }
      if (pmBadge && badge) pmBadge.textContent = badge.textContent.trim();
      if (pmHeading && title) pmHeading.textContent = title.textContent.trim();
      if (pmCounter) pmCounter.textContent = `${currentLightboxIndex + 1} / ${visibleCards.length}`;
      if (pmCaption) pmCaption.textContent = meta ? meta.textContent.trim().replace(/\s+/g, ' ') : '';

      if (pmNavPrev && pmNavNext) {
        const hasMultiple = visibleCards.length > 1;
        pmNavPrev.style.display = hasMultiple ? 'flex' : 'none';
        pmNavNext.style.display = hasMultiple ? 'flex' : 'none';
      }
      if (pmCounter) pmCounter.style.display = 'inline';
    }
  };

  const openGalleryLightbox = (cardElement) => {
    if (!posterModal) return;
    const visibleCards = getVisibleGalleryCards();
    const index = visibleCards.indexOf(cardElement);
    currentLightboxMode = 'gallery';
    currentLightboxIndex = index >= 0 ? index : 0;

    updateLightboxContent();

    posterModal.classList.add('active');
    posterModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const openSinglePosterLightbox = (imgSrc, altText, headingText = 'Event Poster', badgeText = 'Event') => {
    if (!posterModal) return;
    currentLightboxMode = 'single';

    if (pmImg) {
      pmImg.src = imgSrc;
      pmImg.alt = altText || 'Event Poster';
    }
    if (pmBadge) pmBadge.textContent = badgeText;
    if (pmHeading) pmHeading.textContent = headingText;
    if (pmCounter) pmCounter.style.display = 'none';
    if (pmCaption) pmCaption.textContent = altText || '';

    if (pmNavPrev) pmNavPrev.style.display = 'none';
    if (pmNavNext) pmNavNext.style.display = 'none';

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

  const navigateLightbox = (step) => {
    if (currentLightboxMode !== 'gallery') return;
    const visibleCards = getVisibleGalleryCards();
    if (!visibleCards.length) return;

    if (pmImg) {
      pmImg.style.opacity = '0';
      pmImg.style.transform = step > 0 ? 'translateX(10px)' : 'translateX(-10px)';
    }

    setTimeout(() => {
      currentLightboxIndex = (currentLightboxIndex + step + visibleCards.length) % visibleCards.length;
      updateLightboxContent();
      if (pmImg) {
        pmImg.style.opacity = '1';
        pmImg.style.transform = 'translateX(0)';
      }
    }, 120);
  };

  // Wire up gallery card clicks
  galleryCards.forEach(card => {
    const media = card.querySelector('.gallery-card-media');
    if (media) {
      media.addEventListener('click', (e) => {
        e.preventDefault();
        openGalleryLightbox(card);
      });
      media.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openGalleryLightbox(card);
        }
      });
    }
  });

  // Wire up hero/completed event wrappers
  if (upcomingEventImgWrap) {
    upcomingEventImgWrap.addEventListener('click', (e) => {
      e.preventDefault();
      const img = upcomingEventImgWrap.querySelector('img');
      openSinglePosterLightbox(
        img ? img.src : 'images/aws_certification_roadmap_image.jpeg',
        'AWS Certification: Your Roadmap to the Golden Jacket',
        'AWS Certification Roadmap',
        'Workshop'
      );
    });
  }

  if (pastEventImgWrap) {
    pastEventImgWrap.addEventListener('click', (e) => {
      e.preventDefault();
      const img = pastEventImgWrap.querySelector('img');
      openSinglePosterLightbox(
        img ? img.src : 'images/event1/cover.png',
        'Session 1: Cloud Ignite Inauguration',
        'Session 1: Cloud Ignite',
        'Inaugural Launch'
      );
    });
  }

  // Maximize buttons outside of gallery (e.g. event cards)
  const maxBtns = document.querySelectorAll('.event-card .maximize-btn');
  maxBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const img = btn.closest('.event-img')?.querySelector('img');
      if (img) {
        openSinglePosterLightbox(img.src, img.alt, 'Event Poster', 'Official');
      }
    });
  });

  // Modal navigation controls
  if (pmNavPrev) {
    pmNavPrev.addEventListener('click', (e) => {
      e.stopPropagation();
      navigateLightbox(-1);
    });
  }
  if (pmNavNext) {
    pmNavNext.addEventListener('click', (e) => {
      e.stopPropagation();
      navigateLightbox(1);
    });
  }

  if (posterModalClose) posterModalClose.addEventListener('click', closePosterModal);
  if (posterModalBackdrop) posterModalBackdrop.addEventListener('click', closePosterModal);

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (posterModal && posterModal.classList.contains('active')) {
      if (e.key === 'Escape') {
        closePosterModal();
      } else if (e.key === 'ArrowLeft') {
        navigateLightbox(-1);
      } else if (e.key === 'ArrowRight') {
        navigateLightbox(1);
      }
    } else {
      if (e.key === 'Escape') {
        if (upcomingCardController && upcomingCardController.isExpanded()) upcomingCardController.setExpanded(false);
        if (pastCardController && pastCardController.isExpanded()) pastCardController.setExpanded(false);
      }
    }
  });

  // Touch swipe support for Lightbox
  let touchStartX = 0;
  let touchEndX = 0;

  if (posterModal) {
    posterModal.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    posterModal.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchEndX - touchStartX;
      if (Math.abs(diff) > 40) {
        if (diff > 0) {
          navigateLightbox(-1); // Swipe right -> prev
        } else {
          navigateLightbox(1);  // Swipe left -> next
        }
      }
    }, { passive: true });
  }
});

