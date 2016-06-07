/* global dbUtil */

function DAO() {
    this.getFields = function (entity, cb) {
        var fields = [];
        var values = [];
        for (var key in entity) {
            if (key != undefined && typeof entity[key] !== 'function' && key != "tableName" && key != "id") {
                fields.push(key);
                values.push("'" + entity[key] + "'");
            }
        }
        if (cb) {
            cb(fields, values);
        }
    };

    this.insert = function (entity, cb) {
        this.getFields(entity, function (fields, values) {
            var sql = "insert into " + entity.tableName + "(" + fields + ") values (" + values + ")";
            dbUtil.executeSql(sql, [], function (res) {
                if (cb) {
                    cb(res);
                }
            });
        });
    };
    this.getAll = function (entity, cb) {
        var sql = "select * from " + entity.tableName + " order by id";
        dbUtil.executeSql(sql, [], function (res) {
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
        });
    };
}
