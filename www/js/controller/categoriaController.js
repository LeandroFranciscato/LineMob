/* global Mustache, logUtil, mainController, alertUtil, daoUtil, Controller, iconUtil, i18next */

var categoriaController = {
    TEMPLATE_CADASTRO: "",
    TEMPLATE_LISTA: "",
    TEMPLATE_EDICAO: "",
    loadList: function (cb) {
        var idNotification = Math.random();
        cordova.plugins.notification.local.schedule({
            id: idNotification,
            title: "Linemob!",
            text: "Ocorreu um erro, clique para mais informações",
            icon: "res://ic_popup_reminder"
        });
        cordova.plugins.notification.local.on("click", function (notification) {
            if (notification.id == idNotification) {
                alert("voltô danado?!!!!");
            }
        });
        Controller.loadList({
            controllerOrigin: this,
            entity: new Categoria(),
            orderBy: "nome",
            template: this.TEMPLATE_LISTA,
            navLeft: {
                icon: iconUtil.back,
                callbackClick: function () {
                    mainController.render();
                }
            },
            navCenter: {
                title: i18next.t("categoria-controller.plural"),
                icon: ""
            },
            floatButton: {
                display: "block",
                callbackAdd: function () {
                    categoriaController.loadNewOrSingleEdit();
                }
            }
        }, function () {
            if (cb) {
                cb();
            }
        });
    },
    loadNewOrSingleEdit: function (data, cb) {
        Controller.loadNewOrSingleEdit({
            controllerOrigin: categoriaController,
            entity: new Categoria(),
            template: this.TEMPLATE_CADASTRO,
            navLeft: {
                icon: iconUtil.back,
                callbackClick: function () {
                    categoriaController.loadList();
                }
            },
            navCenter: {
                title: i18next.t("categoria-controller.singular"),
                icon: (data) ? iconUtil.edit : iconUtil.add
            },
            inputToFocus: "#nome"
        }, data, function () {
            if (cb) {
                cb();
            }
        });
    },
    loadMultipleEdit: function (data, cb) {
        Controller.loadMultipleEdit({
            controllerOrigin: categoriaController,
            entity: new Categoria(),
            template: this.TEMPLATE_EDICAO,
            navLeft: {
                icon: iconUtil.back,
                callbackClick: function () {
                    categoriaController.loadList();
                }
            },
            navCenter: {
                title: i18next.t("categoria-controller.plural"),
                icon: iconUtil.edit
            }
        }, data, function () {
            if (cb) {
                cb();
            }
        });
    },
    selecionaCampoEdicaoMultipla: function () {
        var campo = $("#select-campo").val();

        if (campo === "nome") {
            $("#prompt-campo").html(i18next.t("categoria-controller.field-nome"));
            $("#valor-campo").prop("name", "nome");
            $("#valor-campo").prop("type", "text");
        } else if (campo === "nomeSubCategoria") {
            $("#prompt-campo").html(i18next.t("categoria-controller.field-nome-sub-categoria"));
            $("#valor-campo").prop("name", "nomeSubCategoria");
            $("#valor-campo").prop("type", "text");
        }
    },
    validaFormulario: function (categoria, cb, field) {
        if (!field) {
            if (!categoria.nome) {
                alertUtil.confirm(i18next.t("categoria-controller.alert-nome-req"));
            } else {
                if (cb) {
                    cb();
                }
            }
        } else {
            if (cb) {
                cb();
            }
        }
    },
    loadNewModal: function (element, callbackAction) {
        Controller.loadNewModal({
            controllerModal: categoriaController,
            entity: new Categoria(),
            element: element,
            templateCadastro: categoriaController.TEMPLATE_CADASTRO,
            tituloNavCenter: i18next.t("categoria-controller.singular"),
            columnToReRender: "nome",
            orderByReRender: "nome",
            callbackAction: function () {
                if (callbackAction) {
                    callbackAction();
                }
            },
            labelSelect: i18next.t("categoria-controller.field-select-categoria")
        });
    }
}; 