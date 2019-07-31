var VM = new Vue({
    el: "#main",
    data: {
        maplist: []
    },
    created: function () {
        var _ = this;

    },
    mounted: function () {
        var _ = this;
        _.get_maps()
    },
    methods: {
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

    }
});