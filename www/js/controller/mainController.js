/* global Mustache, contaController */

var mainController = {
    TEMPLATE_MAIN: "",
    SITUACAO_MENU_ESQUERDO: 0,
    render: function (cb) {
        var html = Mustache.render(this.TEMPLATE_MAIN);
        $("#wrapper").css("top", "50px");
        $("#header").css("display", "block");
        $("#menu-esquerdo").css("display", "block");
        $("#scroller").html("");        
        loaded();
        this.bindEvents();
        if (cb) {
            cb();
        }
    },
    bindEvents: function () {
        $("body").on("swipeleft", function (e) {
            if (mainController.SITUACAO_MENU_ESQUERDO === 1) {
                mainController.menuEsquerdo();
            }
        }).on("swiperight", function (e) {
            if (mainController.SITUACAO_MENU_ESQUERDO === 0) {
                mainController.menuEsquerdo();
            }
        });

        $("#scroller").click(function () {
            if (mainController.SITUACAO_MENU_ESQUERDO === 1) {
                mainController.menuEsquerdo();
            }
        });
    },
    menuEsquerdo: function () {
        var border;
        if (this.SITUACAO_MENU_ESQUERDO === 0) {
            $("#menu-esquerdo").animate({
                left: "0px"
            }, 150);
            $("#wrapper").animate({
                left: "220px"
            }, 150);
            $("#header").animate({
                left: "220px"
            }, 150);
            this.SITUACAO_MENU_ESQUERDO = 1;
        } else {
            $("#menu-esquerdo").animate({
                left: "-220px"
            }, 150);
            $("#wrapper").animate({
                left: "0px"
            }, 150);
            $("#header").animate({
                left: "0px"
            }, 150);
            this.SITUACAO_MENU_ESQUERDO = 0;
        }
    },
    mostraBotaoMenu: function () {
        $("#icone-menu").css("display", "initial");
        $("#icone-voltar").css("display", "none");
        $(document).unbind("backbutton");
    }
};