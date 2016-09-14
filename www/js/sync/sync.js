/* global daoUtil, alertUtil, logUtil, cordova, i18next, sync, cartaoSync, movimentoSync */

var sync = {
    running: 0,
    run: function () {
        if (!window.localStorage.getItem("dataBaseCreated")) {
            return;
        }
        // COLCAR VALIDAÇÃO DA EXISTENCIA DE INTERNET //
        if (this.running === 0 || !this.running) {
            sync.insertEntity(new Conta());
            sync.deleteEntity(new Conta());
            sync.updateEntity(new Conta());

            sync.insertEntity(new Pessoa());
            sync.deleteEntity(new Pessoa());
            sync.updateEntity(new Pessoa());

            sync.insertEntity(new Categoria());
            sync.deleteEntity(new Categoria());
            sync.updateEntity(new Categoria());

            cartaoSync.insert();
            sync.deleteEntity(new Cartao());

            movimentoSync.insert();
            sync.deleteEntity(new Movimento());
        }
    },
    insertEntity: function (entity) {
        daoUtil.getInserted(entity, function (entityes) {
            if (!entityes.length) {
                return;
            }
            sync.setRunning(entityes.length);
            for (var i = 0; i < entityes.length; i++) {
                var theEntity = entityes[i];
                sync.insertRequest(theEntity);
            }
        });
    },
    deleteEntity: function (entity) {
        daoUtil.getDeleted(entity, function (entityes) {
            if (!entityes.length) {
                return;
            }
            sync.setRunning(entityes.length);
            for (var i = 0; i < entityes.length; i++) {
                var theEntity = entityes[i];
                sync.deleteRequest(theEntity);
            }
        });
    },
    updateEntity: function (entity) {
        daoUtil.getUpdated(entity, function (entityes) {
            if (!entityes.length) {
                return;
            }
            sync.setRunning(entityes.length);
            for (var i = 0; i < entityes.length; i++) {
                var theEntity = entityes[i];
                sync.updateRequest(theEntity);
            }
        });
    },
    insertRequest: function (entity, callbackSuccess, callbackError) {
        sync.ajax("POST", "TEXT", entity.tableName, entity, function (idExterno) {
            entity.idExterno = idExterno;
            daoUtil.update(entity, function (rowsAffected) {
                sync.setRunning(-1);
                if (rowsAffected != 0) {
                    if (callbackSuccess) {
                        callbackSuccess(idExterno);
                    }
                } else {
                    if (callbackError) {
                        callbackError();
                    }
                }
            });
        }, function (errorThrown) {
            sync.setRunning(-1);
            if (callbackError) {
                callbackError(errorThrown);
            }
        });
    },
    deleteRequest: function (entity, callbackSuccess, callbackError) {
        var urlPath = entity.tableName + "/" + entity.idExterno;
        sync.ajax("DELETE", "TEXT", urlPath, {}, function (remoteRowsAffected) {
            if (remoteRowsAffected == 1) {
                daoUtil.delete(entity, function (rowsAffected) {
                    sync.setRunning(-1);
                    if (rowsAffected != 0) {
                        if (callbackSuccess) {
                            callbackSuccess();
                        }
                    } else {
                        if (callbackError) {
                            callbackError();
                        }
                    }
                });
            } else {
                sync.setRunning(-1);
                if (callbackError) {
                    callbackError();
                }
            }
        }, function (errorThrown) {
            sync.setRunning(-1);
            if (callbackError) {
                callbackError(errorThrown);
            }
        });
    },
    updateRequest: function (entity, callbackSuccess, callbackError) {
        var urlPath = entity.tableName + "/" + entity.idExterno;
        sync.ajax("PUT", "TEXT", urlPath, entity, function (remoteRowsAffected) {
            if (remoteRowsAffected == 1) {
                entity.updated = 0;
                daoUtil.update(entity, function (rowsAffected) {
                    sync.setRunning(-1);
                    if (rowsAffected != 0) {
                        if (callbackSuccess) {
                            callbackSuccess();
                        }
                    } else {
                        if (callbackError) {
                            callbackError();
                        }
                    }
                },1);
            } else {
                sync.setRunning(-1);
                if (callbackError) {
                    callbakError();
                }
            }
        }, function (errorThrown) {
            sync.setRunning(-1);
            if (callbackError) {
                callbackError(errorThrown);
            }
        });
    },
    ajax: function (httpType, responseType, url, dataInput, cbSuccess, cbError) {
        url = "http://10.1.1.13:8080/LinemobAPI/" + url;
        $.ajax({
            crossDomain: true,
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