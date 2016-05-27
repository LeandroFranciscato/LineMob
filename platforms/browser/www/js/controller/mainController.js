/* global Mustache, contaController */

var mainController = {
    TEMPLATE_BARRA_TOPO: "",
    SITUACAO_MENU_ESQUERDO: 0,
    render: function (cb) {
        var html = Mustache.render(this.TEMPLATE_BARRA_TOPO);
        $("[data-content=content]").html(html);
        this.bindEvents();
        //contaController.load();
        if (cb) {
            cb();
        }
    },
    bindEvents: function () {
        $(".tudo").on("swipeleft", function (e) {
            mainController.menuEsquerdo();
        }).on("swiperight", function (e) {
            mainController.menuEsquerdo();
        });

        $("#centro-abaixo").click(function () {
            if (mainController.SITUACAO_MENU_ESQUERDO === 1) {
                mainController.menuEsquerdo();
            }
        });
    },
    menuEsquerdo: function () {
        var border;
        if (this.SITUACAO_MENU_ESQUERDO === 0) {
            $("#menu-esquerdo").animate({
                width: "60%",
                borderWidth: "3px"
            }, 150);
            this.SITUACAO_MENU_ESQUERDO = 1;
        } else {
            $("#menu-esquerdo").animate({
                width: "0%",
                borderWidth: "0px"
            }, 150);
            this.SITUACAO_MENU_ESQUERDO = 0;
        }
    }
};