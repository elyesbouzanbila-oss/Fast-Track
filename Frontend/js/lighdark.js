const btn = document.getElementById("changeTheme");
const icon = document.getElementById("themeIcon");

btn?.addEventListener("click", changerStyle); // ✅ safe: only if btn exists

function syncThemeState() {
    const test = document.getElementById("test");
    const isLight = (test?.getAttribute("href") || "").endsWith("test2.css");
    document.body.dataset.theme = isLight ? "light" : "dark";

    document.querySelectorAll("body.signup-page .bg, body.login-page .bg").forEach((panel) => {
        if (isLight) {
            panel.style.background = "rgba(247, 249, 252, 0.94)";
        } else {
            panel.style.background = "transparent";
        }
        panel.style.border = "none";
        panel.style.outline = "none";
        panel.style.outlineOffset = "0px";
        panel.style.boxShadow = "none";
    });
}

function toggleSheet(linkEl, fileA, fileB) {
    if (!linkEl) return;
    const current = linkEl.getAttribute("href") || "";
    const next = current.endsWith(fileA) ? fileB : fileA;
    linkEl.setAttribute("href", `../css/${next}`);
}

function changerStyle() {

    let test = document.getElementById("test");
    let select = document.getElementById("select-style");
    let error = document.getElementById("error-style");
    let form = document.getElementById("form-style");
    let form1 = document.getElementById("form1-style");
    let nav = document.getElementById("nav-style");
    let sel = document.getElementById("sel-style");
    let uploadimage = document.getElementById("uploadimage-style");
    let textarea = document.getElementById("textarea-style");
    let modif = document.getElementById("modif-style");
    let modif2 = document.getElementById("modif2-style");

    // ✅ keep valid relative paths while toggling theme files
    toggleSheet(select, "select.css", "select2.css");
    toggleSheet(error, "erroe.css", "erroe2.css");
    toggleSheet(test, "test.css", "test2.css");
    toggleSheet(form, "form.css", "form2.css");
    toggleSheet(form1, "form1.css", "form3.css");
    // login1.html uses img.css on this id; keep it stable there.
    if (nav) {
        const navHref = nav.getAttribute("href") || "";
        if (navHref.endsWith("img.css")) {
            nav.setAttribute("href", "../css/img.css");
        } else {
            toggleSheet(nav, "nav.css", "nav2.css");
        }
    }
    toggleSheet(sel, "sel.css", "sel2.css");
    toggleSheet(uploadimage, "uploadimage.css", "uploadimage2.css");
    toggleSheet(textarea, "textarea.css", "textarea2.css");
    toggleSheet(modif, "modif.css", "modification.css");
    toggleSheet(modif2, "modif2.css", "modification2.css");

    if (icon) {
        icon.classList.toggle("fa-moon");
        icon.classList.toggle("fa-sun");
    }

    syncThemeState();
}

syncThemeState();