/* global dbUtil, alertUtil */

var Entity = function (tableName) {
    this.id = "";
    this.tableName = tableName;
    this.idExterno = "";
    this.deleted = "0";
    this.updated = "0";
    this.versao = "0";

    this.getFields = function (cb, showId, hideIdExterno) {
        var fields = [];
        var values = [];

        for (var key in this) {
            if (key != undefined && typeof this[key] !== 'function') {
                if (key == "id" && !showId) {
                    continue;
                }
                if (key == "idExterno" && hideIdExterno) {
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
    checkTableChanges: function (entity, cb) {
        entity.getFields(function (entityFields) {
            daoUtil.getCustom("PRAGMA table_info(" + entity.tableName + ")", function (fieldsObj) {
                var databaseFields = [];
                fieldsObj.forEach(function (fieldObj) {
                    databaseFields.push(fieldObj.name.toString());
                });
                entityFields.forEach(function (entityField) {
                    if (databaseFields.indexOf(entityField) === -1) {
                        daoUtil.getCustom("alter table " + entity.tableName + " add column " + entityField + " text");
                    }
                });
                if (cb) {
                    cb();
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
    update: function (entity, cb, updateIdExterno) {
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
        }, null, updateIdExterno);
    },
    updateDinamicColumn: function (entity, coluna, cb) {
        entity.getFields(function (fields, values) {
            var valor = "";
            for (var i = 0; i < fields.length; i++) {
                if (fields[i] === coluna) {
                    valor = values[i];
                    break;
                }
            }
            var sql = "update " + entity.tableName +
                    "   set updated = 1, " + coluna + " = " + valor +
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
        this.getById(entity, function (entityComplete) {
            if (!entityComplete.idExterno) {
                daoUtil.delete(entityComplete, function (rowsAffected) {
                    if (cb) {
                        cb(rowsAffected);
                    }
                });
            } else {
                var sql = "update " + entityComplete.tableName + " set deleted = '1' where id = ?";
                dbUtil.executeSql(sql, [entityComplete.id], function (res) {
                    if (cb) {
                        cb(res.rowsAffected);
                    }
                });
            }
        });
    },
    getAll: function (entity, orderByColumn, cb, isDescent) {
        var sql = "select * from " + entity.tableName + " where deleted <> '1' ";

        if (orderByColumn) {
            sql += " order by " + orderByColumn + " collate nocase ";
            sql += (isDescent) ? "desc" : "asc";
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
        var sql = "select * from " + entity.tableName + " where id = ?";
        dbUtil.executeSql(sql, [entity.id], function (res) {
            daoUtil.sucessGets(entity, res, function (retorno) {
                if (cb) {
                    cb(retorno[0]);
                }
            });
        });
    },
    getByIdExterno: function (entity, cb) {
        var sql = "select * from " + entity.tableName + " where idExterno = ?";
        dbUtil.executeSql(sql, [entity.idExterno], function (res) {
            daoUtil.sucessGets(entity, res, function (retorno) {
                if (cb) {
                    cb(retorno[0]);
                }
            });
        });
    },
    getByRange: function (entity, orderByColumn, start, end, cb, isDescent) {
        var sql = "select * from " + entity.tableName + " where deleted <> '1' ";

        if (orderByColumn) {
            sql += " order by " + orderByColumn + " collate nocase ";
            sql += (isDescent) ? "desc" : "asc";
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
    getVersao: function (type, entity, cb) {
        var sql = "select " + type + "(cast(versao as integer)) versao from " + entity.tableName;
        dbUtil.executeSql(sql, [], function (res) {
            daoUtil.sucessGets(null, res, function (retorno) {
                if (cb) {
                    if (!retorno[0].versao) {
                        retorno[0].versao = 0;
                    }
                    cb(retorno[0].versao);
                }
            });
        });
    },
    getByLIke: function (entity, likeText, orderbyColumn, cb, isDescent) {
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
                sql += " order by " + orderbyColumn + " collate nocase ";
                sql += (isDescent) ? "desc" : "asc";
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
    getCustom: function (sql, cb) {
        dbUtil.executeSql(sql, [], function (res) {
            daoUtil.sucessGets(null, res, function (retorno) {
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
                            alertUtil.confirm("Error executing SQL ->" + err.valueOf());
                            if (cb) {
                                cb(err);
                            }
                        });
            });
        });
    }
};