/* global Controller, mainController, iconUtil, i18next, daoUtil, alertUtil */

/*
 QUERIES
 daoUtil.getCustom("select cast(valorSaldoInicial as decimal) valorSaldoInicial from conta where id = 1", function(res){console.log(res);});
 daoUtil.getCustom("select sum(case natureza when 'C' then cast(valor as decimal) else cast(valor*-1 as decimal) end) saldo_inicial from movimento where dataVencimento <= '2016-09-27' and idConta = 2", function(res){console.log(res);});
 daoUtil.getCustom("select case natureza when 'C' then cast(valor as decimal) else cast(valor*-1 as decimal) end valor, dataVencimento, descricao from movimento where dataVencimento <= '2016-09-27' and idConta = 2", function(res){console.log(res);});
 */
var reportsController = {
    TEMPLATE_CHOOSE_REPORTS: "",
    TEMPLATE_ACCOUNT_BALANCE_FILTER: "",
    TEMPLATE_ACCOUNT_BALANCE: "",
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

            });
        });
    },
    loadAccountBalance: function (dataInicio, dataFinal, contaId) {
        var stringFiltroConta = (contaId) ? " where id = " + contaId : "";
        var data = {};
        data.contas = [];
        daoUtil.getCustom(
                "select cast(valorSaldoInicial as decimal) valor, " +
                "       nome, " +
                "       dataFundacao data, " +
                "       id ," +
                "       (select ifnull(sum(case natureza when 'C' then cast(valor as decimal) else cast(valor*-1 as decimal) end),0) saldo_inicial " +
                "          from movimento" +
                "         where movimento.idConta = conta.id" +
                "           and dataVencimento <= '" + dataInicio + "') saldoLancamentos" +
                "  from conta " + stringFiltroConta, function (contasRes) {

                    contasRes.forEach(function (conta) {
                        var saldo = 0;
                        conta.valor = conta.valor + conta.saldoLancamentos;
                        conta.saldo = conta.valor + saldo;
                        conta.valorExibicao = conta.valor.toFixed(2);
                        conta.saldoExibicao = conta.saldo.toFixed(2);
                        conta.data = reportsController.dateFormat(conta.data);
                        saldo += conta.valor;
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
                                        movimento.data = reportsController.dateFormat(movimento.data);
                                        conta.movimentos.push(movimento);
                                        saldo += movimento.valor;
                                    });
                                    data.contas.push(conta);

                                    if (contasRes.length === data.contas.length) {
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
    dateFormat: function (date) {
        var campos = date.split("-");
        return campos[2] + "/" + campos[1] + "/" + campos[0].substr(2, 2);
    }
};