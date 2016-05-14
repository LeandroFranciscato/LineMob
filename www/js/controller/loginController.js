var loginController = {
	TEMPLATE_LOGIN : "",
	OBJECT_TO_BIND : "[data-content=content]",

	loadTemplateLogin : function(cb) {
		data = "";
		//implementar
		this.renderTemplateLogin(data, function() {
			if (cb) {
				cb();
			}
		});
	},

	renderTemplateLogin : function(data, cb) {
		data = (data) ? data : {};
		var html = Mustache.render(this.TEMPLATE_LOGIN, data);
		$(this.OBJECT_TO_BIND).html(html);
		this.bindEvents();
		if (cb) {
			cb();
		}
	},

	bindEvents : function() {
		$('[data-id=btnLogin]').click(loginController.getLogin);

		$("#inputPassword").on("keyup", function() {
			if ($(this).val())
				$(".glyphicon-eye-open").show();
			else
				$(".glyphicon-eye-open").hide();
		});

		$(".glyphicon-eye-open").click(function() {
			if ($("#inputPassword").attr('type') == 'text') {
				$("#inputPassword").attr('type', 'password');
			} else {
				$("#inputPassword").attr('type', 'text');
			}

		});
	},

	getLogin : function() {
		logUtil.log("Entrou getLogin");
	}
};
