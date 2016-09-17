/* global logUtil, Mustache, alertUtil, mainController, daoUtil, Materialize, database_helper, Controller, dbUtil, i18next, iconUtil, sync, loadController, loginController */

var signupController = {
    TEMPLATE_SIGNUP: "",
    loadList: function (cb) {
        this.load(function () {
            if (cb) {
                cb();
            }
        });
    },
    load: function (cb) {
        $("#wrapper").css("top", "0px");
        Controller.loadNewOrSingleEdit({
            controllerOrigin: signupController,
            entity: new Usuario(),
            template: signupController.TEMPLATE_SIGNUP,
            inputToFocus: "",
            navLeft: {
                callbackClick: function () {
                    loginController.load();
                }
            }
        }, null, function () {
            if (cb) {
                cb();
            }
        });
    },
    validaFormulario: function (usuario, callbackSucess) {
        if (!usuario.usuario) {
            alertUtil.confirm(i18next.t("login-controller.alert-usuario-req"));
        } else if (!usuario.senha) {
            alertUtil.confirm(i18next.t("login-controller.alert-senha-req"));
        } else {
            if (callbackSucess) {
                callbackSucess();
            }
        }
    },
    insert: function () {
        this.validaFormulario($("#form-cadastro").serializeObject(), function () {
            // sync
        });
    }
};
