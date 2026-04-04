// Récupérer le bouton
const backToTopBtn = document.getElementById('back-to-top');

// Afficher ou cacher le bouton au scroll
window.addEventListener('scroll', () => {
  if (window.scrollY > 300) { // apparait après 300px
    backToTopBtn.style.display = 'block';
  } else {
    backToTopBtn.style.display = 'none';
  }
});

// Scroll vers le haut au clic
backToTopBtn.addEventListener('click', (e) => {
  e.preventDefault();
  window.scrollTo({
    top: 0,
    behavior: 'smooth' // animation fluide
  });
});