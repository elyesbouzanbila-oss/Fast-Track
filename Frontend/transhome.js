const languageSelect = document.getElementById('language-select'); // make sure the id matches your select



  // Example translations for your main titles and subtitle
  const translations = {
  en: {
    mainTitle: "Smart Transport System",
    subtitle: "Routes that adapt to weather conditions in real time",
    aboutTitle: "About the App",
    complaintsTitle: "Complaints",
    mapTitle: "Live Map",
    routesTitle: "Available Routes",
    complaininfo: "If you have any complaints please click the button below.",
    complainbutton: "Submit a Complaint",
    nav: {
      about: "About",
      map: "Map",
      routes: "Routes",
      complaints: "Complaints",
      contact: "Contact"
    },
    footer: {
  contactTitle: "Contact",
  address: "13 Rue Borjine 1073 – Montplaisir",
  follow: "Follow Us",
  links: "Links",
  terms: "Terms",
  privacy: "Privacy",
  sitemap: "Sitemap",
  feedbackTitle: "Feedback",
  feedbackText: "If you have any suggestions, please reach out. We appreciate your input!"
},
    buttons: {
      signin: "Sign In",
      signup: "Sign Up",
      all: "All",
      available: "Available",
      unavailable: "Unavailable",
      complaint: "Submit a Complaint",
      showRoute: "Show Route"
    },
    slides: {
  slide1: {
    title: "Why We Created This App",
    text1: "We developed this platform to address the ongoing transportation challenges in our country.",
    text2: "Our goal is to solve these everyday issues by providing clear, real-time information.",
    text3: "This app is designed for every Tunisian who relies on public transport.",
    text4: "We hope to make commuting easier, safer, and more predictable."
  },
  slide2: {
    title: "🚧 Route Unavailable",
    text1: "The route R2 is currently out of service due to operational issues.",
    text2: "This route will no longer appear until it is restored.",
    text3: "Important information for travelers:",
    list1: "Check for alternative routes.",
    list2: "Allow extra travel time.",
    list3: "Stay updated via our app.",
    text4: "We apologize for the inconvenience."
  },
  slide3: {
    title: "🌧️ Weather Alert: Heavy Rain",
    text1: "Some roads are unsafe due to heavy rain.",
    text2: "Impacted routes: R1, R3",
    text3: "Important safety advice:",
    list1: "Do not travel on unsafe roads.",
    list2: "Use alternative routes.",
    list3: "Stay informed via the app.",
    text4: "Your safety is the priority. Please avoid these areas until it is safe to travel."
  }
}
    
  },
  fr: {
    mainTitle: "Système de Transport Intelligent",
    subtitle: "Itinéraires qui s'adaptent aux conditions météorologiques en temps réel",
    aboutTitle: "À propos de l'application",
    complaintsTitle: "Plaintes",
    mapTitle: "Carte en direct",
    routesTitle: "Itinéraires disponibles",
    complaininfo: "Si vous avez des plaintes, veuillez cliquer sur le bouton ci-dessous.",
    complainbutton: "Soumettre une Plainte",
    nav: {
      about: "À propos",
      map: "Carte",
      routes: "Itinéraires",
      complaints: "Plaintes",
      contact: "Contact"
    },
    footer: {
  contactTitle: "Contact",
  address: "13 Rue Borjine 1073 – Montplaisir",
  follow: "Suivez-nous",
  links: "Liens",
  terms: "Conditions",
  privacy: "Confidentialité",
  sitemap: "Plan du site",
  feedbackTitle: "Retour",
  feedbackText: "Si vous avez des suggestions, veuillez nous contacter. Nous apprécions votre avis !"
},
    buttons: {
      signin: "Se Connecter",
      signup: "S'inscrire",
      all: "Tous",
      available: "Disponible",
      unavailable: "Indisponible",
      complaint: "Soumettre une Plainte",
      showRoute: "Afficher l’itinéraire"
    },
    slides: {
  slide1: {
    title: "Pourquoi avons-nous créé cette application",
    text1: "Nous avons développé cette plateforme pour résoudre les مشکلات de transport dans notre pays.",
    text2: "Notre objectif est de fournir des informations claires et en temps réel.",
    text3: "Cette application est conçue pour chaque Tunisien utilisant les transports publics.",
    text4: "Nous voulons rendre les déplacements plus faciles et plus sûrs."
  },
  slide2: {
    title: "🚧 Itinéraire indisponible",
    text1: "La ligne R2 est actuellement hors service.",
    text2: "Elle ne sera pas affichée jusqu'à sa restauration.",
    text3: "Informations importantes :",
    list1: "Vérifiez les itinéraires alternatifs.",
    list2: "Prévoyez plus de temps.",
    list3: "Restez informé via l'application.",
    text4: "Nous nous excusons pour le désagrément."
  },
  slide3: {
    title: "🌧️ Alerte météo : forte pluie",
    text1: "Certaines routes sont dangereuses.",
    text2: "Routes affectées : R1, R3",
    text3: "Conseils de sécurité :",
    list1: "Évitez ces routes.",
    list2: "Utilisez des alternatives.",
    list3: "Suivez les mises à jour.",
    text4: "Votre sécurité est la priorité. Veuillez éviter ces zones jusqu'à ce qu'il soit sûr de voyager."
  }
}
    
  },
  ar: {
    mainTitle: "نظام النقل الذكي",
    subtitle: "مسارات تتكيف مع الظروف الجوية في الوقت الفعلي",
    aboutTitle: "حول التطبيق",
    complaintsTitle: "الشكاوى",
    mapTitle: "الخريطة المباشرة",
    routesTitle: "المسارات المتاحة",
    complaininfo: "إذا كان لديك أي شكاوى، يرجى النقر على الزر أدناه.",
    complainbutton: "إرسال شكوى",
    nav: {
      about: "حول",
      map: "الخريطة",
      routes: "المسارات",
      complaints: "الشكاوى",
      contact: "الاتصال"
    },
    footer: {
  contactTitle: "الاتصال",
  address: "13 Rue Borjine 1073 – Montplaisir",
  follow: "تابعنا",
  links: "روابط",
  terms: "الشروط",
  privacy: "الخصوصية",
  sitemap: "خريطة الموقع",
  feedbackTitle: "التعليقات",
  feedbackText: "إذا كان لديك أي اقتراحات، يرجى التواصل معنا. نحن نقدر مشاركتك!"
},

    buttons: {
      signin: "تسجيل الدخول",
      signup: "إنشاء حساب",
      all: "الكل",
      available: "متاحة",
      unavailable: "غير متاحة",
      complaint: "إرسال شكوى",
      showRoute: "عرض المسار"
    },
    slides: {
  slide1: {
    title: "لماذا أنشأنا هذا التطبيق",
    text1: "قمنا بتطوير هذه المنصة لحل مشاكل النقل في بلدنا.",
    text2: "هدفنا هو تقديم معلومات واضحة وفي الوقت الحقيقي.",
    text3: "هذا التطبيق مخصص لكل تونسي يعتمد على النقل العمومي.",
    text4: "نأمل أن نجعل التنقل أسهل وأكثر أمانًا."
  },
  slide2: {
    title: "🚧 المسار غير متاح",
    text1: "المسار R2 خارج الخدمة حاليًا.",
    text2: "لن يظهر حتى يتم إصلاحه.",
    text3: "معلومات مهمة:",
    list1: "تحقق من المسارات البديلة.",
    list2: "خصص وقتًا إضافيًا.",
    list3: "تابع التحديثات.",
    text4: "نعتذر عن الإزعاج."
  },
  slide3: {
    title: "🌧️ تنبيه جوي: أمطار غزيرة",
    text1: "بعض الطرق غير آمنة.",
    text2: "المسارات المتأثرة: R1، R3",
    text3: "نصائح السلامة:",
    list1: "لا تسلك هذه الطرق.",
    list2: "استخدم طرق بديلة.",
    list3: "تابع آخر التحديثات.",
    text4: "سلامتكم هي الأولوية. يرجى تجنب هذه المناطق حتى يصبح التنقل آمناً."
  }
}
  }
};

document.addEventListener('DOMContentLoaded', () => {
  const languageSelect = document.getElementById('language-select');

  languageSelect.addEventListener('change', () => {
    const lang = languageSelect.value;
    const t = translations[lang];

    // Main titles
    document.querySelector('main h1').textContent = t.mainTitle;
    document.querySelector('.subtitle').textContent = t.subtitle;

    // Section titles
    document.querySelector('#ta h1').textContent = t.aboutTitle;
    document.querySelector('#ta1 h1').textContent = t.mapTitle;
    document.querySelector('#ta2 h1').textContent = t.routesTitle;
    document.querySelector('#ta3 h1').textContent = t.complaintsTitle;

    // Navigation links
    document.getElementById('nav-about').textContent = t.nav.about;
    document.getElementById('nav-map').textContent = t.nav.map;
    document.getElementById('nav-routes').textContent = t.nav.routes;
    document.getElementById('nav-complaints').textContent = t.nav.complaints;
    document.getElementById('nav-contact').textContent = t.nav.contact;

    // Buttons
    document.getElementById('btn-signin').textContent = t.buttons.signin;
    document.getElementById('btn-signup').textContent = t.buttons.signup;
    document.getElementById('btn-all').textContent = t.buttons.all;
    document.getElementById('btn-available').textContent = t.buttons.available;
    document.getElementById('btn-unavailable').textContent = t.buttons.unavailable;
    document.getElementById('btn-complaint').textContent = t.buttons.complaint;
    document.getElementById('footer-contact-title').textContent = t.footer.contactTitle;
    document.getElementById('footer-address').textContent = t.footer.address;
    document.getElementById('footer-follow').textContent = t.footer.follow;
    document.getElementById('footer-links').textContent = t.footer.links;
    document.getElementById('footer-terms').textContent = t.footer.terms;
    document.getElementById('footer-privacy').textContent = t.footer.privacy;
    document.getElementById('footer-sitemap').textContent = t.footer.sitemap;
    document.getElementById('footer-feedback-title').textContent = t.footer.feedbackTitle;
    document.getElementById('footer-feedback-text').textContent = t.footer.feedbackText;
    document.getElementById('btn-show-route').textContent = t.buttons.showRoute;


    // Complaints section
    const complaintsInfo = document.getElementById('complaintsinfo');
    const complaintsButton = document.getElementById('complaintsbutton');
    if (complaintsInfo) complaintsInfo.textContent = t.complaininfo;
    if (complaintsButton) complaintsButton.textContent = t.complainbutton;




    // Slides
const s = t.slides;

// Slide 1
document.getElementById('slide1Title').textContent = s.slide1.title;
document.getElementById('slide1Text1').textContent = s.slide1.text1;
document.getElementById('slide1Text2').textContent = s.slide1.text2;
document.getElementById('slide1Text3').textContent = s.slide1.text3;
document.getElementById('slide1Text4').textContent = s.slide1.text4;

// Slide 2
document.getElementById('slide2Title').textContent = s.slide2.title;
document.getElementById('slide2Text1').textContent = s.slide2.text1;
document.getElementById('slide2Text2').textContent = s.slide2.text2;
document.getElementById('slide2Text3').textContent = s.slide2.text3;
document.getElementById('slide2List1').textContent = s.slide2.list1;
document.getElementById('slide2List2').textContent = s.slide2.list2;
document.getElementById('slide2List3').textContent = s.slide2.list3;
document.getElementById('slide2Text4').textContent = s.slide2.text4;

// Slide 3
document.getElementById('slide3Title').textContent = s.slide3.title;
document.getElementById('slide3Text1').textContent = s.slide3.text1;
document.getElementById('slide3Text2').textContent = s.slide3.text2;
document.getElementById('slide3Text3').textContent = s.slide3.text3;
document.getElementById('slide3List1').textContent = s.slide3.list1;
document.getElementById('slide3List2').textContent = s.slide3.list2;
document.getElementById('slide3List3').textContent = s.slide3.list3;
document.getElementById('slide3Text4').textContent = s.slide3.text4;
  });
});