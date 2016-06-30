/* global logUtil, Mustache, contaController, alertUtil, mainController, daoUtil, Materialize, database_helper */

var loginController = {
    TEMPLATE_LOGIN: "",
    OBJECT_TO_BIND: "#scroller",
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
        $("#wrapper").css("top", "0px");
        this.bindEvents();
        loaded();
        if (cb) {
            cb();
        }
    },
    bindEvents: function () {
        $('[data-id=btnLogin]').click(loginController.getLogin);
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
    },
    logout: function () {
        alertUtil.confirm(
                "Esta ação fará com que todos os dados locais sejam perdidos, deseja mesmo continuar?",
                "Saindo...",
                ["Não", "Sim"],
                function (btnEscolhido) {
                    if (btnEscolhido == 2){
                        dbUtil.dropDatabase(function () {
                            window.localStorage.removeItem("dataBaseCreated");
                            navigator.app.exitApp();
                        });
                    }
                }
        );
    }
};
