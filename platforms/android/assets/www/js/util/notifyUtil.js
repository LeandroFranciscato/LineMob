/* global cordova, i18next */

var notifyUtil = {
    notificationsArray: [],
    notify: function (titulo, mensagem, data, cbActionClick) {
        var idNotification = this.getIdNotify();
        cordova.plugins.notification.local.schedule({
            id: idNotification,
            title: titulo,
            text: mensagem,
            icon: "/platforms/android/res/drawable-mdpi/icon.png",
            at: data,
            color: "e53935"
        });
        cordova.plugins.notification.local.on("click", function (notification) {
            if (notification.id == idNotification) {
                if (cbActionClick) {
                    cbActionClick();
                }
            }
        });
    },
    addScheduleNotification: function (titulo, mensagem, data, cbActionClick) {
        var idNotification = this.getIdNotify();
        notifyUtil.notificationsArray.push({
            id: idNotification,
            title: titulo,
            text: mensagem,
            icon: "/platforms/android/res/drawable-mdpi/icon.png",
            at: data,
            color: "e53935"
        });
        cordova.plugins.notification.local.on("click", function (notification) {
            if (notification.id == idNotification) {
                if (cbActionClick) {
                    cbActionClick();
                }
            }
        });
    },
    bulkNotify: function () {
        cordova.plugins.notification.local.schedule(notifyUtil.notificationsArray);
        notifyUtil.notificationsArray = [];
    },
    getIdNotify: function () {
        var id = window.localStorage.getItem("idNotify");
        if (id) {
            id++;
        } else {
            id = 1;
        }
        window.localStorage.setItem("idNotify", id);
        return id;
    },
    getTitleNew: function (entity, acao) {
        if (entity.tableName === "pessoa") {
            return i18next.t("pessoa-controller.title-" + acao);
        } else if (entity.tableName === "categoria") {
            return i18next.t("categoria-controller.title-" + acao);
        } else if (entity.tableName === "cartao") {
            return i18next.t("cartao-controller.title-" + acao);
        } else if (entity.tableName === "conta") {
            return i18next.t("conta-controller.title-" + acao);
        } else if (entity.tableName === "movimento") {
            return i18next.t("movimento-controller.title-" + acao);
        }
    },
    getMessageNew: function (entity) {
        if (entity.tableName === "pessoa") {
            return entity.nome + " / " + entity.apelido;
        } else if (entity.tableName === "categoria") {
            return (entity.nomeSubCategoria) ? entity.nome + " / " + entity.nomeSubCategoria : entity.nome;
        } else if (entity.tableName === "cartao") {
            return entity.nome;
        } else if (entity.tableName === "conta") {
            return entity.nome;
        } else if (entity.tableName === "movimento") {
            return i18next.t("generics.currency-symbol") + " " + entity.valor + " : " + entity.descricao;
        }
    }
};