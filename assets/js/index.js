var VM = new Vue({
    el: "#main",
    data: {
        myChart: null,
        time: '00:00:00',
        time_flow: [],
        date: '获取日期',
        week: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
        weekday: '星期几',
        cond_code_d: '100',
        tmp_max: '',
        tmp_min: '',
        admin_area: '兰州',
        pm25: ''
    },
    created: function () {
        var _ = this;
        // alert(_.getBrowserInfo())
    },
    mounted: function () {
        var _ = this;
        _.myChart = echarts.init(document.querySelector("#chart"));
        _.myChart.showLoading(
            {
                text: '加载中…',
                color: '#32B16C',
                textColor: '#000',
                maskColor: 'rgba(12, 255, 0, .1)',
                zlevel: 10
            }
        );
        setInterval(function () {
            _.getinitindex();
        }, 1000);
        _.initchart();
        _.getLeftMenu();
        setInterval(function () {
            _.initchart();
            _.getLeftMenu()
        }, 60000);
        _.setWeather();
        _.getair()
    },
    methods: {
        // 获取日期
        getinitindex: function () {
            var _ = this;
            var date = new Date();
            var h = date.getHours();
            var m = date.getMinutes();
            var s = date.getSeconds();
            var month = date.getMonth() + 1;
            var day = date.getDate();
            var week = date.getDay();
            _.date = month + '月' + day + '日';
            _.time = h + ':' + _.add0(m) + ':' + _.add0(s);
            _.weekday = _.week[week];
        },
        // 数字超10 加0
        add0: function (a) {
            return a >= 10 ? a : '0' + a
        },
        // 设置天气
        setWeather: function () {
            var vm = this;
            BaseAjax.get({
                type: "get",
                url: "https://free-api.heweather.com/s6/weather/forecast",
                data: {
                    location: "auto_ip",
                    key: weatherkey
                },
                success: function (rlt) {
                    if (rlt.HeWeather6[0].status == 'ok') {
                        console.log(rlt);
                        var daily_forecast = rlt.HeWeather6[0].daily_forecast[0];
                        var basic = rlt.HeWeather6[0].basic;
                        // console.log(now)
                        vm.tmp_max = daily_forecast.tmp_max;
                        vm.tmp_min = daily_forecast.tmp_min;
                        vm.cond_code_d = daily_forecast.cond_code_d;
                        vm.admin_area = basic.parent_city;
                    }
                },
                error: function (rlt) {
                    console.log(rlt)
                }
            });
        },
        // 获取空气质量
        getair: function () {
            var vm = this;
            BaseAjax.get({
                type: "get",
                url: "https://free-api.heweather.net/s6/air/now",
                data: {
                    location: "auto_ip",
                    key: weatherkey,
                    unit: '',
                    lang: 'zh-cn'
                },
                success: function (rlt) {
                    if (rlt.HeWeather6[0].status == 'ok') {
                        console.log(rlt)
                        var air_now_city = rlt.HeWeather6[0].air_now_city;
                        vm.pm25 = air_now_city.pm25;
                    }
                },
                error: function (rlt) {
                    console.log(rlt)
                }
            });
        },
        // 获取客流信息
        getLeftMenu: function () {
            var _ = this;
            var ck_stat_key = [];
            var ck_stat_value = [];
            BaseAjax.get({
                url: "http://keliu.gsstm.org/api/time_flow?p=t",
                success: function (res) {
                    // console.log(res)
                    _.myChart.hideLoading();
                    if (res.status == 1) {
                        _.time_flow = res.data.time_flow;
                        for (var key in   _.time_flow) {
                            ck_stat_key.push(key);
                            ck_stat_value.push(_.time_flow[key])
                        }
                        setTimeout(function () {
                            _.updatechart3(ck_stat_key, ck_stat_value)
                        }, 10)
                    } else {

                    }
                }
            });

        },
        // 图表
        initchart: function () {
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
                    bottom: '10%'
                },
                xAxis: [{
                    type: 'category',
                    boundaryGap: false,
                    data: [],
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
                    data: [],
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
        // 更新图表
        updatechart3: function (ck_stat_key, ck_stat_value) {
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
        },

        getBrowserInfo: function () {
            let agent = navigator.userAgent.toLowerCase();
            console.log(agent);
            let arr = [];
            let system = agent.split(' ')[1].split(' ')[0].split('(')[1];
            arr.push(system);
            let REGSTR_EDGE = /edge\/[\d.]+/gi;
            let REGSTR_IE = /trident\/[\d.]+/gi;
            let OLD_IE = /msie\s[\d.]+/gi;
            let REGSTR_FF = /firefox\/[\d.]+/gi;
            let REGSTR_CHROME = /chrome\/[\d.]+/gi;
            let REGSTR_SAF = /safari\/[\d.]+/gi;
            let REGSTR_OPERA = /opr\/[\d.]+/gi;
            // IE
            if (agent.indexOf('trident') > 0) {
                arr.push(agent.match(REGSTR_IE)[0].split('/')[0]);
                arr.push(agent.match(REGSTR_IE)[0].split('/')[1]);
                return arr;
            }
            // OLD_IE
            if (agent.indexOf('msie') > 0) {
                arr.push(agent.match(OLD_IE)[0].split(' ')[0]);
                arr.push(agent.match(OLD_IE)[0].split(' ')[1]);
                return arr;
            }
            // Edge
            if (agent.indexOf('edge') > 0) {
                arr.push(agent.match(REGSTR_EDGE)[0].split('/')[0]);
                arr.push(agent.match(REGSTR_EDGE)[0].split('/')[1]);
                return arr;
            }
            // firefox
            if (agent.indexOf('firefox') > 0) {
                arr.push(agent.match(REGSTR_FF)[0].split('/')[0]);
                arr.push(agent.match(REGSTR_FF)[0].split('/')[1]);
                return arr;
            }
            // Opera
            if (agent.indexOf('opr') > 0) {
                arr.push(agent.match(REGSTR_OPERA)[0].split('/')[0]);
                arr.push(agent.match(REGSTR_OPERA)[0].split('/')[1]);
                return arr;
            }
            // Safari
            if (agent.indexOf('safari') > 0 && agent.indexOf('chrome') < 0) {
                arr.push(agent.match(REGSTR_SAF)[0].split('/')[0]);
                arr.push(agent.match(REGSTR_SAF)[0].split('/')[1]);
                return arr;
            }
            // Chrome
            if (agent.indexOf('chrome') > 0) {
                arr.push(agent.match(REGSTR_CHROME)[0].split('/')[0]);
                arr.push(agent.match(REGSTR_CHROME)[0].split('/')[1]);
                return arr;
            } else {
                arr.push('未获取到浏览器信息');
                return arr;
            }
        }
    }
});
