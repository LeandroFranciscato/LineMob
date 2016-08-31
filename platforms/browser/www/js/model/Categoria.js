var Categoria = function () {
    this.nome = "";
    this.nomeSubCategoria = ""; 
    this.idExterno = "";
};
Categoria.prototype = new Entity("categoria");