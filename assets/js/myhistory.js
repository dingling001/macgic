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
        showmore: false,
        inds: -1,
        currSong: '',
        p_width: 0,
        is_playing: false,
        audio_time: '00:00',
        cur: 0,

        findex: 1,
        isflag: false,
        imageOverlay: null,
        imgurl: '',
        myLayerGroup: null
    },
    created: function () {
        var _ = this;
        _.myLayerGroup = new L.LayerGroup();
    },
    mounted: function () {
        var _ = this;
        _._map_exhibits(1);
        setTimeout(function () {
            _.$nextTick(function () {
                _.initMap();
            })
        }, 1000)
    },
    methods: {
        // 获取楼层展厅的展品列表
        _map_exhibits: function (map_id) {
            // alert(JSON.stringify(localStorage.getItem('api_token')))
            var _ = this;
            _.exhibit_list = [];
            return new Promise(function (resolve, reject) {
                BaseAjax.get({
                    url: baseUrl + "touchuser/visit_road",
                    data: {
                        p: "t",
                        api_token: localStorage.getItem('api_token'),
                        // api_token: 'a95adad90339a5d63d215c50365a5bd5',
                        map_id: map_id
                    },
                    success: function (res) {
                        if (res.status == 1) {
                            // alert(JSON.stringify(res))
                            _.lists = res.data.exhibitInfo;
                            _.info = res.data.mapInfo;
                            if (_.lists.length > 1) {
                                _.exhibit_list = _.lists[0]
                            }

                            _.imgurl = res.data.mapInfo.png_map_path;
                            _.isflag = true;
                            resolve()
                        }
                    }
                });
            })
        },
        // 跳转展品详情
        godetail: function (id) {
            var _ = this;
            // exhibit_info
            window.location.href = './mapex.html?floor_id=' + _.maplist[index].floor_id
        },
        initMap: function () {
            var v = this;
            var imgWidth = v.imgWidth;
            var imgHeight = v.imgHeight;
            var imgUrl = v.imgurl;
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
            });
            v.imageOverlay = L.imageOverlay(imgUrl, [
                [-(imgHeight / 2), -(imgWidth / 2)],
                [imgHeight / 2, imgWidth / 2]
            ]).addTo(v.myMap).on('load', function () {
                v.initMarkers();
            });
        },
        initMarkers: function () {
            var v = this;
            var imgWidth = v.imgWidth;
            var imgHeight = v.imgHeight;
            var len = v.lists.length;
            v.myLayerGroup.clearLayers();
            for (var i = 0; i < len; i++) {
                var d = v.lists[i];
                var nx = d.axis_x - imgWidth / 2;
                var ny = d.axis_y - imgHeight / 2;
                var markerContent = '';
                if (i == 0) {
                    markerContent = `<div class="cell " data-id="${d.exhibit_id}" data-len="1" data-i="${i}" >
                                        <div class="cell_icon markerbg_1 animated">
                                            <img src="${d.poi_1}" alt="" class="animated bounce infinite"/>
                                        </div>
                                        <div class="cell_title">${d.title}</div>
                                    </div>`;
                } else {
                    markerContent = `<div class="cell " data-id="${d.exhibit_id}" data-len="1" data-i="${i}" >
                                        <div class="cell_icon markerbg_1 animated">
                                            <img src="${d.poi_1}" alt="" />
                                        </div>
                                        <div class="cell_title">${d.title}</div>
                                    </div>`;
                }
                var myIcon = new L.divIcon({
                    className: "my-exhibits",
                    html: markerContent
                });
                var point = L.marker([ny, nx], {
                    icon: myIcon,
                }).on("click", function (ev) {
                    var target = ev.target;
                    var id = target._icon.children[0].dataset.id;
                    var len = target._icon.children[0].dataset.len;
                    var index = target._icon.children[0].dataset.i;
                    var img = target._icon.children[0].children[0];
                    $('body').find('.bounce').removeClass('bounce infinite');
                    $(img).addClass('bounce infinite');
                    // console.log(target._icon.children[0].children[0])
                    v.exhibition_name = v.lists[index].exhibition_name;
                    var _audio = document.getElementById('audio');
                    _audio.load();
                    v.pause_audio();
                    v.exhibit_list = v.lists[index];
                });
                v.myLayerGroup.addLayer(point);
                v.myMap.addLayer(v.myLayerGroup);
            }
        },
        // 播放音频
        play_audio: function (index) {
            var that = this;
            var elist = that.exhibit_list;
            console.log(that.exhibit_list)
            that.currSong = elist.audio;
            // alert(JSON.stringify(that.currSong))
            if (Object.keys(that.currSong).length == 0) {
                alert('暂不可播放')
            } else {
                that.inds = index;
                // that.proShow = 0;
                // that.indexSong = 0;
                that.getAddlisten()
                that.$nextTick(() => {
                    this.playAudio()
                });
            }
        },
        // 获取播放时间
        onloadedmetadata: function (res) {
            var that = this;
            var cur = res.target.currentTime;
            var dur = res.target.duration;
            cur = dur - cur;
            that.dur = cur;
            var elist = that.exhibit_list;
            // that.p_width = 100 - (cur / dur) * 100
            if (cur > 0 && that.inds >= 0) {
                elist[that.inds].audio_time = Utils.timeFormat(dur)
                // alert(that.audio_time)
            } else {
                console.log(dur)
                // clearInterval(interval);
            }
        },
        // 播放结束
        end_audio: function () {
            var _audio = document.getElementById('audio');
            _audio.load()
            _audio.pause();
            var that = this;
            that.inds = -1;
        },
        // 关闭
        colseauido: function () {
            var that = this;
            that.showmore = false
            that.inds = -1;
            var _audio = document.getElementById('audio');
            _audio.pause();
            this.$refs.audio.load();
        },
        // 播放监听
        getAddlisten: function () {
            var that = this;
            var _audio = document.getElementById('audio');
            _audio.addEventListener("play", function () {
                //在这里写代码
                that.is_playing = true;
            });
        },
        // 播放
        playAudio: function () {
            // ios不能自动加载，导致首次加载不能自动读取最大时间,故做此loading弹层提示优化
            var _audio = document.getElementById('audio');
            _audio.play();
            // this.is_pause = false;
        },
        // 暂停
        pause_audio: function (index) {
            var that = this;
            that.$refs.audio.pause();
            that.inds = -1;
            // console.log( elist[index].isPlaying)
            // that.indexSong = index;
        },
        // 播放进度条
        ontimeupdate: function () {
            var that = this;
            var _audio = document.getElementById('audio');
            // alert(myaudio.duration);
            var dur = _audio.duration;
            var cur = _audio.currentTime;
            var elist = that.exhibit_list;
            if (that.inds > 0 && dur && cur) {
                elist[that.inds].audio_time = Utils.timeFormat(dur - cur);
            }
        },
        // 去详情页
        go_detail: function (id) {
            var _ = this;
            window.location.href = './mapd.html?exhibit_id=' + id;
        },

        tab: function (index) {
            var _ = this;
            _.findex = index;
            _._map_exhibits(index);
            _._map_exhibits(index).then(function () {
                _.imageOverlay.setUrl(_.imgurl);
            });
        }
    }
});
