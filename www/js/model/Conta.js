var Conta = function () {
    this.nome = "";
    this.dataFundacao = "";
    this.valorSaldoInicial = "";
    this.idExterno = "";
};
Conta.prototype = new Entity("conta");