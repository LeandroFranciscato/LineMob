/* global Mustache, logUtil, mainController, alertUtil, daoUtil, Controller, iconUtil, i18next */

var movimentoController = {
    TEMPLATE_CADASTRO: "",
    TEMPLATE_LISTA: "",
    TEMPLATE_EDICAO: "",
    loadList: function (cb) {

        Controller.loadList({
            controllerOrigin: this,
            entity: new Movimento(),
            orderBy: "id desc",
            template: this.TEMPLATE_LISTA,
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
                            inputToFocus: "#data"
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

        var selects = ["idConta", "idCategoria", "idPessoa", "idCartao", "natureza"];

        if (selects.indexOf(campo) >= 0) {
            $("#input-text").addClass("hide");
            $("#input-select").removeClass("hide");
            $("#valor-campo").prop("id", "id-temp");
            $("#select-conta").prop("id", "valor-campo");

            if (campo === "conta") {
                $("#idContaOptions").removeClass("hide");
                $("#idCategoriaOptions").addClass("hide");
                $("#idPessoaOptions").addClass("hide");
            } else if (campo === "idCategoria") {
                $("#idContaOptions").addClass("hide");
                $("#idCategoriaOptions").removeClass("hide");
                $("#idPessoaOptions").addClass("hide");
            } else if (campo === "idPessoa") {
                $("#idContaOptions").addClass("hide");
                $("#idCategoriaOptions").addClass("hide");
                $("#idPessoaOptions").removeClass("hide");
            }
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
    validaFormulario: function (movimento, cb, field) {
        if (!field) {
            if (!movimento.data) {
                alertUtil.confirm(i18next.t("movimento-controller.alert-data-req"));
            } else if (!movimento.valor) {
                alertUtil.confirm(i18next.t("movimento-controller.alert-valor-req"));
            } else if (!movimento.descricao) {
                alertUtil.confirm(i18next.t("movimento-controller.alert-descricao-req"));
            } else if (!movimento.idConta) {
                alertUtil.confirm(i18next.t("movimento-controller.alert-idConta-req"));
            } else if (!movimento.idCategoria) {
                alertUtil.confirm(i18next.t("movimento-controller.alert-idCategoria-req"));
            } else if (!movimento.idPessoa) {
                alertUtil.confirm(i18next.t("movimento-controller.alert-idPessoa-req"));
            } else if (!movimento.idCartao) {
                alertUtil.confirm(i18next.t("movimento-controller.alert-idCartao-req"));
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