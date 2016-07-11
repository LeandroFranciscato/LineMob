/* global i18nextBrowserLanguageDetector, i18nextXHRBackend, i18next, i18nextJquery */

// Iniciando a lib
i18next.use(i18nextBrowserLanguageDetector)
        .use(i18nextXHRBackend)
        .init({
            fallbackLng: "en" //fallback quando não definir linguagem
            , debug: true //debug do plugin
            , fixLng: true //preserva o cookie quando a linguagem for definida
            , load: 'current' //define a forma correta de declarar linguagens
            , backend: {
                "loadPath": "locales/{{lng}}/{{ns}}.json"
            }
        },function (translation) {
            i18nextJquery.init(i18next, $);
            $('[data-i18n]').localize();
        });
/*
// espanhol
$('#btn-es').on('click', function () {
    i18next.changeLanguage("es", function (err, t) {
        i18nextJquery.init(i18next, $);
        $('[data-i18n]').localize();
    });
});

// inglês
$('#btn-en').on('click', function () {
    i18next.changeLanguage("en", function (err, t) {
        i18nextJquery.init(i18next, $);
        $('[data-i18n]').localize();
    });
});

// português
$('#btn-pt').on('click', function () {
    i18next.changeLanguage("pt", function (err, t) {
        i18nextJquery.init(i18next, $);
        $('[data-i18n]').localize();
    });
});*/