var Conta = function () {
    this.nome = "";
    this.dataFundacao = "";
    this.valorSaldoInicial = "";
};
Conta.prototype = new Entity("conta");