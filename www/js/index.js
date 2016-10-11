/* global dbUtil, logUtil, contaController, loginController, mainController, daoUtil, pessoaController, configController, loadController, cartaoController, categoriaController, movimentoController, cordova, i18next, syncUtil, sync, signupController, reportsController */

var app = {
    initialize: function () {
        this.bindEvents();
    },
    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    onDeviceReady: function () {
        app.enableBackground();
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
                                app.loadTemplateReports(function () {
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

    },
    loadTemplateConta: function (cb) {
        $.get('templates/forms/contaCadastro.html', function (string) {
            contaController.TEMPLATE_CADASTRO = string;
            $.get('templates/forms/contaLista.html', function (string) {
                contaController.TEMPLATE_LISTA = string;
                $.get('templates/forms/contaEdicao.html', function (string) {
                    contaController.TEMPLATE_EDICAO = string;
                    if (cb) {
                        cb();
                    }
                });
            });
        });
    },
    loadTemplatePessoa: function (cb) {
        $.get('templates/forms/pessoaCadastro.html', function (string) {
            pessoaController.TEMPLATE_CADASTRO = string;
            $.get('templates/forms/pessoaLista.html', function (string) {
                pessoaController.TEMPLATE_LISTA = string;
                $.get('templates/forms/pessoaEdicao.html', function (string) {
                    pessoaController.TEMPLATE_EDICAO = string;
                    if (cb) {
                        cb();
                    }
                });
            });
        });
    },
    loadTemplateCartao: function (cb) {
        $.get('templates/forms/cartaoCadastro.html', function (string) {
            cartaoController.TEMPLATE_CADASTRO = string;
            $.get('templates/forms/cartaoLista.html', function (string) {
                cartaoController.TEMPLATE_LISTA = string;
                $.get('templates/forms/cartaoEdicao.html', function (string) {
                    cartaoController.TEMPLATE_EDICAO = string;
                    if (cb) {
                        cb();
                    }
                });
            });
        });
    },
    loadTemplateCategoria: function (cb) {
        $.get('templates/forms/categoriaCadastro.html', function (string) {
            categoriaController.TEMPLATE_CADASTRO = string;
            $.get('templates/forms/categoriaLista.html', function (string) {
                categoriaController.TEMPLATE_LISTA = string;
                $.get('templates/forms/categoriaEdicao.html', function (string) {
                    categoriaController.TEMPLATE_EDICAO = string;
                    if (cb) {
                        cb();
                    }
                });
            });
        });
    },
    loadTemplateMovimento: function (cb) {
        $.get('templates/forms/movimentoCadastro.html', function (string) {
            movimentoController.TEMPLATE_CADASTRO = string;
            $.get('templates/forms/movimentoLista.html', function (string) {
                movimentoController.TEMPLATE_LISTA = string;
                $.get('templates/forms/movimentoEdicao.html', function (string) {
                    movimentoController.TEMPLATE_EDICAO = string;
                    if (cb) {
                        cb();
                    }
                });
            });
        });
    },
    loadTemplateMain: function (cb) {
        $.get('templates/forms/login.html', function (string) {
            loginController.TEMPLATE_LOGIN = string;
            $.get('templates/forms/config.html', function (string) {
                configController.TEMPLATE_CONFIG = string;
                $.get('templates/forms/signup.html', function (string) {
                    signupController.TEMPLATE_SIGNUP = string;
                    $.get('templates/forms/inicio.html', function (string) {
                        mainController.TEMPLATE_MAIN = string;
                        if (cb) {
                            cb();
                        }
                    });
                });
            });
        });
    },
    loadTemplateReports: function (cb) {
        $.get('templates/reports/chooseReports.html', function (string) {
            reportsController.TEMPLATE_CHOOSE_REPORTS = string;
            $.get('templates/reports/accountBalance.html', function (string) {
                reportsController.TEMPLATE_ACCOUNT_BALANCE = string;
                $.get('templates/reports/accountBalanceFilter.html', function (string) {
                    reportsController.TEMPLATE_ACCOUNT_BALANCE_FILTER = string;
                    $.get('templates/reports/credCard.html', function (string) {
                        reportsController.TEMPLATE_CRED_CARD = string;
                        $.get('templates/reports/credCardFilter.html', function (string) {
                            reportsController.TEMPLATE_CRED_CARD_FILTER = string;
                            $.get("templates/reports/groupCategory.html", function (string) {
                                reportsController.TEMPLATE_GROUP_CATEGORY = string;
                                $.get("templates/reports/groupCategoryFilter.html", function (string) {
                                    reportsController.TEMPLATE_GROUP_CATEGORY_FILTER = string;
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
    },
    enableBackground: function () {
        /*
        var interval = null;
        interval = setInterval(function () {
            sync.run();
        }, 60000);
         */
    }
};
app.initialize();
