/* global logUtil, Mustache, loginModel, contaController, alertUtil, mainController */

var loginController = {
    TEMPLATE_LOGIN: "",
    OBJECT_TO_BIND: "[data-content=content]",
    load: function (cb) {
        loginModel.getAll(function (res) {
            if (res) {
                alertUtil.confirm("Bem Vindo " + res.usuario);
                mainController.render();
            } else {
                loginController.render(function () {
                    if (cb) {
                        cb();
                    }
                });
            }
        });
    },
    render: function (cb) {
        var html = Mustache.render(this.TEMPLATE_LOGIN);
        $(this.OBJECT_TO_BIND).html(html);
        this.bindEvents();
        if (cb) {
            cb();
        }
    },
    bindEvents: function () {
        $('[data-id=btnLogin]').click(loginController.getLogin);        
        
        $(".glyphicon-eye-open").click(function () {
            $("#inputPassword").attr('type', 'text');            
            $(".glyphicon-eye-open").hide();
            $(".glyphicon-eye-close").show();
        });

        $(".glyphicon-eye-close").click(function () {
            $("#inputPassword").attr('type', 'password');
            $(".glyphicon-eye-open").show();
            $(".glyphicon-eye-close").hide();
        });
    },
    getLogin: function () {
        var usuario = $('[data-id=formLogin]').serializeObject();
        
        if (!usuario.usuario){
            alertUtil.confirm("Informe o Usuário!");
            return;
        }
        
        if (!usuario.senha){
            alertUtil.confirm("Informe a Senha!");
            return;
        }
        
        //Aqui teremos no futuro uma validação com o WS
        if (usuario.senha !== "L") {
            alertUtil.confirm("Usuário e Senha incorretos.");
            return;
        }

        if ($('#checkBoxLembrar').prop('checked') === true) {
            loginModel.insert(usuario);
        }
        alertUtil.confirm("Bem vindo " + usuario.usuario);
        mainController.render();
    }
};
