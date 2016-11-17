/* global alertUtil, Controller, iconUtil, mainController, i18next, daoUtil */
var configController = {
    TEMPLATE_CONFIG: "",
    TEMPLATE_ALTERAR_DADOS_CADASTRAIS: "",
    TEMPLATE_ALTERAR_SENHA: "",
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
    },
    abrirAlterarDadosCadastrais: function () {
        if (!networkUtil.isOnline()) {
            alertUtil.confirm("generics.must-be-online");
            return;
        }
        Controller.loadNewModal({
            controllerModal: configController,
            template: configController.TEMPLATE_ALTERAR_DADOS_CADASTRAIS,
            element: "",
            tituloNavCenter: i18next.t("config-controller.alterar-informacoes"),
            iconTituloNavCenter: iconUtil.edit,
            callbackAction: function () {
                mainController.render();
            },
            callbackConfirmAction: function () {
                configController.alterarDadosCadastrais(function () {
                    Controller.closeModal(function () {
                        mainController.render();
                    });
                });
            },
            data: {nome: window.localStorage.getItem("name"), email: window.localStorage.getItem("user")}
        });
    },
    alterarDadosCadastrais: function (cb) {
        // Validações
        var data = $("#form-modal").serializeObject();
        if (!data.email) {
            alertUtil.confirm(i18next.t("login-controller.alert-usuario-req"));
            return;
        }
        if (!signupController.isEmail(data.email)) {
            alertUtil.confirm(i18next.t("login-controller.alert-email-invalid"));
            return;
        }
        if (!data.nome) {
            alertUtil.confirm(i18next.t("login-controller.alert-nome-req"));
            return;
        }

        // Envio ao Server        
        var dataJson = {
            nome: data.email.replace(/[.]/g, ','),
            nomeNovo: data.nome,
            versao: 1,
            password: window.localStorage.getItem("pwd")
        };

        loadController.show();
        sync.ajax("POST", "TEXT", "usuario/alteracaoDadosCadastrais", dataJson, function (msg) {
            loadController.hide();
            if (!msg) {
                window.localStorage.setItem("user", data.email);
                window.localStorage.setItem("name", data.nome);
                alertUtil.confirm(i18next.t("config-controller.dados-alterados-sucesso"));
                if (cb) {
                    cb();
                }
            } else {
                alertUtil.confirm(i18next.t(msg));
            }
        }, function (msg) {
            loadController.hide();
            alertUtil.confirm(i18next.t(msg));
        });
    },
    abrirAlterarSenha: function () {
        if (!networkUtil.isOnline()) {
            alertUtil.confirm("generics.must-be-online");
            return;
        }
        Controller.loadNewModal({
            controllerModal: configController,
            template: configController.TEMPLATE_ALTERAR_SENHA,
            element: "",
            tituloNavCenter: i18next.t("config-controller.alterar-senha"),
            iconTituloNavCenter: iconUtil.edit,
            callbackAction: function () {
                mainController.render();
            },
            callbackConfirmAction: function () {
                configController.alterarSenha(function () {
                    Controller.closeModal(function () {
                        mainController.render();
                    });
                });
            }
        });
    },
    alterarSenha: function () {
        // Validações
        var data = $("#form-modal").serializeObject();
        if (!data.senhaAtual || !data.senhaNova || !data.senhaNovaRepete){
            alertUtil.confirm(i18next.t("generics.all-fields-required"));
            return;
        }        
        if (data.senhaAtual != window.localStorage.getItem("pwd")){
            alertUtil.confirm(i18next.t("config-controller.senha-incorreta"));
            return;
        }        
        if (data.senhaNova != data.senhaNovaRepete){
            alertUtil.confirm(i18next.t("config-controller.senhas-nao-coincidem"));
            return;
        }            

        // Envio ao Server        
        var dataJson = {
            nome: window.localStorage.getItem("user").replace(/[.]/g, ','),
            nomeNovo: window.localStorage.getItem("name"),
            versao: 1,
            password: data.senhaNova
        };

        loadController.show();
        sync.ajax("POST", "TEXT", "usuario/alteracaoSenha", dataJson, function (msg) {
            loadController.hide();
            if (msg == "1") {
                window.localStorage.setItem("pwd", data.senhaAtual);
                alertUtil.confirm(i18next.t("config-controller.senha-alterada-sucesso"));
                if (cb) {
                    cb();
                }
            } else {
                alertUtil.confirm(i18next.t("generics.fail-crud-msg"));
            }
        }, function (msg) {
            loadController.hide();
            alertUtil.confirm(i18next.t(msg));
        });
    }
}; 