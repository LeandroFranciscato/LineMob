/* global dbUtil, logUtil, contaController, loginController, mainController, daoUtil */

var app = {
    initialize: function () {
        this.bindEvents();
    },
    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    onDeviceReady: function () {
        dbUtil.initialize(function () {
            app.createTables(function () {
                app.loadTemplates(function () {
                    loginController.load();
                });
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
                });
            });
        });
    },
    createTables: function (cb) {
        var storage = window.localStorage;
        if (!storage.getItem("dataBaseCreated")) {
            var usuario = new Usuario();
            daoUtil.initialize(usuario, function () {
                var conta = new Conta();
                daoUtil.initialize(conta, function () {
                    var cartao = new Cartao();
                    daoUtil.initialize(cartao, function () {
                        var categoria = new Categoria();
                        daoUtil.initialize(categoria, function () {
                            var pessoa = new Pessoa();
                            daoUtil.initialize(pessoa, function () {
                                var mov = new Movimento();
                                daoUtil.initialize(mov, function () {
                                    storage.setItem("dataBaseCreated", "1");
                                    if (cb) {
                                        cb();
                                    }
                                });
                            });
                        });
                    });
                });
            });
        }
        if (cb) {
            cb();
        }
    }
};

app.initialize();
