/* global daoUtil, alertUtil, logUtil, cordova, i18next, sync, cartaoSync, movimentoSync, networkUtil, loadController, notifyUtil */

var sync = {
    running: 0,
    run: function () {
        if (!window.localStorage.getItem("dataBaseCreated")) {
            return;
        }
        if (!networkUtil.isOnline()) {
            return;
        }
        if (!window.localStorage.getItem("user")) {
            return;
        }
        if (this.running === 0 || !this.running) {
            /*  sync.insertEntity(new Conta());
             sync.deleteEntity(new Conta());
             sync.updateEntity(new Conta());
             sync.getInsertedRequest(new Conta());
             */

            sync.getInsertedRequest(new Pessoa(), function () {
                sync.insertEntity(new Pessoa());
                sync.updateEntity(new Pessoa());
                sync.getDeletedRequest(new Pessoa(), function () {
                    sync.deleteEntity(new Pessoa());
                });
            });

            /*
             sync.insertEntity(new Categoria());
             sync.deleteEntity(new Categoria());
             sync.updateEntity(new Categoria());
             sync.getInsertedRequest(new Categoria());
             
             cartaoSync.insertUpdate("insert");
             sync.deleteEntity(new Cartao());
             cartaoSync.insertUpdate("update");
             cartaoSync.getInsertedRequest();
             
             movimentoSync.insertUpdate("insert");
             sync.deleteEntity(new Movimento());
             movimentoSync.insertUpdate("update");
             movimentoSync.getInsertedRequest();
             
             
             sync.getDeletedUpdatedRequest(new Conta());             
             sync.getDeletedUpdatedRequest(new Categoria());
             sync.getDeletedUpdatedRequest(new Cartao());
             sync.getDeletedUpdatedRequest(new Movimento());
             */
        }
    },
    insertEntity: function (entity) {
        daoUtil.getInserted(entity, function (entities) {
            if (!entities.length) {
                return;
            }
            sync.setRunning(entities.length);
            entities.forEach(function (theEntity) {
                daoUtil.getVersao("max", theEntity, function (versao) {
                    theEntity.versao = versao;
                    sync.insertRequest(theEntity);
                });
            });
        });
    },
    updateEntity: function (entity) {
        daoUtil.getUpdated(entity, function (entities) {
            if (!entities.length) {
                return;
            }
            sync.setRunning(entities.length);
            entities.forEach(function (theEntity) {
                daoUtil.getVersao("max", theEntity, function (versao) {
                    theEntity.versao = versao;
                    sync.updateRequest(theEntity);
                });
            });
        });
    },
    deleteEntity: function (entity) {
        daoUtil.getDeleted(entity, function (entities) {
            if (!entities.length) {
                return;
            }
            sync.setRunning(entities.length);
            entities.forEach(function (theEntity) {
                var versaoDelete = window.localStorage.getItem("versaoDelete" + theEntity.tableName);
                theEntity.versao = (versaoDelete) ? versaoDelete - 1 : -1;
                window.localStorage.setItem("versaoDelete" + theEntity.tableName, theEntity.versao);
                sync.deleteRequest(theEntity);
            });
        });
    },
    insertRequest: function (entity, callbackSuccess, callbackError) {
        sync.ajax("POST", "TEXT", entity.tableName, entity, function (idExterno) {
            entity.idExterno = idExterno;
            entity.versao++;
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
    updateRequest: function (entity, callbackSuccess, callbackError) {
        var urlPath = entity.tableName + "/" + entity.idExterno;
        sync.ajax("PUT", "TEXT", urlPath, entity, function (remoteRowsAffected) {
            if (remoteRowsAffected == 1) {
                entity.updated = 0;
                entity.versao++;
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
    deleteRequest: function (entity, callbackSuccess, callbackError) {
        var urlPath = entity.tableName + "/" + entity.idExterno + "/del";
        sync.ajax("PUT", "TEXT", urlPath, entity, function (remoteRowsAffected) {
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
    getInsertedRequest: function (entity, callbackSuccess, callbackError) {
        daoUtil.getVersao("max", entity, function (versao) {
            var url = entity.tableName + "/" + versao + "/1/0";
            sync.ajax("GET", "JSON", url, {}, function (responseEntities) {
                if (responseEntities.length) {
                    sync.setRunning(responseEntities.length);
                    responseEntities.forEach(function (theEntity) {
                        theEntity.tableName = entity.tableName;
                        theEntity.idExterno = theEntity.id;
                        theEntity.id = "";
                        daoUtil.getByIdExterno(theEntity, function (res) {
                            var customFunction;
                            var acao;
                            if (res) {
                                acao = "update";
                                theEntity.id = res.id;
                            } else {
                                acao = "insert";
                            }
                            customFunction = window["daoUtil"][acao];
                            var modelEntity;
                            modelEntity = sync.jsonToEntity(theEntity, entity);
                            customFunction(modelEntity, function () {
                                notifyUtil.addScheduleNotification(
                                        notifyUtil.getTitleNew(modelEntity, acao),
                                        notifyUtil.getMessageNew(modelEntity),
                                        new Date(),
                                        function () {
                                            daoUtil.getByIdExterno(modelEntity, function (res) {
                                                var loadNewOrSingleEdit = window[modelEntity.tableName + "Controller"]["loadNewOrSingleEdit"];
                                                loadNewOrSingleEdit(res);
                                            });
                                        });
                                sync.setRunning(-1);
                            });
                        });
                    });
                } else {
                    if (callbackSuccess) {
                        callbackSuccess();
                    }
                }
            }, function (errorThrown) {
                if (callbackError) {
                    callbackError(errorThrown);
                }
            });
        });
    },
    getDeletedRequest: function (entity, callbackSuccess, callbackError) {
        var versao = window.localStorage.getItem("versaoDelete" + entity.tableName);
        versao = (versao) ? versao : 0;
        var url = entity.tableName + "/" + versao + "/1/1";
        sync.ajax("GET", "JSON", url, {}, function (responseEntities) {
            if (responseEntities.length) {
                sync.setRunning(responseEntities.length);
                responseEntities.forEach(function (theEntity) {
                    theEntity.tableName = entity.tableName;
                    theEntity.idExterno = theEntity.id;
                    theEntity.id = "";
                    daoUtil.getByIdExterno(theEntity, function (res) {
                        if (!res) {
                            window.localStorage.setItem("versaoDelete" + theEntity.tableName, theEntity.versao);
                            sync.setRunning(-1);
                        } else {
                            daoUtil.delete(res, function () {
                                notifyUtil.addScheduleNotification(
                                        notifyUtil.getTitleNew(theEntity, "delete"),
                                        notifyUtil.getMessageNew(theEntity),
                                        new Date(),
                                        function () {
                                            var loadList = window[theEntity.tableName + "Controller"]["loadList"];
                                            loadList();
                                        });
                                window.localStorage.setItem("versaoDelete" + theEntity.tableName, theEntity.versao);
                                sync.setRunning(-1);
                            });
                        }
                    });
                });
            } else {
                if (callbackSuccess) {
                    callbackSuccess();
                }
            }
        }, function (errorThrown) {
            if (callbackError) {
                callbackError(errorThrown);
            }
        });
    },
    ajax: function (httpType, responseType, url, dataInput, cbSuccess, cbError) {
        url = "http://10.0.0.102:8080/LinemobAPI/" + url;
        $.ajax({
            crossDomain: true,
            type: httpType,
            dataType: responseType,
            url: url,
            data: (dataInput) ? JSON.stringify(dataInput) : {},
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Usuario", window.localStorage.getItem("user"));
                xhr.setRequestHeader("Token", window.localStorage.getItem("pwd"));
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
            loadController.hide();
            if (notifyUtil.notificationsArray.length) {
                notifyUtil.bulkNotify();
            }
        }
    },
    jsonToEntity: function (jsonObject, entityModel) {
        var modelEntity = {};
        for (var key in jsonObject) {
            if (key === "@type") {
                continue;
            }
            modelEntity[key] = jsonObject[key];
        }
        Object.setPrototypeOf(modelEntity, Object.getPrototypeOf(entityModel));
        return modelEntity;
    }
};