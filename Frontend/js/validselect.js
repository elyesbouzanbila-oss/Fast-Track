const form = document.getElementById('loginForm');

// Fonction de validation complète au moment de la soumission
form.addEventListener('submit', function(e) {
    let valid = true;

    const select1 = document.getElementById('advancedSelect');
    const select2 = document.getElementById('advancedSelect2');
    const select3 = document.getElementById('advancedSelect3');

    clearError('sel1');
    clearError('sel2');
    clearError('sel3');

    if (select1.value === "") {
        showError('sel1', 'error.select1');
        valid = false;
    }
    if (select2.value === "") {
        showError('sel2', 'error.select2');
        valid = false;
    }
    if (select3.value === "") {
        showError('sel3', 'error.select3');
        valid = false;
    }

    if (!valid) {
        e.preventDefault();
    }
});

// Fonction pour effacer l'erreur dès que l'utilisateur choisit quelque chose
['advancedSelect', 'advancedSelect2', 'advancedSelect3'].forEach((id, index) => {
    const select = document.getElementById(id);
    const fieldId = `sel${index + 1}`;

    select.addEventListener('change', function() {
        if (select.value !== "") {
            clearError(fieldId);
        }
    });
});

// Fonctions d'affichage des erreurs
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




// Initialisation i18next
i18next.init({
  lng: 'fr', // langue par défaut
  resources: {
    fr: {
      translation: {
        title_2: "Transport en Tunisie",
        submit_btn: "Envoyer",
        label_message: "Description du problème",
        img: "Cliquez pour télécharger une image",
        "error.select1": "Veuillez choisir un type de réclamation",
        "error.select2": "Veuillez choisir un type de transport",
        "error.select3": "Veuillez choisir une ville"
      }
    },
    en: {
      translation: {
        title_2: "Transport in Tunisia",
        submit_btn: "Submit",
        label_message: "Problem description",
        img: "Click to upload an image",
        "error.select1": "Please select a complaint type",
        "error.select2": "Please select a transport type",
        "error.select3": "Please select a city"
      }
    },
    ar: {
      translation: {
        title_2: "النقل في تونس",
        submit_btn: "إرسال",
        label_message: "وصف المشكلة",
        img: "انقر لتحميل صورة",
        "error.select1": "يرجى اختيار نوع الشكوى",
        "error.select2": "يرجى اختيار نوع النقل",
        "error.select3": "يرجى اختيار المدينة"
      }
    }
  }
}, function(err, t) {
  updateContent();
});

// Fonction pour mettre à jour le contenu
function updateContent() {
  document.querySelectorAll("[data-i18n]").forEach(el => {
    el.innerHTML = i18next.t(el.getAttribute("data-i18n"));
  });
}

// Changer la langue
function changeLanguage(lang) {
  i18next.changeLanguage(lang, () => {
    updateContent();

    // Gestion direction (arabe RTL)
    if (lang === "ar") {
      document.documentElement.setAttribute("dir", "rtl");
      document.body.classList.add("arabic");
    } else {
      document.documentElement.setAttribute("dir", "ltr");
      document.body.classList.remove("arabic");
    }
  });
}