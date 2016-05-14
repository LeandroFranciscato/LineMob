/* global logUtil, Mustache, loginModel, contaController */

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

        $("#inputPassword").on("keyup", function () {
            if ($(this).val())
                $(".glyphicon-eye-open").show();
            else
                $(".glyphicon-eye-open").hide();
        });

        $(".glyphicon-eye-open").click(function () {
            if ($("#inputPassword").attr('type') === 'text') {
                $("#inputPassword").attr('type', 'password');
            } else {
                $("#inputPassword").attr('type', 'text');
            }
        });
    },
    getLogin: function () {
        var usuario = $('[data-id=formLogin]').serializeObject();
        if (usuario.senha !== "L") {
            alert("Usuário e Senha incorretos.");
            return;
        }

        if ($('#checkBoxLembrar').prop('checked') === true) {
            loginModel.insert(usuario);
        }
        alert("Bem vindo "+usuario.usuario);
        contaController.loadTemplateContaCadastro();
    }
};
