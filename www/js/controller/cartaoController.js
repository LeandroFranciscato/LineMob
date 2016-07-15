/* global Mustache, logUtil, mainController, alertUtil, daoUtil, Controller, iconUtil, i18next */

var cartaoController = {
    TEMPLATE_CADASTRO: "",
    TEMPLATE_LISTA: "",
    TEMPLATE_EDICAO: "",
    loadList: function (cb) {

        Controller.loadList({
            controllerOrigin: this,
            entity: new Cartao(),
            orderBy: "nome",
            template: this.TEMPLATE_LISTA,
            navLeft: {
                icon: iconUtil.back,
                callbackClick: function () {
                    mainController.render();
                }
            },
            navCenter: {
                title: i18next.t("cartao-controller.plural"),
                icon: ""
            },
            floatButton: {
                display: "block",
                callbackAdd: function () {
                    cartaoController.loadNewOrSingleEdit();
                }
            }
        }, function () {
            if (cb) {
                cb();
            }
        });
    },
    loadNewOrSingleEdit: function (data, cb) {
        var conta = new Conta();
        var inserting = true;
        daoUtil.getAll(conta, "nome", function (res) {
            if (data) {
                data.conta = res;
                inserting = false;
            } else {
                data = {};
                data.conta = [];
                data.conta = res;
            }
            Controller.loadNewOrSingleEdit({
                controllerOrigin: cartaoController,
                entity: new Cartao(),
                template: cartaoController.TEMPLATE_CADASTRO,
                navLeft: {
                    icon: iconUtil.back,
                    callbackClick: function () {
                        cartaoController.loadList();
                    }
                },
                navCenter: {
                    title: i18next.t("cartao-controller.singular"),
                    icon: (inserting === true) ? iconUtil.add : iconUtil.edit
                },
                inputToFocus: "#nome"
            }, data, function () {
                if (cb) {
                    cb();
                }
            });
        });
    },
    loadMultipleEdit: function (data, cb) {
        Controller.loadMultipleEdit({
            controllerOrigin: this,
            entity: new Cartao(),
            template: this.TEMPLATE_EDICAO,
            navLeft: {
                icon: iconUtil.back,
                callbackClick: function () {
                    cartaoController.loadList();
                }
            },
            navCenter: {
                title: i18next.t("cartao-controller.plural"),
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
            $("#prompt-campo").html(i18next.t("cartao-controller.field-nome"));
            $("#valor-campo").prop("type", "text");
        } else if (campo === "diaVencimento") {
            $("#prompt-campo").html(i18next.t("cartao-controller.field-diaVencimento"));
            $("#valor-campo").prop("type", "number");
        } else if (campo === "diaFechamento") {
            $("#prompt-campo").html(i18next.t("cartao-controller.field-diaFechamento"));
            $("#valor-campo").prop("type", "number");
        } else if (campo === "valorLimite") {
            $("#prompt-campo").html(i18next.t("cartao-controller.field-valorLimite"));
            $("#valor-campo").prop("type", "number");
        } else if (campo === "idConta") {
            $("#prompt-campo").html(i18next.t("cartao-controller.field-idConta"));
            $("#valor-campo").prop("type", "date");/********/
        }

        $("#valor-campo").prop("name", campo.toString());
    },
    validaFormulario: function (cartao, callbackSucess) {
        if (!cartao.nome) {
            alertUtil.confirm(i18next.t("cartao-controller.alert-nome-req"));
        } else if (!cartao.diaVencimento) {
            alertUtil.confirm(i18next.t("cartao-controller.alert-diaVencimento-req"));
        } else if (!cartao.diaFechamento) {
            alertUtil.confirm(i18next.t("cartao-controller.alert-diaFechamento-req"));
        } else if (!cartao.valorLimite) {
            alertUtil.confirm(i18next.t("cartao-controller.alert-valorLimite-req"));
        } else if (!cartao.idConta) {
            alertUtil.confirm(i18next.t("cartao-controller.alert-idConta-req"));
        } else {
            var conta = new Conta();
            conta.id = cartao.idConta;
            daoUtil.getById(conta, function (res) {
                if (res) {
                    if (callbackSucess) {
                        callbackSucess();
                    }
                } else {
                    alertUtil.confirm(i18next.t("cartao-controller.alert-idConta-not-exists"));
                }
            });
        }
    }
}; 