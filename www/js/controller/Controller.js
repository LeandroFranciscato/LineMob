/* global daoUtil, mainController, Mustache, iconUtil, myScroll */
var Controller = {
    SCROLLER: "#scroller",
    options: "",
    loadList: function (options, cb) {

        this.options = {
            entity: new Entity(),
            inicial: 0,
            final: 10,
            orderBy: undefined,
            template: "",
            floatButton: {},
            navCenter: {},
            navLeft: {},
            paginator: "1"
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
            entity: new Entity(),
            inicial: 0,
            final: 10,
            orderBy: undefined,
            template: "",
            floatButton: {},
            navCenter: {},
            navLeft: {},
            paginator: "0"
        };
        this.setOptions(this.options, options);

        daoUtil.getByLIke(this.options.entity, searchText, this.options.orderBy, function (res) {
            var data = {};
            data.conta = res;
            Controller.render(Controller.options, data, function () {
                if (cb) {
                    cb();
                }
            });
        });
    },
    render: function (options, data, cb) {
        this.options = {
            entity: new Entity(),
            inicial: 0,
            final: 10,
            orderBy: undefined,
            template: "",
            objectToBind: this.SCROLLER,
            rightNavIcon: {
                iconName: ""
            },
            floatButton: {
                display: "none",
                callbackAdd: function () {},
                callbackEdit: function () {},
                callbackRemove: function () {}
            },
            navCenter: {
                title: "LINEMOB",
                icon: ""
            },
            navLeft: {
                icon: iconUtil.menu,
                callbackClick: function () {}
            },
            paginator: "1"
        };
        this.setOptions(this.options, options);

        /*front-end controllers*/
        this.renderHtml(data, this.options.template, this.options.objectToBind);
        loadScroll();
        this.hideLeftMenu();
        this.setRightIcon();
        this.setFloatButton();
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
    hideLeftMenu: function () {
        if (mainController.SITUACAO_MENU_ESQUERDO === 1) {
            mainController.menuEsquerdo();
        }
    },
    setRightIcon: function () {
        $("#text-icon-right-nav").html(this.options.rightNavIcon.iconName);
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
                Controller.options.floatButton.callbackEdit();

            });
            $("#btn-float-remove").on("click", function () {
                closeFABMenu($("#btn-float"));
                Controller.closeSearchField();
                Controller.options.floatButton.callbackRemove();
            });
        }
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
                Controller.options.navLeft.callbackClick();
            }
        });
        $("#text-icon-left-nav").html(this.options.navLeft.icon);
    },
    setSearchNav: function (currentOptions) {
        $("#text-icon-search-nav").html(iconUtil.search);

        $("#icon-back-search-field").unbind("click");
        $("#icon-clean-search-field").unbind("click");
        $("#input-search").unbind("keyup");

        $("#icon-back-search-field").on("click", function () {
            Controller.closeSearchField();
            currentOptions.paginator = "1";
            currentOptions.inicial = undefined;
            currentOptions.final = undefined;
            Controller.loadList(currentOptions);
        });

        $("#icon-clean-search-field").on("click", function () {
            Controller.cleanSearchField();
            currentOptions.paginator = "1";
            currentOptions.inicial = undefined;
            currentOptions.final = undefined;
            Controller.loadList(currentOptions);
        });

        $("#input-search").on("keyup", function () {
            var textField = $("#input-search").val();
            if (textField) {
                currentOptions.paginator = "0";
                Controller.loadSearchedList(currentOptions, textField);
            } else {
                currentOptions.paginator = "1";
                currentOptions.inicial = undefined;
                currentOptions.final = undefined;
                Controller.loadList(currentOptions);
            }
        });
    },
    setPaginator: function (data, currentOptions) {
        if (this.options.paginator === "1") {
            var dataArray = data[this.options.entity.tableName];
            if (dataArray.length) {
                var entity = dataArray[0];
                daoUtil.getCount(entity, function (qtde) {
                    if (qtde > dataArray.length) {
                        $("#footer").css("display", "block");
                        $("#text-footer").html("Carregar mais " + (qtde - data.conta.length) + "...");
                        $("#footer").unbind("click");
                        $("#footer").on("click", function () {
                            currentOptions.inicial = 0;
                            currentOptions.final = dataArray.length + 10;
                            Controller.loadList(currentOptions, function () {
                                myScroll.scrollTo(0, myScroll.maxScrollY, 0);
                            });
                        });
                    }
                });
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
            if (newOptions[i]) {
                defaultOptions[i] = newOptions[i];
            }
        }
    }
};