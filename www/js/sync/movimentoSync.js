/* global daoUtil, sync */

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
    },
    getInsertedRequest: function (callbackSuccess, callbackError) {
        var movimento = new Movimento();
        sync.ajax("GET", "JSON", movimento.tableName, {}, function (responseMovimentos) {
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
                                                    sync.setRunning(-1);
                                                    var modelEntity;
                                                    if (!res) {
                                                        modelEntity = sync.jsonToEntity(theMovimento, movimento);
                                                        daoUtil.insert(modelEntity);
                                                    }
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
        var movimento = new Movimento();
        var theMovimento = sync.jsonToEntity(jsonObject, movimento);
        theMovimento.idExterno = theMovimento.id;
        daoUtil.getByIdExterno(theMovimento, function (res) {
            if (res) {
                theMovimento.id = res.id;

                var conta = new Conta();
                conta.idExterno = theMovimento.idExternoConta;
                daoUtil.getByIdExterno(conta, function (res) {
                    if (res) {
                        theMovimento.idConta = res.id;

                        var categoria = new Categoria();
                        categoria.idExterno = theMovimento.idExternoCategoria;
                        daoUtil.getByIdExterno(categoria, function (res) {
                            if (res) {
                                theMovimento.idCategoria = res.id;


                                var pessoa = new Pessoa();
                                pessoa.idExterno = theMovimento.idExternoPessoa;
                                daoUtil.getByIdExterno(pessoa, function (res) {
                                    if (res) {
                                        theMovimento.idPessoa = res.id;

                                        var cartao = new Cartao();
                                        cartao.idExterno = theMovimento.idExternoCartao;
                                        daoUtil.getByIdExterno(cartao, function (res) {
                                            if (theMovimento.idExternoCartao) {
                                                if (res) {
                                                    theMovimento.idCartao = res.id;
                                                } else {
                                                    if (cb) {
                                                        cb();
                                                    }
                                                }
                                            } else {
                                                theMovimento.idCartao = null;
                                            }
                                            daoUtil.update(theMovimento, function (rowsAffected) {
                                                if (cb) {
                                                    cb(rowsAffected);
                                                }
                                            });
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