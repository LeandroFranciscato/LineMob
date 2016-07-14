
/* global alertUtil, Controller, iconUtil, mainController, i18next, daoUtil */

var configController = {
    TEMPLATE_CONFIG: "",
    load: function (cb) {
        var config = new Config();
        daoUtil.getAll(config, "", function (data) {
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
                    title: i18next.t("nav-top-names.config"),
                    icon: iconUtil.config
                },
                navRight: {
                    display: "block",
                    iconName: iconUtil.check,
                    callbackClick: function () {
                        Controller.insert("", "", function () {
                            i18nextSetLng($("#select-language").val());
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
            }, data[0], function () {
                if (cb) {
                    cb();
                }
            });
        });
    },
    validaFormulario: function (config, callbackSucess) {
        if (!config.language) {
            alertUtil.confirm("Idioma deve ser informado.");
        } else {
            if (callbackSucess) {
                callbackSucess();
            }
        }
    }
}; 