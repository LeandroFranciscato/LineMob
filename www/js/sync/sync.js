/* global daoUtil, alertUtil, logUtil, cordova, i18next, sync */

var sync = {
    running: 0,
    run: function () {
        if (!window.localStorage.getItem("dataBaseCreated")) {
            return;
        }
        // COLCAR VALIDAÇÃO DA EXISTENCIA DE INTERNET //
        if (this.running === 0 || !this.running) {
            alert('inicie o debug!');
            sync.insertCartao();
        }
    },
    insertCartao: function () {
        daoUtil.getInserted(new Cartao(), function (cartoes) {
            if (!cartoes.length) {
                return;
            }
            sync.setRunning(cartoes.length);
            for (var i = 0; i < cartoes.length; i++) {
                var cartao = cartoes[i];

                var conta = new Conta();
                conta.id = cartao.idConta;
                daoUtil.getById(conta, function (res) {
                    conta = res;
                    if (!conta.idExterno) {

                        sync.ajax("POST", "TEXT", conta.tableName, conta, function (idExterno) {
                            conta.idExterno = idExterno;
                            daoUtil.update(conta, function (rowsAffected) {
                                sync.setRunning(-1);
                                if (rowsAffected != 0) {
                                    cartao.idConta = idExterno;

                                    sync.ajax("POST", "TEXT", cartao.tableName, cartao, function (idExterno) {
                                        cartao.idExterno = idExterno;
                                        daoUtil.update(cartao, function (rowsAffected) {
                                            sync.setRunning(-1);
                                        });
                                    }, function (errorThrown) {
                                        sync.setRunning(-1);
                                    });
                                }
                            });
                        }, function (errorThrown) {
                            sync.setRunning(-1);
                        });
                    } else {
                        cartao.idConta = conta.idExterno;
                        sync.ajax("POST", "TEXT", cartao.tableName, cartao, function (idExterno) {
                            cartao.idExterno = idExterno;
                            daoUtil.update(cartao, function (rowsAffected) {
                                sync.setRunning(-1);
                            });
                        }, function (errorThrown) {
                            sync.setRunning(-1);
                        });
                    }
                });

            }
        });
    },
    ajax: function (httpType, responseType, url, dataInput, cbSuccess, cbError) {
        url = "http://10.0.0.102:8080/LinemobAPI/" + url;
        $.ajax({
            type: httpType,
            dataType: responseType,
            url: url,
            data: (dataInput) ? JSON.stringify(dataInput) : {},
            //headers: {"Usuario": "Leandro", "Token": "testepwd", "Content-Type": "application/json"},
            beforeSend: function (request)
            {
                request.setRequestHeader("Usuario", "Leandro");
                request.setRequestHeader("Token", "testepwd");
                request.setRequestHeader("Content-Type", "application/json");
            },
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
    },
    setRunning: function (qtdeTasks) {
        sync.running += qtdeTasks;
        if (sync.running >= 1) {
            cordova.plugins.backgroundMode.configure({
                title: i18next.t("background-mode.title-sync"),
                color: "455a64"
            });
        } else {
            cordova.plugins.backgroundMode.configure({
                title: i18next.t("background-mode.title"),
                color: "e53935"
            });
        }
    },
    notify: function (titulo, mensagem, cbActionClick) {
        var idNotification = Math.random();
        cordova.plugins.notification.local.schedule({
            id: idNotification,
            title: titulo,
            text: mensagem,
            icon: "/platforms/android/res/drawable-mdpi/icon.png"
        });
        cordova.plugins.notification.local.on("click", function (notification) {
            if (notification.id == idNotification) {
                if (cbActionClick) {
                    cbActionClick();
                }
            }
        });
    }
};