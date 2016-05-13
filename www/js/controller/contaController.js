/* global Mustache, logUtil */

var contaController = {
    TEMPLATE_CONTA_CADASTRO: "",
    OBJECT_TO_BIND: "[data-content=content]",
    loadTemplateContaCadastro: function (data, cb) {
        Mustache.parse(this.TEMPLATE_CONTA_CADASTRO);
        data = (data) ? data : {};
        var html = Mustache.render(this.TEMPLATE_CONTA_CADASTRO, data);
        $(this.OBJECT_TO_BIND).html(html);
        logUtil.log("Bind contaCadastro rendered.");
        if (cb) {
            cb();
        }
    }
};