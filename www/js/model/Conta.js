var Conta = function () {
    this.nome = "";
    this.data = "";
    this.valor = "";
};
Conta.prototype = new Entity("conta");