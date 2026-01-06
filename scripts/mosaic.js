document.addEventListener("DOMContentLoaded", () => {
  const galleryContainer = document.getElementById("photoGallery");
  const indicatorsContainer = document.getElementById("indicators");
  const prevArrow = document.querySelector(".arrow-left");
  const nextArrow = document.querySelector(".arrow-right");

  // Safety guard
  if (!galleryContainer || !indicatorsContainer || !prevArrow || !nextArrow) {
    return;
  }

  // Add image paths (update with actual image URLs or paths)
  const imagePaths = [
    'PhotoGallery/1Z0A6122.jpg',
    'PhotoGallery/20230618_131906.jpg',
    'PhotoGallery/1000003650.JPEG'
  ];

  galleryContainer.innerHTML = ''; // Clear loading message

  imagePaths.forEach((src, index) => {
    const img = document.createElement('img');
    img.src = src;
    img.alt = `Slide ${index + 1}`;
    img.className = 'gallery-image';
    galleryContainer.appendChild(img);
  });

  // Get all gallery images that are already in the DOM
  const images = Array.from(
    galleryContainer.querySelectorAll(".gallery-image")
  );

  if (!images.length) return;

  let slideIndex = 0;

  // Core slide logic (similar to the remembered script)
  function showSlide(index) {
    // Wrap around using modulo
    slideIndex = (index + images.length) % images.length;

    // Update images
    images.forEach((img, i) => {
      img.classList.toggle("active", i === slideIndex);
    });

    // Update indicators
    const dots = indicatorsContainer.querySelectorAll(".indicator");
    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === slideIndex);
    });
  }

  function nextSlide() {
    showSlide(slideIndex + 1);
  }

  function prevSlide() {
    showSlide(slideIndex - 1);
  }

  function initializeIndicators() {
    indicatorsContainer.innerHTML = "";

    images.forEach((_, index) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "indicator";
      dot.setAttribute("aria-label", `Go to slide ${index + 1}`);

      dot.addEventListener("click", () => {
        showSlide(index);
      });

      indicatorsContainer.appendChild(dot);
    });
  }

  // Correct wiring: left arrow = prevSlide, right arrow = nextSlide
  prevArrow.addEventListener("click", prevSlide);
  nextArrow.addEventListener("click", nextSlide);

  // Keyboard navigation
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") prevSlide();
    if (e.key === "ArrowRight") nextSlide();
  });

  // Init
  initializeIndicators();
  showSlide(0);

  // Disable arrows if only one image
  if (images.length <= 1) {
    prevArrow.disabled = true;
    nextArrow.disabled = true;
  }
});
