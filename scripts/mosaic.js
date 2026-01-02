// scripts/mosaic.js
document.addEventListener("DOMContentLoaded", () => {
  const galleryPath = "./PhotoGallery/";
  const maxImages = 10;

  const availableImages = [
    "Revath_Mamidala.png",
    "Revath_Mamidala - Copy.png",
    "7ZA04122.jpg",
    "20230618_131906.jpg",
    "1000003605.JPEG",
    "Revath Formal Image.jpeg"
  ];

  const galleryContainer = document.getElementById("photoGallery");
  const indicatorsContainer = document.getElementById("indicators");

  let images = [];
  let slideIndex = 0;

  function showSlide(n) {
    if (!images.length) return;

    slideIndex = (n + images.length) % images.length;

    images.forEach(img => img.classList.remove("active"));
    images[slideIndex].classList.add("active");

    document.querySelectorAll(".indicator").forEach((dot, i) => {
      dot.classList.toggle("active", i === slideIndex);
    });
  }

  function nextSlide() {
    showSlide(slideIndex + 1);
  }

  function prevSlide() {
    showSlide(slideIndex - 1);
  }

  function shuffleArray(arr) {
    return [...arr].sort(() => Math.random() - 0.5);
  }

  function initializeGallery() {
    galleryContainer.innerHTML = "";
    indicatorsContainer.innerHTML = "";

    const selectedImages = shuffleArray(availableImages).slice(0, maxImages);
    const loading = galleryContainer.querySelector(".loading-message");
    if (loading) loading.remove();

    selectedImages.forEach((file, index) => {
      const img = document.createElement("img");
      img.src = `${galleryPath}${file}`;
      img.alt = `Gallery image ${index + 1}`;
      img.className = "gallery-image";
      if (index === 0) img.classList.add("active");

      galleryContainer.appendChild(img);
      images.push(img);

      const dot = document.createElement("div");
      dot.className = "indicator";
      if (index === 0) dot.classList.add("active");
      dot.addEventListener("click", () => showSlide(index));

      indicatorsContainer.appendChild(dot);
    });
  }

  document.querySelector(".arrow-left").addEventListener("click", prevSlide);
  document.querySelector(".arrow-right").addEventListener("click", nextSlide);

  document.addEventListener("keydown", e => {
    if (e.key === "ArrowLeft") prevSlide();
    if (e.key === "ArrowRight") nextSlide();
  });

  initializeGallery();
});