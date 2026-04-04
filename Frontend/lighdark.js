const btn = document.getElementById("changeTheme");
const icon = document.getElementById("themeIcon");

btn?.addEventListener("click", changerStyle); // ✅ safe: only if btn exists

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

    // ✅ only change if element exists
    if (select) select.setAttribute("href", select.getAttribute("href") === "select.css" ? "select2.css" : "select.css");
    if (error) error.setAttribute("href", error.getAttribute("href") === "erroe.css" ? "erroe2.css" : "erroe.css");
    if (test) test.setAttribute("href", test.getAttribute("href") === "test.css" ? "test2.css" : "test.css");
    if (form) form.setAttribute("href", form.getAttribute("href") === "form.css" ? "form2.css" : "form.css");
    if (form1) form1.setAttribute("href", form1.getAttribute("href") === "form1.css" ? "form3.css" : "form1.css");
    if (nav) nav.setAttribute("href", nav.getAttribute("href") === "nav2.css" ? "nav.css" : "nav2.css");
    if (sel) sel.setAttribute("href", sel.getAttribute("href") === "sel.css" ? "sel2.css" : "sel.css");
    if (uploadimage) uploadimage.setAttribute("href", uploadimage.getAttribute("href") === "uploadimage.css" ? "uploadimage2.css" : "uploadimage.css");

    if (textarea) textarea.setAttribute("href", textarea.getAttribute("href") === "textarea.css" ? "textarea2.css" : "textarea.css");

    if (modif) modif.setAttribute("href", modif.getAttribute("href") === "modif.css" ? "modification.css" : "modif.css");

    if (modif2) modif2.setAttribute("href", modif2.getAttribute("href") === "modif2.css" ? "modification2.css" : "modif2.css");

    if (icon) {
        icon.classList.toggle("fa-moon");
        icon.classList.toggle("fa-sun");
    }
}