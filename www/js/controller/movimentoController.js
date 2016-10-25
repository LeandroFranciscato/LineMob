/* global Mustache, logUtil, mainController, alertUtil, daoUtil, Controller, iconUtil, i18next, dateUtil */

var movimentoController = {
    TEMPLATE_CADASTRO: "",
    TEMPLATE_LISTA: "",
    TEMPLATE_EDICAO: "",
    loadList: function (cb) {

        Controller.loadList({
            controllerOrigin: this,
            entity: new Movimento(),
            orderBy: "id",
            isDescent: true,
            template: movimentoController.TEMPLATE_LISTA,
            navLeft: {
                icon: iconUtil.back,
                callbackClick: function () {
                    mainController.render();
                }
            },
            navCenter: {
                title: i18next.t("movimento-controller.plural"),
                icon: ""
            },
            floatButton: {
                display: "block",
                callbackAdd: function () {
                    movimentoController.loadNewOrSingleEdit();
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
            var categoria = new Categoria();
            daoUtil.getAll(categoria, "nome", function (res) {
                if (data) {
                    data.categoria = res;
                    for (var i = 0; i < data.categoria.length; i++) {
                        if (data.categoria[i].id == data.idCategoria) {
                            data.categoria[i].selected = "selected";
                        }
                    }
                } else {
                    data.categoria = [];
                    data.categoria = res;
                }
                var pessoa = new Pessoa();
                daoUtil.getAll(pessoa, "apelido", function (res) {
                    if (data) {
                        data.pessoa = res;
                        for (var i = 0; i < data.pessoa.length; i++) {
                            if (data.pessoa[i].id == data.idPessoa) {
                                data.pessoa[i].selected = "selected";
                            }
                        }
                    } else {
                        data.pessoa = [];
                        data.pessoa = res;
                    }
                    var cartao = new Cartao();
                    daoUtil.getAll(cartao, "nome", function (res) {
                        if (data) {
                            data.cartao = res;
                            for (var i = 0; i < data.cartao.length; i++) {
                                if (data.cartao[i].id == data.idCartao) {
                                    data.cartao[i].selected = "selected";
                                }
                            }
                        } else {
                            data.cartao = [];
                            data.cartao = res;
                        }
                        (data.natureza === "C") ? data.naturezaC = "1" : data.naturezaD = "1";
                        Controller.loadNewOrSingleEdit({
                            controllerOrigin: movimentoController,
                            entity: new Movimento(),
                            template: movimentoController.TEMPLATE_CADASTRO,
                            navLeft: {
                                icon: iconUtil.back,
                                callbackClick: function () {
                                    movimentoController.loadList();
                                }
                            },
                            navCenter: {
                                title: i18next.t("movimento-controller.singular"),
                                icon: (!inserting) ? iconUtil.edit : iconUtil.add
                            },
                            navRight: {
                                display: "block",
                                iconName: iconUtil.check,
                                callbackClick: function () {
                                    movimentoController.insert();
                                }
                            },
                            inputToFocus: "#data"
                        }, data, function () {
                            $("#select-conta-origem-row").addClass("hide");
                            $("#select-conta-destino-row").addClass("hide");
                            Controller.initializePlugins();
                            if (cb) {
                                cb();
                            }
                        });
                    });
                });
            });
        });
    },
    loadMultipleEdit: function (data, cb) {
        var conta = new Conta();
        daoUtil.getAll(conta, "nome", function (res) {
            if (data) {
                data.conta = res;
            }
            var categoria = new Categoria();
            daoUtil.getAll(categoria, "nome", function (res) {
                if (data) {
                    data.categoria = res;
                }
                var pessoa = new Pessoa();
                daoUtil.getAll(pessoa, "nome", function (res) {
                    if (data) {
                        data.pessoa = res;
                    }
                    var cartao = new Cartao();
                    daoUtil.getAll(cartao, "nome", function (res) {
                        if (data) {
                            data.cartao = res;
                        }
                        var natureza = [];
                        natureza.push({D: "Débito"});
                        natureza.push({C: "Crédito"});
                        data.natureza = natureza;
                        Controller.loadMultipleEdit({
                            controllerOrigin: movimentoController,
                            entity: new Movimento(),
                            template: movimentoController.TEMPLATE_EDICAO,
                            navLeft: {
                                icon: iconUtil.back,
                                callbackClick: function () {
                                    movimentoController.loadList();
                                }
                            },
                            navCenter: {
                                title: i18next.t("movimento-controller.plural"),
                                icon: iconUtil.edit
                            }
                        }, data, function () {
                            if (cb) {
                                cb();
                            }
                        });
                    });
                });
            });
        });
    },
    selecionaCampoEdicaoMultipla: function () {
        var campo = $("#select-campo").val();

        var selects = ["natureza", "idConta", "idCategoria", "idPessoa", "idCartao"];

        if (selects.indexOf(campo) >= 0) {
            $("#input-text").addClass("hide");
            $("#input-select").removeClass("hide");
            $("#valor-campo").prop("id", "id-temp");

            $("#naturezaAux").addClass("hide");
            $("#idContaAux").addClass("hide");
            $("#idCategoriaAux").addClass("hide");
            $("#idPessoaAux").addClass("hide");
            $("#idCartaoAux").addClass("hide");

            if (campo === "natureza") {
                $("#naturezaAux").removeClass("hide");
                $("#select-natureza").prop("id", "valor-campo");
            } else if (campo === "idConta") {
                $("#idContaAux").removeClass("hide");
                $("#select-conta").prop("id", "valor-campo");
            } else if (campo === "idCategoria") {
                $("#idCategoriaAux").removeClass("hide");
                $("#select-categoria").prop("id", "valor-campo");
            } else if (campo === "idPessoa") {
                $("#idPessoaAux").removeClass("hide");
                $("#select-pessoa").prop("id", "valor-campo");
            } else if (campo === "idCartao") {
                $("#idCartaoAux").removeClass("hide");
                $("#select-cartao").prop("id", "valor-campo");
            }
        } else {
            $("#input-text").removeClass("hide");
            $("#input-select").addClass("hide");
            $("#valor-campo").prop("id", "id-temp");
            $("#id-temp").prop("id", "valor-campo");

            $("#valor-campo").val("");

            if (campo === "valor") {
                $("#valor-campo").mask("000000000.00", {reverse: true});
            } else {
                $("#valor-campo").unmask();
            }

            if (campo === "dataVencimento") {
                $("#prompt-campo").html(i18next.t("movimento-controller.field-dataVencimento"));
                $("#valor-campo").prop("type", "date");
            } else if (campo === "dataLancamento") {
                $("#prompt-campo").html(i18next.t("movimento-controller.field-dataLancamento"));
                $("#valor-campo").prop("type", "date");
            } else if (campo === "valor") {
                $("#prompt-campo").html(i18next.t("movimento-controller.field-valor"));
                $("#valor-campo").prop("type", "number");
            } else if (campo === "descricao") {
                $("#prompt-campo").html(i18next.t("movimento-controller.field-descricao"));
                $("#valor-campo").prop("type", "text");
            }

            $("#valor-campo").prop("name", campo.toString());
        }
    },
    validaFormulario: function (movimento, cb, field) {
        if (!field) {
            if (!movimento.dataVencimento) {
                alertUtil.confirm(i18next.t("movimento-controller.alert-dataVencimento-req"));
            } else if (!movimento.dataLancamento) {
                alertUtil.confirm(i18next.t("movimento-controller.alert-dataLancamento-req"));
            } else if (!movimento.valor) {
                alertUtil.confirm(i18next.t("movimento-controller.alert-valor-req"));
            } else if (!movimento.descricao) {
                alertUtil.confirm(i18next.t("movimento-controller.alert-descricao-req"));
            } else if ((!movimento.idConta || movimento.idConta == "+") && movimento.natureza != "T") {
                alertUtil.confirm(i18next.t("movimento-controller.alert-idConta-req"));
            } else if ((!movimento.idContaOrigem || !movimento.idContaDestino) && movimento.natureza == "T") {
                alertUtil.confirm(i18next.t("movimento-controller.alert-idConta-req"));
            } else if ((movimento.idContaOrigem == movimento.idContaDestino) && movimento.natureza == "T") {
                alertUtil.confirm(i18next.t("movimento-controller.alert-equal-idContaOrigem-idContaDestino"));
            } else if (!movimento.idCategoria || movimento.idCategoria == "+") {
                alertUtil.confirm(i18next.t("movimento-controller.alert-idCategoria-req"));
            } else if (!movimento.idPessoa || movimento.idPessoa == "+") {
                alertUtil.confirm(i18next.t("movimento-controller.alert-idPessoa-req"));
            } else if (movimento.repeat > 0) {
                if (movimento.countRepeat == 0) {
                    alertUtil.confirm(i18next.t("movimento-controller.alert-repeat-wrong"));
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
        } else {
            if (cb) {
                cb();
            }
        }
    },
    preparaTransferencia: function (element) {
        if ($(element).val() === "T") {
            $("#select-conta-origem-row").removeClass("hide");
            $("#select-conta-destino-row").removeClass("hide");
            $("#select-conta-row").addClass("hide");
            $("#repeat-card-panel").addClass("hide");
        } else {
            $("#select-conta-origem-row").addClass("hide");
            $("#select-conta-destino-row").addClass("hide");
            $("#select-conta-row").removeClass("hide");
            $("#repeat-card-panel").removeClass("hide");
        }
        Controller.initializePlugins();
    },
    insert: function (sucessMessage, errorMessage, cb) {
        var movimento = $("#form-cadastro").serializeObject();
        Object.setPrototypeOf(movimento, new Movimento());

        // Preparação para a Transferência
        var idContaOrigem = movimento.idContaOrigem;
        var idContaDestino = movimento.idContaDestino;
        movimento.isTransferencia = (movimento.natureza == "T") ? 1 : 0;

        if (movimento.id) {
            sucessMessage = (!sucessMessage) ? i18next.t("alerts-crud.body-edit-success") : sucessMessage;
            errorMessage = (!errorMessage) ? i18next.t("generics.fail-crud-msg") : errorMessage;
            movimentoController.validaFormulario(movimento, function () {
                delete movimento.idContaOrigem;
                delete movimento.idContaDestino;
                movimento.updated = 1;
                daoUtil.update(movimento, function (rowsAffected) {
                    if (rowsAffected === 1) {
                        alertUtil.confirm(sucessMessage);
                        movimentoController.loadList(function () {
                            if (cb) {
                                cb();
                            }
                        });
                    } else {
                        alertUtil.confirm(errorMessage);
                    }
                }, 1);
            });
        } else {
            sucessMessage = (!sucessMessage) ? i18next.t("alerts-crud.body-insert-success") : sucessMessage;
            errorMessage = (!errorMessage) ? i18next.t("generics.fail-crud-msg") : errorMessage;

            movimentoController.validaFormulario(movimento, function () {

                delete movimento.idContaOrigem;
                delete movimento.idContaDestino;

                var countRepeat = [];
                if (movimento.repeat > 0) {
                    for (var i = 1; i <= movimento.countRepeat; i++) {
                        countRepeat.push(i);
                    }
                } else {
                    if (movimento.isTransferencia) {
                        countRepeat = [1, 2];
                    } else {
                        countRepeat = [1];
                    }
                }

                var descricaoAux;
                countRepeat.forEach(function (i) {
                    if (movimento.dataVencimento && movimento.repeat > 0) {
                        movimento.dataVencimento = (i == 1) ? movimento.dataVencimento : dateUtil.increment(movimento.dataVencimento, movimento.repeat);
                    }
                    if (movimento.descricao && movimento.repeat > 0) {
                        if (!descricaoAux) {
                            descricaoAux = movimento.descricao;
                        }
                        movimento.descricao = descricaoAux + " " + i + "/" + movimento.countRepeat;
                    }
                    if (movimento.isTransferencia) {
                        if (!descricaoAux) {
                            descricaoAux = movimento.descricao;
                        }
                        if (i == 1) {
                            movimento.natureza = "D";
                            movimento.descricao = descricaoAux + " - ";
                        } else {
                            movimento.natureza = "C";
                            movimento.descricao = descricaoAux + " + ";
                        }
                    }
                    daoUtil.insert(movimento, function (rowsAffected) {
                        if (rowsAffected != 1) {
                            alertUtil.confirm(errorMessage);
                        }
                    });
                });

                alertUtil.confirm(sucessMessage);
                movimentoController.loadList(function () {
                    if (cb) {
                        cb();
                    }
                });
            });
        }
    }
}; 