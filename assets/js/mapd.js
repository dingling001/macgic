var VM = new Vue({
    el: "#main",
    data: {
        exhibit_id: '',
        exhibit_info: {
            exhibit_imgs: []
        }
    },
    created: function () {
        var _ = this;

    },
    mounted: function () {
        var _ = this;
        if (Utils.getUrlKey('exhibit_id')) {
            _.exhibit_id = Utils.getUrlKey('exhibit_id');
            _._exhibit_info();

        } else {
            window.history.go(-1)
        }
    },
    methods: {
        // 获取详情
        _exhibit_info: function () {
            var _ = this;
            var post = {
                p: "t",
                api_token: localStorage.getItem('api_token'),
                exhibit_id: _.exhibit_id,
                has_relate: '0',
                language: '1'
            };
            BaseAjax.get({
                url: baseUrl + "exhibit_info",
                data: post,
                success: function (res) {
                    if (res.status == 1) {
                        _.exhibit_info = res.data;
                        _.exhibit_info.exhibit_imgs = res.data.exhibit_imgs;
                        var mySwiper = new Swiper('.swiper-container', {
                            pagination: {
                                el: '.swiper-pagination',
                            },
                        })
                    }
                }
            });
        },

    }
});
