/* global logUtil, Mustache, contaController, alertUtil, mainController, daoUtil */

var loginController = {
    TEMPLATE_LOGIN: "",
    OBJECT_TO_BIND: "#dialog",
    load: function (cb) {
        var usuario = new Usuario();
        daoUtil.getAll(usuario, "id", function (res) {
            if (res && res.length > 0) {
                mainController.render();
            } else {
                loginController.render();
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
        var dadosForm = $('[data-id=formLogin]').serializeObject();

        var usuario = new Usuario();
        usuario.usuario = dadosForm.usuario;
        usuario.senha = dadosForm.senha;

        if (!usuario.usuario) {
            alertUtil.confirm("Informe o Usuário!");
            return;
        }

        if (!usuario.senha) {
            alertUtil.confirm("Informe a Senha!");
            return;
        }

        //Aqui teremos no futuro uma validação com o WS
        if (usuario.senha !== "L") {
            alertUtil.confirm("Usuário e Senha incorretos.");
            return;
        }

        if ($('#checkBoxLembrar').prop('checked') === true) {
            daoUtil.insert(usuario);
        }
        alertUtil.confirm("Bem vindo " + usuario.usuario);
        mainController.render();
    }
};
