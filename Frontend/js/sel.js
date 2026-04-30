<script src="https://cdn.jsdelivr.net/npm/choices.js/public/assets/scripts/choices.min.js"></script>

function initChoices(id, placeholder, scrollThreshold = 4, scrollHeight = 200) {
  const element = document.getElementById(id);
  const choices = new Choices(element, {
    searchEnabled: true,
    itemSelectText: '',
    removeItemButton: true,
    shouldSort: false,
    placeholder: true,
    placeholderValue: placeholder
  });

  // Ajouter variable CSS pour stagger automatique
  const dropdownWrapper = element.closest('.choices');
  dropdownWrapper.addEventListener('showDropdown', () => {
    const items = dropdownWrapper.querySelectorAll('.choices__list--dropdown .choices__item--selectable');
    items.forEach((item, index) => item.style.setProperty('--i', index));

    // Appliquer scroll si le nombre d'options dépasse le seuil
    if (element.options.length > scrollThreshold) {
      const dropdown = dropdownWrapper.querySelector('.choices__list--dropdown');
      dropdown.style.maxHeight = scrollHeight + 'px';
      dropdown.style.overflowY = 'auto';
    } else {
      const dropdown = dropdownWrapper.querySelector('.choices__list--dropdown');
      dropdown.style.maxHeight = '';
      dropdown.style.overflowY = '';
    }
  });
}
document.addEventListener('DOMContentLoaded', () => {
  initChoices('advancedSelect', 'type de réclamation');
  initChoices('advancedSelect2', 'type transport');
  initChoices('advancedSelect3', 'ville');
});

