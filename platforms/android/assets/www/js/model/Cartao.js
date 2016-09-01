var Cartao = function(){
  this.nome = ""  ;
  this.diaVencimento = "";
  this.diaFechamento = "";
  this.valorLimite = "";
  this.idConta = "";  
};
Cartao.prototype = new Entity("cartao");