/* global dbUtil, logUtil, contaController, loginController, mainController */

var app = {
    initialize: function () {
        this.bindEvents();
    },
    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    onDeviceReady: function () {
        dbUtil.createSchema(function (res) {
            app.loadTemplates(function () {
                loginController.load();
            });
        });
    },
    loadTemplates: function (cb) {
        $.get('templates/contaCadastro.html', function (string) {
            contaController.TEMPLATE_CONTA_CADASTRO = string;
            $.get('templates/contaLista.html', function (string) {
                contaController.TEMPLATE_CONTA_LISTA = string;
                $.get('templates/contaEdicao.html', function (string) {
                    contaController.TEMPLATE_CONTA_EDICAO = string;
                    $.get('templates/login.html', function (string) {
                        loginController.TEMPLATE_LOGIN = string;
                        if (cb) {
                            cb();
                        }
                    });
                })

            });
        });
    }
};

app.initialize();
