/* global Mustache, contaController */

var mainController = {
    TEMPLATE_MAIN: "",
    OBJECT_TO_BIND: "#scroller",
    SITUACAO_MENU_ESQUERDO: 0,
    render: function (cb) {
        $("#wrapper").css("top", "56px");
        $("#header").css("display", "block");
        $("#menu-esquerdo").css("display", "block");

        Mustache.parse(this.TEMPLATE_MAIN);
        var html = Mustache.render(this.TEMPLATE_MAIN);
        $(this.OBJECT_TO_BIND).html(html);

        loadScroll();
        loadScrollLeftMenu();
        this.bindEvents();
        if (this.SITUACAO_MENU_ESQUERDO === 1) {
            this.menuEsquerdo();
        }

        $("#icon-right-nav").removeClass("active");
        $("#icon-right-nav").attr("data-activates", "dropdown-inicio");
        $("#text-icon-right-nav").html("&#xE5D4;");
        $("#text-icon-right-nav").unbind("click");
        $(".dropdown-button").dropdown({
            belowOrigin: true
        });
        $("#btn-float").css("display", "none");

        $("#titulo-center-nav").html(i18next.t("app.name"));
        $("#icon-aux-titulo-center-nav").html("");

        $("#icon-left-nav").unbind();
        $(document).unbind("backbutton");
        $("#icon-left-nav").on("click", function () {
            mainController.menuEsquerdo();
        });
        $("#text-icon-left-nav").html("&#xE5D2;");
        $("#text-icon-search-nav").html("");

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
