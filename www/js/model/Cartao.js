var Cartao = function(){
  this.nome = ""  ;
  this.diaVencimento = "";
  this.diaFechamento = "";
  this.valorLimite = "";
  this.idConta = "";
  this.idExterno = "";
};
Cartao.prototype = new Entity("cartao");