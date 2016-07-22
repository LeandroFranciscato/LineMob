/* global Mustache, logUtil, mainController, alertUtil, daoUtil, Controller, iconUtil, i18next */

var contaController = {
    TEMPLATE_CADASTRO: "",
    TEMPLATE_LISTA: "",
    TEMPLATE_EDICAO: "",
    loadList: function (cb) {
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
    loadNewModal: function (element, callbackAction) {
        if ($(element).val() === "") {
            Controller.renderHtml({}, this.TEMPLATE_CADASTRO, "#modal-aux-form-content");
            Controller.initializePlugins();
            $("#titulo-center-modal").html("CONTA");
            loadScrollModal();
            $("#icon-right-modal").unbind("click");
            $("#icon-right-modal").on("click", function () {
                var data = $("#form-modal").serializeObject();
                var conta = new Conta();
                Object.setPrototypeOf(data, conta);
                contaController.validaFormulario(data, function () {
                    daoUtil.insert(data, function (rowsAffected) {
                        if (rowsAffected === 1) {
                            alertUtil.confirm(i18next.t("alerts-crud.body-insert-success"));
                            $("#modal").closeModal();
                            $("#select-conta").html("<option value='' disabled selected>" + i18next.t("cartao-controller.field-select-conta") + "</option>");
                            $("#select-conta").append("<option value=''>+</option>");
                            daoUtil.getAll(conta, "nome", function (res) {
                                for (var i = 0; i < res.length; i++) {
                                    $("#select-conta").append("<option value='" + res[i].id + "'>" + res[i].nome + "</option>");
                                }
                                $('select').material_select();
                            });
                        } else {
                            alertUtil.confirm(i18next.t("generics.fail-crud-msg"));
                        }
                    });
                });
            });
            $(document).unbind("backbutton");
            $(document).on("backbutton", function () {
                $("#modal").closeModal();
                $(document).on("backbutton", function () {
                    if (callbackAction) {
                        callbackAction();
                    }
                });
            });
            $("#modal").openModal({dismissible: false});
        }
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

    }
}; 