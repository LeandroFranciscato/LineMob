/* global daoUtil, sync, notifyUtil, cartaoController */

var cartaoSync = {
    insertUpdate: function (type) {
        var getFunction;
        if (type === "insert") {
            getFunction = window["daoUtil"]["getInserted"];
        } else {
            getFunction = window["daoUtil"]["getUpdated"];
        }
        getFunction(new Cartao(), function (cartoes) {
            if (!cartoes.length) {
                return;
            }
            sync.setRunning(cartoes.length);
            cartoes.forEach(function (cartao) {
                var conta = new Conta();
                conta.id = cartao.idConta;
                daoUtil.getById(conta, function (res) {
                    conta = res;
                    if (conta.idExterno) {
                        cartao.idExternoConta = conta.idExterno;
                        if (type === "insert") {
                            sync.insertRequest(cartao);
                        } else {
                            sync.updateRequest(cartao);
                        }
                    } else {
                        sync.setRunning(-1);
                    }
                });
            });
        });
    },
    getInsertedRequest: function (callbackSuccess, callbackError) {
        var cartao = new Cartao();
        sync.ajax("GET", "JSON", cartao.tableName, {}, function (responseCartoes) {
            if (responseCartoes.length) {
                sync.setRunning(responseCartoes.length);
                responseCartoes.forEach(function (theCartao) {
                    theCartao.tableName = cartao.tableName;
                    theCartao.idExterno = theCartao.id;
                    theCartao.id = "";

                    var conta = new Conta();
                    conta.idExterno = theCartao.idExternoConta;
                    daoUtil.getByIdExterno(conta, function (res) {
                        if (res) {
                            theCartao.idConta = res.id;
                            daoUtil.getByIdExterno(theCartao, function (res) {
                                sync.setRunning(-1);
                                var modelEntity;
                                if (!res) {
                                    modelEntity = sync.jsonToEntity(theCartao, cartao);
                                    daoUtil.insert(modelEntity, function () {
                                        notifyUtil.addScheduleNotification(
                                                notifyUtil.getTitleNew(modelEntity),
                                                notifyUtil.getMessageNew(modelEntity),
                                                new Date(),
                                                function () {
                                                    daoUtil.getByIdExterno(modelEntity, function (res) {                                                        
                                                        cartaoController.loadNewOrSingleEdit(res);
                                                    });
                                                });
                                    });
                                }
                            });
                        } else {
                            sync.setRunning(-1);
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
    getUpdatedRequest: function (jsonObject, cb) {
        var cartao = new Cartao();
        var theCartao = sync.jsonToEntity(jsonObject, cartao);
        theCartao.idExterno = theCartao.id;
        daoUtil.getByIdExterno(theCartao, function (res) {
            if (res) {
                theCartao.id = res.id;

                var conta = new Conta();
                conta.idExterno = theCartao.idExternoConta;
                daoUtil.getByIdExterno(conta, function (res) {
                    if (res) {
                        theCartao.idConta = res.id;
                        daoUtil.update(theCartao, function (rowsAffected) {
                            if (cb) {
                                cb(rowsAffected);
                            }
                        });
                    } else {
                        if (cb) {
                            cb();
                        }
                    }
                });
            } else {
                if (cb) {
                    cb();
                }
            }
        });
    }
};