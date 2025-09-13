// ...new file...
// Shared loader + small component initializers

// Load an HTML fragment into #content and initialize features inside it
async function loadContent(path) {
    try {
        const res = await fetch(path);
        if (!res.ok) throw new Error(`Failed to load ${path}: ${res.status}`);
        const html = await res.text();
        const container = document.getElementById('content');
        if (!container) return console.warn('#content element not found');
        container.innerHTML = html;
        // allow browser to parse inserted HTML, then init components
        requestAnimationFrame(() => {
            initializeGallery();
            initializeModals();
        });
    } catch (err) {
        console.error(err);
        const container = document.getElementById('content');
        if (container) container.innerHTML = `<p style="color:#900">Error loading content.</p>`;
    }
}

// Initialize photo gallery if a #photoGallery element exists in the fragment
function initializeGallery() {
    const gallery = document.getElementById('photoGallery');
    if (!gallery) return;

    // determine image sources:
    // 1) data-images on the #photoGallery (pipe-separated full URLs)
    // 2) fallback to window.galleryPath + window.availableImages (filenames)
    let srcs = [];
    if (gallery.dataset.images) {
        srcs = gallery.dataset.images.split('|').map(s => s.trim()).filter(Boolean);
    } else if (window.galleryPath && Array.isArray(window.availableImages)) {
        srcs = window.availableImages.map(n => window.galleryPath + n);
    } else {
        // nothing to load
        const msg = gallery.querySelector('.loading-message');
        if (msg) msg.textContent = 'No images configured.';
        return;
    }

    const container = gallery;
    container.innerHTML = ''; // clear placeholder
    const images = [];
    srcs.forEach((src, i) => {
        const img = document.createElement('img');
        img.src = src;
        img.alt = `image-${i+1}`;
        img.className = 'gallery-image' + (i === 0 ? ' active' : '');
        container.appendChild(img);
        images.push(img);
    });

    // indicators
    const indicatorsWrap = document.getElementById('indicators');
    if (indicatorsWrap) {
        indicatorsWrap.innerHTML = '';
        srcs.forEach((_, idx) => {
            const dot = document.createElement('span');
            dot.className = 'indicator' + (idx === 0 ? ' active' : '');
            dot.addEventListener('click', () => showSlide(idx));
            indicatorsWrap.appendChild(dot);
        });
    }

    let index = 0;
    function showSlide(n) {
        if (images.length === 0) return;
        index = ((n % images.length) + images.length) % images.length;
        images.forEach((im, i) => im.classList.toggle('active', i === index));
        const dots = indicatorsWrap ? indicatorsWrap.querySelectorAll('.indicator') : [];
        dots.forEach((d, i) => d.classList.toggle('active', i === index));
    }

    // arrow controls (look for arrows inside the same parent `.photo-gallery-container`)
    const containerWrapper = gallery.closest('.photo-gallery-container');
    if (containerWrapper) {
        const left = containerWrapper.querySelector('.arrow-left');
        const right = containerWrapper.querySelector('.arrow-right');
        if (left) left.addEventListener('click', () => showSlide(index - 1));
        if (right) right.addEventListener('click', () => showSlide(index + 1));
    }

    // expose small API if needed
    gallery._showSlide = showSlide;
}

// Minimal modal initializer (sections can use data-modal-target)
function initializeModals() {
    // close modals by clicking outside (elements with class .modal expected)
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
                document.body.style.overflow = '';
            }
        });
    });

    // bind elements with data-modal-target
    document.querySelectorAll('[data-modal-target]').forEach(btn => {
        btn.addEventListener('click', () => {
            const sel = btn.dataset.modalTarget;
            const modal = document.querySelector(sel);
            if (modal) {
                modal.style.display = 'block';
                document.body.style.overflow = 'hidden';
            }
        });
    });
}

// Expose loader globally so nav links can call it
window.loadContent = loadContent;
window.initializeGallery = initializeGallery;
window.initializeModals = initializeModals;

// Optionally load the default section on first load (uncomment or call from index)
// document.addEventListener('DOMContentLoaded', () => loadContent('about_me_section.html'));