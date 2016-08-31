var Pessoa = function(){
  this.nome = "";
  this.apelido = "";
  this.idExterno = "";
};
Pessoa.prototype = new Entity("pessoa");