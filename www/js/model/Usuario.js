var Usuario = function(){
  this.usuario = ""  ;
  this.senha = "";
  this.idExterno = "";
};
Usuario.prototype = new Entity("usuario");