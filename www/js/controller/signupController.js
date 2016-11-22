/* global logUtil, Mustache, alertUtil, mainController, daoUtil, Materialize, database_helper, Controller, dbUtil, i18next, iconUtil, sync, loadController, loginController, networkUtil */

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
        if (!usuario.nome) {
            alertUtil.confirm(i18next.t("login-controller.alert-nome-req"));
        } else if (!usuario.usuario) {
            alertUtil.confirm(i18next.t("login-controller.alert-usuario-req"));
        } else if (!usuario.senha) {
            alertUtil.confirm(i18next.t("login-controller.alert-senha-req"));
        } else if (!signupController.isEmail(usuario.usuario)) {
            alertUtil.confirm(i18next.t("login-controller.alert-email-invalid"));
        } else {
            if (callbackSucess) {
                callbackSucess();
            }
        }
    },
    requestSignUp: function (cbSuccess, cbError) {
        window.localStorage.setItem("user", $("#inputUsuario").val());
        window.localStorage.setItem("pwd", $.md5($("#inputPassword").val()));
        window.localStorage.setItem("name", $("#inputNome").val());
        loadController.show();
        sync.ajax("GET", "TEXT", "usuario/signup", {}, function (msg) {
            loadController.hide();
            if (cbSuccess) {
                cbSuccess(msg);
            }
        }, function () {
            loadController.hide();
            window.localStorage.removeItem("user");
            window.localStorage.removeItem("pwd");
            window.localStorage.removeItem("name");
            if (cbError) {
                cbError();
            }
        });
    },
    insert: function () {
        if (!networkUtil.isOnline()) {
            alertUtil.confirm(i18next.t("generics.must-be-online"));
            return;
        }
        this.validaFormulario($("#form-cadastro").serializeObject(), function () {
            signupController.requestSignUp(function (msg) {
                if (msg == "server-messages.user-exists") {
                    alertUtil.confirm(i18next.t(msg));
                } else {
                    Controller.insert(i18next.t("login-controller.alert-welcome-pt1") + $("#inputNome").val(), undefined, function () {
                        mainController.render();
                    });
                }
            }, function () {
                alertUtil.confirm(i18next.t("generics.fail-crud-msg"));
            });
        });
    },
    isEmail: function (email) {
        var exclude = /[^@\-\.\w]|^[_@\.\-]|[\._\-]{2}|[@\.]{2}|(@)[^@]*\1/;
        var check = /@[\w\-]+\./;
        var checkend = /\.[a-zA-Z]{2,3}$/;
        if (((email.search(exclude) != -1) || (email.search(check)) == -1) || (email.search(checkend) == -1)) {
            return false;
        } else {
            return true;
        }
    }
};
