var form = document.getElementById("loginForm");
var nompr = document.getElementById("nompr");
var numtel = document.getElementById("numtel");
var mail = document.getElementById("mail");
var ville = document.getElementById("ville");
var address = document.getElementById("address");

// --- Full Name ---
nompr?.addEventListener("input", function () {
    if (!alpha(nompr.value)) {
        setInvalid(nompr);
        showError("nompr", "invalid_name");
    } else {
        setValid(nompr);
        clearError("nompr");
    }
});

// --- Phone Number ---
numtel?.addEventListener("input", function () {
    if (!isEightDigits(numtel.value)) {
        setInvalid(numtel);
        showError("numtel", "invalid_numtel");
    } else {
        setValid(numtel);
        clearError("numtel");
    }
});

// --- Address ---
address?.addEventListener("input", function () {
    if (!isValidAddress(address.value)) {
        setInvalid(address);
        showError("address", "invalid_address");
    } else {
        setValid(address);
        clearError("address");
    }
});

// --- Email ---
mail?.addEventListener("input", function () {
    if (!validateEmail(mail.value)) {
        setInvalid(mail);
        showError("mail", "invalid_mail");
    } else {
        setValid(mail);
        clearError("mail");
    }
});

// --- City ---
ville?.addEventListener("input", function () {
    if (!alpha(ville.value)) {
        setInvalid(ville);
        showError("ville", "invalid_ville");
    } else {
        setValid(ville);
        clearError("ville");
    }
});

// --- Validation functions ---
function alpha(str) {
    return /^[A-Za-z\s]+$/.test(str) && str.trim().length > 2;
}
function isEightDigits(value) {
    return /^\d{8}$/.test(value);
}
function validateEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}
function isValidAddress(value) {
    return value.trim().length >= 5;
}

// --- Form submit ---
form?.addEventListener("submit", function (event) {
    let valid = true;

    if (!alpha(nompr.value)) { setInvalid(nompr); showError("nompr", "invalid_name"); valid=false; }
    if (!isEightDigits(numtel.value)) { setInvalid(numtel); showError("numtel", "invalid_numtel"); valid=false; }
    if (!validateEmail(mail.value)) { setInvalid(mail); showError("mail", "invalid_mail"); valid=false; }
    if (!alpha(ville.value)) { setInvalid(ville); showError("ville", "invalid_ville"); valid=false; }
    if (!isValidAddress(address.value)) { setInvalid(address); showError("address", "invalid_address"); valid=false; }

    if (!valid) event.preventDefault();
});

// --- Style helpers ---
function setValid(field) { field.classList.add("valid"); field.classList.remove("invalid"); }
function setInvalid(field) { field.classList.remove("valid"); field.classList.add("invalid"); }
function showError(fieldId, errorKey) {
    const div = document.getElementById(`error-${fieldId}`);
    if (!div) return;
    div.textContent = i18next.t(errorKey);
    div.style.display = "block";
    div.style.opacity = "1";
}
function clearError(fieldId) {
    const div = document.getElementById(`error-${fieldId}`);
    if (!div) return;
    div.textContent = "";
    div.style.display = "none";
    div.style.opacity = "1";
}