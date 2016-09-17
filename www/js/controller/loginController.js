/* global logUtil, Mustache, alertUtil, mainController, daoUtil, Materialize, database_helper, Controller, dbUtil, i18next, iconUtil, sync, loadController */

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
        } else {
            if (callbackSucess) {
                callbackSucess();
            }
        }
    },
    requestLogin: function (cbSuccess, cbError) {
        var user = window.localStorage.setItem("user", $("#inputUsuario").val());
        var pwd = window.localStorage.setItem("pwd", $.md5($("#inputPassword").val()));
        loadController.show();
        sync.ajax("GET", "TEXT", "usuario/login", {}, function () {
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
            loginController.requestLogin(function () {
                if ($('#checkBoxLembrar').prop('checked') === true) {
                    Controller.insert(i18next.t("login-controller.alert-welcome-pt1") + $("#inputUsuario").val(), undefined, function () {
                        mainController.render();
                        loadController.show();
                        setTimeout(function () {
                            sync.run();
                        }, 2000);
                    });
                } else {
                    mainController.render();
                    loadController.show();
                    setTimeout(function () {
                        sync.run();
                    }, 2000);
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
                            window.localStorage.removeItem("user");
                            window.localStorage.removeItem("pwd");
                            window.localStorage.removeItem("dataBaseCreated");
                            navigator.app.exitApp();
                        });
                    }
                }
        );
    },
    showOrHidePasswd: function (element) {
        if ($(element).hasClass("eyeOn")) {
            $(element).removeClass("eyeOn").addClass("eyeOff");
            $("#inputPassword").attr("type", "text");
            $("#icon-eye").html(iconUtil.eyeOff);
        } else {
            $(element).removeClass("eyeOff").addClass("eyeOn");
            $("#inputPassword").attr("type", "password");
            $("#icon-eye").html(iconUtil.eyeOn);
        }
        $("#inputPassword").trigger("focus");
    }
};
