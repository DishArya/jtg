document.addEventListener('DOMContentLoaded', function() {
  /***** Modal *****/
  const modalBackdrop = document.getElementById('modalBackdrop');
  const requestBtn = document.getElementById('requestDishBtn');
  const modalCancel = document.getElementById('modalCancel');
  const modalSubmit = document.getElementById('modalSubmit');

  function openModal() {
    if (!modalBackdrop) return;
    modalBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
    modalBackdrop.setAttribute('aria-hidden', 'false');
  }

  function closeModal() {
    if (!modalBackdrop) return;
    modalBackdrop.classList.remove('active');
    document.body.style.overflow = '';
    modalBackdrop.setAttribute('aria-hidden', 'true');
  }

  requestBtn?.addEventListener('click', openModal);
  modalCancel?.addEventListener('click', (e) => { e.preventDefault(); closeModal(); });
  modalSubmit?.addEventListener('click', (e) => {
    e.preventDefault();
    alert('Request submitted successfully!');
    closeModal();
  });
  modalBackdrop?.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) closeModal();
  });

  /***** Fixed Carousel - allows first and last items to be selected *****/
  const carousel = document.getElementById('carousel');
  const btnPrev = document.querySelector('.carousel-arrow.prev');
  const btnNext = document.querySelector('.carousel-arrow.next');
  const carouselContainer = document.querySelector('.carousel-container');

  if (carousel && carouselContainer) {
    let slides = Array.from(carousel.querySelectorAll('.slide'));
    let currentIndex = 0;
    let slideWidth = 0;
    let visibleSlides = 1;
    let gap = 20;

    function calculateDimensions() {
      slides = Array.from(carousel.querySelectorAll('.slide'));
      if (slides.length === 0) {
        slideWidth = 0;
        visibleSlides = 1;
        return;
      }
      const cs = window.getComputedStyle(carousel);
      gap = parseFloat(cs.gap) || parseFloat(cs.columnGap) || 20;
      const rect = slides[0].getBoundingClientRect();
      slideWidth = rect.width + gap;
      const containerWidth = carouselContainer.clientWidth || carouselContainer.getBoundingClientRect().width;
      visibleSlides = Math.max(1, Math.floor(containerWidth / slideWidth));
      visibleSlides = Math.min(visibleSlides, slides.length);
    }

    function updateButtons() {
      if (btnPrev) btnPrev.disabled = currentIndex <= 0;
      if (btnNext) btnNext.disabled = currentIndex >= slides.length - 1;
    }

    function updateCarousel(animate = true) {
      calculateDimensions();
      
      // Allow navigation to show each individual slide as the active one
      currentIndex = Math.max(0, Math.min(currentIndex, slides.length - 1));
      
      // Calculate the translation to center the current slide
      const containerWidth = carouselContainer.clientWidth;
      const slideCenter = slideWidth * currentIndex + (slideWidth - gap) / 2;
      const containerCenter = containerWidth / 2;
      let translateX = containerCenter - slideCenter;
      
      // Constrain translation to not show empty space
      const maxTranslate = 0;
      const minTranslate = containerWidth - (slides.length * slideWidth - gap);
      translateX = Math.max(minTranslate, Math.min(maxTranslate, translateX));
      
      if (!animate) carousel.style.transition = 'none';
      else carousel.style.transition = '';
      carousel.style.transform = `translateX(${translateX}px)`;
      if (!animate) requestAnimationFrame(() => { carousel.style.transition = ''; });
      
      // Update active state - only the current index slide is active
      slides.forEach((s, i) => {
        s.classList.toggle('active', i === currentIndex);
        s.setAttribute('aria-hidden', 'false'); // Keep all slides accessible
      });
      
      updateButtons();
    }

    btnPrev?.addEventListener('click', () => {
      if (currentIndex > 0) {
        currentIndex--;
        updateCarousel();
        slides[currentIndex]?.focus();
      }
    });

    btnNext?.addEventListener('click', () => {
      if (currentIndex < slides.length - 1) {
        currentIndex++;
        updateCarousel();
        slides[currentIndex]?.focus();
      }
    });

    // Touch/swipe handling
    let startX = 0;
    let isTouching = false;
    carousel.addEventListener('touchstart', (ev) => {
      if (!ev.touches || ev.touches.length === 0) return;
      startX = ev.touches[0].clientX; 
      isTouching = true; 
      carousel.style.transition = 'none';
    }, { passive: true });

    carousel.addEventListener('touchend', (ev) => {
      if (!isTouching) return;
      const endX = (ev.changedTouches && ev.changedTouches[0] && ev.changedTouches[0].clientX) || startX;
      const diff = startX - endX; 
      const threshold = 50;
      carousel.style.transition = '';
      if (Math.abs(diff) > threshold) {
        if (diff > 0 && currentIndex < slides.length - 1) currentIndex++;
        else if (diff < 0 && currentIndex > 0) currentIndex--;
        updateCarousel();
      } else updateCarousel();
      isTouching = false;
    }, { passive: true });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        if (currentIndex > 0) { 
          currentIndex--; 
          updateCarousel(); 
          slides[currentIndex]?.focus(); 
        }
      } else if (e.key === 'ArrowRight') {
        if (currentIndex < slides.length - 1) { 
          currentIndex++; 
          updateCarousel(); 
          slides[currentIndex]?.focus(); 
        }
      } else if (e.key === 'Escape' && modalBackdrop?.classList.contains('active')) {
        closeModal();
      }
    });

    let resizeTimer = null;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => { updateCarousel(false); }, 80);
    });

    window.addEventListener('load', () => { updateCarousel(false); });
    setTimeout(() => { updateCarousel(false); }, 50);
  }

  /***** Video overlay *****/
  const promoVideo = document.getElementById('promoVideo');
  const overlayBtn = document.getElementById('videoOverlay');

  function updateOverlay(){
    if(!promoVideo || !overlayBtn) return;
    overlayBtn.style.display = promoVideo.paused ? 'flex' : 'none';
  }

  overlayBtn?.addEventListener('click', function(){
    if(!promoVideo) return;
    if(promoVideo.paused) promoVideo.play();
    else promoVideo.pause();
    updateOverlay();
  });

  promoVideo?.addEventListener('click', function(){
    if(promoVideo.paused) promoVideo.play();
    else promoVideo.pause();
    updateOverlay();
  });

  promoVideo?.addEventListener('play', updateOverlay);
  promoVideo?.addEventListener('pause', updateOverlay);
  updateOverlay();

}); // DOMContentLoaded end

// Clear contact form inputs on submit
const contactForm = document.getElementById('contactForm');
const contactSubmitBtn = document.getElementById('contactSubmitBtn');

if (contactForm) {
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();

    // Optionally -- basic client-side validation could go here.
    // For now, simply clear the inputs as requested.
    const name = document.getElementById('contactName');
    const email = document.getElementById('contactEmail');
    const message = document.getElementById('contactMessage');

    if (name) name.value = '';
    if (email) email.value = '';
    if (message) message.value = '';

    // give user a quick feedback (temporary)
    if (contactSubmitBtn) {
      const prev = contactSubmitBtn.textContent;
      contactSubmitBtn.textContent = 'Submitted';
      contactSubmitBtn.disabled = true;
      setTimeout(() => {
        contactSubmitBtn.textContent = prev;
        contactSubmitBtn.disabled = false;
      }, 1500);
    }
  });
}
