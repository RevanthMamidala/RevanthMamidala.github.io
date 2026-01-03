// scripts/mosaic.js
document.addEventListener("DOMContentLoaded", () => {
  const galleryContainer = document.getElementById("photoGallery");
  const indicatorsContainer = document.getElementById("indicators");
  const prevArrow = document.querySelector(".arrow-left");
  const nextArrow = document.querySelector(".arrow-right");

  // Safety guard
  if (!galleryContainer || !indicatorsContainer || !prevArrow || !nextArrow) {
    return;
  }

  const images = Array.from(
    galleryContainer.querySelectorAll(".gallery-image")
  );

  // No images, nothing to do
  if (!images.length) return;

  let slideIndex = 0;

  // ----------------------------
  // Show slide
  // ----------------------------
  function showSlide(index) {
    slideIndex = (index + images.length) % images.length;

    images.forEach((img, i) => {
      img.classList.toggle("active", i === slideIndex);
    });

    const dots = indicatorsContainer.querySelectorAll(".indicator");
    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === slideIndex);
    });
  }

  // ----------------------------
  // Navigation
  // ----------------------------
  function nextSlide() {
    showSlide(slideIndex + 1);
  }

  function prevSlide() {
    showSlide(slideIndex - 1);
  }

  // ----------------------------
  // Indicators (dots)
  // ----------------------------
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

  // ----------------------------
  // Event listeners
  // ----------------------------
  prevArrow.addEventListener("click", prevSlide);
  nextArrow.addEventListener("click", nextSlide);

  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") prevSlide();
    if (e.key === "ArrowRight") nextSlide();
  });

  // ----------------------------
  // Init
  // ----------------------------
  initializeIndicators();
  showSlide(0);

  // Disable arrows if only one image
  if (images.length <= 1) {
    prevArrow.disabled = true;
    nextArrow.disabled = true;
  }
});
