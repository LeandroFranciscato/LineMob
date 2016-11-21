/* global logUtil, Mustache, alertUtil, mainController, daoUtil, Materialize, database_helper, Controller, dbUtil, i18next, iconUtil, sync, loadController, signupController, networkUtil */

var loginController = {
    TEMPLATE_LOGIN: "",
    loadList: function (cb) {
        this.load(function () {
            if (cb) {
                cb();
            }
        });
    },
    load: function (cb) {
        var usuario = new Usuario();
        daoUtil.getAll(usuario, "id", function (res) {
            if (res && res.length > 0) {
                mainController.render(function () {
                    if (cb) {
                        cb();
                    }
                });
            } else {
                $("#wrapper").css("top", "0px");
                Controller.loadNewOrSingleEdit({
                    controllerOrigin: loginController,
                    entity: new Usuario(),
                    template: loginController.TEMPLATE_LOGIN,
                    inputToFocus: "#inputUsuario",
                    navLeft: {
                        callbackClick: function () {
                            navigator.app.exitApp();
                        }
                    }
                }, null, function () {
                    if (cb) {
                        cb();
                    }
                });
            }
        });
    },
    validaFormulario: function (usuario, callbackSucess) {
        if (!usuario.usuario) {
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
    requestLogin: function (cbSuccess, cbError) {
        var user = $("#inputUsuario").val();
        var pwd = $.md5($("#inputPassword").val());
        window.localStorage.setItem("user", user);
        window.localStorage.setItem("pwd", pwd);
        loadController.show();
        sync.ajax("GET", "TEXT", "usuario/login", {}, function (nomeUsuario) {
            loadController.hide();
            if (cbSuccess) {
                window.localStorage.setItem("name", nomeUsuario);
                $("#inputNome").val(nomeUsuario);
                cbSuccess();
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
            loginController.requestLogin(function () {
                if ($('#checkBoxLembrar').prop('checked') === true) {
                    Controller.insert(i18next.t("login-controller.alert-welcome-pt1") + $("#inputNome").val(), undefined, function () {
                        mainController.render();
                    });
                } else {
                    mainController.render();
                }
            }, function () {
                alertUtil.confirm(i18next.t("login-controller.alert-login-fail"));
            });
        });
    },
    logout: function () {
        alertUtil.confirm(
                i18next.t("login-controller.body-alert-logout"),
                i18next.t("login-controller.title-alert-logout"),
                [i18next.t("generics.no"), i18next.t("generics.yes")],
                function (btnEscolhido) {
                    if (btnEscolhido == 2) {
                        dbUtil.dropDatabase(function () {
                            window.localStorage.clear();
                            navigator.app.exitApp();
                        });
                    }
                }
        );
    },
    showOrHidePasswd: function (element) {
        if ($(element).hasClass("eyeOn")) {
            $(element).removeClass("eyeOn").addClass("eyeOff");
            $(".password").attr("type", "text");
            $(element).html(iconUtil.eyeOff);
        } else {
            $(element).removeClass("eyeOff").addClass("eyeOn");
            $(".password").attr("type", "password");
            $(element).html(iconUtil.eyeOn);
        }
        if ($(".password").length == 1) {
            $(".password").trigger("focus");
        }
    },
    getNomeUsuario: function () {
        return window.localStorage.getItem("name");
    }
};
