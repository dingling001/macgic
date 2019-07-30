var VM = new Vue({
    el: "#main",
    data: {
        myChart: null
    },
    created: function () {
        var _ = this;
        _.getLeftMenu();

    },
    mounted: function () {
        var _ = this;
        _.myChart = echarts.init(document.querySelector("#chart"));
        _.initchart();
        _.getLeftMenu();
    },
    methods: {
        getLeftMenu: function () {
            var _ = this;

            // BaseAjax.get({
            //     url: "../common/nav.html",
            //     success: function (rlt) {
            //
            //     }
            // });
            var ck_stat_key = ['9:00', '10:00', '11:00'];
            var ck_stat_value = [200, 100, 300];
            setTimeout(function () {
                _.updatechart3(ck_stat_key, ck_stat_value)
            },10)
        },
        // 图表
        initchart() {
            var _ = this;
            var option = {
                backgroundColor: 'rgba(12, 255, 0, .2)',
                title: {
                    text: ' 当前馆内客流',
                    left: 'left',
                    top: 20,
                    padding: [0, 0, 0, 20],
                    textStyle: {
                        color: '#000000',
                        fontSize: '36',
                        fontWeight: 'bold'
                    }
                },
                grid: {
                    top: "15%",
                    bottom:'10%'
                },
                xAxis: [{
                    type: 'category',
                    boundaryGap: false,
                    data: ['9:00', '10:00', '11:00', '12:00', '1:00', '2:00'],
                    axisLine: {
                        lineStyle: {
                            color: "#000",
                            fontSize: 20
                        }
                    }
                }],
                yAxis: [{
                    type: 'value',
                    splitNumber: 4,
                    splitLine: {
                        lineStyle: {
                            type: 'dashed',
                            color: '#DDD'
                        }
                    },
                    axisLine: {
                        show: false,
                        lineStyle: {
                            color: "#333"
                        },
                    },
                    nameTextStyle: {
                        color: "#999"
                    },
                    splitArea: {
                        show: false
                    }
                }],
                series: [{
                    type: 'line',
                    data: [23, 60, 20, 36, 23, 85],
                    lineStyle: {
                        normal: {
                            width: 4,
                            color: '#32B16C'
                        }
                    },
                    label: {
                        show: true,
                    },
                    itemStyle: {
                        normal: {
                            color: '#000',
                            borderWidth: 10,
                            /*shadowColor: 'rgba(72,216,191, 0.3)',
                            shadowBlur: 100,*/
                            borderColor: "#1DBC9D"
                        }
                    },
                    areaStyle: {
                        normal: {
                            color: '#15DEB7'
                            // color: new echarts.graphic.LinearGradient(
                            //     0, 0, 1, 0,
                            //     [
                            //         {offset: 0, color: 'rgba(0,254,157,1)'},
                            //         {offset: 0.25, color: 'rgba(2,191,241,1)'},
                            //         {offset: 0.75, color: 'rgba(51,156,255,1)'},
                            //         {offset: 1, color: 'rgba(145,127,255,1)'}
                            //     ]
                            // )
                        }
                    },
                    smooth: true
                }]
            };
            _.myChart.setOption(option);
        },
        updatechart3(ck_stat_key, ck_stat_value) {
            var _ = this;
            var options = {
                xAxis: {
                    boundaryGap: false,
                    data: ck_stat_key
                },
                series: [{
                    data: ck_stat_value,
                }]
            };
            _.myChart.setOption(options);
        }

    }
});
