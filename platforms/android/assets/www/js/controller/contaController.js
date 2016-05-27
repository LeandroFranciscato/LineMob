/* global Mustache, logUtil */

var contaController = {
    TEMPLATE_CONTA_CADASTRO: "",
    OBJECT_TO_BIND: "#scroller",
    load: function (data, cb) {
        if (!data) {
            Mustache.parse(this.TEMPLATE_CONTA_CADASTRO);
            this.render(data, function () {
                if (cb) {
                    cb();
                }
            });
        }
    },
    render: function (data, cb) {
        data = (data) ? data : {};
        var html = Mustache.render(this.TEMPLATE_CONTA_CADASTRO, data);
        $(this.OBJECT_TO_BIND).html(html);
        mainController.menuEsquerdo();
        if (cb) {
            cb();
        }
    }
}; 