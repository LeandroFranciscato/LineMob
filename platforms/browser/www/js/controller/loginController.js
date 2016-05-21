/* global logUtil, Mustache, loginModel, contaController, alertUtil */

var loginController = {
    TEMPLATE_LOGIN: "",
    OBJECT_TO_BIND: "[data-content=content]",
    loadTemplateLogin: function (cb) {
        loginModel.getAll(function (res) {
            if (res) {
                alert("Bem Vindo " + res.usuario);
                contaController.loadTemplateContaCadastro();
            } else {
                loginController.renderTemplateLogin(function () {
                    if (cb) {
                        cb();
                    }
                });
            }
        });
    },
    renderTemplateLogin: function (cb) {
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
        if (usuario.senha !== "L") {
            alertUtil.confirm("Usuário e Senha incorretos.");
            return;
        }

        if ($('#checkBoxLembrar').prop('checked') === true) {
            loginModel.insert(usuario);
        }
        alert("Bem vindo " + usuario.usuario);
        contaController.loadTemplateContaCadastro();
    }
};
