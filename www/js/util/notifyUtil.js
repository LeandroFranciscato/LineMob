var notifyUtil = {
    notify: function (titulo, mensagem, data, cbActionClick) {
        var idNotification = Math.random();
        cordova.plugins.notification.local.schedule({
            id: idNotification,
            title: titulo,
            text: mensagem,
            icon: "/platforms/android/res/drawable-mdpi/icon.png",
            at: data
        });
        cordova.plugins.notification.local.on("click", function (notification) {
            if (notification.id == idNotification) {
                if (cbActionClick) {
                    cbActionClick();
                }
            }
        });
    }
};