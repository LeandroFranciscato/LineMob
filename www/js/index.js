/* global dbUtil, logUtil, contaController, loginController, mainController, daoUtil, pessoaController */

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
        this.loadTemplateConta(function () {
            app.loadTemplatePessoa(function () {
                app.loadTemplateMain(function () {
                    if (cb) {
                        cb();
                    }
                });
            });
        });

    },
    loadTemplateConta: function (cb) {
        $.get('templates/contaCadastro.html', function (string) {
            contaController.TEMPLATE_CADASTRO = string;
            $.get('templates/contaLista.html', function (string) {
                contaController.TEMPLATE_LISTA = string;
                $.get('templates/contaEdicao.html', function (string) {
                    contaController.TEMPLATE_EDICAO = string;
                    if (cb) {
                        cb();
                    }
                });
            });
        });
    },
    loadTemplatePessoa: function (cb) {
        $.get('templates/pessoaCadastro.html', function (string) {
            pessoaController.TEMPLATE_CADASTRO = string;
            $.get('templates/pessoaLista.html', function (string) {
                pessoaController.TEMPLATE_LISTA = string;
                $.get('templates/pessoaEdicao.html', function (string) {
                    pessoaController.TEMPLATE_EDICAO = string;
                    if (cb) {
                        cb();
                    }
                });
            });
        });
    },
    loadTemplateMain: function (cb) {
        $.get('templates/login.html', function (string) {
            loginController.TEMPLATE_LOGIN = string;
            $.get('templates/inicio.html', function (string) {
                mainController.TEMPLATE_MAIN = string;
                if (cb) {
                    cb();
                }
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
        } else {
            if (cb) {
                cb();
            }
        }
    }
};

app.initialize();
