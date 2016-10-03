/* global Controller, mainController, iconUtil, i18next */

/*
QUERIES
daoUtil.getCustom("select cast(valorSaldoInicial as decial) valorSaldoInicial from conta where id = 1", function(res){console.log(res);});
daoUtil.getCustom("select sum(case natureza when 'C' then cast(valor as decimal) else cast(valor*-1 as decimal) end) saldo_inicial from movimento where dataVencimento <= '2016-09-27' and idConta = 2", function(res){console.log(res);});
daoUtil.getCustom("select case natureza when 'C' then cast(valor as decimal) else cast(valor*-1 as decimal) end valor, dataVencimento, descricao from movimento where dataVencimento <= '2016-09-27' and idConta = 2", function(res){console.log(res);});
*/
var reportsController = {
    TEMPLATE_ACCOUNT_BALANCE: "",
    loadAccountBalance: function () {
        Controller.render({
            controllerOrigin: reportsController,                        
            template: reportsController.TEMPLATE_ACCOUNT_BALANCE,            
            navLeft: {
                icon: iconUtil.back,
                callbackClick: function () {
                    mainController.render();
                }
            },
            navCenter: {
                title: i18next.t("reports-controller.account-balance"),
                icon: ""
            },           
            navSearch: {
                display: "none"
            }            
        }, {}, function () {

        });
    }
};