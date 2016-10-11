var Cartao = function(){
  this.nome = ""  ;
  this.diaVencimento = "";
  this.diaFechamento = "";
  this.valorLimite = "";
  this.idConta = ""; 
  this.idExternoConta = "";
};
Cartao.prototype = new Entity("cartao");