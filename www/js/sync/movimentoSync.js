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
            for (var i = 0; i < movimentos.length; i++) {
                var movimento = movimentos[i];

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
                                                movimento.idExternoCartao = cartao.idExterno;
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
            }
        });
    }
};