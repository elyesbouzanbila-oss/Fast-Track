// Login validation - this file is now handled by the inline script in login1.html
// Keeping this minimal to avoid conflicts

const errorMessage = document.getElementById("errorMessage");

function showError(message) {
  if (errorMessage) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
  }
}

function hideError() {
  if (errorMessage) {
    errorMessage.textContent = '';
    errorMessage.style.display = 'none';
  }
}

// Password validation rules
function estMotDePasseValide(password) {
  if (password.length < 8 || /\s/.test(password)) return false;
  return (
    /[a-z]/.test(password) &&
    /[A-Z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[!@#$%^&*(),.?":{}|<>_\-\\\/[\]=+]/.test(password)
  );
}
