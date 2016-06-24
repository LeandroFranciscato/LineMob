/* global Mustache, logUtil, mainController, contaModel, alertUtil, daoUtil */

var contaController = {
    TEMPLATE_CONTA_CADASTRO: "",
    TEMPLATE_CONTA_LISTA: "",
    TEMPLATE_CONTA_EDICAO: "",
    OBJECT_TO_BIND: "#scroller",
    loadLista: function (inicial, final, cb) {

        if (!inicial) {
            inicial = 0;
        }

        if (!final) {
            final = 3;
        }

        var conta = new Conta();
        daoUtil.getByRange(conta, "nome", inicial, final, function (results) {
            var data = {};
            data.contas = results;
            contaController.render("lista", data, function () {
                contaController.mostraBotaoVoltarLista();
                if (cb) {
                    cb();
                }
            });
        });
    },
    loadContaCadastro: function () {
        contaController.render("cadastro", null, function () {
            contaController.mostraBotaoVoltarCadastro();
        });
    },
    loadContaEdicao: function () {
        var contas = $('#tab-contas').tableToJSON();
        var conta = {};
        var qtdeSelecionados = 0;

        for (var i = 0; i <= contas.length; i++) {
            if (contas[i] && contas[i].selecionado == 1) {
                qtdeSelecionados++;

                if (!conta.id || conta.id == undefined) {
                    conta.id = contas[i].id + "-";
                } else {
                    conta.id += contas[i].id + "-";
                }

                conta.nome = contas[i].Nome;
                conta.data = contas[i].Data;
                conta.saldo = contas[i].Saldo;
            }
        }

        var operacao = "";
        if (qtdeSelecionados === 0) {
            alertUtil.confirm("Selecione ao menos um (1) registro para editar.", " Editando...");
            return;
        } else if (qtdeSelecionados === 1) {
            contaController.render("cadastro", null, function () {
                $('#id-conta').val(conta.id);
                $('#nome-conta').val(conta.nome);
                $('#data-conta').val(conta.data);
                $('#saldo-conta').val(conta.saldo);
            });
        } else if (qtdeSelecionados > 1) {
            contaController.render("edicao", null, function () {
                $('#id-conta').val(conta.id);
            });
        }
        contaController.mostraBotaoVoltarCadastro();
    },
    render: function (operacao, data, cb) {
        var html;
        if (operacao === "lista") {
            Mustache.parse(this.TEMPLATE_CONTA_LISTA);
            html = Mustache.render(this.TEMPLATE_CONTA_LISTA, data);
        } else if (operacao === "cadastro") {
            Mustache.parse(this.TEMPLATE_CONTA_CADASTRO);
            html = Mustache.render(this.TEMPLATE_CONTA_CADASTRO);
        } else if (operacao === "edicao") {
            Mustache.parse(this.TEMPLATE_CONTA_EDICAO);
            html = Mustache.render(this.TEMPLATE_CONTA_EDICAO, data);
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
            var contas = tableToJSON("#tab-contas");
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
    insert: function () {
        var data = $("#form-cadastro-conta").serializeObject();
        var conta = new Conta();
        Object.setPrototypeOf(data, Object.getPrototypeOf(conta));
        
        if (data.id) {
            data.id = data.id.replace("-", "");            
            contaModel.update(data, function (results) {
                if (results && results.rowsAffected === 1) {
                    alertUtil.confirm("Conta Alterada com sucesso!");
                    contaController.loadLista();
                } else {
                    alertUtil.confirm("Problemas ao alterar Conta...");
                }
            });
        } else {
            var conta = new Conta();
            conta.nome = data.nome;
            conta.dataFundacao = data.dataFundacao;
            conta.valorSaldoInicial = data.valorSaldoInicial;

            daoUtil.insert(conta, function (rowsAffected) {
                if (rowsAffected === 1) {
                    alertUtil.confirm("Conta cadastrada com sucesso!");
                    contaController.loadLista();
                } else {
                    alertUtil.confirm("Problemas ao inserir Conta...");
                }
            });
        }
    },
    delete: function () {

        var buttons = ["Não", "Sim"];
        alertUtil.confirm("Deseja realmente deletar?", "Deletando...", buttons, function (btn) {

            if (btn == 2) {
                var contas = tableToJSON('#tab-contas');
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

        var campo = $("#nome-campo").prop("name");
        var valorCampo = $("#nome-campo").val();

        for (var i = 0; i < ids.length; i++) {
            if (ids[i]) {
                contaModel.updateColunaDinamica(ids[i], campo, valorCampo, function (res) {
                    if (res && res.rowsAffected != 1) {
                        alertUtil.confirm("Erro ao atualizar CONTA, id: " + ids[i]);
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
            $("#nome-campo").prop("name", "nome");
            $("#nome-campo").prop("type", "text");
        } else if (campo === "data") {
            $("#prompt-campo").html("Data Saldo Início");
            $("#nome-campo").prop("name", "data");
            $("#nome-campo").prop("type", "date");
        } else if (campo === "valor") {
            $("#prompt-campo").html("Saldo Inicial");
            $("#nome-campo").prop("name", "valor");
            $("#nome-campo").prop("type", "number");
        }
    },
    mostraBotaoVoltar: function () {
        $("#icone-menu").css("display", "none");
        $("#icone-voltar").css("display", "initial");
        $("#icone-voltar").unbind();
        $(document).unbind("backbutton");
    },
    mostraBotaoVoltarCadastro: function () {
        this.mostraBotaoVoltar();
        $("#icone-voltar").click(function () {
            contaController.loadLista();
        });
        $(document).bind("backbutton", function (evt) {
            contaController.loadLista();
        });
    },
    mostraBotaoVoltarLista: function () {
        this.mostraBotaoVoltar();
        $("#icone-voltar").click(function () {
            mainController.render(function () {
                mainController.mostraBotaoMenu();
            });
        });
        $(document).bind("backbutton", function (evt) {
            mainController.render(function () {
                mainController.mostraBotaoMenu();
            });
        });
    }
}; 