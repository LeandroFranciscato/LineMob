var Movimento = function(){
    this.dataLancamento = "";    
    this.dataVencimento = "";    
    this.valor = "";
    this.natureza = "";
    this.descricao = "";
    this.idConta = "";
    this.idCategoria = "";
    this.idPessoa = "";
    this.idCartao = "";    
};
Movimento.prototype = new Entity("movimento");