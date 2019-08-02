var baseUrl = "http://192.168.10.158:8316/api/"; //嘉善测试平台
// var baseUrl = "http://jiashan.museum-edu.cn"; //线上测试平台
var baseImgUrl='http://192.168.10.158:8316'
var ls = window.localStorage;
var weatherkey = '4cb210538d2c4a27ae661140753c71d0';//天气key
var Utils = {
    /**
     * @取url查询字段参数
     */
    getUrlKey: function (key) {
        return (decodeURIComponent((new RegExp("[?|&]" + key + "=" + "([^&;]+?)(&|#|;|$)").exec(location.href) || [, ""])[1].replace(/\+/g, "%20")) || null);
    },
    getRootPath: function () {
        var strFullPath = window.document.location.href;
        var strPath = window.document.location.pathname;
        var pos = strFullPath.indexOf(strPath);
        var prePath = strFullPath.substring(0, pos);
        return prePath;
    },
    /**
     * @判断网络状态
     */
    checkNetStatus: function (element, type, handler) {
        if (element.addEventListener) {
            element.addEventListener(type, handler, false);
        } else if (element.attachEvent) {
            element.attachEvent("on" + type, handler);
        } else {
            element["on" + type] = handler;
        }
    },
    isNull: function (val) {
        return val == null ? '' : val;
    },
    isArray: function (o) {
        return Object.prototype.toString.call(o) == '[object Array]';
    },
    /**
     * @手势滑动
     */
    initScroll: function (arg) {
        var myscroll = new iScroll("wrapper", {
            hScroll: false,
            vScroll: true,
            hScrollbar: false,
            vScrollbar: false,
            onScrollMove: function () {
                arg.onScrollMove && arg.onScrollMove.call(this);
            },
            onScrollEnd: function () {
                arg.onScrollEnd && arg.onScrollEnd.call(this);
            },
            onRefresh: function () {
                arg.onRefresh && arg.onRefresh.call(this);
            }
        });
        setTimeout(function () { //放在计时器里边才好使，不然容易出错
            !arg && myscroll.refresh();
        }, 0);
        return myscroll;
    },
    initScrollCont: function () {
        var swiper = new Swiper('#contWrap', {
            direction: 'vertical',
            slidesPerView: 'auto',
            freeMode: true,
            scrollbar: {
                el: '.swiper-scrollbar',
            },
            mousewheel: true,
            observer: true,
            observeParents: true,
            on: {
                slideChangeTransitionEnd: function () {
                    this.update();
                }
            }
        });
        return swiper;
    },
    /**
     * @判断是否移动端
     */
    isMobile: function () {
        var sUserAgent = navigator.userAgent.toLowerCase();
        var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
        var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
        var bIsMidp = sUserAgent.match(/midp/i) == "midp";
        var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
        var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
        var bIsAndroid = sUserAgent.match(/android/i) == "android";
        var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
        var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
        if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {
            return true;
        } else {
            return false;
        }
    },
    /**
     * @设置当前时间
     */
    setLoctime: function () {
        var mydate = new Date();
        var year = mydate.getFullYear();
        var month = mydate.getMonth() + 1;
        var day = mydate.getDate();
        var weekday = mydate.getDay();
        var hour = mydate.getHours();
        var minu = mydate.getMinutes();
        var week = [
            "星期日",
            "星期一",
            "星期二",
            "星期三",
            "星期四",
            "星期五",
            "星期六"
        ];
        month = Number(month) >= 10 ? month : "0" + month;
        day = Number(day) >= 10 ? day : "0" + day;
        hour = Number(hour) >= 10 ? hour : "0" + hour;
        minu = Number(minu) >= 10 ? minu : "0" + minu;
        $("#time1").text(hour + ":" + minu);
        // var startDate = localStorage.date;
        // var date3 = mydate.getTime() - startDate;
        // var leave1 = date3 % (24 * 3600 * 1000); //计算天数后剩余的毫秒数
        // hours = Math.floor(leave1 / (3600 * 1000));
        // //计算相差分钟数
        // var leave2 = leave1 % (3600 * 1000); //计算小时数后剩余的毫秒数
        // min = Math.floor(leave2 / (60 * 1000));
        var api_token = localStorage.api_token;
        if (api_token == undefined || api_token == "" || api_token == null) {
            $(".time .c2").hide();
        } else {
            $(".time .c2").show();
            $("#time2").text("已经浏览时间");
            $("#time3").text(localStorage.rent_time);
        }

        var Loctime;
        clearInterval(Loctime);
        Loctime = setInterval(function () {
            mydate = new Date();
            hour = mydate.getHours();
            minu = mydate.getMinutes();
            hour = Number(hour) >= 10 ? hour : "0" + hour;
            minu = Number(minu) >= 10 ? minu : "0" + minu;
            $("#time1").text(hour + ":" + minu);
            var startDate = localStorage.date;
            var date3 = mydate.getTime() - startDate;
            var leave1 = date3 % (24 * 3600 * 1000); //计算天数后剩余的毫秒数
            hours = Math.floor(leave1 / (3600 * 1000));
            //计算相差分钟数
            var leave2 = leave1 % (3600 * 1000); //计算小时数后剩余的毫秒数
            min = Math.floor(leave2 / (60 * 1000));
            var api_token = localStorage.api_token;
            if (api_token == undefined || api_token == "" || api_token == null) {
                $(".time .c2").hide();
            } else {
                $(".time .c2").show();
                $("#time2").text("已经浏览时间");
                $("#time3").text(localStorage.rent_time);
            }
        }, 1000);
    },
    /**
     * @定时长屏幕无触发处理：返回首页，注销登录状态-----分享页不用倒计时
     */
    noTouchtime: function (t) {
        // 如页面有【#nobackTimer】元素，跳出本方法，不进行无触发处理
        if ($("#nobackTimer")[0]) {
            return;
        }

        var ACTTIME = t || 120;
        var count = ACTTIME;

        var timerDom = '<svg width="100" height="100" viewBox="0 0 100 100" id="backTimer"><circle class="c1" cx="50" cy="50" r="30" stroke-width="0" fill="#fff"></circle><circle class="c2" cx="50" cy="50" r="40" stroke-width="10" stroke="#FFB95F" fill="none" transform="matrix(0,-1,1,0,0,100)" stroke-dasharray="251 251"></circle><text class="t1" x="50" y="50" fill="#FFB95F" text-anchor="middle" dominant-baseline="middle">' + count + "s</text></svg>";

        if (!$("#backTimer")[0]) {
            $("body").append(timerDom);
            $("#backTimer circle.c2").attr("stroke-dasharray", Math.PI * 2 * 40 + " " + Math.PI * 2 * 40);
        }

        document.body.onmousedown = function () {
            count = ACTTIME;
        };
        document.body.onkeydown = function () {
            count = ACTTIME;
        };
        document.body.addEventListener("touchstart", function (e) {
            count = ACTTIME;
        }, false);
        document.body.addEventListener("touchmove", function (e) {
            count = ACTTIME;
        }, false);
        document.body.addEventListener("touchend", function (e) {
            count = ACTTIME;
        }, false);
        var outInterval = setInterval(function () {
            count--;
            if ($("#backTimer")[0]) {
                var perc = count / ACTTIME;
                var circum = Math.PI * 2 * 40;
                $("#backTimer text.t1").text(count + "s");
                $("#backTimer circle.c2").attr("stroke-dasharray", perc * circum + " " + (1 - perc) * circum);
            }
            if (count == 0) {
                clearInterval(outInterval);
                if (window.location.href == 'http://192.168.11.90/project/macgic/index.html') return;
                window.location.href = "http://192.168.11.90/project/macgic/index.html";
            }
        }, 1000);
    },
    /**
     * @断网提示
     */
    noInterNet: function () {
        var domStr = '';
        domStr += '<div class="netFail animated zoomIn">';
        domStr += '<div class="net_fail">';
        domStr += '<div class="c1">';
        domStr += '<div class="icon_fail"></div>';
        domStr += '<p class="p1">很抱歉，网络走丢了~</p>';
        domStr += '<p class="p2">请刷新试试</p>';
        domStr += '</div>';
        domStr += '<div class="btn" onclick="window.location.reload()">刷新</div>';
        domStr += '</div>';
        domStr += '</div>';
        $("body").append(domStr);
    },

}


/**
 * cache
 */
var Local = {
    get: function (key) {
        if (key) return JSON.parse(ls.getItem(key))
        return null
    },
    set: function (key, val) {
        var setting = arguments[0]
        if (Object.prototype.toString.call(setting).slice(8, -1) === 'Object') {
            for (var i in setting) {
                ls.setItem(i, JSON.stringify(setting[i]))
            }
        } else {
            ls.setItem(key, JSON.stringify(val))
        }
    },
    remove: function (key) {
        ls.removeItem(key)
    },
    clear: function () {
        ls.clear()
    }
};

/**
 * ajax
 */
var BaseAjax = {
    //*****************
    get: function (arg) {
        $.ajax({
            type: "GET",
            url: arg.url || "",
            data: arg.data || "",
            async: (arg.async != undefined || arg.async != null) ? Boolean(arg.async) : true,
            Headers: {
                'Accept': 'application/json',
            },
            beforeSend: function () {
            },
            success: function (data) {
                arg.success && arg.success(data);
            },
            error: function (err) {
                ("获取数据失败，请查看网络连接！！");
                Utils.noInterNet();
                arg.error && arg.error(err);
            },
            complete: function (XMLHttpRequest, textStatus) {
                arg.complete && arg.complete()
            }
        });
    },
    post: function (arg) {
        $.ajax({
            type: "POST",
            url: arg.url || "",
            data: arg.data || "",
            Headers: {
                'Accept': 'application/json',
            },
            async: (arg.async != undefined && arg.async != null) ? Boolean(arg.async) : true,
            dataType: "json", //"xml", "html", "script", "json", "jsonp", "text".
            processData: (arg.processData != undefined && arg.processData != null) ? Boolean(arg.processData) : true,
            cache: (arg.cache != undefined && arg.cache != null) ? Boolean(arg.cache) : true,
            beforeSend: function () {
            },
            success: function (data) {
                arg.success && arg.success(data);
            },
            error: function (err) {
                alert("获取数据失败，请查看网络连接！！");
                Utils.noInterNet();
                arg.error && arg.error(err);
            },
            complete: function (XMLHttpRequest, textStatus) {
                arg.complete && arg.complete()
            }
        });
    }
}

Utils.noTouchtime(120);

Utils.checkNetStatus(window, "offline", function () {
    if (!window.alertCancel) Utils.noInterNet();
    window.sessionStorage.last_href = window.location.href;
});

Utils.checkNetStatus(window, "online", function () {
    // alert("重新上线");
    if (window.sessionStorage.last_href) window.location.href = window.sessionStorage.last_href;
})


var lastTouchEnd = 0;
document.documentElement.addEventListener("touchstart", function () {
    lastTouchEnd = Date.now();
});
document.documentElement.addEventListener("touchend", function (event) {
        var now = Date.now();
        if (now - lastTouchEnd <= 100) {
            event.preventDefault();
        }
        lastTouchEnd = now;
    },
    false
);
// 禁用鼠标右键、文字选中、多指
document.oncontextmenu = new Function("event.returnValue=false;");
document.onselectstart = new Function("event.returnValue=false;");
document.documentElement.addEventListener("touchstart", function (event) {
        if (event.touches.length > 1) {
            event.preventDefault();
        }
    },
    false
);


if (!Utils.isMobile()) {
    //禁用双指缩放
    window.addEventListener("touchmove", function (event) {
        if (event.scale !== 1) {
            event.preventDefault();
        }
    }, {passive: false});
}