// scripts/mosaic.js
document.addEventListener('DOMContentLoaded', () => {
  const galleryPath = './PhotoGallery/';
  const maxImages = 10;

  const availableImages = [
    'Revanth_Mamidala - Copy.png',
    'Revanth_Mamidala.png',
    '1Z0A6122.jpg',
    '20230618_131906.jpg',
    '1000003650.JPEG',
    'Revanth Formal Image.jpeg'
  ];

  const galleryContainer = document.getElementById('photoGallery');
  const indicatorsContainer = document.getElementById('indicators');
  let slideIndex = 0;
  let images = [];

  function showSlide(n) {
    if (images.length === 0) return;

    slideIndex = (n + images.length) % images.length;

    images.forEach(img => img.classList.remove('active'));
    images[slideIndex].classList.add('active');

    document.querySelectorAll('.indicator').forEach((dot, i) => {
      dot.classList.toggle('active', i === slideIndex);
    });
  }

  function nextSlide() { showSlide(slideIndex + 1); }
  function prevSlide() { showSlide(slideIndex - 1); }

  function goToSlide(n) { showSlide(n); }

  function shuffleArray(arr) {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function initializeGallery() {
    const selectedImages = shuffleArray(availableImages).slice(0, maxImages);
    galleryContainer.innerHTML = '';
    images = [];

    selectedImages.forEach((file, idx) => {
      const img = document.createElement('img');
      img.src = `${galleryPath}${file}`;
      img.alt = `Gallery Image ${idx + 1}`;
      img.className = 'gallery-image';
      if (idx === 0) img.classList.add('active');
      galleryContainer.appendChild(img);
      images.push(img);
    });

    // Create indicators
    indicatorsContainer.innerHTML = '';
    selectedImages.forEach((_, i) => {
      const dot = document.createElement('div');
      dot.className = 'indicator' + (i === 0 ? ' active' : '');
      dot.addEventListener('click', () => goToSlide(i));
      indicatorsContainer.appendChild(dot);
    });
  }

  document.querySelector('.arrow-left').addEventListener('click', prevSlide);
  document.querySelector('.arrow-right').addEventListener('click', nextSlide);
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') prevSlide();
    if (e.key === 'ArrowRight') nextSlide();
  });

  initializeGallery();
});
