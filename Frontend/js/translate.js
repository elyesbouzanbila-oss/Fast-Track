// Initialisation des traductions
        const savedLanguage = localStorage.getItem('fasttrack-language') || 'fr';

        i18next.init({
            lng: savedLanguage,
            resources: {
                fr: {
                     translation:
                        { page_title: "Formulaire de connexion",
                        title_1: "transtut",
                        title_2: "transport on tunise",
                        label_username: "Nom d'utilisateur",
                        label_password: "Mot de passe",
                        label_nom : "Nom et prénom",
                        label_mail : "Email",
                        hazard_type_placeholder: "Type de danger",
                        hazard_road_closure: "Route fermée",
                        hazard_flooding: "Inondation",
                        hazard_construction: "Travaux",
                        hazard_accident: "Accident",
                        hazard_pothole: "Nid-de-poule",
                        hazard_landslide: "Glissement de terrain",
                        hazard_unsafe_area: "Zone dangereuse",
                        hazard_other: "Autre",
                        severity_placeholder: "Niveau de gravité",
                        severity_low: "Faible",
                        severity_medium: "Moyenne",
                        severity_high: "Élevée",
                        severity_critical: "Critique",
                        hazard_location: "Localisation",
                        hazard_latitude: "Latitude",
                        hazard_longitude: "Longitude",
                        hazard_get_location: "📍 Obtenir la position actuelle",
                        hazard_description: "Description du problème",
                        hazard_submit: "Signaler le danger",
                        label_numtel : "Numéro de téléphone",
                        label_address : "Address",
                        label_ville : "Ville",
                        invalid_name: "Nom invalide",
                        invalid_numtel: "Numéro invalide",
                        invalid_mail: "Email invalide",
                        invalid_ville: "Ville invalide",
                        invalid_address: "Adresse invalide",
                        error_validation: "Veuillez remplir tous les champs obligatoires",
                        error_location_required: "La localisation est requise. Utilisez \"Obtenir la position actuelle\" ou entrez les coordonnées.",
                        error_latitude_range: "La latitude doit être entre -90 et 90",
                        error_longitude_range: "La longitude doit être entre -180 et 180",
                        error_hazard_type: "Veuillez sélectionner un type de danger",
                        error_severity: "Veuillez sélectionner un niveau de gravité",
                        error_geolocation_unsupported: "La géolocalisation n'est pas supportée par votre navigateur.",
                        error_geolocation_failed: "Impossible d'obtenir la localisation",
                        error_server_unreachable: "Impossible d'accéder au serveur. Vérifiez votre connexion.",
                        error_too_many_reports: "Trop de rapports. Veuillez attendre un moment.",
                        error_report_failed: "Échec du signalement du danger. Veuillez réessayer.",
                        success_reported: "Danger signalé avec succès! Merci.",
                        getting_location: "📍 Obtention de la position…",
                        submit_btn: "Entrée",
                        claim_type: "type de réclamation",
                        transport_type: "type de transport",
                        city: "ville",
                        claim_date: "date de réclamation",
                        declarant_number: "numéro de personne déclarer",
                        modify: "modifier",
                        delete: "supprimer",
                        status: "état",
                        admin: "admin",
                        user: "user",
                        claimed: "Traitée",
                        pending: "En attente",
                        route: "Route",
                        departure: "départ",
                        arrival: "arrivée",
                        transport: "transport",
                        details: "détaille",

                        admin_panel_title: "👨‍💼 panneau administrateur",

                        user: "utilisateur",
                        modifier_supprimer: "modifier / supprimer",
                        ajouter: "ajouter",
                        export_excel: "exporter en Excel",

                        reclamation: "réclamation",

                        route: "route",
                        "ajout route": "ajouter une route",
                        "gérer route": "gérer les routes",

                        autres: "autres",
                        logout: "se déconnecter",
                        home: "accueil",

                        alert_username: "⚠️ Le nom doit contenir uniquement des lettres (au moins 3) et être alphanumérique.",
                        alert_password: "⚠️ Le mot de passe doit contenir au moins 8 caractères, avec majuscule, minuscule, chiffre et caractère spécial, sans espace.",
                        login_signup_prompt: "Vous n'avez pas de compte ?",
                        login_signup_link: "Inscrivez-vous ici",
                        error_email_required: "L'email est requis",
                        error_email_invalid: "L'email n'est pas valide",
                        error_password_required: "Le mot de passe est requis",
                        error_password_weak: "Le mot de passe doit contenir au moins 8 caractères, avec majuscule, minuscule, chiffre et caractère spécial",
                        error_name_required: "Le nom est requis",
                        error_name_short: "Le nom doit faire au moins 2 caractères",
                        error_invalid_credentials: "Email ou mot de passe incorrect",
                        error_email_exists: "Cet email est déjà utilisé",
                        error_network: "Erreur réseau. Vérifiez votre connexion",
                        error_rate_limit: "Trop de tentatives. Veuillez réessayer plus tard",
                        error_unknown: "Une erreur s'est produite. Veuillez réessayer"
                        ,signup_prompt: "Vous avez déjà un compte ?"
                        ,signup_login_link: "Connectez-vous ici"
                    
                    } 
                    },
                en: {
                     translation: {
                         page_title: "Login Form",
                         title_1: "transtut",
                         title_2: "transport in tunisia",
                         label_username: "Username",
                         label_password: "Password",
                            label_nom : "Name and surname",
                            label_mail : "Email",
                            hazard_type_placeholder: "Hazard Type",
                            hazard_road_closure: "Road Closure",
                            hazard_flooding: "Flooding",
                            hazard_construction: "Construction",
                            hazard_accident: "Accident",
                            hazard_pothole: "Pothole",
                            hazard_landslide: "Landslide",
                            hazard_unsafe_area: "Unsafe Area",
                            hazard_other: "Other",
                            severity_placeholder: "Severity Level",
                            severity_low: "Low",
                            severity_medium: "Medium",
                            severity_high: "High",
                            severity_critical: "Critical",
                            hazard_location: "Location",
                            hazard_latitude: "Latitude",
                            hazard_longitude: "Longitude",
                            hazard_get_location: "📍 Get Current Location",
                            hazard_description: "Description of problem",
                            hazard_submit: "Report Hazard",
                            label_numtel : "Phone number",
                            label_address : "Address",
                            label_ville : "City",
                            invalid_name: "Invalid name",
                            invalid_numtel: "Invalid phone number",
                            invalid_mail: "Invalid email",
                            invalid_ville: "Invalid city",
                            invalid_address: "Invalid address",
                            error_validation: "Please fill in all required fields",
                            error_location_required: "Location is required. Use \"Get Current Location\" or enter coordinates.",
                            error_latitude_range: "Latitude must be between -90 and 90",
                            error_longitude_range: "Longitude must be between -180 and 180",
                            error_hazard_type: "Please select a hazard type",
                            error_severity: "Please select a severity level",
                            error_geolocation_unsupported: "Geolocation is not supported by your browser.",
                            error_geolocation_failed: "Could not get location",
                            error_server_unreachable: "Cannot reach the server. Check your connection.",
                            error_too_many_reports: "Too many reports. Please wait a moment.",
                            error_report_failed: "Failed to report hazard. Please try again.",
                            success_reported: "Hazard reported successfully! Thank you.",
                            getting_location: "📍 Getting location…",
                         submit_btn: "Login",
                         claim_type: "Claim Type",
                         transport_type: "Transport Type",
                         city: "City",
                         claim_date: "Claim Date",
                         declarant_number: "Declarant Number",
                         modify: "Modify",
                         delete: "Delete",
                         status: "Status",
                            admin: "admin",
                            user: "user",
                            claimed: "Claimed",
                            pending: "Pending",
                            route: "Route",
                            departure: "Departure",
                            arrival: "Arrival",
                            transport: "Transport",
                            details: "Details",


                            admin_panel_title: "👨‍💼 admin panel",

                            user: "user",
                            modifier_supprimer: "edit / delete",
                            ajouter: "add",
                            export_excel: "export to Excel",

                            reclamation: "complaint",

                            route: "route",
                            "ajout route": "add route",
                            "gérer route": "manage routes",

                            autres: "others",
                            logout: "logout",
                            home: "home"        ,



                         alert_username: "⚠️ Username must be at least 3 characters long and alphanumeric.",
                         alert_password: "⚠️ Password must be at least 8 characters long, with uppercase, lowercase, number and special character, no spaces.",
                         login_signup_prompt: "Don't have an account?",
                         login_signup_link: "Sign up here",
                         error_email_required: "Email is required",
                         error_email_invalid: "Email is not valid",
                         error_password_required: "Password is required",
                         error_password_weak: "Password must be at least 8 characters with uppercase, lowercase, number and special character",
                         error_name_required: "Name is required",
                         error_name_short: "Name must be at least 2 characters",
                         error_invalid_credentials: "Invalid email or password",
                         error_email_exists: "This email is already in use",
                         error_network: "Network error. Check your connection",
                         error_rate_limit: "Too many attempts. Please try again later",
                         error_unknown: "An error occurred. Please try again",
                         signup_prompt: "Already have an account?",
                         signup_login_link: "Login here"} 
                        },
                ar: {
                     translation: {
                            page_title: "نموذج تسجيل الدخول",
                            title_1: "transtut",
                            title_2: "النقل في تونس",
                            label_username: "اسم المستخدم",
                            label_password: "كلمة المرور",
                            label_nom : "الاسم واللقب",
                            label_mail : "البريد الإلكتروني",
                            hazard_type_placeholder: "نوع الخطر",
                            hazard_road_closure: "إغلاق الطريق",
                            hazard_flooding: "فيضان",
                            hazard_construction: "أشغال",
                            hazard_accident: "حادث",
                            hazard_pothole: "حفرة",
                            hazard_landslide: "انهيار أرضي",
                            hazard_unsafe_area: "منطقة غير آمنة",
                            hazard_other: "أخرى",
                            severity_placeholder: "مستوى الخطورة",
                            severity_low: "منخفض",
                            severity_medium: "متوسط",
                            severity_high: "مرتفع",
                            severity_critical: "حرج",
                            hazard_location: "الموقع",
                            hazard_latitude: "خط العرض",
                            hazard_longitude: "خط الطول",
                            hazard_get_location: "📍 الحصول على الموقع الحالي",
                            hazard_description: "وصف المشكلة",
                            hazard_submit: "الإبلاغ عن الخطر",
                            label_numtel : "رقم الهاتف",
                            label_address : "العنوان",
                            label_ville : "المدينة",
                            invalid_name: "اسم غير صالح",
                            invalid_numtel: "رقم هاتف غير صالح",
                            invalid_mail: "بريد إلكتروني غير صالح",
                            invalid_ville: "مدينة غير صالحة",
                            invalid_address: "عنوان غير صالح",
                            invalid_numtel: "رقم هاتف غير صالح",
                            submit_btn: "دخول",
                            error_validation: "الرجاء ملء جميع الحقول المطلوبة",
                            error_location_required: "الموقع مطلوب. استخدم \"الحصول على الموقع الحالي\" أو أدخل الإحداثيات.",
                            error_latitude_range: "خط العرض يجب أن يكون بين -90 و 90",
                            error_longitude_range: "خط الطول يجب أن يكون بين -180 و 180",
                            error_hazard_type: "يرجى اختيار نوع الخطر",
                            error_severity: "يرجى اختيار مستوى الخطورة",
                            error_geolocation_unsupported: "الموقع الجغرافي غير مدعوم في متصفحك",
                            error_geolocation_failed: "لا يمكن الحصول على الموقع",
                            error_server_unreachable: "لا يمكن الوصول إلى الخادم. تحقق من اتصالك",
                            error_too_many_reports: "الكثير من التقارير. يرجى الانتظار قليلاً",
                            error_report_failed: "فشل الإبلاغ عن الخطر. يرجى المحاولة مرة أخرى",
                            success_reported: "تم الإبلاغ عن الخطر بنجاح! شكراً لك",
                            getting_location: "📍 جاري الحصول على الموقع…",
                            claim_type: "نوع الشكوى",
                            transport_type: "نوع النقل",
                            city: "المدينة",
                            claim_date: "تاريخ الشكوى",
                            declarant_number: "رقم المُعلن",
                            modify: "تعديل",
                            delete: "حذف",
                            status: "الحالة",
                            route: "المسار",
                            departure: "الانطلاق",
                            arrival: "الوصول",
                            transport: "النقل",
                            details: "التفاصيل",


                                admin: "مدير",
                                user: "مستخدم",
                                claimed: " معالجة",
                                pending: "في الانتظار",





                                admin_panel_title: "👨‍💼 لوحة الإدارة",

    user: "المستخدم",
    modifier_supprimer: "تعديل / حذف",
    ajouter: "إضافة",
    export_excel: "تصدير إلى Excel",

    reclamation: "شكوى",

    route: "طريق",
    "ajout route": "إضافة طريق",
    "gérer route": "إدارة الطرق",

    autres: "أخرى",
    logout: "تسجيل الخروج",
    home: "الرئيسية"        ,


                            alert_username: "⚠️ يجب أن يحتوي الاسم على 3 أحرف على الأقل ويكون أبجديًا.",
                            alert_password: "⚠️ يجب أن تحتوي كلمة المرور على 8 أحرف على الأقل، بحرف كبير وصغير ورقم ورمز خاص، بدون فراغ.",
                            login_signup_prompt: "ليس لديك حساب؟",
                            login_signup_link: "سجّل هنا",
                            error_email_required: "البريد الإلكتروني مطلوب",
                            error_email_invalid: "البريد الإلكتروني غير صالح",
                            error_password_required: "كلمة المرور مطلوبة",
                            error_password_weak: "كلمة المرور يجب أن تحتوي على 8 أحرف على الأقل مع أحرف كبيرة وصغيرة ورقم ورمز خاص",
                            error_name_required: "الاسم مطلوب",
                            error_name_short: "الاسم يجب أن يكون 2 أحرف على الأقل",
                            error_invalid_credentials: "بريد إلكتروني أو كلمة مرور غير صحيحة",
                            error_email_exists: "هذا البريد الإلكتروني قيد الاستخدام بالفعل",
                            error_network: "خطأ في الشبكة. تحقق من اتصالك",
                            error_rate_limit: "عدد محاولات كثير. يرجى المحاولة لاحقاً",
                            error_unknown: "حدث خطأ. يرجى المحاولة مرة أخرى",
                            signup_prompt: "هل لديك حساب بالفعل؟",
                            signup_login_link: "سجّل الدخول هنا"} 
                        }
            }
        }, function(err, t) {
            if (err) return console.error(err);
            updateContent();
            // Synchroniser le select avec la langue courante
            const languageSelect = document.getElementById('languageSelect');
            if (languageSelect) {
                languageSelect.value = i18next.language;
            }
        });

        // ── Mise à jour du contenu + direction ───────────────────────────
        function updateContent() {
            const lang = i18next.language;

            // Traduction des éléments data-i18n
            document.querySelectorAll('[data-i18n]').forEach(el => {
                const key = el.getAttribute('data-i18n');
                if (el.tagName.toLowerCase() === 'title') {
                    document.title = i18next.t(key);
                } else {
                    el.textContent = i18next.t(key);   // ← plus sûr que innerHTML ici
                }
            });

            // Translate placeholders when provided as data-i18n-placeholder
            document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
                const key = el.getAttribute('data-i18n-placeholder');
                el.setAttribute('placeholder', i18next.t(key));
            });

            // Traduction spécifique du bouton (value)
            const submitBtn = document.getElementById('checkButton');
            if (submitBtn) {
                submitBtn.value = i18next.t('submit_btn');
            }

            // Translate input/button values when requested via data-i18n="[value]key"
            document.querySelectorAll('[data-i18n^="[value]"]').forEach(el => {
                const raw = el.getAttribute('data-i18n');
                const key = raw.replace('[value]', '');
                el.value = i18next.t(key);
            });

            // Direction du texte
            if (lang === 'ar') {
                document.body.dir = 'rtl';
                document.body.style.textAlign = 'right';
            } else {
                document.body.dir = 'ltr';
                document.body.style.textAlign = 'left';
            }

                        // Auth form cursor direction:
                        // FR/EN should type from the left, Arabic from the right.
                        const authInputs = document.querySelectorAll(
                            'body.login-page input[type="text"], body.login-page input[type="email"], body.login-page input[type="password"], body.signup-page input[type="text"], body.signup-page input[type="email"], body.signup-page input[type="password"]'
                        );
                        authInputs.forEach((el) => {
                            if (lang === 'ar') {
                                el.style.direction = 'rtl';
                                el.style.textAlign = 'right';
                            } else {
                                el.style.direction = 'ltr';
                                el.style.textAlign = 'left';
                            }
                        });

                        const authTextBlocks = document.querySelectorAll(
                            'body.login-page .bg h4, body.login-page .error-message, body.login-page #errorMessage, body.signup-page .bg h4, body.signup-page .error-message, body.signup-page .signup-footer, body.signup-page .signup-footer a, body.signup-page .signup-footer span'
                        );
                        authTextBlocks.forEach((el) => {
                            el.style.textAlign = 'center';
                        });
        }

        // ── Changement de langue ────────────────────────────────────────
        function changeLanguage(lang) {
            localStorage.setItem('fasttrack-language', lang);
            i18next.changeLanguage(lang, (err, t) => {
                if (err) return console.error(err);
                updateContent();
                
                // Reinitialize Choices.js if available (for hazard form)
                if (typeof reinitializeChoices === 'function') {
                    reinitializeChoices();
                }
            });
        }



                function applyTranslations() {
        document.querySelectorAll('[data-i18n]').forEach(el => {
                const key = el.getAttribute('data-i18n');
                if (el.tagName === 'OPTION') {
                        el.textContent = i18next.t(key);
                } else {
                        el.textContent = i18next.t(key);
                }
        });
}

                // ── Global error clearing setup for all forms ────────────────────────────
                function setupErrorClearingGlobal() {
                    // Clear all error messages when user modifies any input field
                    document.addEventListener('input', () => {
                        document.querySelectorAll('.error-message').forEach(el => {
                            if (el.textContent) el.textContent = '';
                        });
                    }, true);
          
                    // Also clear on change for select elements
                    document.addEventListener('change', (e) => {
                        if (e.target.tagName === 'SELECT') {
                            const errorId = 'error-' + (e.target.id || e.target.name);
                            const errorEl = document.getElementById(errorId);
                            if (errorEl) errorEl.textContent = '';
                        }
                    }, true);
                }

                // ── Setup global error clearing when DOM is ready ──────────────────────────
                if (document.readyState === 'loading') {
                    document.addEventListener('DOMContentLoaded', setupErrorClearingGlobal);
                } else {
                    setupErrorClearingGlobal();
                }

        