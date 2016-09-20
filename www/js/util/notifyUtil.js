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
    getTitleNew: function (entity) {
        if (entity.tableName === "pessoa") {
            return i18next.t("pessoa-controller.title-new");
        } else if (entity.tableName === "categoria") {
            return i18next.t("categoria-controller.title-new");
        } else if (entity.tableName === "cartao") {
            return i18next.t("cartao-controller.title-new");
        } else if (entity.tableName === "conta") {
            return i18next.t("conta-controller.title-new");
        } else if (entity.tableName === "movimento") {
            return i18next.t("movimento-controller.title-new");
        }
    },
    getMessageNew: function (entity) {
        if (entity.tableName === "movimento") {
            return entity.descricao;
        } else {
            return entity.nome;
        }
    }
};