/* global daoUtil, sync */

var cartaoSync = {
    insert: function () {
        daoUtil.getInserted(new Cartao(), function (cartoes) {
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
                        sync.insertRequest(cartao);
                    } else {
                        sync.setRunning(-1);
                    }
                });
            }
        });
    }
};