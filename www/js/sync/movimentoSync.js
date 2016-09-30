/* global daoUtil, sync, notifyUtil, movimentoController */

var movimentoSync = {
    insertUpdate: function (type) {
        var getFunction;
        if (type === "insert") {
            getFunction = window["daoUtil"]["getInserted"];
        } else {
            getFunction = window["daoUtil"]["getUpdated"];
        }
        getFunction(new Movimento(), function (movimentos) {
            if (!movimentos.length) {
                return;
            }
            sync.setRunning(movimentos.length);
            movimentos.forEach(function (movimento) {
                daoUtil.getVersao("max", movimento, function (versao) {
                    movimento.versao = versao;
                    var conta = new Conta();
                    conta.id = movimento.idConta;
                    daoUtil.getById(conta, function (res) {
                        conta = res;
                        if (conta.idExterno) {
                            movimento.idExternoConta = conta.idExterno;

                            var categoria = new Categoria();
                            categoria.id = movimento.idCategoria;
                            daoUtil.getById(categoria, function (res) {
                                categoria = res;
                                if (categoria.idExterno) {
                                    movimento.idExternoCategoria = categoria.idExterno;

                                    var pessoa = new Pessoa();
                                    pessoa.id = movimento.idPessoa;
                                    daoUtil.getById(pessoa, function (res) {
                                        pessoa = res;
                                        if (pessoa.idExterno) {
                                            movimento.idExternoPessoa = pessoa.idExterno;

                                            var cartao = new Cartao();
                                            cartao.id = movimento.idCartao;
                                            daoUtil.getById(cartao, function (res) {
                                                if (res) {
                                                    cartao = res;
                                                    if (cartao.idExterno) {
                                                        movimento.idExternoCartao = cartao.idExterno;
                                                    } else {
                                                        sync.setRunning(-1);
                                                        return;
                                                    }
                                                } else {
                                                    movimento.idExternoCartao = null;
                                                }

                                                if (type === "insert") {
                                                    sync.insertRequest(movimento);
                                                } else {
                                                    sync.updateRequest(movimento);
                                                }
                                            });
                                        } else {
                                            sync.setRunning(-1);
                                        }
                                    });
                                } else {
                                    sync.setRunning(-1);
                                }
                            });
                        } else {
                            sync.setRunning(-1);
                        }
                    });
                });
            });
        });
    },
    getInsertedRequest: function (callbackSuccess, callbackError) {
        var movimento = new Movimento();
        daoUtil.getVersao("max", movimento, function (versao) {
            var url = movimento.tableName + "/" + versao + "/1/0";
            sync.ajax("GET", "JSON", url, {}, function (responseMovimentos) {
                if (responseMovimentos.length) {
                    sync.setRunning(responseMovimentos.length);
                    responseMovimentos.forEach(function (theMovimento) {
                        theMovimento.tableName = movimento.tableName;
                        theMovimento.idExterno = theMovimento.id;
                        theMovimento.id = "";

                        var conta = new Conta();
                        conta.idExterno = theMovimento.idExternoConta;
                        daoUtil.getByIdExterno(conta, function (res) {
                            if (res) {
                                theMovimento.idConta = res.id;

                                var pessoa = new Pessoa();
                                pessoa.idExterno = theMovimento.idExternoPessoa;
                                daoUtil.getByIdExterno(pessoa, function (res) {
                                    if (res) {
                                        theMovimento.idPessoa = res.id;

                                        var categoria = new Categoria();
                                        categoria.idExterno = theMovimento.idExternoCategoria;
                                        daoUtil.getByIdExterno(categoria, function (res) {
                                            if (res) {
                                                theMovimento.idCategoria = res.id;

                                                var cartao = new Cartao();
                                                cartao.idExterno = theMovimento.idExternoCartao;
                                                daoUtil.getByIdExterno(cartao, function (res) {
                                                    if (theMovimento.idExternoCartao) {
                                                        if (res) {
                                                            theMovimento.idCartao = res.id;
                                                        } else {
                                                            sync.setRunning(-1);
                                                            return;
                                                        }
                                                    } else {
                                                        theMovimento.idCartao = null;
                                                    }
                                                    daoUtil.getByIdExterno(theMovimento, function (res) {
                                                        var customFunction;
                                                        var acao;
                                                        if (res) {
                                                            acao = "update";
                                                            theMovimento.id = res.id;
                                                        } else {
                                                            acao = "insert";
                                                        }
                                                        customFunction = window["daoUtil"][acao];
                                                        var modelMovimento = sync.jsonToEntity(theMovimento, movimento);
                                                        customFunction(modelMovimento, function () {
                                                            notifyUtil.addScheduleNotification(
                                                                    notifyUtil.getTitleNew(modelMovimento, acao),
                                                                    notifyUtil.getMessageNew(modelMovimento),
                                                                    new Date(),
                                                                    function () {
                                                                        daoUtil.getByIdExterno(modelMovimento, function (res) {
                                                                            movimentoController.loadNewOrSingleEdit(res);
                                                                        });
                                                                    });
                                                            sync.setRunning(-1);
                                                        });
                                                    });
                                                });
                                            } else {
                                                sync.setRunning(-1);
                                            }
                                        });
                                    } else {
                                        sync.setRunning(-1);
                                    }
                                });
                            } else {
                                sync.setRunning(-1);
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
        });
    }
};