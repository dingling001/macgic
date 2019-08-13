var VM = new Vue({
    el: "#main",
    data: {
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
        nologin: false
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
                        // console.log(baseImgUrl + res.data.share_url)
                        setTimeout(function () {
                            _.sharecode = new QRCode("qrcode", {
                                text: baseImgUrl + res.data.share_url,
                                width: 400,
                                height: 400,
                                colorDark: "#000000",
                                colorLight: "#ffffff",
                                correctLevel: QRCode.CorrectLevel.H
                            });
                            _.initswiper();
                            Utils.initScrollCont();
                        }, 500)
                    }
                }
            });
        },
        // 初始化头部轮播
        initswiper: function () {
            var mySwiper = new Swiper('.topswiper', {
                pagination: {
                    el: '.swiper-pagination',
                },
                observer: true,
                observeParents: true
            })
        },
        // 收藏
        _do_like: function () {
            var _ = this;
            if (_.exhibit_info.is_collection == 1) {
                _._collect_cancel()
            } else {
                _.collect_do();
            }
        },
        // 收藏
        collect_do: function () {
            var _ = this;
            var post = {
                p: "t",
                api_token: localStorage.getItem('api_token'),
                exhibit_id: _.exhibit_id,
                type: 2,
                is_new: '1'
            };
            BaseAjax.get({
                url: baseUrl + "touchuser/collect_do",
                data: post,
                success: function (res) {
                    if (res.status == 1) {
                        _._exhibit_info();
                    } else if (res.status == 405) {
                        // alert('未登录')
                        _.nologin = true;
                    }
                }
            });
        },
        // 取消收藏
        _collect_cancel: function () {
            var _ = this;
            var post = {
                p: "t",
                api_token: localStorage.getItem('api_token'),
                exhibit_id: _.exhibit_id,
                type: 2,
                is_new: '1'
            };
            BaseAjax.get({
                url: baseUrl + "touchuser/collect_cancel",
                data: post,
                success: function (res) {
                    if (res.status == 1) {
                        _._exhibit_info();
                    } else if (res.status == 405) {
                        // alert('未登录')
                        _.nologin = true;
                    }
                }
            });
        },
        // 分享
        share_fn: function () {
            var vm = this;
            vm.isshowlayer = true;
        },
        // 播放切换
        toggleplay: function () {
            var _ = this;
            if (_.exhibit_info.audio) {
                _.playing ? _.pause() : _.play();
            } else {
                console.log('...')
            }
        },
        // 播放音频
        play: function () {
            var _ = this;
            // console.log('播放')
            _.playing = true;
            _.$refs.audio.play();
        },
        // 暂停音频
        pause: function () {
            // console.log('暂停音频')
            var _ = this;
            _.playing = false;
            _.$refs.audio.pause();
        },
        // 当加载语音流元数据完成后，会触发该事件的回调函数
        // 语音元数据主要是语音的长度之类的数据
        onLoadedmetadata(res) {
            console.log(res)
            var _ = this;
            var cur = res.target.currentTime;
            var dur = res.target.duration;
            cur = dur - cur;
            _.dur = cur;
            // that.p_width = 100 - (cur / dur) * 100
            if (cur > 0) {
                _.maxTime = Utils.timeFormat(dur)
                // _.currentTime = Utils.timeFormat(cur)
                // alert(that.audio_time)s
            } else {
                // clearInterval(interval);
            }
        },
        // 当timeupdate事件大概每秒一次，用来更新音频流的当前播放时间
        // 当音频当前时间改变后，进度条也要改变
        onTimeupdate: function (res) {
            var _ = this;
            if (res.target.duration <= 0 || !res.target.duration) return
            setTimeout(function () {
                _.maxTime = Utils.timeFormat(res.target.duration);
                _.currentTime = Utils.timeFormat(res.target.currentTime);
                _.posprcent = parseInt(res.target.currentTime / res.target.duration * 100) + '%';
                _.posleft = parseInt(res.target.currentTime / res.target.duration * 100) + '%';
            }, 100)

        },
        //播放结束
        onEnded: function () {
            console.log('end')
            var _ = this;
            _.currentTime = '00:00';
            // _.posprcent = '0%';
            // _.posleft ='0%';
            _.playing = false;
        },
        handleTouchStart: function (e) {
            this.setValue(e.touches[0]);
            document.addEventListener('touchmove', this.handleTouchMove);
            document.addEventListener('touchup', this.handleTouchEnd);
            document.addEventListener('touchend', this.handleTouchEnd);
            document.addEventListener('touchcancel', this.handleTouchEnd);
        },
        handleTouchMove: function (e) {
            this.setValue(e.changedTouches[0]);
        },
        handleTouchEnd: function (e) {
            this.setValue(e.changedTouches[0]);
            document.removeEventListener('touchmove', this.handleTouchMove);
            document.removeEventListener('touchup', this.handleTouchEnd);
            document.removeEventListener('touchend', this.handleTouchEnd);
            document.removeEventListener('touchcancel', this.handleTouchEnd);
        },
        // 从点击位置更新 value
        setValue: function (e) {
            const $track = this.$refs.track;
            const {
                maxTime,
                minTime,
                step
            } = this;
            let value = ((e.clientX - $track.getBoundingClientRect().left) / $track.offsetWidth) * (maxTime - minTime);
            value = Math.round(value / step) * step + minTime;
            value = parseFloat(value.toFixed(5));

            if (value > maxTime) {
                value = maxTime;
            } else if (value < minTime) {
                value = minTime;
            }
            this.$refs.audio.currentTime = value;
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
        }

    }
});

