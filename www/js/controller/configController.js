/* global alertUtil, Controller, iconUtil, mainController, i18next, daoUtil */
var configController = {
    TEMPLATE_CONFIG: "",
    load: function (cb) {
        var config = new Config();
        daoUtil.getAll(config, "", function (data) {

            if (data && data.length) {
                var currentLng = data[0].language;
                var currentId = data[0].id;                
            }
            
            data.id = currentId;
            data.languageOptions = [
                {lng: "en", selected: currentLng === "en"},
                {lng: "pt", selected: currentLng === "pt"},
                {lng: "es", selected: currentLng === "es"}
            ];

            Controller.render({
                controllerOrigin: configController,
                entity: new Config(),
                template: configController.TEMPLATE_CONFIG,
                navLeft: {
                    icon: iconUtil.back,
                    callbackClick: function () {
                        mainController.render();
                    }
                },
                navCenter: {
                    title: i18next.t("config-controller.plural"),
                    icon: iconUtil.config
                },
                navRight: {
                    display: "block",
                    iconName: iconUtil.check,
                    callbackClick: function () {
                        Controller.insert("", "", function () {
                            i18nextSetLng($("#select-language").val());
                            mainController.render();
                        });
                    }
                },
                navSearch: {
                    display: "none"
                },
                floatButton: {
                    display: "none"
                },
                inputToFocus: ""
            }, data, function () {
                if (cb) {
                    cb();
                }
            });
        });
    },
    validaFormulario: function (config, callbackSucess) {
        if (!config.language) {
            alertUtil.confirm(i18next.t("config-controller.alert-lng-req"));
        } else {
            if (callbackSucess) {
                callbackSucess();
            }
        }
    }
}; 