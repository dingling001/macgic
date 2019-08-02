var SCALE = 1;
var VM = new Vue({
    el: "#main",
    data: {
        floor_id: '',
        info: "", //展厅信息
        lists: [],
        imgWidth: 3720 * SCALE, //图片像素宽
        imgHeight: 2560 * SCALE, //图片像素高
        myMap: null,
        maplist: [],
        exhibition_list: [],
        map_name: '',
        exhibition_name: '',
        exhibit_list: [],
        ind: 0,
        showmore: false
    },
    created: function () {
        var _ = this;

    },
    mounted: function () {
        var _ = this;
        if (Utils.getUrlKey('floor_id')) {
            _.floor_id = Utils.getUrlKey('floor_id');
        } else {
            window.history.go(-1)
        }
        _.get_maps();
        _._map_exhibits()
    },
    methods: {
        // 获取地图信息，展厅列表
        get_maps: function () {
            var _ = this;
            BaseAjax.get({
                url: baseUrl + "touch_exhibit/maps",
                data: {p: "t"},
                success: function (res) {
                    console.log(res)
                    if (res.status == 1) {
                        _.maplist = res.data;
                        for (var i in res.data) {
                            if (_.floor_id == res.data[i].floor_id) {
                                _.exhibition_list = res.data[i].exhibition_list;
                                _.map_name = res.data[i].map_name
                            }
                        }
                    }
                }
            });
        },
        // 获取展厅的展品列表
        _map_exhibits: function () {
            var _ = this;
            BaseAjax.get({
                url: baseUrl + "touch_exhibit/map_exhibits",
                data: {p: "t", floor_id: _.floor_id},
                success: function (res) {
                    console.log(res)
                    if (res.status == 1) {
                        _.info = res.data;
                        _.lists = res.data.nums;
                        console.log(_.lists[0].exhibit_list)
                        _.exhibit_list = _.lists[0].exhibit_list;
                        _.exhibition_name = _.lists[0].exhibition_name;

                        if (_.lists.length > 0) {
                            _.initMap(_.lists[0].x, _.lists[0].y);
                        }
                        _.initMarkers();
                    }
                }
            });
        },
        // 跳转展品详情
        godetail(id) {
            var _ = this;
            // exhibit_info
            window.location.href = './mapex.html?floor_id=' + _.maplist[index].floor_id
        },
        // 切换展厅
        changeExhibit: function (index) {
            var _ = this;
            _.ind = index;
            var x = _.exhibition_list[index].x;
            var y = _.exhibition_list[index].y;
            _.myMap.flyTo([x, y])
        },
        initMap: function (x, y) {
            var v = this;
            var imgWidth = v.imgWidth;
            var imgHeight = v.imgHeight;
            var imgUrl = v.info.png_map_path;
            v.myMap = L.map("map", {
                // 修改坐标系
                crs: L.CRS.Simple,
                // 设置最大拖动边界
                maxBounds: [
                    [-(imgHeight / 1.5), -(imgWidth / 1.5)],
                    [imgHeight / 1.5, imgWidth / 1.5]
                ],
                minZoom: -1.55, // 设置缩放的最小值
                maxZoom: 0, // 设置地图放大的最大值
                zoom: 2, //设置初始化的缩放值
                center: [0, 0], //隐藏leaflet
                zoomControl: false,
                attributionControl: false
            }).flyTo([x, y]);
            L.imageOverlay(imgUrl, [
                [-(imgHeight / 2), -(imgWidth / 2)],
                [imgHeight / 2, imgWidth / 2]
            ]).addTo(v.myMap).on('load', function () {
                // v.initMarkers();
            });
        },
        initMarkers: function () {
            var v = this;
            var imgWidth = v.imgWidth;
            var imgHeight = v.imgHeight;
            var len = v.lists.length;
            for (var i = 0; i < len; i++) {
                var d = v.lists[i];
                var nx = d.x - imgWidth / 2;
                var ny = d.y - imgHeight / 2;
                var markerContent, popupContent;
                var exhibitLen = d.exhibit_list.length;
                if (exhibitLen == 1) {
                    var o = d.exhibit_list[0];
                    if(i==0){
                        markerContent = `<div class="cell " data-id="${o.exhibit_id}" data-len="1" data-i="${i}" >
                                        <div class="cell_icon markerbg_1 animated">
                                            <img src="${baseImgUrl}${o.icon}" alt="" class="animated bounce infinite"/>
                                        </div>
                                        <div class="cell_title">${o.exhibit_name}</div>
                                    </div>`;
                        popupContent = v.renderPopup1(d.exhibit_list);
                    }else{
                        markerContent = `<div class="cell " data-id="${o.exhibit_id}" data-len="1" data-i="${i}" >
                                        <div class="cell_icon markerbg_1 animated">
                                            <img src="${baseImgUrl}${o.icon}" alt="" />
                                        </div>
                                        <div class="cell_title">${o.exhibit_name}</div>
                                    </div>`;
                        popupContent = v.renderPopup1(d.exhibit_list);
                    }

                } else if (exhibitLen > 1) {
                    if (i == 0) {
                        markerContent = `<div class="cell" data-len="${exhibitLen}" data-i="${i}">
                                        <div class="cell_icon markerbg_2 animated bounce infinite">
                                            <span>${exhibitLen}</span>
                                        </div>
                                    </div>`;
                    } else {
                        markerContent = `<div class="cell" data-len="${exhibitLen}" data-i="${i}">
                                        <div class="cell_icon markerbg_2  animated">
                                            <span>${exhibitLen}</span>
                                        </div>
                                    </div>`;
                    }
                }
                var myIcon = new L.divIcon({
                    className: "my-exhibits",
                    html: markerContent
                });
                var popup = new L.popup({
                    className: 'my-exhibits-popup',
                    keepInView: true,
                    offset: [0, -80],
                    closeOnClick: false,
                    closeButton: false
                })
                    .setContent(popupContent)
                var point = L.marker([ny, nx], {
                    icon: myIcon,
                })
                    .addTo(v.myMap)
                    // .bindPopup(popup)
                    .on("click", function (ev) {
                        var target = ev.target;
                        var id = target._icon.children[0].dataset.id;
                        var len = target._icon.children[0].dataset.len;
                        var index = target._icon.children[0].dataset.i;
                        var img = target._icon.children[0].children[0];
                        $('body').find('.bounce').removeClass('bounce infinite');
                        $(img).addClass('bounce infinite');
                        console.log(target._icon.children[0].children[0])
                        v.exhibition_name = v.lists[index].exhibition_name;
                        v.exhibit_list = v.lists[index].exhibit_list;
                        if (len == 1) {
                        } else {
                            v.showmore = true;
                        }

                    });
            }
        },
        initSwiper1: function () {
            var swiper1 = new Swiper('#mySwiper1', {
                loop: false,
                slidesPerView: 1,
                centeredSlides: true,
                observer: true,
                observerParents: true,
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                },
                on: {
                    init: function () {
                        // alert('当前的slide序号是' + this.activeIndex);
                        this.emit('transitionEnd'); //在初始化时触发一次transitionEnd事件
                    },
                    transitionEnd: function () {
                    },
                    slideChangeTransitionEnd: function () {
                        // if (this.isEnd) {
                        //     this.navigation.$nextEl.css('display', 'none');
                        // } else {
                        //     this.navigation.$nextEl.css('display', 'block');
                        // }
                    },
                },
            });
        },
        renderPopup1: function (list) {
            var str = "";
            for (var i in list) {
                str += `<div class="cell">
                            <div class="img">
                                <img src="${baseImgUrl}${list[i].icon}" alt="" />
                            </div>
                            <div class="txt">
                                <div class="title">${list[i].exhibit_name}</div>
                                <div class="brief">${list[i].desc}</div>
                                <div data_id="${list[i].exhibit_id}" class="enter_btn">查看详情</div>
                            </div>
                        </div>`;
            }
            return str;
        },
        renderPopup2: function (list) {
            var str = "";
            for (var j in list) {
                str += `<div class="swiper-slide">
                            <div class="cell">
                                <div class="img">
                                    <img src="${baseImgUrl}${list[j].icon}" alt="" />
                                </div>
                                <div class="txt">
                                    <div class="title">${list[j].exhibit_name}</div>
                                    <div class="brief">${list[j].desc}</div>
                                    <div class="swiper_num">
                                        <span class="curT">${parseInt(j) + 1}</span>/<span>${list.length}</span>
                                    </div>
                                    <div data_id="${list[j].exhibit_id}" class="enter_btn">查看详情</div>
                                </div>
                            </div>
                        </div>`;
            }
            return str;
        },
    }
});
