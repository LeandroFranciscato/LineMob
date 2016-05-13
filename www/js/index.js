/* global dbUtil, logUtil, contaController */

var app = {
    initialize: function () {
        this.bindEvents();
    },
    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    onDeviceReady: function () {
        alert("OnDeviceReady!");
        dbUtil.createSchema(function (res) {
            logUtil.log("PostCreateSchema", res);
            app.loadTemplates(function () {
                contaController.loadTemplateContaCadastro();
            });
        });
    },
    loadTemplates: function (cb) {
        $.get('templates/contaCadastro.html', function (string) {
            contaController.TEMPLATE_CONTA_CADASTRO = string;
            logUtil.log("Template contaCadastro loaded -> ", string);
            if (cb) {
                cb();
            }
        });
    }
};

app.initialize();