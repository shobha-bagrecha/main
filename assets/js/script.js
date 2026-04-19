/* ============================================================
   SHOBHA BAGRECHA — MAIN SCRIPT
   - Navbar scroll effect
   - Mobile menu (hamburger drawer)
   - Smooth scroll
   - Scroll-triggered fade-in animations (Intersection Observer)
   - Animated stat counters
   - Testimonial carousel (mobile)
   - Floating button visibility (Intersection Observer on #booking)
   ============================================================ */

(function () {
  'use strict';

  /* ----------------------------------------------------------
     1. NAVBAR SCROLL SHADOW
  ---------------------------------------------------------- */
  const navbar = document.getElementById('navbar');

  function onScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 10);
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  /* ----------------------------------------------------------
     2. MOBILE MENU
  ---------------------------------------------------------- */
  const hamburger     = document.getElementById('hamburger');
  const mobileMenu    = document.getElementById('mobileMenu');
  const mobileClose   = document.getElementById('mobileMenuClose');
  const mobileOverlay = document.getElementById('mobileOverlay');
  const mobileLinks   = document.querySelectorAll('.mobile-link');

  function openMenu() {
    mobileMenu.classList.add('open');
    mobileMenu.removeAttribute('aria-hidden');
    mobileOverlay.classList.add('visible');
    hamburger.setAttribute('aria-expanded', 'true');
    hamburger.setAttribute('aria-label', 'Close navigation menu');
    document.body.style.overflow = 'hidden';
    mobileClose.focus();
  }

  function closeMenu() {
    mobileMenu.classList.remove('open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    mobileOverlay.classList.remove('visible');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-label', 'Open navigation menu');
    document.body.style.overflow = '';
    hamburger.focus();
  }

  hamburger.addEventListener('click', openMenu);
  mobileClose.addEventListener('click', closeMenu);
  mobileOverlay.addEventListener('click', closeMenu);

  // Close on link click
  mobileLinks.forEach(link => link.addEventListener('click', closeMenu));

  // Close on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && mobileMenu.classList.contains('open')) closeMenu();
  });

  /* ----------------------------------------------------------
     3. SCROLL-TRIGGERED FADE-IN ANIMATIONS
  ---------------------------------------------------------- */
  const fadeEls = document.querySelectorAll('.fade-in');

  if ('IntersectionObserver' in window) {
    const fadeObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            fadeObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    fadeEls.forEach(el => fadeObserver.observe(el));
  } else {
    // Fallback: show everything
    fadeEls.forEach(el => el.classList.add('visible'));
  }

  /* ----------------------------------------------------------
     4. ANIMATED STAT COUNTERS
  ---------------------------------------------------------- */
  const statNumbers = document.querySelectorAll('.stat-number');
  let countersStarted = false;

  function formatNumber(val, separator, suffix) {
    let result = Math.floor(val).toString();
    if (separator) {
      result = result.replace(/\B(?=(\d{3})+(?!\d))/g, separator);
    }
    return result + (suffix || '');
  }

  function animateCounter(el) {
    const target    = parseInt(el.dataset.target, 10);
    const suffix    = el.dataset.suffix    || '';
    const separator = el.dataset.separator || '';
    const duration  = 1600;  // ms
    const start     = performance.now();

    function step(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased    = 1 - Math.pow(1 - progress, 3);
      el.textContent = formatNumber(eased * target, separator, suffix);
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  if ('IntersectionObserver' in window) {
    const statsSection = document.getElementById('stats');

    const statsObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting && !countersStarted) {
            countersStarted = true;
            statNumbers.forEach(animateCounter);
            statsObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );

    if (statsSection) statsObserver.observe(statsSection);
  } else {
    // Fallback: set final values
    statNumbers.forEach(function (el) {
      const target    = parseInt(el.dataset.target, 10);
      const suffix    = el.dataset.suffix    || '';
      const separator = el.dataset.separator || '';
      el.textContent  = formatNumber(target, separator, suffix);
    });
  }

  /* ----------------------------------------------------------
     5. TESTIMONIAL CAROUSEL (mobile)
     On desktop, the CSS grid takes over; carousel is hidden.
  ---------------------------------------------------------- */
  const grid      = document.getElementById('testimonialsGrid');
  const cards     = grid ? Array.from(grid.querySelectorAll('.testimonial-card')) : [];
  const dotsWrap  = document.getElementById('carouselDots');
  const prevBtn   = document.getElementById('prevBtn');
  const nextBtn   = document.getElementById('nextBtn');

  let currentSlide = 0;
  let isMobile     = window.innerWidth < 900;

  function buildDots() {
    dotsWrap.innerHTML = '';
    cards.forEach(function (_, i) {
      const dot = document.createElement('button');
      dot.className   = 'carousel-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', 'Go to testimonial ' + (i + 1));
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
      dot.addEventListener('click', function () { goToSlide(i); });
      dotsWrap.appendChild(dot);
    });
  }

  function updateCarousel() {
    if (!isMobile) return;
    const offset = currentSlide * 100;
    grid.style.transform = 'translateX(-' + offset + '%)';

    const dots = dotsWrap.querySelectorAll('.carousel-dot');
    dots.forEach(function (d, i) {
      d.classList.toggle('active', i === currentSlide);
      d.setAttribute('aria-selected', i === currentSlide ? 'true' : 'false');
    });

    // Update aria-hidden on cards
    cards.forEach(function (card, i) {
      card.setAttribute('aria-hidden', i !== currentSlide ? 'true' : 'false');
    });

    prevBtn.disabled = currentSlide === 0;
    nextBtn.disabled = currentSlide === cards.length - 1;
  }

  function goToSlide(index) {
    currentSlide = Math.max(0, Math.min(index, cards.length - 1));
    updateCarousel();
  }

  function setupCarousel() {
    isMobile = window.innerWidth < 900;

    if (isMobile) {
      // Carousel mode
      grid.style.gridTemplateColumns = 'repeat(' + cards.length + ', 100%)';
      grid.style.gap = '0';
      buildDots();
      updateCarousel();
      document.getElementById('carouselControls').style.display = '';
    } else {
      // Grid mode — reset inline styles
      grid.style.transform = '';
      grid.style.gridTemplateColumns = '';
      grid.style.gap = '';
      cards.forEach(card => card.removeAttribute('aria-hidden'));
      document.getElementById('carouselControls').style.display = 'none';
    }
  }

  if (prevBtn) prevBtn.addEventListener('click', function () { goToSlide(currentSlide - 1); });
  if (nextBtn) nextBtn.addEventListener('click', function () { goToSlide(currentSlide + 1); });

  // Swipe support
  let touchStartX = 0;
  if (grid) {
    grid.addEventListener('touchstart', function (e) {
      touchStartX = e.changedTouches[0].clientX;
    }, { passive: true });

    grid.addEventListener('touchend', function (e) {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        goToSlide(diff > 0 ? currentSlide + 1 : currentSlide - 1);
      }
    }, { passive: true });
  }

  // Keyboard navigation for carousel
  document.addEventListener('keydown', function (e) {
    if (!isMobile) return;
    if (e.key === 'ArrowLeft')  goToSlide(currentSlide - 1);
    if (e.key === 'ArrowRight') goToSlide(currentSlide + 1);
  });

  setupCarousel();

  let resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(setupCarousel, 150);
  });

  /* ----------------------------------------------------------
     6. FLOATING BUTTON — hide when booking section is visible
  ---------------------------------------------------------- */
  const floatingBtn   = document.getElementById('floatingBtn');
  const bookingSection = document.getElementById('booking');

  if (floatingBtn && bookingSection && 'IntersectionObserver' in window) {
    const floatObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          // Hide on mobile when booking is visible; always show on desktop
          if (window.innerWidth < 900) {
            floatingBtn.classList.toggle('hidden', entry.isIntersecting);
          } else {
            floatingBtn.classList.remove('hidden');
          }
        });
      },
      { threshold: 0.2 }
    );
    floatObserver.observe(bookingSection);
  }

})();
