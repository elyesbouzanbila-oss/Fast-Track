// Toggle hamburger button & sidebar
const menuToggleButton = document.querySelector('.menu-toggle');
const sidebar = document.querySelector('.sidebar');

menuToggleButton.addEventListener('click', function() {
    sidebar.classList.toggle('active'); // Show/hide sidebar
    // Change button text X/O
    this.textContent = this.textContent === '☰' ? '✖' : '☰';
});

// Toggle submenus (menu groups)
function toggleMenueee(menuId, headerElement) {
    const submenu = document.getElementById(menuId);
    const arrow = headerElement.querySelector('.arrow');
    if (!submenu || !arrow) return;

    // Show/hide submenu
    submenu.style.display = submenu.style.display === 'flex' ? 'none' : 'flex';
    arrow.classList.toggle('rotate');
}