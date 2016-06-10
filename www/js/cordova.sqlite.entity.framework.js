/* global dbUtil */

var Entity = function (tableName) {
    this.id = "";
    this.tableName = tableName;

    this.getFields = function (cb) {
        var fields = [];
        var values = [];
        for (var key in this) {
            if (key != undefined && typeof this[key] !== 'function' && key !== "tableName" && key !== "id") {
                fields.push(key);
                values.push("'" + this[key] + "'");
            }
        }
        if (cb) {
            cb(fields, values);
        }
    };
};

var daoUtil = {
    initialize: function (entity, cb) {
        entity.getFields(function (fields) {
            var sql = "create table if not exists " + entity.tableName + "(";
            for (var i = 0; i < fields.length; i++) {
                sql += fields[i] + " text,";
            }

            sql = sql + " id integer not null primary key autoincrement)";
            dbUtil.executeSql(sql, [], function (res) {
                if (cb) {
                    cb(res);
                }
            });
        });
    },
    insert: function (entity, cb) {
        entity.getFields(function (fields, values) {
            var sql = "insert into " + entity.tableName + "(" + fields + ") values (" + values + ")";
            dbUtil.executeSql(sql, [], function (res) {
                if (cb) {
                    cb(res.rowsAffected);
                }
            });
        });
    },
    delete: function (entity, cb) {
        var sql = "delete from " + entity.tableName + " where id = ?";
        dbUtil.executeSql(sql, [entity.id], function (res) {
            if (cb) {
                cb(res.rowsAffected);
            }
        });
    },
    getAll: function (entity, orderByColumn, cb) {
        var sql = "select * from " + entity.tableName + " order by " + orderByColumn;
        dbUtil.executeSql(sql, [], function (res) {
            daoUtil.sucessGets(res, function (retorno) {
                if (cb) {
                    cb(retorno);
                }
            });
        });
    },
    getByRange: function (entity, orderByColumn, start, end, cb) {
        var sql = "select * from " + entity.tableName + " order by " + orderByColumn + " limit ?, ?";
        dbUtil.executeSql(sql, [start, end], function (res) {
            daoUtil.sucessGets(res, function (retorno) {
                if (cb) {
                    cb(retorno);
                }
            });
        });
    },
    sucessGets: function (res, cb) {
        if (res && res.rows && res.rows.item) {
            var retorno = [];
            for (var i = 0; i < res.rows.length; i++) {
                retorno.push(res.rows.item(i));
            }
            if (cb) {
                cb(retorno);
            }
        } else {
            if (cb) {
                cb();
            }
        }
    }
};

var dbUtil = {
    DATABASE: "",
    NOME_DATABASE: "LineMob.db",
    LOCALIZACAO_DATABASE: "default",
    initialize: function (cb) {
        if (!this.DATABASE) {
            this.DATABASE = window.sqlitePlugin.openDatabase({name: this.NOME_DATABASE, location: this.LOCALIZACAO_DATABASE},
                    function (tx) {
                        if (cb) {
                            cb(tx);
                        }
                    },
                    function (err) {
                        if (cb) {
                            cb(err);
                        }
                    });
        } else {
            if (cb) {
                cb();
            }
        }
    },
    executeSql: function (sql, parametros, cb) {
        this.initialize(function () {
            dbUtil.DATABASE.transaction(function (transaction) {
                transaction.executeSql(sql, parametros,
                        function (tx, res) {
                            if (cb) {
                                cb(res);
                            }
                        },
                        function (err) {
                            alertUtil.confirm("Erro executando sql ->", err.toString());
                            if (cb) {
                                cb(err);
                            }
                        });
            });
        });
    }
};

var alertUtil = {
    confirm: function (mensagem, titulo, buttons, cb) {

        if (!titulo) {
            titulo = "";
        }

        if (!buttons) {
            buttons = [];
            buttons.push("OK");
        }
        navigator.notification.confirm(
                mensagem,
                function (btnEscolhido) {
                    if (cb) {
                        cb(btnEscolhido);
                    }
                },
                titulo,
                buttons);
    }
};