/* global i18nextBrowserLanguageDetector, i18nextXHRBackend, i18next, i18nextJquery, i18Util */

i18nextInitialize = function () {
    i18nextJquery.init(i18next, $);
    $('[data-i18n]').localize();
};

i18nextSetLng = function (lng) {
    i18next.changeLanguage(lng, function () {
        i18nextInitialize();
    });
};

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
        }, function (translation) {

        });
