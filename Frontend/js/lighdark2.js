const btn = document.getElementById("theme-toggle");
const icon = document.getElementById("themeIcon");

btn?.addEventListener("click", changerTheme); // safe check

function toggleSheet(linkEl, fileA, fileB, storageKey) {
    if (!linkEl) return;
    const current = linkEl.getAttribute("href") || "";
    const next = current.endsWith(fileA) ? fileB : fileA;
    const nextHref = `../css/${next}`;
    linkEl.setAttribute("href", nextHref);
    if (storageKey) localStorage.setItem(storageKey, nextHref);
}

function changerTheme() {

    let hp = document.getElementById("hp");
    let himg = document.getElementById("homeimg");
    let scrole = document.getElementById("scrole");
    let ii = document.getElementById("ii");
    let typrot = document.getElementById("typrot");
    let mapStyle = document.getElementById("map-style");

    // ✅ toggle each stylesheet while preserving valid ../css paths
    toggleSheet(hp, "home page.css", "home page2.css", "hp");
    toggleSheet(himg, "homeimg.css", "homeimg2.css", "himg");
    toggleSheet(scrole, "scrole.css", "scrole2.css", "scrole");
    toggleSheet(ii, "ii.css", "ii2.css", "ii");
    toggleSheet(typrot, "typing rotating.css", "typing rotating2.css", "typrot");
    toggleSheet(mapStyle, "map.css", "map2.css", "map");


    // ✅ optional icon toggle
    if (icon) {
        icon.classList.toggle("fa-moon");
        icon.classList.toggle("fa-sun");
    }
}