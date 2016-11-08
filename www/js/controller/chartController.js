/* global Controller, chartController, iconUtil, mainController, i18next, alertUtil, reportsController, networkUtil, importUtil, google, daoUtil, loadController */
var chartController = {
    TEMPLATE_CHOOSE_CHART: "",
    TEMPLATE_PIE_CATEGORY: "",
    TEMPLATE_PIE_CATEGORY_FILTER: "",
    TEMPLATE_LINE_CATEGORY: "",
    TEMPLATE_LINE_CATEGORY_FILTER: "",
    load: function () {
        Controller.render({
            controllerOrigin: chartController,
            template: chartController.TEMPLATE_CHOOSE_CHART,
            navLeft: {
                icon: iconUtil.back,
                callbackClick: function () {
                    mainController.render();
                }
            },
            navCenter: {
                title: i18next.t("chart-controller.plural"),
                icon: ""
            },
            navSearch: {
                display: "none"
            }
        }, {}, function () {

        });
    },
    loadFilterPieCategory: function () {
        Controller.render({
            controllerOrigin: chartController,
            template: chartController.TEMPLATE_PIE_CATEGORY_FILTER,
            navLeft: {
                icon: iconUtil.back,
                callbackClick: function () {
                    chartController.load();
                }
            },
            navCenter: {
                title: i18next.t("chart-controller.pie-category-filter"),
                icon: ""
            },
            navRight: {
                display: "block",
                iconName: iconUtil.print,
                callbackClick: function () {
                    var dataInicio = $("#dataInicio").val();
                    var dataFinal = $("#dataFinal").val();
                    if (!dataInicio || !dataFinal) {
                        alertUtil.confirm(i18next.t("generics.date-range-required"));
                        return;
                    }
                    chartController.loadPieCategory(dataInicio, dataFinal);
                }
            },
            navSearch: {
                display: "none"
            }
        }, {}, function () {
            reportsController.setDefaultNextMonthlyDates();
        });
    },
    loadPieCategory: function (dataInicio, dataFinal) {
        if (!networkUtil.isOnline()) {
            alertUtil.confirm(i18next.t("generics.must-be-online"));
            return;
        }
        loadController.show();
        importUtil.get("google", "https://www.gstatic.com/charts/loader.js", function () {
            Controller.render({
                controllerOrigin: chartController,
                template: chartController.TEMPLATE_PIE_CATEGORY,
                navLeft: {
                    icon: iconUtil.back,
                    callbackClick: function () {
                        chartController.loadFilterPieCategory();
                    }
                },
                navCenter: {
                    title: i18next.t("chart-controller.pie-category"),
                    icon: ""
                },
                navSearch: {
                    display: "none"
                }
            }, {}, function () {
                google.charts.load('current', {'packages': ['corechart']});
                google.charts.setOnLoadCallback(drawChart);
                function drawChart() {
                    daoUtil.getCustom(
                            "select nome, " +
                            "       id ," +
                            "       (select abs(ifnull(sum(case natureza when 'C' then cast(valor as decimal) else cast(valor*-1 as decimal) end),0)) saldo_inicial " +
                            "          from movimento" +
                            "         where movimento.idCategoria = categoria.id" +
                            "           and ifnull(movimento.isTransferencia,'0') <> '1' " +
                            "           and movimento.natureza = 'D' " +
                            "           and movimento.dataVencimento >= '" + dataInicio + "'" +
                            "           and movimento.dataVencimento <= '" + dataFinal + "') saldoLancamentos" +
                            "  from categoria " +
                            " order by nome ", function (categoriasRes) {

                                var categoriasArray = [];
                                categoriasArray.push([i18next.t("categoria-controller.singular"), i18next.t("movimento-controller.field-valor")]);
                                categoriasRes.forEach(function (categoria) {
                                    categoriasArray.push([categoria.nome, categoria.saldoLancamentos]);
                                });

                                var data = google.visualization.arrayToDataTable(categoriasArray);
                                var options = {
                                    title: i18next.t("categoria-controller.pie-chart"),
                                    titleTextStyle: {fontSize: 17},
                                    legend: {position: 'top', textStyle: {fontSize: 17}},
                                    chartArea: {left: 10, right: 10}
                                };
                                var chart = new google.visualization.PieChart(document.getElementById('piechart'));
                                chart.draw(data, options);
                                Controller.initializePlugins();
                                loadController.hide();
                            });
                }
            });
        });
    },
    loadFilterLineExpenses: function () {        
        Controller.render({
            controllerOrigin: chartController,
            template: chartController.TEMPLATE_LINE_CATEGORY_FILTER,
            navLeft: {
                icon: iconUtil.back,
                callbackClick: function () {
                    chartController.load();
                }
            },
            navCenter: {
                title: i18next.t("chart-controller.line-expenses-filter"),
                icon: ""
            },
            navRight: {
                display: "block",
                iconName: iconUtil.print,
                callbackClick: function () {
                    var dataInicio = $("#dataInicio").val();
                    var dataFinal = $("#dataFinal").val();
                    if (!dataInicio || !dataFinal) {
                        alertUtil.confirm(i18next.t("generics.date-range-required"));
                        return;
                    }
                    chartController.loadLineExpenses(dataInicio, dataFinal);
                }
            },
            navSearch: {
                display: "none"
            }
        }, {}, function () {
            reportsController.setDefaultMonthlyDates();
        });
    },
    loadLineExpenses: function (dataInicio, dataFinal) {
        if (!networkUtil.isOnline()) {
            alertUtil.confirm(i18next.t("generics.must-be-online"));
            return;
        }
        loadController.show();
        importUtil.get("google", "https://www.gstatic.com/charts/loader.js", function () {
            window.screen.lockOrientation("landscape");
            Controller.render({
                controllerOrigin: chartController,
                template: chartController.TEMPLATE_LINE_CATEGORY,
                navLeft: {
                    icon: iconUtil.back,
                    callbackClick: function () {
                        window.screen.lockOrientation("portrait");
                        chartController.loadFilterLineExpenses();
                    }
                },
                navCenter: {
                    title: i18next.t("chart-controller.line-expenses"),
                    icon: ""
                },
                navSearch: {
                    display: "none"
                }
            }, {}, function () {

                google.charts.load('current', {'packages': ['corechart', 'line']});
                google.charts.setOnLoadCallback(drawChart);
                function drawChart() {

                    daoUtil.getCustom(
                            " select abs(ifnull(sum(case natureza when 'C' then cast(valor as decimal) else cast(valor*-1 as decimal) end),0)) valor, " +
                            "        dataLancamento " +
                            "   from movimento" +
                            "  where natureza = 'D' " +
                            "    and ifnull(isTransferencia,'0') <> '1' " +
                            "    and dataLancamento >= '" + dataInicio + "'" +
                            "    and dataLancamento <= '" + dataFinal + "' " +
                            "  group by dataLancamento", function (movimentoRes) {

                                var movimentosArray = [];
                                movimentoRes.forEach(function (movimento) {
                                    movimentosArray.push([new Date(movimento.dataLancamento), movimento.valor]);
                                });

                                var data = new google.visualization.DataTable();
                                data.addColumn('date', 'X');
                                data.addColumn('number', i18next.t("generics.expenses"));
                                data.addRows(movimentosArray);

                                var options = {
                                    hAxis: {
                                        title: i18next.t("generics.period")
                                    },
                                    vAxis: {
                                        title: i18next.t("movimento-controller.field-valor")
                                    },
                                    title: i18next.t("chart-controller.line-expenses")
                                };
                                var chart = new google.visualization.LineChart(document.getElementById('linechart'));
                                chart.draw(data, options);
                                Controller.initializePlugins();
                                loadController.hide();
                            });
                }
            });
        });

    }
};