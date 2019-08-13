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
        showvideo: false,
        endestatus: false
    },
    created: function () {
        var _ = this;
        // localStorage.setItem('api_token','0ded844bb16ebe1ec85180be51f6cd5f')
        if (localStorage.getItem('api_token')) {
            _.islogin = false;
        }
        // alert(JSON.stringify(Utils.getUrlKey('deviceId')))
        if (!localStorage.getItem('api_token')) {
            if (Utils.getUrlKey('deviceId')) {
                _.deviceId = Utils.getUrlKey('deviceId');
                _.login();
            }
        }
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
                    if (res.status == 1) {
                        localStorage.setItem('api_token', res.data.api_token);
                        _.showvideo = true;
                    }
                }
            });
        },
        loginOut: function () {
            var _ = this;
            _.islogin = true;
            _.isout = false;
            Utils.loginOut();
        },
        // 我的浏览历史
        go_his: function () {
            var _ = this;
            if (!localStorage.getItem('api_token')) {
                _.logining = true;
                _.logintext = '您尚未登录';
                setTimeout(function () {
                    _.logining = false;
                }, 5000);
            } else {
                window.location.href = './maphistory.html'
            }
        },
        // 我的收藏
        go_collect: function () {
            var _ = this;
            if (!localStorage.getItem('api_token')) {
                _.logining = true;
                _.logintext = '您尚未登录';
                setTimeout(function () {
                    _.logining = false;
                }, 5000);
            } else {
                window.location.href = './mycollect.html'
            }
        },
        // 视频播放完毕
        endvideo: function () {
            var _ = this;
            _.showvideo = false;
            _.logintext = '恭喜，您已登录成功';
            _.logining = true;
            setTimeout(function () {
                _.logining = false;
                _.islogin = false;
            }, 1500);
        }
    }
});
