/* global dbUtil, logUtil */

var loginModel = {
    initialize: function (cb) {
        var sql = "create table if not exists usuario (" +
                "id integer not null primary key autoincrement, " +
                "usuario text not null, " +
                "senha text not null);";

        dbUtil.DATABASE.transaction(function (t) {
            t.executeSql(sql, [], function (t, res) {
                if (cb) {
                    cb(res);
                }
            });
        });
    },
    insert: function (usuario, cb) {
        var sql = "insert into usuario (usuario, senha) values(?,?)";

        dbUtil.DATABASE.transaction(function (t) {
            t.executeSql(sql, [usuario.usuario, usuario.senha], function (t, res) {
                if (cb) {
                    cb(res);
                }
            }, function (error) {
                logUtil.log("Erro inserindo USUARIO", error);
            });
        });
    },
    getAll: function (cb) {
        var sql = "select * from usuario";
        
        dbUtil.DATABASE.transaction(function(t){
            t.executeSql(sql,[],function(t,res){
                if (cb){
                    cb(res.rows.item(0));
                }
            });
        });
       
    }
};