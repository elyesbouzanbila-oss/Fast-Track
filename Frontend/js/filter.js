

let currentStatus = "all";

function filterRoutes(status) {
  currentStatus = status;
  applyFilters();

  document.querySelectorAll(".filter-buttons button")
    .forEach(btn => btn.classList.remove("active"));

  event.target.classList.add("active");
}

function applyFilters() {
  const routes = document.querySelectorAll(".route");
  const fromSelect = document.getElementById("fromCity");
  const toSelect = document.getElementById("toCity");
  const from = fromSelect ? fromSelect.value : "all";
  const to = toSelect ? toSelect.value : "all";

  routes.forEach(route => {
    const routeFrom = route.dataset.from;
    const routeTo = route.dataset.to;

    const matchStatus =
      currentStatus === "all" || route.classList.contains(currentStatus);

    const matchFrom =
      from === "all" || routeFrom === from;

    const matchTo =
      to === "all" || routeTo === to;

    if (matchStatus && matchFrom && matchTo) {
      route.style.display = "block";
    } else {
      route.style.display = "none";
    }
  });
}



