document.addEventListener("DOMContentLoaded", () => {
  
  // ========================================================================
  // 1. INITIALISATION DE LENIS (SMOOTH SCROLL)
  // ========================================================================
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
  });

  // Mettre à jour ScrollTrigger lors du scroll Lenis
  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);

  // ========================================================================
  // 2. HEADER COMPORTEMENT (SCROLL & EFFET GLASSMORPHISM)
  // ========================================================================
  let lastScrollY = window.scrollY;
  const header = document.querySelector('.site-header');

  if (header) {
    window.addEventListener('scroll', () => {
      const currentScrollY = window.scrollY;
      
      // Ajout de la classe scrolled au-delà de 100px
      if (currentScrollY > 100) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
      
      // Masquer au scroll vers le bas, afficher au scroll vers le haut
      if (currentScrollY > lastScrollY && currentScrollY > 200) {
        header.classList.add('hide');
      } else {
        header.classList.remove('hide');
      }
      
      lastScrollY = currentScrollY;
    });
  }

  // ========================================================================
  // 3. MENU MOBILE BURGER & ACCORDION DE LIENS
  // ========================================================================
  const burgerMenu = document.querySelector('.burger-menu');
  const mobileOverlay = document.querySelector('.mobile-menu-overlay');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (burgerMenu && mobileOverlay) {
    burgerMenu.addEventListener('click', () => {
      const isOpen = burgerMenu.classList.toggle('open');
      mobileOverlay.classList.toggle('open');
      
      if (isOpen) {
        // Animation des liens avec GSAP (Stagger)
        gsap.fromTo(mobileLinks, 
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.1,
            duration: 0.6,
            ease: 'power3.out',
            delay: 0.2
          }
        );
        lenis.stop(); // Désactiver le scroll de la page principale
      } else {
        gsap.to(mobileLinks, {
          opacity: 0,
          y: 40,
          stagger: 0.05,
          duration: 0.4,
          ease: 'power2.in'
        });
        lenis.start(); // Réactiver le scroll
      }
    });

    // Fermer le menu si un lien est cliqué
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        burgerMenu.classList.remove('open');
        mobileOverlay.classList.remove('open');
        gsap.set(mobileLinks, { opacity: 0, y: 40 });
        lenis.start();
      });
    });
  }

  // ========================================================================
  // 4. CURSEUR PERSONNALISÉ DESKTOP
  // ========================================================================
  const cursor = document.querySelector('.custom-cursor');
  const cursorDot = document.querySelector('.custom-cursor-dot');

  if (cursor && cursorDot) {
    // Suivi de la souris
    window.addEventListener('mousemove', (e) => {
      gsap.to(cursorDot, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.05,
        ease: 'power1.out'
      });
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.15,
        ease: 'power1.out'
      });
    });

    // Éléments réactifs au survol
    const hoverElements = document.querySelectorAll('a, button, .btn, .domain-card, .pricing-card, .faq-trigger, .form-control, .form-checkbox');
    hoverElements.forEach(elem => {
      elem.addEventListener('mouseenter', () => {
        document.body.classList.add('hover-link');
      });
      elem.addEventListener('mouseleave', () => {
        document.body.classList.remove('hover-link');
      });
    });
  }

  // ========================================================================
  // 5. ANIMATIONS D'ENTRÉE HERO (DÉCLENCHÉES APRÈS PRELOADER)
  // ========================================================================
  window.addEventListener('preloaderComplete', () => {
    const heroTitle = document.querySelector('.hero-title');
    
    if (heroTitle) {
      // Découper le titre par mots pour faire un stagger élégant
      const words = heroTitle.innerText.split(' ');
      heroTitle.innerHTML = words.map(word => {
        // Détecter si le mot contient un style ou une classe spécifique (géré manuellement pour l'italique)
        if (word.includes("déposer") || word.includes("apaisement") || word.includes("chemin")) {
          return `<span class="hero-word italic-emotional" style="display:inline-block; opacity:0; filter:blur(10px); transform:translateY(30px);">${word}</span>`;
        }
        return `<span class="hero-word" style="display:inline-block; opacity:0; filter:blur(10px); transform:translateY(30px);">${word}</span>`;
      }).join(' ');

      const heroTL = gsap.timeline();

      heroTL.to('.hero-word', {
        opacity: 1,
        filter: 'blur(0px)',
        y: 0,
        stagger: 0.08,
        duration: 1.2,
        ease: 'power3.out'
      })
      .to('.hero-tagline', {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out'
      }, '-=0.8')
      .to('.hero-description', {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out'
      }, '-=0.6')
      .to('.hero-actions', {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out'
      }, '-=0.4')
      .to('.hero-image-wrapper', {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 1.4,
        ease: 'power3.out'
      }, '-=1.0');
    } else {
      // Entrée pour les pages internes
      const pageHeroTitle = document.querySelector('.page-hero h1');
      const pageHeroDesc = document.querySelector('.page-hero p');
      
      if (pageHeroTitle) {
        gsap.fromTo(pageHeroTitle, 
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
        );
      }
      if (pageHeroDesc) {
        gsap.fromTo(pageHeroDesc, 
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.2 }
        );
      }
      
      // Affichage des éléments à animer
      const contentElements = document.querySelectorAll('main > section');
      gsap.fromTo(contentElements, 
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.15,
          duration: 1,
          ease: 'power3.out',
          delay: 0.4
        }
      );
    }
  });

  // ========================================================================
  // 6. ANIMATIONS SCROLLTRIGGER GLOBAL (RÉVÉLATION & PARALLAXE)
  // ========================================================================
  // Révélation d'éléments au scroll
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  revealElements.forEach(elem => {
    gsap.fromTo(elem,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: elem,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      }
    );
  });

  // Parallaxe douce sur les images/blobs
  const parallaxElements = document.querySelectorAll('.parallax-slow');
  parallaxElements.forEach(elem => {
    gsap.to(elem, {
      yPercent: -15,
      ease: 'none',
      scrollTrigger: {
        trigger: elem,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    });
  });

  // ========================================================================
  // 7. SÉPARATEURS SVG ONDULÉS (DESSIN AU SCROLL)
  // ========================================================================
  const wavePaths = document.querySelectorAll('.wave-divider path');
  wavePaths.forEach(path => {
    gsap.to(path, {
      strokeDashoffset: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: path,
        start: 'top 90%',
        end: 'bottom 40%',
        scrub: 1
      }
    });
  });

  // ========================================================================
  // 8. SIGNATURE MANUSCRITE ANIMÉE
  // ========================================================================
  const signaturePath = document.querySelector('.signature-svg path');
  if (signaturePath) {
    gsap.to(signaturePath, {
      strokeDashoffset: 0,
      duration: 2.2,
      ease: 'power2.inOut',
      scrollTrigger: {
        trigger: '.signature-container',
        start: 'top 85%',
        toggleActions: 'play none none none'
      }
    });
  }

  // ========================================================================
  // 9. ANIMATION DE COMPTEURS CHIFFRES
  // ========================================================================
  const counters = document.querySelectorAll('.counter-val');
  counters.forEach(counter => {
    const target = parseFloat(counter.getAttribute('data-target'));
    const isDecimal = counter.getAttribute('data-decimal') === 'true';
    const suffix = counter.getAttribute('data-suffix') || '';

    gsap.fromTo(counter,
      { textContent: 0 },
      {
        textContent: target,
        duration: 2.5,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: counter,
          start: 'top 90%',
          toggleActions: 'play none none none'
        },
        snap: { textContent: isDecimal ? 0.1 : 1 },
        onUpdate: function() {
          const val = parseFloat(counter.textContent);
          counter.textContent = (isDecimal ? val.toFixed(1) : Math.floor(val)) + suffix;
        }
      }
    );
  });

  // ========================================================================
  // 10. MICRO-INTERACTIONS : CARTES TILT 3D
  // ========================================================================
  const tiltCards = document.querySelectorAll('.domain-card, .pricing-card');
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      // Rotation maximale de 3 degrés
      const rotateX = ((centerY - y) / centerY) * 3;
      const rotateY = ((x - centerX) / centerX) * 3;
      
      card.style.setProperty('--x', `${(x / rect.width) * 100}%`);
      card.style.setProperty('--y', `${(y / rect.height) * 100}%`);
      
      gsap.to(card, {
        rotateX: rotateX,
        rotateY: rotateY,
        duration: 0.35,
        ease: 'power2.out',
        transformPerspective: 1000
      });
    });
    
    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.5,
        ease: 'power2.out'
      });
    });
  });

  // ========================================================================
  // 11. ACCORDÉONS FAQ (FLUIDE & ACCESSIBLE)
  // ========================================================================
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    const content = item.querySelector('.faq-content');

    if (trigger && content) {
      trigger.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        
        // Fermer les autres accordéons
        faqItems.forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('active');
            otherItem.querySelector('.faq-content').style.maxHeight = '0';
            otherItem.querySelector('.faq-trigger').setAttribute('aria-expanded', 'false');
          }
        });

        if (isActive) {
          item.classList.remove('active');
          content.style.maxHeight = '0';
          trigger.setAttribute('aria-expanded', 'false');
        } else {
          item.classList.add('active');
          content.style.maxHeight = content.scrollHeight + 'px';
          trigger.setAttribute('aria-expanded', 'true');
        }
        
        // Rafraîchir ScrollTrigger après la transition de hauteur
        setTimeout(() => {
          ScrollTrigger.refresh();
        }, 400);
      });
    }
  });

  // ========================================================================
  // 12. TRANSITION DE THÈME ÉMOTIONNEL AU SCROLL
  // ========================================================================
  const sections = document.querySelectorAll('[data-theme]');
  sections.forEach(section => {
    const targetTheme = section.getAttribute('data-theme');
    let colorVal = '#FAF6F0'; // cream par défaut
    
    if (targetTheme === 'sand') colorVal = '#E8DFD3';
    else if (targetTheme === 'mist') colorVal = '#D9E0DB';
    else if (targetTheme === 'cream') colorVal = '#FAF6F0';
    else if (targetTheme === 'sage') colorVal = '#8A9B8E';

    ScrollTrigger.create({
      trigger: section,
      start: 'top 50%',
      end: 'bottom 50%',
      onEnter: () => {
        gsap.to('body', { backgroundColor: colorVal, duration: 1.2, ease: 'power2.out' });
      },
      onEnterBack: () => {
        gsap.to('body', { backgroundColor: colorVal, duration: 1.2, ease: 'power2.out' });
      }
    });
  });

  // ========================================================================
  // 13. CARROUSEL DES TÉMOIGNAGES (FONDU LENT)
  // ========================================================================
  const slides = document.querySelectorAll('.testimonial-slide');
  const dots = document.querySelectorAll('.testimonial-dot');
  let currentSlide = 0;
  let testimonialInterval;

  function showSlide(index) {
    if (slides.length === 0) return;
    
    slides.forEach((slide, i) => {
      slide.classList.remove('active');
      if (dots[i]) dots[i].classList.remove('active');
    });
    
    slides[index].classList.add('active');
    if (dots[index]) dots[index].classList.add('active');
    currentSlide = index;
  }

  function nextSlide() {
    let next = (currentSlide + 1) % slides.length;
    showSlide(next);
  }

  if (dots.length > 0) {
    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        showSlide(index);
        resetTestimonialTimer();
      });
    });
    
    function startTestimonialTimer() {
      testimonialInterval = setInterval(nextSlide, 7000); // 7 secondes pour une lecture tranquille
    }
    
    function resetTestimonialTimer() {
      clearInterval(testimonialInterval);
      startTestimonialTimer();
    }
    
    showSlide(0);
    startTestimonialTimer();
  }
});
