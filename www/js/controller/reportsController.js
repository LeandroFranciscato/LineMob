/* global Controller, mainController, iconUtil, i18next, daoUtil, alertUtil, dateUtil */
var reportsController = {
    TEMPLATE_CHOOSE_REPORTS: "",
    TEMPLATE_ACCOUNT_BALANCE: "",
    TEMPLATE_ACCOUNT_BALANCE_FILTER: "",
    TEMPLATE_CRED_CARD: "",
    TEMPLATE_CRED_CARD_FILTER: "",
    TEMPLATE_GROUP_CATEGORY: "",
    TEMPLATE_GROUP_CATEGORY_FILTER: "",
    load: function () {
        Controller.render({
            controllerOrigin: reportsController,
            template: reportsController.TEMPLATE_CHOOSE_REPORTS,
            navLeft: {
                icon: iconUtil.back,
                callbackClick: function () {
                    mainController.render();
                }
            },
            navCenter: {
                title: i18next.t("reports-controller.plural"),
                icon: ""
            },
            navSearch: {
                display: "none"
            }
        }, {}, function () {

        });
    },
    loadFilterAccountBalance: function () {
        var data = {};
        var conta = new Conta();
        daoUtil.getAll(conta, "nome", function (res) {
            if (data) {
                data.conta = res;
            }

            Controller.render({
                controllerOrigin: reportsController,
                template: reportsController.TEMPLATE_ACCOUNT_BALANCE_FILTER,
                navLeft: {
                    icon: iconUtil.back,
                    callbackClick: function () {
                        reportsController.load();
                    }
                },
                navCenter: {
                    title: i18next.t("reports-controller.account-balance-filter"),
                    icon: ""
                },
                navRight: {
                    display: "block",
                    iconName: iconUtil.print,
                    callbackClick: function () {
                        var dataInicio = $("#dataInicio").val();
                        var dataFinal = $("#dataFinal").val();
                        var contaId = $("#select-conta").val();
                        if (!dataInicio || !dataFinal) {
                            alertUtil.confirm(i18next.t("generics.date-range-required"));
                            return;
                        }
                        reportsController.loadAccountBalance(dataInicio, dataFinal, contaId);
                    }
                },
                navSearch: {
                    display: "none"
                }
            }, data, function () {
                reportsController.setDefaultDates();
            });
        });
    },
    loadAccountBalance: function (dataInicio, dataFinal, contaId) {
        var stringFiltroConta = (contaId) ? " where id = " + contaId : "";
        var data = {};
        data.contas = [];
        data.saldoTotal = 0;
        daoUtil.getCustom(
                "select cast(valorSaldoInicial as decimal) valor, " +
                "       nome, " +
                "       id ," +
                "       (select ifnull(sum(case natureza when 'C' then cast(valor as decimal) else cast(valor*-1 as decimal) end),0) saldo_inicial " +
                "          from movimento" +
                "         where movimento.idConta = conta.id" +
                "           and dataVencimento <= '" + dataInicio + "') saldoLancamentos" +
                "  from conta " + stringFiltroConta + " order by nome ", function (contasRes) {

                    contasRes.forEach(function (conta) {
                        var saldo = 0;
                        conta.valor = conta.valor + conta.saldoLancamentos;
                        conta.saldo = conta.valor + saldo;
                        conta.valorExibicao = conta.valor.toFixed(2);
                        conta.saldoExibicao = conta.saldo.toFixed(2);
                        conta.data = dateUtil.format(dataInicio);
                        saldo += conta.valor;
                        data.saldoTotal += conta.valor;
                        conta.movimentos = [];
                        daoUtil.getCustom(
                                "select case natureza when 'C' then cast(valor as decimal) else cast(valor*-1 as decimal) end valor, " +
                                "       dataVencimento data, " +
                                "       descricao " +
                                "  from movimento " +
                                " where dataVencimento > '" + dataInicio + "'" +
                                "   and dataVencimento <= '" + dataFinal + "'" +
                                "   and idConta = " + conta.id +
                                " order by dataVencimento", function (movimentosRes) {
                                    movimentosRes.forEach(function (movimento) {
                                        movimento.saldo = movimento.valor + saldo;
                                        movimento.valorExibicao = movimento.valor.toFixed(2);
                                        movimento.saldoExibicao = movimento.saldo.toFixed(2);
                                        movimento.data = dateUtil.format(movimento.data);
                                        conta.movimentos.push(movimento);
                                        saldo += movimento.valor;
                                        data.saldoTotal += movimento.valor;
                                    });
                                    data.contas.push(conta);
                                    if (contasRes.length === data.contas.length) {
                                        data.saldoTotal = data.saldoTotal.toFixed(2);
                                        Controller.render({
                                            controllerOrigin: reportsController,
                                            template: reportsController.TEMPLATE_ACCOUNT_BALANCE,
                                            navLeft: {
                                                icon: iconUtil.back,
                                                callbackClick: function () {
                                                    reportsController.loadFilterAccountBalance();
                                                }
                                            },
                                            navCenter: {
                                                title: i18next.t("reports-controller.account-balance"),
                                                icon: ""
                                            },
                                            navSearch: {
                                                display: "none"
                                            }
                                        }, data, function () {

                                        });
                                    }
                                }
                        );
                    });
                }
        );
    },
    loadFilterCredCard: function () {
        var data = {};
        var cartao = new Cartao();
        daoUtil.getAll(cartao, "nome", function (res) {
            if (data) {
                data.cartao = res;
            }

            Controller.render({
                controllerOrigin: reportsController,
                template: reportsController.TEMPLATE_CRED_CARD_FILTER,
                navLeft: {
                    icon: iconUtil.back,
                    callbackClick: function () {
                        reportsController.load();
                    }
                },
                navCenter: {
                    title: i18next.t("reports-controller.cred-card-invoice-filter"),
                    icon: ""
                },
                navRight: {
                    display: "block",
                    iconName: iconUtil.print,
                    callbackClick: function () {
                        var dataInicio = $("#dataInicio").val();
                        var dataFinal = $("#dataFinal").val();
                        var cartaoId = $("#select-cartao").val();
                        if (!dataInicio || !dataFinal) {
                            alertUtil.confirm(i18next.t("generics.date-range-required"));
                            return;
                        }
                        reportsController.loadCredCard(dataInicio, dataFinal, cartaoId);
                    }
                },
                navSearch: {
                    display: "none"
                }
            }, data, function () {
                reportsController.setDefaultDates();
            });
        });
    },
    loadCredCard: function (dataInicio, dataFinal, cartaoId) {
        var stringFiltroCartao = (cartaoId) ? " where id = " + cartaoId : "";
        var data = {};
        data.cartoes = [];
        data.saldoTotal = 0;
        daoUtil.getCustom(
                "select nome, " +
                "       id ," +
                "       (select ifnull(sum(case natureza when 'C' then cast(valor as decimal) else cast(valor*-1 as decimal) end),0) saldo_inicial " +
                "          from movimento" +
                "         where movimento.idCartao = cartao.id" +
                "           and dataVencimento = '" + dataInicio + "') saldoLancamentos" +
                "  from cartao " + stringFiltroCartao + " order by nome ", function (cartoesRes) {

                    cartoesRes.forEach(function (cartao) {
                        var saldo = 0;
                        cartao.valor = cartao.saldoLancamentos;
                        cartao.saldo = cartao.valor + saldo;
                        cartao.valorExibicao = cartao.valor.toFixed(2);
                        cartao.saldoExibicao = cartao.saldo.toFixed(2);
                        cartao.data = dateUtil.format(dataInicio);
                        saldo += cartao.valor;
                        data.saldoTotal += cartao.valor;
                        cartao.movimentos = [];
                        daoUtil.getCustom(
                                "select case natureza when 'C' then cast(valor as decimal) else cast(valor*-1 as decimal) end valor, " +
                                "       dataVencimento data, " +
                                "       descricao " +
                                "  from movimento " +
                                " where dataVencimento > '" + dataInicio + "'" +
                                "   and dataVencimento <= '" + dataFinal + "'" +
                                "   and idCartao = " + cartao.id +
                                " order by dataVencimento", function (movimentosRes) {
                                    movimentosRes.forEach(function (movimento) {
                                        movimento.saldo = movimento.valor + saldo;
                                        movimento.valorExibicao = movimento.valor.toFixed(2);
                                        movimento.saldoExibicao = movimento.saldo.toFixed(2);
                                        movimento.data = dateUtil.format(movimento.data);
                                        cartao.movimentos.push(movimento);
                                        saldo += movimento.valor;
                                        data.saldoTotal += movimento.valor;
                                    });
                                    data.cartoes.push(cartao);
                                    if (cartoesRes.length === data.cartoes.length) {
                                        data.saldoTotal = data.saldoTotal.toFixed(2);
                                        Controller.render({
                                            controllerOrigin: reportsController,
                                            template: reportsController.TEMPLATE_CRED_CARD,
                                            navLeft: {
                                                icon: iconUtil.back,
                                                callbackClick: function () {
                                                    reportsController.loadFilterCredCard();
                                                }
                                            },
                                            navCenter: {
                                                title: i18next.t("reports-controller.cred-card-invoice"),
                                                icon: ""
                                            },
                                            navSearch: {
                                                display: "none"
                                            }
                                        }, data, function () {

                                        });
                                    }
                                }
                        );
                    });
                }
        );
    },
    loadFilterCategory: function () {
        var data = {};
        var categoria = new Categoria();
        daoUtil.getAll(categoria, "nome", function (res) {
            if (data) {
                data.categoria = res;
            }

            Controller.render({
                controllerOrigin: reportsController,
                template: reportsController.TEMPLATE_GROUP_CATEGORY_FILTER,
                navLeft: {
                    icon: iconUtil.back,
                    callbackClick: function () {
                        reportsController.load();
                    }
                },
                navCenter: {
                    title: i18next.t("reports-controller.group-category-filter"),
                    icon: ""
                },
                navRight: {
                    display: "block",
                    iconName: iconUtil.print,
                    callbackClick: function () {
                        var dataInicio = $("#dataInicio").val();
                        var dataFinal = $("#dataFinal").val();
                        var categoriaId = $("#select-categoria").val();
                        if (!dataInicio || !dataFinal) {
                            alertUtil.confirm(i18next.t("generics.date-range-required"));
                            return;
                        }
                        reportsController.loadCategory(dataInicio, dataFinal, categoriaId);
                    }
                },
                navSearch: {
                    display: "none"
                }
            }, data, function () {
                reportsController.setDefaultDates();
            });
        });
    },
    loadCategory: function (dataInicio, dataFinal, categoriaId) {
        var stringFiltroCategoria = (categoriaId) ? " where id = " + categoriaId : "";
        var data = {};
        data.categorias = [];
        data.saldoTotal = 0;
        daoUtil.getCustom(
                "select nome, " +
                "       id ," +
                "       (select ifnull(sum(case natureza when 'C' then cast(valor as decimal) else cast(valor*-1 as decimal) end),0) saldo_inicial " +
                "          from movimento" +
                "         where movimento.idCategoria = categoria.id" +
                "           and dataVencimento = '" + dataInicio + "') saldoLancamentos" +
                "  from categoria " + stringFiltroCategoria + " order by nome ", function (categoriasRes) {

                    categoriasRes.forEach(function (Categoria) {
                        var saldo = 0;
                        Categoria.valor = Categoria.saldoLancamentos;
                        Categoria.saldo = Categoria.valor + saldo;
                        Categoria.valorExibicao = Categoria.valor.toFixed(2);
                        Categoria.saldoExibicao = Categoria.saldo.toFixed(2);
                        Categoria.data = dateUtil.format(dataInicio);
                        saldo += Categoria.valor;
                        data.saldoTotal += Categoria.valor;
                        Categoria.movimentos = [];
                        daoUtil.getCustom(
                                "select case natureza when 'C' then cast(valor as decimal) else cast(valor*-1 as decimal) end valor, " +
                                "       dataVencimento data, " +
                                "       descricao " +
                                "  from movimento " +
                                " where natureza = 'D' " +
                                "   and dataVencimento > '" + dataInicio + "'" +
                                "   and dataVencimento <= '" + dataFinal + "'" +
                                "   and idCategoria = " + Categoria.id +
                                " order by dataVencimento", function (movimentosRes) {
                                    movimentosRes.forEach(function (movimento) {
                                        movimento.saldo = movimento.valor + saldo;
                                        movimento.valorExibicao = movimento.valor.toFixed(2);
                                        movimento.saldoExibicao = movimento.saldo.toFixed(2);
                                        movimento.data = dateUtil.format(movimento.data);
                                        Categoria.movimentos.push(movimento);
                                        saldo += movimento.valor;
                                        data.saldoTotal += movimento.valor
                                    });
                                    data.categorias.push(Categoria);
                                    if (categoriasRes.length === data.categorias.length) {
                                        data.saldoTotal = data.saldoTotal.toFixed(2);
                                        Controller.render({
                                            controllerOrigin: reportsController,
                                            template: reportsController.TEMPLATE_GROUP_CATEGORY,
                                            navLeft: {
                                                icon: iconUtil.back,
                                                callbackClick: function () {
                                                    reportsController.loadFilterCategory();
                                                }
                                            },
                                            navCenter: {
                                                title: i18next.t("reports-controller.group-category"),
                                                icon: ""
                                            },
                                            navSearch: {
                                                display: "none"
                                            }
                                        }, data, function () {

                                        });
                                    }
                                }
                        );
                    });
                }
        );
    },
    setDefaultDates: function () {
        var data = new Date();
        var firstDay = new Date(data.getFullYear(), data.getMonth(), 1);
        var lastDay = new Date(data.getFullYear(), data.getMonth() + 1, 0);
        $("#dataInicio").val(dateUtil.toString(firstDay));
        $("#dataFinal").val(dateUtil.toString(lastDay));
    }
};