/* global daoUtil, alertUtil, logUtil */

var syncUtil = {
    running: 0,
    run: function () {
        if (!window.localStorage.getItem("dataBaseCreated")) {
            return;
        }
        if (this.running === 0 || !this.running) {
            this.running = 1;

            /*BEGIN: TASKS HERE*/
            daoUtil.getInserted(new Conta(), function (res) {
                if (!res.length) {
                    syncUtil.running = 0;
                    return;
                }
                for (var i = 0; i < res.length; i++) {
                    var contaJson = new Conta();
                    contaJson.datafundacao = res[i].dataFundacao;
                    contaJson.nome = res[i].nome;
                    contaJson.valorsaldoinicial = res[i].valorSaldoInicial;
                    var contaModel = res[i];
                    syncUtil.ajax("POST", "conta", contaJson, function (returnedData) {
                        contaModel.idExterno = returnedData;
                        daoUtil.update(contaModel, function (rowsAffected) {
                            if (rowsAffected != 1) {
                                alertUtil.confirm("Erro ao atualizar bla bla bla...");
                            }
                            syncUtil.running = 0;
                        });
                    }, function (errorThrown) {
                        syncUtil.running = 0;

                    });
                }
            });
            /*END: TASKS HERE*/
        }
    },
    ajax: function (httpType, url, dataInput, cbSuccess, cbError) {
        url = "http://10.0.0.102:8080/LinemobAPI/" + url;
        $.ajax({
            type: httpType,
            dataType: "text",
            url: url,
            data: JSON.stringify(dataInput),
            headers: {"Usuario": "Leandro", "Token": "testepwd", "Content-Type": "application/json"},
            success: function (returnedData, textStatus, jqXHR) {
                if (cbSuccess) {
                    cbSuccess(returnedData);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                if (cbError) {
                    cbError(errorThrown);
                }
            }
        });
    }
};