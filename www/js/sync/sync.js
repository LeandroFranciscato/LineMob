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
            sync.getRequest(new Conta());
            sync.deletedByAnother(new Conta());

            sync.insertEntity(new Pessoa());
            sync.deleteEntity(new Pessoa());
            sync.updateEntity(new Pessoa());
            sync.getRequest(new Pessoa());
            sync.deletedByAnother(new Pessoa());

            sync.insertEntity(new Categoria());
            sync.deleteEntity(new Categoria());
            sync.updateEntity(new Categoria());
            sync.getRequest(new Categoria());
            sync.deletedByAnother(new Categoria());

            cartaoSync.insertUpdate("insert");
            sync.deleteEntity(new Cartao());
            cartaoSync.insertUpdate("update");
            cartaoSync.getRequest();
            sync.deletedByAnother(new Cartao());

            movimentoSync.insertUpdate("insert");
            sync.deleteEntity(new Movimento());
            movimentoSync.insertUpdate("update");
            movimentoSync.getRequest();
            sync.deletedByAnother(new Movimento());
        }
    },
    insertEntity: function (entity) {
        daoUtil.getInserted(entity, function (entities) {
            if (!entities.length) {
                return;
            }
            sync.setRunning(entities.length);
            for (var i = 0; i < entities.length; i++) {
                var theEntity = entities[i];
                sync.insertRequest(theEntity);
            }
        });
    },
    deleteEntity: function (entity) {
        daoUtil.getDeleted(entity, function (entities) {
            if (!entities.length) {
                return;
            }
            sync.setRunning(entities.length);
            for (var i = 0; i < entities.length; i++) {
                var theEntity = entities[i];
                sync.deleteRequest(theEntity);
            }
        });
    },
    updateEntity: function (entity) {
        daoUtil.getUpdated(entity, function (entities) {
            if (!entities.length) {
                return;
            }
            sync.setRunning(entities.length);
            for (var i = 0; i < entities.length; i++) {
                var theEntity = entities[i];
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
                }, 1);
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
    getRequest: function (entity, callbackSuccess, callbackError) {
        sync.ajax("GET", "JSON", entity.tableName, {}, function (responseEntities) {
            if (responseEntities.length) {
                sync.setRunning(responseEntities.length);
                responseEntities.forEach(function (theEntity) {
                    theEntity.tableName = entity.tableName;
                    theEntity.idExterno = theEntity.id;
                    theEntity.id = "";
                    daoUtil.getByIdExterno(theEntity, function (res) {
                        sync.setRunning(-1);
                        var modelEntity;
                        if (!res) {
                            modelEntity = sync.modelFromJson(entity);
                            daoUtil.insert(modelEntity);
                        }
                    });
                });
            } else {
                if (callbackError) {
                    callbakError();
                }
            }
        }, function (errorThrown) {
            if (callbackError) {
                callbackError(errorThrown);
            }
        });
    },
    deletedByAnother: function (entity, callbackSuccess, callbackError) {
        daoUtil.getAll(entity, "", function (entities) {
            sync.setRunning(entities.length);

            entities.forEach(function (theEntity) {
                var url = theEntity.tableName + "/" + theEntity.idExterno;
                sync.ajax("GET", "JSON", url, {}, function (responseJson) {
                    sync.setRunning(-1);
                    if (!responseJson) {
                        daoUtil.delete(theEntity);
                        if (callbackSuccess) {
                            callbackSuccess();
                        }
                    }
                }, function (err) {
                    sync.setRunning(-1);
                    if (callbackError) {
                        callbackError();
                    }
                });
            });
        });
    },
    ajax: function (httpType, responseType, url, dataInput, cbSuccess, cbError) {
        url = "http://10.0.0.102:8080/LinemobAPI/" + url;
        $.ajax({
            async: false,
            crossDomain: true,
            type: httpType,
            dataType: responseType,
            url: url,
            data: (dataInput) ? JSON.stringify(dataInput) : {},
            //headers: {"Usuario": "Leandro", "Token": "testepwd", "Content-Type": "application/json"},
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Usuario", "Leandro");
                xhr.setRequestHeader("Token", "testepwd");
                xhr.setRequestHeader("Content-Type", "application/json");

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
    modelFromJson: function (entity) {
        var modelEntity = {};
        for (var key in entity) {
            if (key === "@type") {
                continue;
            }
            modelEntity[key] = entity[key];
        }
        Object.setPrototypeOf(modelEntity, Object.getPrototypeOf(entity));
        return modelEntity;
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