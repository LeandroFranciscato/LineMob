/* global Mustache, logUtil, mainController, contaModel, alertUtil */

var contaController = {
    TEMPLATE_CONTA_CADASTRO: "",
    TEMPLATE_CONTA_LISTA: "",
    OBJECT_TO_BIND: "#scroller",
    load: function (inicial, final, cb) {

        if (!inicial) {
            inicial = 1;
        }

        if (!final) {
            final = 3;
        }

        Mustache.parse(this.TEMPLATE_CONTA_LISTA);
        contaModel.getByRange(inicial, final, function (results) {
            var dados = {};
            dados.contas = [];

            if (results && results.item) {
                for (var i = 0; i < results.length; i++) {
                    dados.contas.push(results.item(i));
                }
            }
            contaController.render(dados, function () {
                contaController.mostraBotaoVoltarLista();
                if (cb) {
                    cb();
                }
            });
        });
    },
    render: function (data, cb) {
        var html;
        if (data) {
            html = Mustache.render(contaController.TEMPLATE_CONTA_LISTA, data);
        } else {
            html = Mustache.render(contaController.TEMPLATE_CONTA_CADASTRO);
        }
        mainController.render();
        $(contaController.OBJECT_TO_BIND).html(html);
        if (mainController.SITUACAO_MENU_ESQUERDO === 1) {
            mainController.menuEsquerdo();
        }
        loaded();
        if (cb) {
            cb();
        }
    },
    checkInList: function (idConta) {

        if (!idConta) {
            var contas = $('#tab-contas').tableToJSON();
            for (var i = 0; i <= contas.length; i++) {
                if (contas[i]) {
                    var checkedAll = $('#check-conta').prop("checked");
                    $('#check-conta-' + contas[i].id).prop("checked", checkedAll);
                    this.checkInList(contas[i].id);
                }
            }
        }

        var checked = $('#check-conta-' + idConta).prop("checked");
        if (checked && checked === true) {
            checked = 1;
        } else {
            checked = 0;
        }
        $('#conta-selecionada-' + idConta).html(checked);
    },
    novo: function () {
        Mustache.parse(this.TEMPLATE_CONTA_CADASTRO);
        contaController.render(null, function () {
            contaController.mostraBotaoVoltarCadastro();
        });

    },
    insert: function () {
        var data = $("#form-cadastro-conta").serializeObject();
        if (data.id) {
            contaModel.update(data, function (results) {
                if (results && results.rowsAffected === 1) {
                    alertUtil.confirm("Conta alterada com sucesso!");
                    contaController.load();
                } else {
                    alertUtil.confirm("Problemas ao alterar Conta...");
                }
            });
        } else {
            contaModel.insert(data, function (results) {
                if (results && results.rowsAffected === 1) {
                    alertUtil.confirm("Conta cadastrada com sucesso!");
                    contaController.load();
                } else {
                    alertUtil.confirm("Problemas ao inserir Conta...");
                }
            });
        }
    },
    editar: function (data) {
        Mustache.parse(this.TEMPLATE_CONTA_CADASTRO);
        contaController.render(null, function () {
            $('#id-conta').prop("value", data.id);
            $('#nome-conta').prop("value", data.nome);
            $('#data-conta').prop("value", data.data);
            $('#saldo-conta').prop("value", data.saldo);
            contaController.mostraBotaoVoltarCadastro();
        });
    },
    edit: function () {
        var qtdeSelecionados = 0;
        var contas = $('#tab-contas').tableToJSON();
        var conta = {};

        for (var i = 0; i <= contas.length; i++) {
            if (contas[i] && contas[i].selecionado == 1) {
                qtdeSelecionados++;
                conta.id = contas[i].id;
                conta.nome = contas[i].Nome;
                conta.data = contas[i].Data;
                conta.saldo = contas[i].Saldo;
            }
        }

        if (qtdeSelecionados > 1 || qtdeSelecionados === 0) {
            alertUtil.confirm("Selecione um (1) registro para editar.", " Editando...");
        } else {
            this.editar(conta);
        }
    },
    delete: function () {

        var buttons = ["Não", "Sim"];
        alertUtil.confirm("Deseja realmente deletar?", "Deletando...", buttons, function (btn) {

            if (btn == 2) {
                var contas = $('#tab-contas').tableToJSON();
                for (var i = 0; i <= contas.length; i++) {
                    if (contas[i] && contas[i].selecionado == 1) {
                        contaModel.delete(contas[i].id,
                                function (res) {
                                    if (res && res.rowsAffected !== 1) {
                                        alertUtil.confirm("Erro ao deletar CONTA, id:" + contas[i].id);
                                    }
                                });
                    }
                }
                alertUtil.confirm("Deletado com Sucesso!");
                contaController.load();
            }
        });
    },
    mostraBotaoVoltar: function () {
        $("#icone-menu").css("display", "none");
        $("#icone-voltar").css("display", "initial");
        $("#icone-voltar").unbind();
    },
    mostraBotaoVoltarCadastro: function () {
        this.mostraBotaoVoltar();
        $("#icone-voltar").click(function () {
            contaController.load();
        });
    },
    mostraBotaoVoltarLista: function () {
        this.mostraBotaoVoltar();
        $("#icone-voltar").click(function () {
            mainController.render(function () {
                mainController.mostraBotaoMenu();
            });
        });
    }
}; 