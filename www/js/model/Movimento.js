var Movimento = function(){
    this.data = "";
    this.valor = "";
    this.natureza = "";
    this.descricao = "";
    this.idConta = "";
    this.idCategoria = "";
    this.idPessoa = "";
    this.idCartao = "";
    this.idExterno = "";
};
Movimento.prototype = new Entity("movimento");