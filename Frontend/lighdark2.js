const btn = document.getElementById("theme-toggle");
const icon = document.getElementById("themeIcon");

btn?.addEventListener("click", changerTheme); // safe check

function changerTheme() {

    let hp = document.getElementById("hp");
    let himg = document.getElementById("homeimg");
    let scrole = document.getElementById("scrole");
    let ii = document.getElementById("ii");
    let typrot = document.getElementById("typrot");
    let map = document.getElementById("map");

    // ✅ toggle each stylesheet if it exists
    if (hp) {
        hp.setAttribute(
            "href",
            hp.getAttribute("href") === "home page.css"
                ? "home page2.css"
                : "home page.css"
        );
        localStorage.setItem("hp", hp.getAttribute("href"));
    }

    if (himg) {
        himg.setAttribute(
            "href",
            himg.getAttribute("href") === "homeimg.css"
                ? "homeimg2.css"
                : "homeimg.css"
        );
        localStorage.setItem("himg", himg.getAttribute("href"));
    }

    if (scrole) {
        scrole.setAttribute(
            "href",
            scrole.getAttribute("href") === "scrole.css"
                ? "scrole2.css"
                : "scrole.css"
        );
        localStorage.setItem("scrole", scrole.getAttribute("href"));
    }

    if (ii) {
        ii.setAttribute(
            "href",
            ii.getAttribute("href") === "ii.css"
                ? "ii2.css"
                : "ii.css"
        );
        localStorage.setItem("ii", ii.getAttribute("href"));
    }

    if (typrot) {
        typrot.setAttribute(
            "href",
            typrot.getAttribute("href") === "typing rotating.css"
                ? "typing rotating2.css"
                : "typing rotating.css"
        );
        localStorage.setItem("typrot", typrot.getAttribute("href"));
    }
    if (map) {
        map.setAttribute(
            "href",
            map.getAttribute("href") === "map.css"
                ? "map2.css"
                : "map.css"
        );
        localStorage.setItem("map", map.getAttribute("href"));
    }


    // ✅ optional icon toggle
    if (icon) {
        icon.classList.toggle("fa-moon");
        icon.classList.toggle("fa-sun");
    }
}