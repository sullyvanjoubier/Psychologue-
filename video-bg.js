/* ========================================================================
   VIDÉO D'AMBIANCE — Fondu au défilement
   La vidéo de fond accompagne le scroll depuis le hero, puis s'efface
   progressivement à l'approche de la section "Champs d'accompagnement".
   ======================================================================== */
(function () {
  const videoBg = document.getElementById('video-bg');
  const domains = document.getElementById('domaines');
  if (!videoBg || !domains) return;

  const video = videoBg.querySelector('video');

  // Coupe la lecture quand la vidéo est invisible (perf & batterie)
  function togglePlayback(opacity) {
    if (!video) return;
    if (opacity <= 0.01 && !video.paused) {
      video.pause();
    } else if (opacity > 0.01 && video.paused && !prefersReducedMotion) {
      video.play().catch(() => {});
    }
  }

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Si l'autoplay est bloqué au chargement, relance au premier geste utilisateur
  if (video && !prefersReducedMotion) {
    const tryPlay = () => {
      if (video.paused && parseFloat(getComputedStyle(videoBg).opacity) > 0.01) {
        video.play().catch(() => {});
      }
    };
    ['scroll', 'touchstart', 'click', 'keydown'].forEach((evt) => {
      window.addEventListener(evt, tryPlay, { once: true, passive: true });
    });
  }

  if (window.gsap && window.ScrollTrigger) {
    // Fondu piloté par GSAP : commence quand les Champs d'accompagnement
    // approchent, se termine quand la section occupe l'écran.
    gsap.to(videoBg, {
      opacity: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: domains,
        start: 'top 95%',
        end: 'top 35%',
        scrub: true,
        onUpdate: (self) => togglePlayback(1 - self.progress)
      }
    });
  } else {
    // Fallback sans GSAP : calcul manuel au scroll
    function onScroll() {
      const rect = domains.getBoundingClientRect();
      const vh = window.innerHeight;
      const fadeStart = vh * 0.95;
      const fadeEnd = vh * 0.35;
      let opacity = (rect.top - fadeEnd) / (fadeStart - fadeEnd);
      opacity = Math.max(0, Math.min(1, opacity));
      videoBg.style.opacity = opacity;
      togglePlayback(opacity);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }
})();
