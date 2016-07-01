/* global Mustache, logUtil, mainController, alertUtil, daoUtil */

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
            final = 20;
        }

        var conta = new Conta();
        daoUtil.getByRange(conta, "nome", inicial, final, function (results) {
            var data = {};
            data.contas = results;
            contaController.render("lista", data, function () {                
                if (cb) {
                    cb();
                }
            });
        });
    },
    loadContaCadastro: function () {
        contaController.render("cadastro");
    },
    loadContaEdicao: function () {
        var contas = tableToJSON("#ul-list-contas", "li", "div");
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

                conta.nome = contas[i].nome;
                conta.dataFundacao = contas[i].dataFundacao;
                conta.valorSaldoInicial = contas[i].valorSaldoInicial;
            }
        }

        if (qtdeSelecionados === 0) {
            alertUtil.confirm("Selecione ao menos um (1) registro para editar.", " Editando...");
            return;
        } else if (qtdeSelecionados === 1) {
            contaController.render("cadastro", conta);
        } else if (qtdeSelecionados > 1) {
            contaController.render("edicao", conta);
        }        
    },
    render: function (operacao, data, cb) {
        var html;
        if (operacao === "lista") {
            Mustache.parse(this.TEMPLATE_CONTA_LISTA);
            html = Mustache.render(this.TEMPLATE_CONTA_LISTA, data);
        } else if (operacao === "cadastro") {
            Mustache.parse(this.TEMPLATE_CONTA_CADASTRO);
            data = (data) ? data : {};
            html = Mustache.render(this.TEMPLATE_CONTA_CADASTRO, data);
        } else if (operacao === "edicao") {
            Mustache.parse(this.TEMPLATE_CONTA_EDICAO);
            html = Mustache.render(this.TEMPLATE_CONTA_EDICAO, data);
        }

        $(contaController.OBJECT_TO_BIND).html(html);
        if (mainController.SITUACAO_MENU_ESQUERDO === 1) {
            mainController.menuEsquerdo();
        }
        loaded();

        if (operacao === "lista") {
            $("#icon-right-nav").attr("data-activates", "dropdown-contaLista");
            $("#text-icon-right-nav").html("&#xE5D4;");
            $(".dropdown-button").dropdown({
                belowOrigin: true
            });

            $(".titulo-center-nav").html("CONTAS");

            $("#icon-left-nav").unbind();
            $(document).unbind("backbutton");
            $("#icon-left-nav").on("click", function () {
                mainController.render();
            });
            $("#text-icon-left-nav").html("&#xE5C4;");
        } else if (operacao === "cadastro") {
            $("#icon-right-nav").attr("data-activates", "");
            $("#text-icon-right-nav").html("&#xE876;");
            $(".dropdown-button").dropdown({
                belowOrigin: true
            });

            $(".titulo-center-nav").html("NOVA CONTA");
            
            $("#icon-left-nav").unbind();
            $(document).unbind("backbutton");
            $("#icon-left-nav").on("click", function () {
                contaController.loadLista();
            });
            $("#text-icon-left-nav").html("&#xE5C4;");
        } else if (operacao === "edicao") {
            $("#icon-right-nav").attr("data-activates", "");
            $("#text-icon-right-nav").html("&#xE876;");
            $(".dropdown-button").dropdown({
                belowOrigin: true
            });
            
            $(".titulo-center-nav").html("EDIÇÃO DE CONTA(S)");
            
            $("#icon-left-nav").unbind();
            $(document).unbind("backbutton");
            $("#icon-left-nav").on("click", function () {
                contaController.loadLista();
            });
            $("#text-icon-left-nav").html("&#xE5C4;");                        
        }

        if (cb) {
            cb();
        }
    },
    checkInList: function (idConta) {

        if (!idConta) {
            var contas = tableToJSON("#ul-list-contas", "li", "div");
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
        conta.nome = data.nome;
        conta.dataFundacao = data.dataFundacao;
        conta.valorSaldoInicial = data.valorSaldoInicial;

        if (data.id) {
            data.id = data.id.replace("-", "");
            conta.id = data.id;
            daoUtil.update(conta, function (rowsAffected) {
                if (rowsAffected === 1) {
                    alertUtil.confirm("Conta Alterada com sucesso!");
                    contaController.loadLista();
                } else {
                    alertUtil.confirm("Problemas ao alterar Conta...");
                }
            });
        } else {
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
                var contas = tableToJSON("#ul-list-contas", "li", "div");
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
            $("#prompt-campo").html("Data Saldo Início");
            $("#valor-campo").prop("name", "dataFundacao");
            $("#valor-campo").prop("type", "date");
        } else if (campo === "valorSaldoInicial") {
            $("#prompt-campo").html("Saldo Inicial");
            $("#valor-campo").prop("name", "valorSaldoInicial");
            $("#valor-campo").prop("type", "number");
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