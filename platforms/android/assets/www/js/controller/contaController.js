/* global Mustache, logUtil, mainController, alertUtil, daoUtil, Controller, iconUtil, i18next */

var contaController = {
    TEMPLATE_CADASTRO: "",
    TEMPLATE_LISTA: "",
    TEMPLATE_EDICAO: "",
    loadList: function (cb) {
        cordova.plugins.notification.local.schedule({
            id: 1,
            title: "Linemob!",
            text: "Ocorreu um erro, clique para mais informações",
            //at: new Date(),
            data: {meetingId: "#123FG8"},
            icon: "https://avatars2.githubusercontent.com/u/19695477?v=3&s=200"
        });
        Controller.loadList({
            controllerOrigin: this,
            entity: new Conta(),
            orderBy: "nome",
            template: this.TEMPLATE_LISTA,
            navLeft: {
                icon: iconUtil.back,
                callbackClick: function () {
                    mainController.render();
                }
            },
            navCenter: {
                title: i18next.t("conta-controller.plural"),
                icon: ""
            },
            floatButton: {
                display: "block",
                callbackAdd: function () {
                    contaController.loadNewOrSingleEdit();
                }
            }
        }, function () {
            if (cb) {
                cb();
            }
        });
    },
    loadNewOrSingleEdit: function (data, cb) {
        Controller.loadNewOrSingleEdit({
            controllerOrigin: contaController,
            entity: new Conta(),
            template: this.TEMPLATE_CADASTRO,
            navLeft: {
                icon: iconUtil.back,
                callbackClick: function () {
                    contaController.loadList();
                }
            },
            navCenter: {
                title: i18next.t("conta-controller.singular"),
                icon: (data) ? iconUtil.edit : iconUtil.add
            },
            inputToFocus: "#nome"
        }, data, function () {
            if (cb) {
                cb();
            }
        });
    },
    loadMultipleEdit: function (data, cb) {
        Controller.loadMultipleEdit({
            controllerOrigin: contaController,
            entity: new Conta(),
            template: this.TEMPLATE_EDICAO,
            navLeft: {
                icon: iconUtil.back,
                callbackClick: function () {
                    contaController.loadList();
                }
            },
            navCenter: {
                title: i18next.t("conta-controller.plural"),
                icon: iconUtil.edit
            }
        }, data, function () {
            if (cb) {
                cb();
            }
        });
    },
    selecionaCampoEdicaoMultipla: function () {
        var campo = $("#select-campo").val();

        if (campo === "nome") {
            $("#prompt-campo").html(i18next.t("conta-controller.field-nome"));
            $("#valor-campo").prop("name", "nome");
            $("#valor-campo").prop("type", "text");
        } else if (campo === "dataFundacao") {
            $("#prompt-campo").html(i18next.t("conta-controller.field-dataFundacao"));
            $("#valor-campo").prop("name", "dataFundacao");
            $("#valor-campo").prop("type", "date");
        } else if (campo === "valorSaldoInicial") {
            $("#prompt-campo").html(i18next.t("conta-controller.field-valorSaldoInicial"));
            $("#valor-campo").prop("name", "valorSaldoInicial");
            $("#valor-campo").prop("type", "number");
        }
        $("#prompt-campo").addClass("active");
    },
    validaFormulario: function (conta, cb, field) {
        if (!field) {
            if (!conta.nome) {
                alertUtil.confirm(i18next.t("conta-controller.alert-nome-req"));
            } else if (!conta.dataFundacao) {
                alertUtil.confirm(i18next.t("conta-controller.alert-dataFundacao-req"));
            } else if (!conta.valorSaldoInicial) {
                alertUtil.confirm(i18next.t("conta-controller.alert-valorSaldoInicial-req"));
            } else {
                if (cb) {
                    cb();
                }
            }
        } else {
            if (cb) {
                cb();
            }
        }
    },
    loadNewModal: function (element, callbackAction) {
        Controller.loadNewModal({
            controllerModal: contaController,
            entity: new Conta(),
            element: element,
            templateCadastro: contaController.TEMPLATE_CADASTRO,
            tituloNavCenter: i18next.t("conta-controller.singular"),
            columnToReRender: "nome",
            orderByReRender: "nome",
            callbackAction: function () {
                if (callbackAction) {
                    callbackAction();
                }
            },
            labelSelect: i18next.t("conta-controller.field-select-conta")
        });
    }
}; 