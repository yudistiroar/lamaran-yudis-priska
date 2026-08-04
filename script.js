/**
 * Undangan Prosesi Lamaran
 * Vanilla JavaScript implementation for scroll effects and smooth interactions.
 */

document.addEventListener('DOMContentLoaded', () => {
    initScrollAnimations();
  });
  
  /**
   * Initializes IntersectionObserver to apply fade-in transitions on scroll.
   */
  function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.fade-in');
  
    if (!('IntersectionObserver' in window)) {
      // Fallback for older browsers
      animatedElements.forEach((el) => el.classList.add('visible'));
      return;
    }
  
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -50px 0px',
      threshold: 0.15
    };
  
    const observer = new IntersectionObserver((entries, observerInstance) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observerInstance.unobserve(entry.target);
        }
      });
    }, observerOptions);
  
    animatedElements.forEach((element) => {
      observer.observe(element);
    });
  }