/**
 * Undangan Prosesi Lamaran - Priska Yovita & Yudistiro AR
 * Modular Vanilla JavaScript for scroll animations, guest personalization,
 * lightbox gallery, and copy link functionality.
 */

document.addEventListener('DOMContentLoaded', () => {
    initGuestPersonalization();
    initScrollAnimations();
    initLightbox();
    initCopyLink();
  });
  
  /**
   * 1. Personalized Invitation Support (URL Parameter ?to=)
   */
  function initGuestPersonalization() {
    const urlParams = new URLSearchParams(window.location.search);
    const guestParam = urlParams.get('to');
  
    if (guestParam && guestParam.trim() !== '') {
      const guestGreeting = document.getElementById('guest-greeting');
      const guestNameEl = document.getElementById('guest-name');
  
      if (guestGreeting && guestNameEl) {
        guestNameEl.textContent = decodeURIComponent(guestParam.trim());
        guestGreeting.classList.remove('hidden');
      }
    }
  }
  
  /**
   * 2. IntersectionObserver Fade-in Scroll Animations
   */
  function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.fade-in');
  
    if (!animatedElements.length) return;
  
    if (!('IntersectionObserver' in window)) {
      animatedElements.forEach((el) => el.classList.add('visible'));
      return;
    }
  
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -40px 0px',
      threshold: 0.1
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
  
  /**
   * 3. Vanilla JavaScript Lightbox Gallery
   */
  function initLightbox() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.getElementById('lightbox-close');
  
    if (!lightbox || !lightboxImg || !galleryItems.length) return;
  
    const openLightbox = (imgSrc, altText) => {
      lightboxImg.src = imgSrc;
      lightboxImg.alt = altText;
      lightbox.classList.add('active');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    };
  
    const closeLightbox = () => {
      lightbox.classList.remove('active');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    };
  
    galleryItems.forEach((item) => {
      const img = item.querySelector('img');
      if (!img) return;
  
      item.addEventListener('click', () => {
        openLightbox(img.src, img.alt);
      });
  
      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openLightbox(img.src, img.alt);
        }
      });
    });
  
    lightboxClose.addEventListener('click', closeLightbox);
  
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });
  
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        closeLightbox();
      }
    });
  }
  
  /**
   * 4. Clipboard API Copy Link with Toast Feedback
   */
  function initCopyLink() {
    const copyBtn = document.getElementById('copy-link-btn');
    const toast = document.getElementById('toast');
  
    if (!copyBtn || !toast) return;
  
    let toastTimer;
  
    copyBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(window.location.href);
        showToast('Link berhasil disalin.');
      } catch (err) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = window.location.href;
        document.body.appendChild(textArea);
        textArea.select();
        try {
          document.execCommand('copy');
          showToast('Link berhasil disalin.');
        } catch (fallbackErr) {
          showToast('Gagal menyalin link.');
        }
        document.body.removeChild(textArea);
      }
    });
  
    function showToast(message) {
      toast.textContent = message;
      toast.classList.add('show');
  
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => {
        toast.classList.remove('show');
      }, 2500);
    }
  }