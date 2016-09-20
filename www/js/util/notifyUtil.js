/* global cordova */

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
    }
};