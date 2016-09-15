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
            for (var i = 0; i < cartoes.length; i++) {
                var cartao = cartoes[i];
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
            }
        });
    }
};