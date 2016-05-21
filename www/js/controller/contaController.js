/* global Mustache, logUtil */

var contaController = {
    TEMPLATE_CONTA_CADASTRO: "",
    OBJECT_TO_BIND: "[data-content=content]",
    load: function (cb) {
        data = ""; // Implementar
        Mustache.parse(this.TEMPLATE_CONTA_CADASTRO);
        this.renderTemplateContaCadastro(data, function () {
            if (cb) {
                cb();
            }
        });
    },
    render: function (data, cb) {
        data = (data) ? data : {};
        var html = Mustache.render(this.TEMPLATE_CONTA_CADASTRO, data);
        $(this.OBJECT_TO_BIND).html(html);
        logUtil.log("Bind contaCadastro rendered.");
        if (cb) {
            cb();
        }
    }
}; 