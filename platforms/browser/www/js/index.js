/* global dbUtil, logUtil, contaController, loginController, mainController */

var app = {
    initialize: function () {
        this.bindEvents();
    },
    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    onDeviceReady: function () {
        //dbUtil.createSchema(function (res) {
         /*   app.loadTemplates(function () {
                loginController.load();
            });*/
//        });
    },
    loadTemplates: function (cb) {
        $.get('templates/contaCadastro.html', function (string) {
            contaController.TEMPLATE_CONTA_CADASTRO = string;
            $.get('templates/login.html', function (string) {
                loginController.TEMPLATE_LOGIN = string;
                $.get('templates/barra-topo.html', function (string) {
                    mainController.TEMPLATE_BARRA_TOPO = string;
                    if (cb) {
                        cb();
                    }
                });
            });
        });
    }
};

app.initialize();
