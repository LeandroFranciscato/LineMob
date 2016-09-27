/* global Mustache, contaController, Controller, iconUtil, i18next, sync, networkUtil, alertUtil, loadController */

var mainController = {
    TEMPLATE_MAIN: "",
    SITUACAO_MENU_ESQUERDO: 0,
    render: function (cb) {
        $("#wrapper").css("top", "56px");
        $("#header").css("display", "block");
        $("#menu-esquerdo").css("display", "block");

        Controller.render({
            controllerOrigin: this,
            entity: new Entity(),
            template: this.TEMPLATE_MAIN,
            navLeft: {
                icon: iconUtil.menu,
                callbackClick: function (element) {
                    if (element) {
                        navigator.app.exitApp();
                    } else {
                        mainController.menuEsquerdo();
                    }
                }
            },
            navCenter: {
                title: i18next.t("app.name"),
                icon: ""
            },
            navRight: {
                display: "block",
                iconName: iconUtil.refresh,
                callbackClick: function () {
                    if (!networkUtil.isOnline()) {
                        alertUtil.confirm(i18next.t("generics.must-be-online"));
                    } else {                                                
                        loadController.show();                        
                        setTimeout(function () {
                            window.localStorage.setItem("syncAll",1);
                            sync.run();
                        }, 2000);
                    }
                }
            },
            navSearch: {
                display: "none"
            }
        }, null, function () {
            loadScrollLeftMenu();
            mainController.bindEvents();
            if (cb) {
                cb();
            }
        });
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
                left: "300px"
            }, 150);
            $("#header").animate({
                left: "300px"
            }, 150);
            this.SITUACAO_MENU_ESQUERDO = 1;
        } else {
            $("#menu-esquerdo").animate({
                left: "-300px"
            }, 150);
            $("#wrapper").animate({
                left: "0px"
            }, 150);
            $("#header").animate({
                left: "0px"
            }, 150);
            this.SITUACAO_MENU_ESQUERDO = 0;
        }
    }
};
