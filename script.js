/**
 * Undangan Prosesi Lamaran - Priska Yovita & Yudistiro AR
 * Production JavaScript: Scroll animations, accessible lightbox gallery with 
 * touch/keyboard navigation, clipboard link copying, and image fallbacks.
 */

document.addEventListener('DOMContentLoaded', () => {
    initImageFallbacks();
    initScrollAnimations();
    initLightbox();
    initCopyLink();
  });
  
  /**
   * 1. Graceful Image Load Fallback
   */
  function initImageFallbacks() {
    const images = document.querySelectorAll('img');
  
    images.forEach((img) => {
      if (img.complete && img.naturalHeight === 0) {
        handleImageError(img);
      } else {
        img.addEventListener('error', () => handleImageError(img));
      }
    });
  
    function handleImageError(img) {
      const parent = img.parentElement;
      img.style.display = 'none';
      if (parent) {
        parent.classList.add('image-fallback');
      }
    }
  }
  
  /**
   * 2. IntersectionObserver Fade-In Animations
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
   * 3. Accessible Gallery Lightbox with Navigation & Swipe Support
   */
  function initLightbox() {
    const galleryButtons = Array.from(document.querySelectorAll('.gallery-item'));
    const dialog = document.getElementById('lightbox');
    const backdrop = document.getElementById('lightbox-backdrop');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeBtn = document.getElementById('lightbox-close');
    const prevBtn = document.getElementById('lightbox-prev');
    const nextBtn = document.getElementById('lightbox-next');
  
    if (!dialog || !lightboxImg || !galleryButtons.length) return;
  
    let currentIndex = 0;
    let lastActiveElement = null;
  
    // Extract gallery images data
    const galleryData = galleryButtons.map((btn) => {
      const img = btn.querySelector('img');
      return {
        src: img ? img.getAttribute('src') : '',
        alt: img ? img.getAttribute('alt') : ''
      };
    });
  
    const updateLightboxContent = (index) => {
      currentIndex = index;
      const data = galleryData[currentIndex];
      lightboxImg.src = data.src;
      lightboxImg.alt = data.alt;
    };
  
    const openLightbox = (index) => {
      lastActiveElement = document.activeElement;
      updateLightboxContent(index);
  
      if (typeof dialog.showModal === 'function') {
        dialog.showModal();
      } else {
        dialog.setAttribute('open', '');
      }
  
      document.body.style.overflow = 'hidden';
      closeBtn.focus();
    };
  
    const closeLightbox = () => {
      if (typeof dialog.close === 'function') {
        dialog.close();
      } else {
        dialog.removeAttribute('open');
      }
  
      document.body.style.overflow = '';
      if (lastActiveElement && typeof lastActiveElement.focus === 'function') {
        lastActiveElement.focus();
      }
    };
  
    const showPrev = () => {
      const newIndex = (currentIndex - 1 + galleryData.length) % galleryData.length;
      updateLightboxContent(newIndex);
    };
  
    const showNext = () => {
      const newIndex = (currentIndex + 1) % galleryData.length;
      updateLightboxContent(newIndex);
    };
  
    // Event Listeners for Gallery Items
    galleryButtons.forEach((btn, index) => {
      btn.addEventListener('click', () => openLightbox(index));
    });
  
    // Control Listeners
    closeBtn.addEventListener('click', closeLightbox);
    backdrop.addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', showPrev);
    nextBtn.addEventListener('click', showNext);
  
    // Keyboard Navigation
    dialog.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeLightbox();
      } else if (e.key === 'ArrowLeft') {
        showPrev();
      } else if (e.key === 'ArrowRight') {
        showNext();
      } else if (e.key === 'Tab') {
        // Focus Trap inside Lightbox
        const focusables = [closeBtn, prevBtn, nextBtn].filter((el) => el && el.offsetParent !== null);
        const firstFocusable = focusables[0];
        const lastFocusable = focusables[focusables.length - 1];
  
        if (e.shiftKey && document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable.focus();
        } else if (!e.shiftKey && document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable.focus();
        }
      }
    });
  
    // Touch Swipe Navigation
    let touchStartX = 0;
    let touchEndX = 0;
  
    dialog.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
  
    dialog.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });
  
    function handleSwipe() {
      const swipeThreshold = 40;
      if (touchEndX < touchStartX - swipeThreshold) {
        showNext();
      } else if (touchEndX > touchStartX + swipeThreshold) {
        showPrev();
      }
    }
  }
  
  /**
   * 4. Clipboard API Link Copying with Toast Notification
   */
  function initCopyLink() {
    const copyBtn = document.getElementById('copy-link-btn');
    const toast = document.getElementById('toast');
  
    if (!copyBtn || !toast) return;
  
    let toastTimer;
  
    copyBtn.addEventListener('click', async () => {
      const shareUrl = window.location.href;
  
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(shareUrl);
          showToast('Link berhasil disalin.');
        } else {
          fallbackCopyText(shareUrl);
        }
      } catch (err) {
        fallbackCopyText(shareUrl);
      }
    });
  
    function fallbackCopyText(text) {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
  
      try {
        document.execCommand('copy');
        showToast('Link berhasil disalin.');
      } catch (err) {
        showToast('Gagal menyalin link.');
      }
  
      document.body.removeChild(textArea);
    }
  
    function showToast(message) {
      toast.textContent = message;
      toast.classList.add('show');
  
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => {
        toast.classList.remove('show');
      }, 2500);
    }
  }