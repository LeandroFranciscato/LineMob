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
                daoUtil.getVersao("max", cartao, function (versao) {
                    cartao.versao = versao;
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
        });
    },
    getInsertedRequest: function (callbackSuccess, callbackError) {
        sync.setRunning(1);
        var cartao = new Cartao();
        daoUtil.getVersao("max", cartao, function (versao) {
            var url = cartao.tableName + "/" + versao + "/1/0";
            sync.ajax("GET", "JSON", url, {}, function (responseCartoes) {
                if (responseCartoes.length) {
                    sync.setRunning(responseCartoes.length);
                    sync.setRunning(-1);
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
                                    var customFunction;
                                    var acao;
                                    if (res) {
                                        acao = "update";
                                        theCartao.id = res.id;
                                    } else {
                                        acao = "insert";
                                    }
                                    customFunction = window["daoUtil"][acao];
                                    var modelCartao = sync.jsonToEntity(theCartao, cartao);
                                    customFunction(modelCartao, function () {
                                        notifyUtil.addScheduleNotification(
                                                notifyUtil.getTitleNew(modelCartao, acao),
                                                notifyUtil.getMessageNew(modelCartao),
                                                new Date(),
                                                function () {
                                                    daoUtil.getByIdExterno(modelCartao, function (res) {
                                                        cartaoController.loadNewOrSingleEdit(res);
                                                    });
                                                });
                                        sync.setRunning(-1);
                                    });
                                });
                            } else {
                                sync.setRunning(-1);
                            }
                        });
                    });
                } else {
                    sync.setRunning(1);
                    if (callbackSuccess) {
                        callbackSuccess();
                    }
                }
            }, function (errorThrown) {
                sync.setRunning(1);
                if (callbackError) {
                    callbackError(errorThrown);
                }
            });
        });
    }
};