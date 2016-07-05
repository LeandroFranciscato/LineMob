/* global daoUtil */
var Controller = function (entity, controller) {
    this.loadLista = function (inicial, final, cb) {

        if (!inicial) {
            inicial = 0;
        }

        if (!final) {
            final = 10;
        }

        var conta = new Conta();
        daoUtil.getByRange(entity, "nome", inicial, final, function (results) {
            var data = {};
            data[entity.tableName] = results;
            controller.render("lista", data, function () {
                if (cb) {
                    cb();
                }
            });
        });
    };

};