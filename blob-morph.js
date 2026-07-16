document.addEventListener("DOMContentLoaded", () => {
  // Chemins SVG ayant exactement le même nombre de points d'ancrage et de types de commande (M... C... Z)
  // pour permettre une interpolation native sans plugin payant.
  const blobPaths = [
    // Etat 1 : Repos / Equilibré
    "M100,20 C140,20 180,60 180,100 C180,140 140,180 100,180 C60,180 20,140 20,100 C20,60 60,20 100,20 Z",
    
    // Etat 2 : Inspiration / Expansion organique
    "M100,10 C160,20 190,50 190,110 C190,170 130,190 90,190 C50,190 10,150 10,90 C10,30 40,0 100,10 Z",
    
    // Etat 3 : Expiration / Légèrement décalé et aplati
    "M90,30 C130,10 170,50 180,100 C190,150 150,180 110,170 C70,160 30,130 30,90 C30,50 50,50 90,30 Z"
  ];

  const morphBlob = (selector, delay = 0) => {
    const blobPathElement = document.querySelector(selector);
    if (!blobPathElement) return;

    // Timeline infinie avec yoyo pour un effet de va-et-vient respiratoire continu
    const tl = gsap.timeline({ repeat: -1, yoyo: true, delay: delay });

    tl.to(blobPathElement, {
      attr: { d: blobPaths[1] },
      duration: 6,
      ease: "sine.inOut"
    })
    .to(blobPathElement, {
      attr: { d: blobPaths[2] },
      duration: 6,
      ease: "sine.inOut"
    })
    .to(blobPathElement, {
      attr: { d: blobPaths[0] },
      duration: 6,
      ease: "sine.inOut"
    });
  };

  // Lancement sur les différents blobs avec des décalages pour un rendu naturel et asynchrone
  morphBlob("#hero-blob-path", 0);
  morphBlob("#bg-blob-path-1", 1.5);
  morphBlob("#bg-blob-path-2", 3);
});
