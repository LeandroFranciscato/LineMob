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
                for (var i = 0; i < data.conta.length; i++) {
                    if (data.conta[i].id == data.idConta) {
                        data.conta[i].selected = "selected";
                    }
                }
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
        var conta = new Conta();
        daoUtil.getAll(conta, "nome", function (res) {
            if (data) {
                data.conta = res;
            }
            Controller.loadMultipleEdit({
                controllerOrigin: cartaoController,
                entity: new Cartao(),
                template: cartaoController.TEMPLATE_EDICAO,
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
        });
    },
    selecionaCampoEdicaoMultipla: function () {
        var campo = $("#select-campo").val();

        if (campo === "idConta") {
            $("#input-text").addClass("hide");
            $("#input-select").removeClass("hide");
            $("#valor-campo").prop("id", "id-temp");
            $("#select-conta").prop("id", "valor-campo");
        } else {
            $("#input-text").removeClass("hide");
            $("#input-select").addClass("hide");
            $("#valor-campo").prop("id", "id-temp");
            $("#id-temp").prop("id", "valor-campo");

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
            }

            $("#valor-campo").prop("name", campo.toString());
        }
    },
    validaFormulario: function (cartao, cb, field) {
        if (!field) {
            //REQUIREMENTS
            if (!cartao.nome) {
                alertUtil.confirm(i18next.t("cartao-controller.alert-nome-req"));
            } else if (!cartao.diaVencimento) {
                alertUtil.confirm(i18next.t("cartao-controller.alert-diaVencimento-req"));
            } else if (!cartao.diaFechamento) {
                alertUtil.confirm(i18next.t("cartao-controller.alert-diaFechamento-req"));
            } else if (!cartao.valorLimite) {
                alertUtil.confirm(i18next.t("cartao-controller.alert-valorLimite-req"));
            } else if (!cartao.idConta || cartao.idConta == "new") {
                alertUtil.confirm(i18next.t("cartao-controller.alert-idConta-req"));
            }
            //OTHER VALIDATIONS
            else if (cartao.diaVencimento <= 0 || cartao.diaVencimento > 28) {
                alertUtil.confirm(i18next.t("cartao-controller.alert-diaVencimento-val"));
            } else if (cartao.diaFechamento <= 0 || cartao.diaFechamento > 30) {
                alertUtil.confirm(i18next.t("cartao-controller.alert-diaFechamento-val"));
            } else if (cartao.valorLimite <= 0) {
                alertUtil.confirm(i18next.t("cartao-controller.alert-valorLimite-val"));
            } else {
                if (cb) {
                    cb();
                }
            }
        } else {
            if (field.name == "diaVencimento") {
                if (field.value <= 0 || field.value > 28) {
                    alertUtil.confirm(i18next.t("cartao-controller.alert-diaVencimento-val"));
                    if (cb) {
                        cb(true);
                    }
                } else {
                    if (cb) {
                        cb();
                    }
                }
            } else if (field.name == "diaFechamento") {
                if (field.value <= 0 || field.value > 30) {
                    alertUtil.confirm(i18next.t("cartao-controller.alert-diaFechamento-val"));
                    if (cb) {
                        cb(true);
                    }
                } else {
                    if (cb) {
                        cb();
                    }
                }
            } else if (field.name == "valorLimite") {
                if (field.value <= 0) {
                    alertUtil.confirm(i18next.t("cartao-controller.alert-valorLimite-val"));
                    if (cb) {
                        cb(true);
                    }
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
        }
    },
    loadNewModal: function (element, callbackAction) {
        // if para não ir sempre ao BD //
        if ($(element).val() === "+") {
            var conta = new Conta();
            daoUtil.getAll(conta, "nome", function (res) {
                var data = {};
                data.conta = [];
                data.conta = res;
                Controller.loadNewModal({
                    controllerModal: cartaoController,
                    entity: new Cartao(),
                    element: element,
                    templateCadastro: cartaoController.TEMPLATE_CADASTRO,
                    tituloNavCenter: i18next.t("cartao-controller.singular"),
                    columnToReRender: "nome",
                    orderByReRender: "nome",
                    callbackAction: function () {
                        if (callbackAction) {
                            callbackAction();
                        }
                    },
                    labelSelect: i18next.t("cartao-controller.field-select-cartao"),
                    data: data
                });
            });
        }
    }
}; 