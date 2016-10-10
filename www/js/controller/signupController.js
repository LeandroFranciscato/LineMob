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
    requestSignUp: function (cbSuccess, cbError) {
        var user = window.localStorage.setItem("user", $("#inputUsuario").val());
        var pwd = window.localStorage.setItem("pwd", $.md5($("#inputPassword").val()));
        loadController.show();
        sync.ajax("GET", "TEXT", "usuario/signup", {}, function () {
            loadController.hide();
            if (cbSuccess) {
                cbSuccess();
            }
        }, function () {
            loadController.hide();
            window.localStorage.removeItem("user");
            window.localStorage.removeItem("pwd");
            if (cbError) {
                cbError();
            }
        });
    },
    insert: function () {
        this.validaFormulario($("#form-cadastro").serializeObject(), function () {
            signupController.requestSignUp(function () {
                Controller.insert(i18next.t("login-controller.alert-welcome-pt1") + $("#inputUsuario").val(), undefined, function () {
                    mainController.render();
                    loadController.show();
                    setTimeout(function () {
                        sync.run();
                    }, 2000);
                });
            }, function () {
                alertUtil.confirm(i18next.t("server-messages.user-exists"));
            });
        });
    }
};
