/* global dbUtil */

var contaModel = {
    initialize: function (cb) {
        var sql = "create table if not exists conta(" +
                "id integer not null primary key autoincrement," +
                "nome text not null," +
                "saldo_inicial real not null default 0)";

        dbUtil.DATABASE.transaction(function (t) {
            t.executeSql(sql, [], function (t, res) {
                if (cb) {
                    cb(res);
                }
            });
        });
    }
};