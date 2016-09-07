/* global daoUtil, alertUtil, logUtil, cordova, i18next, sync */

var sync = {
    running: 0,
    run: function () {
        if (!window.localStorage.getItem("dataBaseCreated")) {
            return;
        }
        // COLCAR VALIDAÇÃO DA EXISTENCIA DE INTERNET //
        if (this.running === 0 || !this.running) {
            sync.insert(new Conta());
            sync.insert(new Cartao());
        }
    },
    insert: function (entityType) {
        daoUtil.getInserted(entityType, function (entityList) {
            if (!entityList.length) {
                return;
            }
            sync.setRunning(entityList.length);
            for (var i = 0; i < entityList.length; i++) {
                var objModel = entityList[i];
                var conta = new Conta();
                conta.id = objModel.idConta;
                daoUtil.getById(conta, function (contaRes) {
                    if (contaRes.idExterno) {
                        objModel.idConta = contaRes.idExterno;
                    }
                    sync.ajax("POST", "TEXT", entityType.tableName, objModel, function (idExterno) {
                        objModel.idExterno = idExterno;
                        daoUtil.update(objModel, function (rowsAffected) {
                            sync.setRunning(-1);
                        });
                    }, function (errorThrown) {
                        sync.setRunning(-1);
                    });
                });
            }
        });
    },
    normalizeFields: function (entity) {
        var newEntity = {};
        for (var key in entity) {
            if (key != undefined && typeof entity[key] !== 'function') {
                newEntity[key.toLowerCase()] = entity[key];
            }
        }
        return newEntity;
    },
    ajax: function (httpType, responseType, url, dataInput, cbSuccess, cbError) {
        url = "http://10.0.0.102:8080/LinemobAPI/" + url;
        $.ajax({
            type: httpType,
            dataType: responseType,
            url: url,
            data: (dataInput) ? JSON.stringify(dataInput) : {},
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