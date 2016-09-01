/* global dbUtil, logUtil, contaController, loginController, mainController, daoUtil, pessoaController, configController, loadController, cartaoController, categoriaController, movimentoController, cordova, i18next */

var app = {
    initialize: function () {
        this.bindEvents();
    },
    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);

    },
    onDeviceReady: function () {
        cordova.plugins.backgroundMode.setDefaults({
            silent: true
        });
        cordova.plugins.backgroundMode.enable();
        loadController.show(function () {
            dbUtil.initialize(function () {
                app.createTables(function () {
                    app.loadTemplates(function () {
                        loginController.load(function () {
                            loadController.hide();
                        });
                    });
                });
            });
        });
    },
    loadTemplates: function (cb) {
        app.loadTemplateConta(function () {
            app.loadTemplatePessoa(function () {
                app.loadTemplateCartao(function () {
                    app.loadTemplateCategoria(function () {
                        app.loadTemplateMovimento(function () {
                            app.loadTemplateMain(function () {
                                if (cb) {
                                    cb();
                                }
                            });
                        });
                    });
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
    loadTemplateCartao: function (cb) {
        $.get('templates/cartaoCadastro.html', function (string) {
            cartaoController.TEMPLATE_CADASTRO = string;
            $.get('templates/cartaoLista.html', function (string) {
                cartaoController.TEMPLATE_LISTA = string;
                $.get('templates/cartaoEdicao.html', function (string) {
                    cartaoController.TEMPLATE_EDICAO = string;
                    if (cb) {
                        cb();
                    }
                });
            });
        });
    },
    loadTemplateCategoria: function (cb) {
        $.get('templates/categoriaCadastro.html', function (string) {
            categoriaController.TEMPLATE_CADASTRO = string;
            $.get('templates/categoriaLista.html', function (string) {
                categoriaController.TEMPLATE_LISTA = string;
                $.get('templates/categoriaEdicao.html', function (string) {
                    categoriaController.TEMPLATE_EDICAO = string;
                    if (cb) {
                        cb();
                    }
                });
            });
        });
    },
    loadTemplateMovimento: function (cb) {
        $.get('templates/movimentoCadastro.html', function (string) {
            movimentoController.TEMPLATE_CADASTRO = string;
            $.get('templates/movimentoLista.html', function (string) {
                movimentoController.TEMPLATE_LISTA = string;
                $.get('templates/movimentoEdicao.html', function (string) {
                    movimentoController.TEMPLATE_EDICAO = string;
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
            $.get('templates/config.html', function (string) {
                configController.TEMPLATE_CONFIG = string;
                $.get('templates/inicio.html', function (string) {
                    mainController.TEMPLATE_MAIN = string;
                    if (cb) {
                        cb();
                    }
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
                                    var config = new Config();
                                    daoUtil.initialize(config, function () {
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
            });
        } else {
            if (cb) {
                cb();
            }
        }
    }
};

app.initialize();
