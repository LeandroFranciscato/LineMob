/* global Mustache, logUtil, mainController, alertUtil, daoUtil, Controller, iconUtil */

var contaController = {
    TEMPLATE_CONTA_CADASTRO: "",
    TEMPLATE_CONTA_LISTA: "",
    TEMPLATE_CONTA_EDICAO: "",
    loadLista: function (cb) {

        Controller.loadList({
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
                    contaController.loadContaCadastro();
                },
                callbackEdit: function () {
                    contaController.loadContaEdicao();
                },
                callbackRemove: function () {
                    contaController.delete();
                }
            }
        }, function () {
            if (cb) {
                cb();
            }
        });
    },
    loadContaCadastro: function (cb) {
        Controller.loadCadastro({
            entity: new Conta(),
            template: this.TEMPLATE_CONTA_CADASTRO,
            navLeft: {
                icon: iconUtil.back,
                callbackClick: function () {
                    contaController.loadLista();
                }
            },
            navCenter: {
                title: "CONTA",
                icon: iconUtil.add
            },            
        }, function () {
            if (cb) {
                cb();
            }
        });
    },
    loadContaEdicao: function () {
        var contas = tableToJSON("#ul-list-contas", "li", "div");
        var conta = new Conta();
        var qtdeSelecionados = 0;

        for (var i = 0; i <= contas.length; i++) {
            if (contas[i] && contas[i].selecionado == 1) {
                qtdeSelecionados++;

                if (!conta.id || conta.id == undefined) {
                    conta.id = contas[i].id + "-";
                } else {
                    conta.id += contas[i].id + "-";
                }
            }
        }

        if (qtdeSelecionados === 0) {
            alertUtil.confirm("Selecione ao menos um (1) registro para editar.", " Editando...");
            return;
        } else if (qtdeSelecionados === 1) {
            conta.id = conta.id.replace("-", "");
            daoUtil.getById(conta, function (res) {
                contaController.render("edicao", res);
            });
        } else if (qtdeSelecionados > 1) {
            contaController.render("multiplaEdicao", conta);
        }
    },
    checkInList: function (idConta) {

        if (!idConta) {
            var contas = tableToJSON("#ul-list-contas", "li", "div");

            var checkedAll = $('#check-conta').prop("checked");
            if (checkedAll && checkedAll === true) {
                $('#check-conta').prop("checked", false);
            } else {
                $('#check-conta').prop("checked", true);
            }

            for (var i = 0; i <= contas.length; i++) {
                if (contas[i]) {
                    $('#check-conta-' + contas[i].id).prop("checked", checkedAll);
                    this.checkInList(contas[i].id);
                }
            }
        }

        var checked = $('#check-conta-' + idConta).prop("checked");
        if (checked && checked === true) {
            $('#check-conta-' + idConta).prop("checked", false);
            checked = 0;
        } else {
            $('#check-conta-' + idConta).prop("checked", true);
            checked = 1;
        }
        $('#conta-selecionada-' + idConta).html(checked);
    },
    insert: function () {
        var data = $("#form-cadastro-conta").serializeObject();

        var conta = new Conta();
        conta.nome = data.nome;
        conta.dataFundacao = data.dataFundacao;
        conta.valorSaldoInicial = data.valorSaldoInicial;

        if (data.id) {
            data.id = data.id.replace("-", "");
            conta.id = data.id;
            this.validaFormulario(conta, function () {
                daoUtil.update(conta, function (rowsAffected) {
                    if (rowsAffected === 1) {
                        alertUtil.confirm("Conta Alterada com sucesso!");
                        contaController.loadLista();
                    } else {
                        alertUtil.confirm("Problemas ao alterar Conta...");
                    }
                });
            });
        } else {
            this.validaFormulario(conta, function () {
                daoUtil.insert(conta, function (rowsAffected) {
                    if (rowsAffected === 1) {
                        alertUtil.confirm("Conta cadastrada com sucesso!");
                        contaController.loadLista();
                    } else {
                        alertUtil.confirm("Problemas ao inserir Conta...");
                    }
                });
            });
        }
    },
    delete: function () {

        var contas = tableToJSON("#ul-list-contas", "li", "div");
        var qtSelecionadas = 0;
        for (var i = 0; i <= contas.length; i++) {
            if (contas[i] && contas[i].selecionado == 1) {
                qtSelecionadas += 1;
            }
        }

        if (qtSelecionadas === 0) {
            alertUtil.confirm("Selecione algum registro para deletar!");
            return;
        }

        var buttons = ["Não", "Sim"];
        alertUtil.confirm("Deseja realmente deletar " + qtSelecionadas + " registro(s)?", "Deletando...", buttons, function (btn) {

            if (btn == 2) {
                for (var i = 0; i <= contas.length; i++) {

                    if (contas[i] && contas[i].selecionado == 1) {
                        var conta = new Conta();
                        conta.id = contas[i].id;
                        daoUtil.delete(conta, function (res) {
                            if (res != 1) {
                                alertUtil.confirm("Erro ao deletar conta: " + conta, id);
                            }
                        });
                    }
                }
                alertUtil.confirm("Deletado com Sucesso!");
                contaController.loadLista();
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
        contaController.loadLista();
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
        this.loadLista();
    }
}; 