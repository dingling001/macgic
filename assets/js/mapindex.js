var VM = new Vue({
    el: "#main",
    data: {
        maplist: [
            '../assets/img/floor/3F.png',
            '../assets/img/floor/2F.png',
            '../assets/img/floor/1F.png',
        ],
        severimgshow: true,
        pos: 0
    },
    created: function () {
        var _ = this;

    },
    mounted: function () {
        var _ = this;
        _.get_maps()
    },
    methods: {
        // 获取楼层id
        get_maps: function () {
            var _ = this;
            BaseAjax.get({
                url: baseUrl + "touch_exhibit/maps",
                data: {p: "t"},
                success: function (res) {
                    console.log(res)
                    if (res.status == 1) {
                        _.maplist = res.data
                    }
                }
            });
        },
        // 去对应的展厅
        go_ex: function () {
            window.location.reload();
        },
        // 去我的楼层
        goex: function (index) {
            var _ = this;
            if (_.maplist.length > 0 && _.maplist[index].floor_id) {
                window.location.href = './mapex.html?floor_id=' + _.maplist[index].floor_id
            }
        },
        // 我的位置
        mypos: function () {
            var _ = this;
            if (Utils.getUrlKey('pos')) {
                _.pos = Utils.getUrlKey('pos');
            }
        }
    }
});
