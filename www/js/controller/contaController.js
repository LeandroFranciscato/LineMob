/* global Mustache, logUtil, mainController, alertUtil, daoUtil, Controller, iconUtil */

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
                title: "CONTAS",
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
                title: "CONTA",
                icon: iconUtil.add
            }
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
                title: "CONTAS",
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
            $("#prompt-campo").html("Nome da Conta");
            $("#valor-campo").prop("name", "nome");
            $("#valor-campo").prop("type", "text");
        } else if (campo === "dataFundacao") {
            $("#prompt-campo").html("Data Início Saldo");
            $("#valor-campo").prop("name", "dataFundacao");
            $("#valor-campo").prop("type", "date");
        } else if (campo === "valorSaldoInicial") {
            $("#prompt-campo").html("Valor Saldo Inicial");
            $("#valor-campo").prop("name", "valorSaldoInicial");
            $("#valor-campo").prop("type", "number");
        }
    },
    validaFormulario: function (conta, callbackSucess) {
        if (!conta.nome) {
            alertUtil.confirm("Nome deve ser informado.");
        } else if (!conta.dataFundacao) {
            alertUtil.confirm("Data início do saldo deve ser informado.");
        } else if (!conta.valorSaldoInicial) {
            alertUtil.confirm("Valor do saldo inicial deve ser informado.");
        } else {
            if (callbackSucess) {
                callbackSucess();
            }
        }
    }
}; 