/* global daoUtil, sync */

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
    getRequest: function (callbackSuccess, callbackError) {
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
                                    modelEntity = sync.modelFromJson(cartao);                                   ;
                                    daoUtil.insert(modelEntity);
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
    }
};