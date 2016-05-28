/* global Mustache, logUtil, mainController, contaModel, alertUtil */

var contaController = {
    TEMPLATE_CONTA_CADASTRO: "",
    TEMPLATE_CONTA_LISTA: "",
    OBJECT_TO_BIND: "#scroller",
    load: function (cb) {
        Mustache.parse(this.TEMPLATE_CONTA_LISTA);
        contaModel.getAll(function (results) {
            var dados = {};
            dados.contas = [];

            if (results && results.item) {
                for (var i = 0; i < results.length; i++) {
                    dados.contas.push(results.item(i));
                }
            }
            contaController.render(dados, function () {
                if (cb) {
                    cb();
                }
            });
        });
    },
    new : function () {
        Mustache.parse(this.TEMPLATE_CONTA_CADASTRO);
        contaController.render();
    },
    render: function (data, cb) {
        var html;
        if (data) {
            html = Mustache.render(contaController.TEMPLATE_CONTA_LISTA, data);
        } else {
            html = Mustache.render(contaController.TEMPLATE_CONTA_CADASTRO);
        }
        mainController.render();
        $(contaController.OBJECT_TO_BIND).html(html);
        if (mainController.SITUACAO_MENU_ESQUERDO === 1) {
            mainController.menuEsquerdo();
        }
        loaded();
        if (cb) {
            cb();
        }
    },
    insert: function () {
        var data = $("#form-cadastro-conta").serializeObject();
        contaModel.insert(data, function (results) {
            if (results) {
                alertUtil.confirm("Conta cadastrada com sucesso!");
                contaController.load();
            } else {
                alertUtil.confirm("Problemas ao inserir Conta...");
            }
        });
    },
    checkInList: function (idConta) {
        var checked = $('#check-conta-' + idConta).prop("checked");
        
        if (checked && checked === true) {
            checked = 1;
        } else {
            checked = 0;
        }

        $('#conta-selecionada-' + idConta).html(checked);
    }
}; 