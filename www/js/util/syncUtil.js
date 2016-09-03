/* global daoUtil, alertUtil */

var syncUtil = {
    running: 0,
    run: function () {
        if (this.running === 0 || !this.running) {
            this.running = 1;

            /*BEGIN: TASKS HERE*/
            daoUtil.getInserted(new Conta(), function (res) {
                contaJson = {};
                contaJson.nome = res.nome;
                contaJson.dataFundacao = res.dataFundacao;
                contaJson.valorSaldoInicial = res.valorSaldoInicial;
                syncUtil.ajax("post", "conta", contaJson, function (returnedData) {
                    alertUtil.confirm(returnedData);
                    syncUtil.running = 0;
                }, function (errorThrown) {
                    alertUtil.confirm(errorThrown);
                    syncUtil.running = 0;

                });
            });
            /*END: TASKS HERE*/
        }
    },
    ajax: function (httpType, url, data, cbSuccess, cbError) {
        url = "localhost:8080/LinemobAPI/" + url;
        $.ajax({
            type: httpType,
            url: url,
            data: data,
            success: function (returnedData, textStatus, jqXHR) {
                if (cbSuccess) {
                    cbSucess(returnedData);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                if (cbError) {
                    cbError(errorThrown);
                }
            },
            dataType: "json"
        });
    }
};