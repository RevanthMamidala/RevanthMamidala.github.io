// main.js – Modular loader, photo gallery, and modal initializers

(() => {
  // ---------- Content Loader ----------
  async function loadContent(path) {
    const container = document.getElementById('content');
    if (!container) return console.warn('#content element not found');
    try {
      const res = await fetch(path);
      if (!res.ok) throw new Error(`Failed to load ${path}: ${res.status}`);
      const html = await res.text();
      // Remove all events from contained galleries/modals in previous content
      removeEventChildren(container);
      container.innerHTML = html;
      // Initialize features
      requestAnimationFrame(() => {
        initializeGalleries(container);
        initializeModals(container);
      });
    } catch (err) {
      console.error(err);
      container.innerHTML = `<p style="color:#900">Error loading content.</p>`;
    }
  }

  // ---------- Gallery (multi-instance, lazy-load, accessible) ----------
  function initializeGalleries(scope = document) {
    scope.querySelectorAll('.photo-gallery').forEach(gallery => initGallery(gallery));
  }

  function initGallery(gallery) {
    const dataImages = gallery.dataset.images;
    let srcs = [];
    if (dataImages) {
      srcs = dataImages.split('|').map(s => s.trim()).filter(Boolean);
    } else if (window.galleryPath && Array.isArray(window.availableImages)) {
      srcs = window.availableImages.map(n => window.galleryPath + n);
    } else {
      const msg = gallery.querySelector('.loading-message');
      if (msg) msg.textContent = 'No images configured.';
      return;
    }

    gallery.innerHTML = ''; // clear placeholder
    let index = 0;
    const slides = srcs.map((src, i) => {
      const img = document.createElement('img');
      img.src = src;
      img.alt = `Photo ${i + 1}`;
      img.className = 'gallery-image' + (i === 0 ? ' active' : '');
      img.loading = "lazy"; // lazy-load!
      gallery.appendChild(img);
      return img;
    });

    // Controls
    const arrowL = document.createElement('button');
    arrowL.className = 'arrow arrow-left';
    arrowL.innerHTML = '&#8592;';
    const arrowR = document.createElement('button');
    arrowR.className = 'arrow arrow-right';
    arrowR.innerHTML = '&#8594;';
    gallery.appendChild(arrowL);
    gallery.appendChild(arrowR);

    // Indicators
    const indicators = document.createElement('div');
    indicators.className = 'gallery-indicators';
    slides.forEach((_, i) => {
      const dot = document.createElement('span');
      dot.className = 'indicator' + (i === 0 ? ' active' : '');
      dot.tabIndex = 0;
      dot.setAttribute('aria-label', `Go to image ${i + 1}`);
      dot.addEventListener('click', () => showSlide(i));
      indicators.appendChild(dot);
    });
    gallery.appendChild(indicators);

    function showSlide(n) {
      index = ((n % slides.length) + slides.length) % slides.length;
      slides.forEach((im, i) => im.classList.toggle('active', i === index));
      indicators.querySelectorAll('.indicator').forEach((d, i) => d.classList.toggle('active', i === index));
      // Move focus for accessibility
      slides[index].focus && slides[index].focus();
    }

    arrowL.addEventListener('click', () => showSlide(index - 1));
    arrowR.addEventListener('click', () => showSlide(index + 1));

    // Keyboard controls (arrow keys, ESC to blur)
    gallery.tabIndex = 0;
    gallery.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight') { showSlide(index + 1); }
      else if (e.key === 'ArrowLeft') { showSlide(index - 1); }
      else if (e.key === 'Escape') { gallery.blur(); }
    });

    // Expose API if needed
    gallery._showSlide = showSlide;
  }

  // ---------- Modal Initializer (multi-instance, accessible) ----------
  function initializeModals(scope = document) {
    scope.querySelectorAll('.modal').forEach(modal => {
      // Remove old event first if re-inited
      modal.replaceWith(modal.cloneNode(true)); // simple deep copy to clear listeners
    });
    // Modal overlay click to close
    scope.querySelectorAll('.modal').forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal(modal);
      });
    });
    // Modal opener
    scope.querySelectorAll('[data-modal-target]').forEach(btn => {
      btn.addEventListener('click', () => {
        const sel = btn.dataset.modalTarget;
        const modal = document.querySelector(sel);
        if (modal) openModal(modal);
      });
    });
  }

  function openModal(modal) {
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    // Keyboard esc to close
    modal.addEventListener('keydown', escClose);
    modal.tabIndex = 0;
    modal.focus();
  }
  function closeModal(modal) {
    modal.style.display = 'none';
    document.body.style.overflow = '';
    modal.removeEventListener('keydown', escClose);
  }
  function escClose(e) {
    if (e.key === 'Escape') {
      closeModal(e.target);
    }
  }

  // ---------- Clean up all events in removed content ----------
  function removeEventChildren(node) {
    node.querySelectorAll('*').forEach(el => el.replaceWith(el.cloneNode(true)));
  }

  // ---------- Expose only loader globally ----------
  window.loadContent = loadContent;

  // Optional: load a default section on start
  // document.addEventListener('DOMContentLoaded', () => loadContent('about_me_section.html'));

})();
