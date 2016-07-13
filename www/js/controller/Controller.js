/* global daoUtil, mainController, Mustache, iconUtil, myScroll, alertUtil */
var Controller = {
    SCROLLER: "#scroller",
    options: "",
    loadList: function (options, cb) {

        this.options = {
            controllerOrigin: Controller,
            entity: new Entity(),
            inicial: 0,
            final: 10,
            orderBy: undefined,
            template: "",
            navLeft: {},
            navCenter: {},
            floatButton: {},
            paginator: true
        };
        this.setOptions(this.options, options);
        daoUtil.getByRange(this.options.entity,
                this.options.orderBy,
                this.options.inicial,
                this.options.final,
                function (results) {
                    var data = {};
                    data[Controller.options.entity.tableName] = results;
                    Controller.render(Controller.options, data, function () {
                        if (cb) {
                            cb();
                        }
                    });
                });
    },
    loadSearchedList: function (options, searchText, cb) {
        this.options = {
            controllerOrigin: Controller,
            entity: new Entity(),
            inicial: 0,
            final: 10,
            orderBy: undefined,
            template: "",
            navCenter: {},
            navLeft: {},
            floatButton: {},
            paginator: false
        };
        this.setOptions(this.options, options);
        daoUtil.getByLIke(this.options.entity, searchText, this.options.orderBy, function (res) {
            var data = {};
            data[Controller.options.entity.tableName] = res;
            Controller.render(Controller.options, data, function () {
                if (cb) {
                    cb();
                }
            });
        });
    },
    loadNewOrSingleEdit: function (options, data, cb) {
        this.options = {
            controllerOrigin: Controller,
            entity: new Entity(),
            template: "",
            navLeft: {},
            navCenter: {},
            navRight: {
                display: "block",
                iconName: iconUtil.check,
                callbackClick: function () {
                    Controller.insert();
                }
            },
            navSearch: {
                display: "none"
            },
            floatButton: {
                display: "none"
            },
            inputToFocus: ""
        };
        this.setOptions(this.options, options);

        if (data) {
            this.options.navCenter.icon = iconUtil.edit;
        }

        this.render(this.options, data, function () {
            if (cb) {
                cb();
            }
        });
    },
    loadMultipleEdit: function (options, data, cb) {
        this.options = {
            controllerOrigin: Controller,
            entity: new Entity(),
            template: "",
            navLeft: {},
            navCenter: {},
            navRight: {
                display: "block",
                iconName: iconUtil.check,
                callbackClick: function () {
                    Controller.updateMultiplaEscolha();
                }
            },
            navSearch: {
                display: "none"
            },
            floatButton: {
                display: "none"
            },
            inputToFocus: "#valor-campo"
        };
        this.setOptions(this.options, options);
        this.render(this.options, data, function () {
            if (cb) {
                cb();
            }
        });
    },
    preLoadEdit: function (cb) {
        var itens = tableToJSON("#ul-list", "li", "div");
        var entity = this.options.entity;
        var qtdeSelecionados = 0;

        for (var i = 0; i <= itens.length; i++) {
            if (itens[i] && itens[i].selecionado == 1) {
                qtdeSelecionados++;

                if (!entity.id || entity.id == undefined) {
                    entity.id = itens[i].id + "-";
                } else {
                    entity.id += itens[i].id + "-";
                }
            }
        }

        if (qtdeSelecionados === 0) {
            alertUtil.confirm("Selecione ao menos um (1) registro para editar.", " Editando...");
            return;
        }

        if (qtdeSelecionados === 1) {
            entity.id = entity.id.replace("-", "");
            daoUtil.getById(entity, function (res) {
                Controller.options.controllerOrigin.loadNewOrSingleEdit(res);
            });
        } else if (qtdeSelecionados > 1) {
            this.options.controllerOrigin.loadMultipleEdit(entity);
        }
    },
    render: function (options, data, cb) {
        this.options = {
            controllerOrigin: Controller,
            entity: new Entity(),
            inicial: 0,
            final: 10,
            orderBy: undefined,
            template: "",
            objectToBind: this.SCROLLER,
            navLeft: {
                icon: iconUtil.menu,
                callbackClick: function () {}
            },
            navCenter: {
                title: "LINEMOB",
                icon: ""
            },
            navRight: {
                display: "none",
                iconName: "",
                callbackClick: function () {}
            },
            navSearch: {
                display: "block"
            },
            floatButton: {
                display: "none",
                callbackAdd: function () {}
            },
            paginator: false,
            inputToFocus: ""
        };
        this.setOptions(this.options, options);

        /*front-end controllers*/
        this.renderHtml(data, this.options.template, this.options.objectToBind);
        this.setMaterializeJs();
        this.setFocus();
        loadScroll();
        this.hideLeftMenu();
        this.setRightIcon();
        this.setFloatButton();
        this.setTapHoldAction();
        this.setCenterNav();
        this.setLeftNav();
        var currentOptions = Controller.options;
        this.setSearchNav(currentOptions);
        this.setPaginator(data, currentOptions);

        if (cb) {
            cb();
        }
    },
    renderHtml: function (data, template, objectToBind) {
        Mustache.parse(template);
        data = (data) ? data : {};
        var htmlParsed = Mustache.render(template, data);
        $(objectToBind).html(htmlParsed);
    },
    setMaterializeJs: function () {
        $('select').material_select();
    },
    setFocus: function () {
        $(this.options.inputToFocus).focus();
    },
    hideLeftMenu: function () {
        if (mainController.SITUACAO_MENU_ESQUERDO === 1) {
            mainController.menuEsquerdo();
        }
    },
    setRightIcon: function () {
        $("#icon-right-nav").css("display", this.options.navRight.display);
        if (this.options.navRight.display === "block") {
            $("#text-icon-right-nav").html(this.options.navRight.iconName);
            $("#icon-right-nav").unbind("click");
            $("#icon-right-nav").on("click", function () {
                Controller.options.navRight.callbackClick();
            });
        }
    },
    setFloatButton: function () {
        $("#btn-float").css("display", this.options.floatButton.display);
        if (this.options.floatButton.display !== "none") {
            $("#btn-float-add").unbind("click");
            $("#btn-float-edit").unbind("click");
            $("#btn-float-remove").unbind("click");
            $("#btn-float-add").on("click", function () {
                closeFABMenu($("#btn-float"));
                Controller.closeSearchField();
                Controller.options.floatButton.callbackAdd();
            });
            $("#btn-float-edit").on("click", function () {
                closeFABMenu($("#btn-float"));
                Controller.closeSearchField();
                Controller.preLoadEdit();
            });
            $("#btn-float-remove").on("click", function () {
                closeFABMenu($("#btn-float"));
                Controller.closeSearchField();
                Controller.delete();
            });
        }
    },
    setTapHoldAction: function () {
        $(".li-lista").unbind("taphold");
        $(".li-lista").on("taphold", {duration: 400}, function () {
            // Uncheck all
            $('#check-all').prop("checked", true);
            Controller.checkInList();

            //close searchbar
            Controller.closeSearchField();

            // check item
            var fields = $(this).find("div");
            for (var i = 0; i < fields.length; i++) {
                if ($(fields[i]).attr("name") === "id") {
                    var id = $(fields[i]).html();
                }
            }
            Controller.checkInList(id);

            //open edit Template
            Controller.preLoadEdit();
        });
    },
    setCenterNav: function () {
        $(".titulo-center-nav").html(this.options.navCenter.title);
        $("#icon-aux-titulo-center-nav").html(this.options.navCenter.icon);
    },
    setLeftNav: function () {
        $("#icon-left-nav").unbind("click");
        $(document).unbind("backbutton");
        $("#icon-left-nav").on("click", function () {
            Controller.options.navLeft.callbackClick();
        });
        $(document).on("backbutton", function () {
            if ($(".search-field").css("display") === "block") {
                Controller.closeSearchField();
            } else {
                if (Controller.options.navLeft.callbackClick) {
                    Controller.options.navLeft.callbackClick();
                }
            }
        });
        $("#text-icon-left-nav").html(this.options.navLeft.icon);
    },
    setSearchNav: function (currentOptions) {
        $("#text-icon-search-nav").css("display", this.options.navSearch.display);
        if (this.options.navSearch.display === "block") {
            $("#text-icon-search-nav").html(iconUtil.search);
            $("#icon-back-search-field").unbind("click");
            $("#icon-clean-search-field").unbind("click");
            $("#input-search").unbind("keyup");
            $("#icon-back-search-field").on("click", function () {
                Controller.closeSearchField();
                Controller.options.controllerOrigin.loadList();
            });
            $("#icon-clean-search-field").on("click", function () {
                Controller.cleanSearchField();
                Controller.options.controllerOrigin.loadList();
            });
            $("#input-search").on("keyup", function () {
                var textField = $("#input-search").val();
                if (textField) {
                    currentOptions.paginator = false;
                    Controller.loadSearchedList(currentOptions, textField);
                } else {
                    Controller.options.controllerOrigin.loadList();
                }
            });
        }
    },
    setPaginator: function (data, currentOptions) {
        if (this.options.paginator) {
            var dataArray = data[this.options.entity.tableName];
            if (dataArray && dataArray.length) {
                var entity = dataArray[0];
                daoUtil.getCount(entity, function (qtde) {
                    if (qtde > dataArray.length) {
                        $("#nav-pre-footer").css("display", "block");
                        $("#footer").css("display", "block");
                        $("#text-footer").html("Carregar mais " + (qtde - dataArray.length) + "...");
                        $("#footer").unbind("click");
                        $("#footer").on("click", function () {
                            currentOptions.inicial = 0;
                            currentOptions.final = dataArray.length + 10;
                            Controller.loadList(currentOptions, function () {
                                myScroll.scrollTo(0, myScroll.maxScrollY, 0);
                            });
                        });
                    } else {
                        $("#nav-pre-footer").css("display", "none");
                        loadScroll();
                        myScroll.scrollTo(0, myScroll.maxScrollY, 0);
                    }
                });
            } else {
                $("#nav-pre-footer").css("display", "none");
                loadScroll();
                myScroll.scrollTo(0, myScroll.maxScrollY, 0);
            }
        }
    },
    openSearchField: function () {
        $(".search-field").css("display", "block");
        $("#input-search").focus();
        $("#input-search").trigger("keyup");
    },
    closeSearchField: function () {
        $(".search-field").css("display", "none");
        $("#input-search").val("");
    },
    cleanSearchField: function () {
        $("#input-search").val("");
        $("#input-search").focus();
    },
    setOptions: function (defaultOptions, newOptions) {
        for (var i in defaultOptions) {
            if (newOptions[i] != undefined) {
                defaultOptions[i] = newOptions[i];
            }
        }
    },
    insert: function (sucessMessage, errorMessage) {
        sucessMessage = (!sucessMessage) ? "Alterado com sucesso!" : sucessMessage;
        errorMessage = (!errorMessage) ? "Problemas ao alterar ..." : errorMessage;

        var data = $("#form-cadastro").serializeObject();
        var entity = new Entity();
        entity.tableName = this.options.entity.tableName;
        Object.setPrototypeOf(data, entity);

        if (data.id) {
            this.options.controllerOrigin.validaFormulario(data, function () {
                daoUtil.update(data, function (rowsAffected) {
                    if (rowsAffected === 1) {
                        alertUtil.confirm(sucessMessage);
                        Controller.options.controllerOrigin.loadList();
                    } else {
                        alertUtil.confirm(errorMessage);
                    }
                });
            });
        } else {
            this.options.controllerOrigin.validaFormulario(data, function () {
                daoUtil.insert(data, function (rowsAffected) {
                    if (rowsAffected === 1) {
                        alertUtil.confirm(sucessMessage);
                        Controller.options.controllerOrigin.loadList();
                    } else {
                        alertUtil.confirm(errorMessage);
                    }
                });
            });
        }
    },
    delete: function () {
        var itens = tableToJSON("#ul-list", "li", "div");
        var qtSelecionadas = 0;
        for (var i = 0; i <= itens.length; i++) {
            if (itens[i] && itens[i].selecionado == 1) {
                qtSelecionadas += 1;
            }
        }

        if (qtSelecionadas === 0) {
            alertUtil.confirm("Selecione algum registro para deletar!");
            return;
        }

        var buttons = ["Não", "Sim"];
        alertUtil.confirm("Deseja realmente deletar " + qtSelecionadas + " registro(s)?", "Deletando...", buttons, function (btn) {

            if (btn == 2) {
                for (var i = 0; i <= itens.length; i++) {

                    if (itens[i] && itens[i].selecionado == 1) {
                        var item = Controller.options.entity;
                        item.id = itens[i].id;
                        daoUtil.delete(item, function (res) {
                            if (res != 1) {
                                alertUtil.confirm("Erro ao deletar ", item.id);
                            }
                        });
                    }
                }
                alertUtil.confirm("Deletado com Sucesso!");
                Controller.options.controllerOrigin.loadList();
            }
        });
    },
    updateMultiplaEscolha: function () {
        var ids = $("#id").val();
        ids = ids.split("-");

        var campo = $("#valor-campo").prop("name");
        var valorCampo = $("#valor-campo").val();

        if (!valorCampo) {
            alertUtil.confirm("Campo deve ser preenchido.");
            return;
        }

        for (var i = 0; i < ids.length; i++) {
            if (ids[i]) {

                var entity = new Entity();
                entity.tableName = this.options.entity.tableName;
                entity.id = ids[i];
                entity[campo] = valorCampo;

                daoUtil.updateDinamicColumn(entity, campo, function (rowsAffected) {
                    if (rowsAffected != 1) {
                        alertUtil.confirm("Erro ao atualizar, id: " + entity.id);
                    }
                });
            }
        }
        alertUtil.confirm("Atualizado com sucesso!");
        this.options.controllerOrigin.loadList();
    },
    checkInList: function (id) {

        if (!id) {
            var itens = tableToJSON("#ul-list", "li", "div");

            var checkedAll = $('#check-all').prop("checked");
            if (checkedAll && checkedAll === true) {
                $('#check-all').prop("checked", false);
            } else {
                $('#check-all').prop("checked", true);
            }

            for (var i = 0; i <= itens.length; i++) {
                if (itens[i]) {
                    $('#check-' + itens[i].id).prop("checked", checkedAll);
                    this.checkInList(itens[i].id);
                }
            }
        }

        var checked = $('#check-' + id).prop("checked");
        if (checked && checked === true) {
            $('#check-' + id).prop("checked", false);
            checked = 0;
        } else {
            $('#check-' + id).prop("checked", true);
            checked = 1;
        }
        $('#selecionado-' + id).html(checked);
    }
};