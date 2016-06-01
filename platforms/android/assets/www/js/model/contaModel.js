/* global dbUtil, config, util */

var contaModel = {
    initialize: function (cb) {
        var sql = "create table if not exists conta( " +
                "id integer not null primary key autoincrement, " +
                "nome text not null, " +
                "data text not null, " +
                "valor real not null)";

        dbUtil.DATABASE.transaction(function (t) {
            t.executeSql(sql, [], function (t, res) {
                if (cb) {
                    cb(res);
                }
            });
        });
    },
    insert: function (conta, cb) {
        var sql = "insert into conta (nome, valor, data) values (?,?,?)";

        dbUtil.DATABASE.transaction(function (transaction) {
            transaction.executeSql(sql, [conta.nome, conta.valor, conta.data],
                    function (transaction, results) {
                        if (cb) {
                            cb(results);
                        }
                    },
                    function (err) {
                        util.LOG("Erro ao inserir CONTA ->", err);
                    });
        });
    },
    getAll: function (cb) {
        var sql = "select * from conta";

        dbUtil.DATABASE.transaction(function (transaction) {
            transaction.executeSql(sql, [],
                    function (tx, results) {
                        if (cb) {
                            cb(results.rows);
                        }
                    },
                    function (err) {
                        util.LOG("Erro no getAll de contas -> ", err);
                    });
        });
    },
    getByRange: function (inicial, final, cb) {
        var sql = "select * from conta order by nome limit ?,?";

        dbUtil.DATABASE.transaction(function (transaction) {
            transaction.executeSql(sql, [inicial, final],
                    function (tx, results) {
                        if (cb) {
                            cb(results.rows);
                        }
                    },
                    function (err) {
                        util.LOG("Erro no getByRanges de contas -> ", err);
                    });
        });
    },
    delete: function (id, cb) {
        var sql = "delete from conta where id = ?";
        dbUtil.executeSql(sql, [id], function (res) {
            if (cb) {
                cb(res);
            }
        });
    },
    update: function (data, cb) {
        var sql = "update conta " +
                "   set nome = ?," +
                "       data = ?," +
                "       valor = ?" +
                " where id = ?";
        dbUtil.executeSql(sql, [data.nome, data.data, data.valor, data.id], function (res) {
            if (cb) {
                cb(res);
            }
        });
    }
};