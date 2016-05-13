/* global contaModel */

var dbUtil = {
    DATABASE: "",
    NOME_DATABASE: "LineMob.db",
    LOCALIZACAO_DATABASE: "default",
    createSchema: function (cb) {
        this.DATABASE = window.sqlitePlugin.openDatabase({name: this.NOME_DATABASE, location: this.LOCALIZACAO_DATABASE});
        contaModel.initialize(function (res) {
            if (cb) {
                cb(res);
            }
        });
    }
}; 