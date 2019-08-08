var VM = new Vue({
    el: "#main",
    data: {
        currSong: '',
        exhibit_id: '',
        exhibit_info: {
            exhibit_imgs: []
        },
        isshowlayer: false,
        sharecode: null,
        sliderX: 0,
        // 该字段是音频是否处于播放状态的属性
        playing: false,
        // 音频当前播放时长
        currentTime: '00:00',
        // 音频最大播放时长
        maxTime: '00:00',
        minTime: '00:00',
        step: 0.1,
        posleft: '0',
        posprcent: '0',
        nologin: false,

        slide_list: [],
        mapinfo: [
            {
                exhibition_list: [
                    {exhibit_list: []}
                ]
            }
        ],
        ind: 0,
        inds: -1,
        exhibit_list: [],
        findex: 0,
        mapinfolength: 0,
        activeIndex: 0,
        mySwiper: null
    },
    created: function () {
        var _ = this;
    },
    mounted: function () {
        var _ = this;
        _.getmapinfo(1);
    },
    methods: {
        tab: function (index) {
            var _ = this;
            _.activeIndex = 0;
            _.findex = index;
            _.int_swiper();
            _.mySwiper.update();
        },
        getmapinfo: function (floor_id) {
            var _ = this;
            var post = {
                p: "t",
                api_token: localStorage.getItem('api_token'),
                floor_id: floor_id
            };
            BaseAjax.get({
                url: baseUrl + "touch_exhibit/maps",
                data: post,
                success: function (res) {
                    if (res.status == 1) {
                        console.log(res)
                        _.mapinfo = res.data;
                        _.mapinfolength = _.mapinfo[_.findex].exhibition_list.length;
                        _.activeIndex = _.mapinfolength >= 3 ? 1 : 0;
                        _.int_swiper();
                    }
                }
            });
        },
        // 初始化轮播图
        int_swiper: function () {
            var _ = this;
            _.mySwiper = new Swiper('.banner', {
                slidesPerView: 'auto', //重要 可以去swiper搜索
                centeredSlides: true, //重要
                paginationClickable: true,
                effect: 'left',
                speed: 500,
                // initialSlide: _.mapinfolength >= 3 ? 1 : _.mapinfolength,
                initialSlide: _.activeIndex,
                // loop: true,
                coverflowEffect: {
                    rotate: 20,
                    stretch: 10,
                    depth: 60,
                    modifier: 2,
                },
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                },
                lazy: {
                    loadPrevNext: true,
                },
                observer: true,
                observeParents: true,
                on: {
                    slideChangeTransitionEnd: function () {
                        _.activeIndex = this.activeIndex;
                        // console.log(_.mapinfo[_.findex].exhibition_list[_.activeIndex].exhibit_list)
                    },
                }
            });
            if (_.activeIndex > 0) {
                setTimeout(() => {
                    _.mySwiper.slideTo(1, 50, false);
                }, 0);
            }
        },
        // 播放音频
        play_audio: function (index) {
            var that = this;
            var elist = that.mapinfo[that.findex].exhibition_list[that.activeIndex].exhibit_list;
            that.currSong = baseImgUrl + elist[index].audio_ogg;
            console.log(that.currSong)
            // alert(JSON.stringify(that.currSong))
            if (Object.keys(that.currSong).length == 0) {
                alert('暂不可播放')
            } else {
                elist[index].isPlaying = false;
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
            var elist = that.mapinfo[that.findex].exhibition_list[that.activeIndex].exhibit_list;
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
            var elist = that.mapinfo[that.findex].exhibition_list[that.activeIndex].exhibit_list;
            if (that.inds > 0 && dur && cur) {
                elist[that.inds].audio_time = Utils.timeFormat(dur - cur);
            }
        },
        //时间转换
        transTime: function (value) {
            var _ = this;
            var time = "";
            var h = parseInt(value / 3600);
            value %= 3600;
            var m = parseInt(value / 60);
            var s = parseInt(value % 60);
            if (h > 0) {
                time = _.formatTime(h + ":" + m + ":" + s);
            } else {
                time = _.formatTime(m + ":" + s);
            }
            return time;
        },
        //时间格式化
        formatTime: function (value) {
            var time = "";
            var s = value.split(':');
            var i = 0;
            for (; i < s.length - 1; i++) {
                time += s[i].length == 1 ? ("0" + s[i]) : s[i];
                time += ":";
            }
            time += s[i].length == 1 ? ("0" + s[i]) : s[i];
            return time;
        },
        // 去详情页
        go_detail: function (id) {
            window.location.href = './mapd.html?exhibit_id=' + id;
        }
    }
});

