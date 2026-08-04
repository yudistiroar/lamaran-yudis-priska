/**
 * Undangan Prosesi Lamaran - Priska Yovita & Yudistiro AR
 * High-performance Vanilla JavaScript: Micro-interactions, scroll animations,
 * floating WhatsApp trigger, image fallbacks, and clipboard link copying.
 */

document.addEventListener('DOMContentLoaded', () => {
    initImageFallbacks();
    initScrollAnimations();
    initCopyLink();
    initFloatingWhatsApp();
  });
  
  /**
   * Graceful Image Fallback
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
   * IntersectionObserver Fade-In Animations
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
   * Clipboard Link Copying with Toast Notification
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
  
  /**
   * Floating WhatsApp Button Visibility Trigger on Scroll (> 200px)
   */
  function initFloatingWhatsApp() {
    const waBtn = document.getElementById('whatsapp-btn');
    if (!waBtn) return;
  
    let ticking = false;
  
    const toggleWaButton = () => {
      if (window.scrollY > 200) {
        waBtn.classList.add('visible');
      } else {
        waBtn.classList.remove('visible');
      }
      ticking = false;
    };
  
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(toggleWaButton);
        ticking = true;
      }
    }, { passive: true });
  
    // Initial check
    toggleWaButton();
  }