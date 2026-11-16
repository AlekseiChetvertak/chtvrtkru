document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Анимация поочередного появления слов в Hero (если блок есть на странице)
  const heroWords = document.querySelectorAll('.hero .word');
  heroWords.forEach((word, index) => {
    if (prefersReducedMotion) {
      word.classList.add('show');
    } else {
      setTimeout(() => {
        word.classList.add('show');
      }, 350 + index * 480);
    }
  });

  // Универсальный наблюдатель за появлением элементов при скролле
  const observeElements = (selector, activeClass, threshold) => {
    const elements = document.querySelectorAll(selector);
    if (!elements.length) return;

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add(activeClass);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold });

    elements.forEach((el) => observer.observe(el));
  };

  observeElements('.reveal', 'in', 0.14);
  observeElements('.brand-word', 'in', 0.35);
});