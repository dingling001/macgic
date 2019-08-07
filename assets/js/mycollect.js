var VM = new Vue({
    el: "#main",
    data: {
        nologin: false,
        history: [],
        today: [],
        showtoday: false,
        nocollect: false
    },
    created: function () {
        var _ = this;

    },
    mounted: function () {
        var _ = this;
        _._all_collect();
    },
    methods: {
        _all_collect: function () {
            var _ = this;
            var post = {
                p: "t",
                api_token: localStorage.getItem('api_token'),
            };
            BaseAjax.get({
                url: baseUrl + "touchuser/all_collect",
                data: post,
                success: function (res) {
                    if (res.status == 1) {
                        _.today = res.data.today;
                        _.history = res.data.history;
                    } else if (res.status == 405) {
                        // alert('未登录')
                        _.nologin = true;
                    }
                }
            });
        },
        // 去详情页
        go_detail: function (id) {
            window.location.href = './mapd.html?exhibit_id=' + id;
        },
        delcollect: function () {
            var _ = this;
            var post = {
                p: "t",
                api_token: localStorage.getItem('api_token'),
            };
            BaseAjax.get({
                url: baseUrl + "touchuser/erase_collect",
                data: post,
                success: function (res) {
                    if (res.status == 1) {
                        _.nocollect = false;
                        _._all_collect();
                    } else if (res.status == 405) {
                        // alert('未登录')
                        _.nologin = true;
                    }
                }
            });
        }
    }
});

