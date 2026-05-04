let index = 0;
const slides = document.getElementById("slides");
const total = document.querySelectorAll(".slide").length;

function update() {
  slides.style.transform = `translateX(-${index * 100}%)`;
}

function next() {
  index = (index + 1) % total;
  update();
}

function prev() {
  index = (index - 1 + total) % total;
  update();
}

/* Auto slide every 10s */
setInterval(next, 10000);