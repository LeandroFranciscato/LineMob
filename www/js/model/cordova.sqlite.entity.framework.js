/* global dbUtil, alertUtil */

var Entity = function (tableName) {
    this.id = "";
    this.tableName = tableName;
    this.idExterno = "";
    this.deleted = "0";
    this.updated = "0";

    this.getFields = function (cb, showId) {
        var fields = [];
        var values = [];

        for (var key in this) {
            if (key != undefined && typeof this[key] !== 'function') {
                if (key == "id" && !showId) {
                    continue;
                }
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
    update: function (entity, cb) {
        entity.updated = 1;
        entity.getFields(function (fields, values) {
            var sql = "update " + entity.tableName + " set ";
            for (var i = 0; i < fields.length; i++) {
                sql += fields[i] + " = " + values[i] + ",";
            }
            sql = sql.substr(0, sql.length - 1);
            sql += " where id = " + entity.id;
            dbUtil.executeSql(sql, [], function (res) {
                if (cb) {
                    cb(res.rowsAffected);
                }
            });
        });
    },
    updateDinamicColumn: function (entity, coluna, cb) {
        entity.updated = 1;
        entity.getFields(function (fields, values) {
            var valor = "";
            for (var i = 0; i < fields.length; i++) {
                if (fields[i] === coluna) {
                    valor = values[i];
                    break;
                }
            }
            var sql = "update " + entity.tableName +
                    "   set " + coluna + " = " + valor +
                    " where id = ?";
            dbUtil.executeSql(sql, [entity.id], function (res) {
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
    markToDelete: function (entity, cb) {
        if (entity.idExterno == "") {
            this.delete(entity, function (res) {
                if (cb) {
                    cb(res.rowsAffected);
                }
            });
        } else {
            var sql = "update " + entity.tableName + " set deleted = '1' where id = ?";
            dbUtil.executeSql(sql, [entity.id], function (res) {
                if (cb) {
                    cb(res.rowsAffected);
                }
            });
        }
    },
    getAll: function (entity, orderByColumn, cb) {
        var sql = "select * from " + entity.tableName + " where deleted <> '1' ";

        if (orderByColumn) {
            sql += " order by " + orderByColumn;
        }

        dbUtil.executeSql(sql, [], function (res) {
            daoUtil.sucessGets(entity, res, function (retorno) {
                if (cb) {
                    cb(retorno);
                }
            });
        });
    },
    getById: function (entity, cb) {
        var sql = "select * from " + entity.tableName + " where deleted <> '1' and id = ?";
        dbUtil.executeSql(sql, [entity.id], function (res) {
            daoUtil.sucessGets(entity, res, function (retorno) {
                if (cb) {
                    cb(retorno[0]);
                }
            });
        });
    },
    getByRange: function (entity, orderByColumn, start, end, cb) {
        var sql = "select * from " + entity.tableName + " where deleted <> '1' ";

        if (orderByColumn) {
            sql += " order by " + orderByColumn;
        }

        sql += " limit ?, ?";

        dbUtil.executeSql(sql, [start, end], function (res) {
            daoUtil.sucessGets(entity, res, function (retorno) {
                if (cb) {
                    cb(retorno);
                }
            });
        });
    },
    getCount: function (entity, cb) {
        var sql = "select count(*) qtde from " + entity.tableName + " where deleted <> '1' ";
        dbUtil.executeSql(sql, [], function (res) {
            daoUtil.sucessGets(null, res, function (retorno) {
                if (cb) {
                    cb(retorno[0].qtde);
                }
            });
        });
    },
    getByLIke: function (entity, likeText, orderbyColumn, cb) {
        entity.getFields(function (fields, values) {
            var sql;
            for (var i = 0; i < fields.length; i++) {

                if (sql) {
                    sql += " union all ";
                } else {
                    sql = "select distinct " + fields + " from (";
                }

                sql += " select * from " + entity.tableName + " where deleted <> '1' and " + fields[i] + " like '%" + likeText + "%'";
            }
            sql += ")";

            if (orderbyColumn) {
                sql += " order by " + orderbyColumn;
            }

            dbUtil.executeSql(sql, [], function (res) {
                daoUtil.sucessGets(entity, res, function (retorno) {
                    if (cb) {
                        cb(retorno);
                    }
                });
            });
        }, true);
    },
    getDeleted: function (entity, cb) {
        var sql = "select * from " + entity.tableName + " where deleted = '1' ";
        dbUtil.executeSql(sql, [], function (res) {
            daoUtil.sucessGets(entity, res, function (retorno) {
                if (cb) {
                    cb(retorno);
                }
            });
        });
    },
    getUpdated: function (entity, cb) {
        var sql = "select * from " + entity.tableName + " where updated = '1' ";
        dbUtil.executeSql(sql, [], function (res) {
            daoUtil.sucessGets(entity, res, function (retorno) {
                if (cb) {
                    cb(retorno);
                }
            });
        });
    },
    getInserted: function (entity, cb) {
        var sql = "select * from " + entity.tableName + " where idExterno = '' ";
        dbUtil.executeSql(sql, [], function (res) {
            daoUtil.sucessGets(entity, res, function (retorno) {
                if (cb) {
                    cb(retorno);
                }
            });
        });
    },
    sucessGets: function (entity, res, cb) {
        if (res && res.rows && res.rows.item) {
            var retorno = [];
            for (var i = 0; i < res.rows.length; i++) {
                var obj = res.rows.item(i);

                if (entity) {
                    Object.setPrototypeOf(obj, Object.getPrototypeOf(entity));
                }
                retorno.push(obj);
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
    dropDatabase: function (callback) {
        window.sqlitePlugin.deleteDatabase({name: this.NOME_DATABASE, location: this.LOCALIZACAO_DATABASE}, function () {
            if (callback) {
                callback();
            }
        });
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
                            alertUtil.confirm("Error executing SQL ->" + err.toString());
                            if (cb) {
                                cb(err);
                            }
                        });
            });
        });
    }
};