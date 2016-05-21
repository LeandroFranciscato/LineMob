var alertUtil = {
    confirm: function (mensagem, titulo, buttons, cb) {
        
        if (!titulo){
            titulo = "Mensagem!";
        }
        
        if (!buttons){
            buttons = "OK";
        }
        navigator.notification.confirm(
                titulo,
                function (btnEscolhido) {
                    if (cb) {
                        cb();
                    }
                },
                mensagem,
                buttons);
    }
};