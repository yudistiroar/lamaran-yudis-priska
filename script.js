/**
 * Undangan Prosesi Lamaran - Priska Yovita & Yudistiro AR
 * Production-ready Vanilla JavaScript for smooth scroll transitions and UX enhancements.
 */

document.addEventListener('DOMContentLoaded', () => {
    initScrollAnimations();
  });
  
  /**
   * Initializes IntersectionObserver to trigger performant fade-in transitions.
   */
  function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.fade-in');
  
    if (!animatedElements.length) return;
  
    // Fallback for browsers without IntersectionObserver support
    if (!('IntersectionObserver' in window)) {
      animatedElements.forEach((el) => el.classList.add('visible'));
      return;
    }
  
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -60px 0px',
      threshold: 0.1
    };
  
    const observer = new IntersectionObserver((entries, observerInstance) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Unobserve after element becomes visible to free memory
          observerInstance.unobserve(entry.target);
        }
      });
    }, observerOptions);
  
    animatedElements.forEach((element) => {
      observer.observe(element);
    });
  }