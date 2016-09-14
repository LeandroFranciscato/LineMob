var Movimento = function(){
    this.dataLancamento = "";    
    this.dataVencimento = "";    
    this.valor = "";
    this.natureza = "";
    this.descricao = "";
    this.idConta = "";
    this.idExternoConta = "";
    this.idCategoria = "";
    this.idExternoCategoria = "";
    this.idPessoa = "";
    this.idExternoPessoa = "";
    this.idCartao = "";
    this.idExternoCartao = "";    
};
Movimento.prototype = new Entity("movimento");