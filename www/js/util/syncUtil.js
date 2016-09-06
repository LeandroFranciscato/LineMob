/* global daoUtil, alertUtil, logUtil */

var syncUtil = {
    running: 0,
    run: function () {
        if (this.running === 0 || !this.running) {
            this.running = 1;

            /*BEGIN: TASKS HERE*/
            daoUtil.getInserted(new Conta(), function (res) {
                if (!res.length) {
                    return;
                }
                for (i = 0; i < res.length; i++) {
                    conta = {}
                    conta.nome = res[i].nome;
                    conta.dataFundacao = res[i].dataFundacao;
                    conta.valorSaldoInicial = res[i].valorSaldoInicial;                    
                    syncUtil.ajax("POST", "conta", conta, function (returnedData) {
                        res[i].idExterno = returnedData;
                        daoUtil.update(res[i], function (rowsAffected) {
                            if (rowsAffected != 1) {
                                alertUtil.confirm("Erro ao atualizar bla bla bla...");
                            }
                            syncUtil.running = 0;
                        });
                    }, function (errorThrown) {
                        alertUtil.confirm(errorThrown);
                        syncUtil.running = 0;

                    });
                }
            });
            /*END: TASKS HERE*/
        }
    },
    ajax: function (httpType, url, dataInput, cbSuccess, cbError) {
        url = "http://10.1.1.6:8080/LinemobAPI/" + url;        
        $.ajax({
            type: httpType,
            dataType: "json",
            url: url,
            data: JSON.stringify(dataInput),
            headers: {"Usuario": "Leandro", "Token": "testepwd", "Content-Type": "application/json"},
//            beforeSend: function (request)
//            {
//                request.setRequestHeader("Usuario", "Leandro");
//                request.setRequestHeader("Token", "testepwd");
//                request.setRequestHeader("Content-Type", "application/json");
//            },                        
            success: function (returnedData, textStatus, jqXHR) {
                if (cbSuccess) {
                    cbSucess(returnedData);
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