/* global logUtil, Mustache, alertUtil, mainController, daoUtil, Materialize, database_helper, Controller, dbUtil */

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
                mainController.render();
            } else {
                $("#wrapper").css("top", "0px");
                Controller.loadNewOrSingleEdit({
                    controllerOrigin: loginController,
                    entity: new Usuario(),
                    template: loginController.TEMPLATE_LOGIN,
                    inputToFocus: "#inputUsuario"
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
            alertUtil.confirm("Usuário deve ser informado.");
        } else if (!usuario.senha) {
            alertUtil.confirm("Senha deve ser informada.");
        } else if (usuario.senha !== "L") { //WS no futuro
            alertUtil.confirm("Usuário e/ou senha incorretos.");
        } else {
            if (callbackSucess) {
                callbackSucess();
            }
        }
    },
    insert: function () {
        if ($('#checkBoxLembrar').prop('checked') === true) {
            Controller.insert("Bem vindo " + $("#inputUsuario").val());
        } else {
            mainController.render();
        }

    },
    logout: function () {
        alertUtil.confirm(
                "Esta ação fará com que todos os dados locais sejam perdidos, deseja mesmo continuar?",
                "Saindo...",
                ["Não", "Sim"],
                function (btnEscolhido) {
                    if (btnEscolhido == 2) {
                        dbUtil.dropDatabase(function () {
                            window.localStorage.removeItem("dataBaseCreated");
                            navigator.app.exitApp();
                        });
                    }
                }
        );
    }
};
