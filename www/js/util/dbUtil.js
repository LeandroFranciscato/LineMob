/* global contaModel, loginModel, logUtil */

var dbUtil = {
    DATABASE: "",
    NOME_DATABASE: "LineMob.db",
    LOCALIZACAO_DATABASE: "default",
    createSchema: function (cb) {
        this.DATABASE = window.sqlitePlugin.openDatabase({name: this.NOME_DATABASE, location: this.LOCALIZACAO_DATABASE});
        contaModel.initialize(function (res) {
            loginModel.initialize(function () {
                if (cb) {
                    cb(res);
                }
            });
        });
    },
    executeSql: function (sql, parametros, cb) {
        this.DATABASE.transaction(function (transaction) {
            transaction.executeSql(sql, parametros,
                    function (tx, res) {
                        if (cb) {
                            cb(res);
                        }
                    },
                    function (err) {
                        logUtil.log("Erro executando sql ->", err);
                    });
        });

    }
}; 