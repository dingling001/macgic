var VM = new Vue({
    el: "#main",
    data: {
        islogin: true,
        deviceId: '',
        name: '亲',
        rent_time: '',
        isout: false,
        logining: false,
        logintext: '恭喜，您已登录成功',
    },
    created: function () {
        var _ = this;
        if (Utils.getUrlKey('deviceId')) {
            _.deviceId = Utils.getUrlKey('deviceId');
            _.login();
        }
        if(localStorage.getItem('api_token')){
            _.islogin=false;
        }
        localStorage.setItem('api_token','85471450cbea9241277fe648c16a0c51')
    },
    mounted: function () {
        var _ = this;
    },
    methods: {
        // 登录
        login: function () {
            var _ = this;
            BaseAjax.post({
                url: baseUrl + "touchuser/login",
                data: {p: "t", deviceId: _.deviceId},
                success: function (res) {
                    console.log(res)
                    if (res.status == 1) {
                        _.logintext = '恭喜，您已登录成功';
                        _.logining = true;
                        setTimeout(function () {
                            _.logining = false;
                        }, 1000);
                        _.islogin = true;
                        localStorage.setItem('api_token', res.data.api_token);
                        _.name = res.data.name;
                        _.rent_time = res.data.rent_time;
                    }
                }
            });
        },
        // 登出
        loginOut: function () {
            var _ = this;
            _.islogin = true;
            _.isout = false;
            BaseAjax.get({
                url: baseUrl + "touchuser/logout",
                data: {p: "t", api_token: localStorage.getItem('api_token')},
                success: function (res) {
                    if (res.status == 1) {
                    }
                }
            });
            localStorage.removeItem('api_token');
        },
        go_his: function () {
            var _=this;
            if (!localStorage.getItem('api_token')) {
                _.logining = true;
                _.logintext = '您尚未登录';
                setTimeout(function () {
                    _.logining = false;
                }, 5000);
            } else {
                window.location.href = './maphistory.html'
            }


            window.location.href = './maphistory.html'
        },
        go_collect:function () {
            var _=this;
            if (!localStorage.getItem('api_token')) {
                _.logining = true;
                _.logintext = '您尚未登录';
                setTimeout(function () {
                    _.logining = false;
                }, 5000);
            } else {
                window.location.href = './mycollect.html'
            }


            window.location.href = './mycollect.html'
        }
    },

});
