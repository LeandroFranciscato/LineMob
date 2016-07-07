/* global Mustache, logUtil, mainController, alertUtil, daoUtil, Controller, iconUtil */

var contaController = {
    TEMPLATE_CONTA_CADASTRO: "",
    TEMPLATE_CONTA_LISTA: "",
    TEMPLATE_CONTA_EDICAO: "",
    loadList: function (cb) {

        Controller.loadList({
            controllerOrigin: this,
            entity: new Conta(),
            orderBy: "nome",
            template: this.TEMPLATE_CONTA_LISTA,
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
            template: this.TEMPLATE_CONTA_CADASTRO,
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
    updateMultiplaEscolha: function () {
        var ids = $("#id-conta").val();
        ids = ids.split("-");

        var campo = $("#valor-campo").prop("name");
        var valorCampo = $("#valor-campo").val();

        if (!valorCampo) {
            alertUtil.confirm("Campo deve ser preenchido.");
            return;
        }

        for (var i = 0; i < ids.length; i++) {
            if (ids[i]) {

                var conta = new Conta();
                conta.id = ids[i];
                conta[campo] = valorCampo;

                daoUtil.updateDinamicColumn(conta, campo, function (rowsAffected) {
                    if (rowsAffected != 1) {
                        alertUtil.confirm("Erro ao atualizar CONTA, id: " + conta.id);
                    }
                });
            }
        }
        alertUtil.confirm("Contas atualizadas com sucesso!");
        contaController.loadList();
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
    },
    closeSearchField: function () {
        mainController.closeSearchField();
        this.loadList();
    }
}; 