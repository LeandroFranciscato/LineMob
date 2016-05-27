var alertUtil = {
    confirm: function (mensagem, titulo, buttons, cb) {

        if (!titulo) {
            titulo = "";
        }

        if (!buttons) {
            buttons = [];
            buttons.push("OK");
        }
        navigator.notification.confirm(
                mensagem,
                function (btnEscolhido) {
                    if (cb) {
                        cb(btnEscolhido);
                    }
                },
                titulo,
                buttons);
    }
};