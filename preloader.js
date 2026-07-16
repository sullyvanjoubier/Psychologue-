document.addEventListener("DOMContentLoaded", () => {
  const preloader = document.getElementById("preloader");
  const loaderCircle = document.querySelector(".loader-circle");
  
  if (!preloader) {
    // Si pas de préloader sur cette page, déclencher directement
    window.dispatchEvent(new CustomEvent("preloaderComplete"));
    return;
  }
  
  // Désactiver le scroll du body pendant le chargement
  document.body.style.overflow = "hidden";
  
  // Timeline GSAP pour la respiration du loader et sa disparition
  const tl = gsap.timeline({
    onComplete: () => {
      preloader.style.display = "none";
      document.body.style.overflow = "";
      // Déclencher l'événement de fin de préchargement pour lancer le Hero
      window.dispatchEvent(new CustomEvent("preloaderComplete"));
    }
  });
  
  // Cycle de respiration (Inspiration de 1.2s -> Expiration de 1.2s)
  tl.to(loaderCircle, {
    scale: 1.35,
    filter: "blur(0px)",
    backgroundColor: "#C6876F", // Devient terracotta doux
    duration: 1.2,
    ease: "power1.inOut"
  })
  .to(loaderCircle, {
    scale: 1,
    filter: "blur(2px)",
    backgroundColor: "#8A9B8E", // Revient sauge
    duration: 1.2,
    ease: "power1.inOut"
  })
  // Disparition en fondu du rideau de chargement
  .to(preloader, {
    opacity: 0,
    duration: 0.6,
    ease: "power2.out"
  });
});
