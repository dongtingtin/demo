/**
 * Created by Ket on 2016/1/8.
 */
function log( str){
    //console.log(str);
}
window.flux = {
    version: '1.0.0'
};
//tool
(function($){
    $.fn.initHead = function(){
        if(/Android (\d+\.\d+)/.test(navigator.userAgent)){
            var version = parseFloat(RegExp.$1);
            if(version>2.3){
                var phoneScale = parseInt(window.screen.width)/640;
                document.write('<meta name="viewport" content="width=640, minimum-scale = '+ phoneScale +', maximum-scale = '+ phoneScale +', target-densitydpi=device-dpi">');
            }else{
                document.write('<meta name="viewport" content="width=640, target-densitydpi=device-dpi">');
            }
        }else{
            document.write('<meta name="viewport" content="width=640, user-scalable=no, target-densitydpi=device-dpi">');
        }
    };
    $.fn.alert = function(title, isremain){
        var tip = $('<div class="comon"> ' +
        '<div class="xu_window" id="windowcenter"> ' +
        '<div id="title" class="wtitle">操作提示<span class="close" id="alertclose"></span></div> ' +
        '<div class="content"> <div id="txt">' +
        title+
        '</div> </div> </div></div>').appendTo($('body'));
        $("#windowcenter").slideToggle("slow");
        if(isremain == null || isremain == undefined || isremain == true){
            setTimeout(function(){
                $("#windowcenter").slideUp(500);
                setTimeout(function(){tip.remove() },500);
            },2000);
        }
        $("#alertclose").click(function () {
            $("#windowcenter").slideUp(500);
            setTimeout(function(){tip.remove() },500);
        });
    };
    $.fn.createRandom = function (num , from , to) {
        var arr=[];
        var json = {};
        var tmpTo = 0;
        if (num > to) {
            to = num;
        }
        while(arr.length<num) {
            var ranNum=Math.ceil(Math.random()*(to-from))+from -1;
            //通过判断json对象的索引值是否存在 来标记 是否重复
            if(!json[ranNum]) {
                json[ranNum]=1;
                arr.push(ranNum);
            }
        }
        return arr;
    };
    $.fn.getFaqUrlParam = function() {
        var url = location.search; //获取url中"?"符后的字串
        var theRequest = new Object();
        if (url.indexOf("?") != -1) {
            var str = url.substr(1);
            if (str.indexOf("&") != -1) {
                strs = str.split("&");
                for (var i = 0; i < strs.length; i++) {
                    theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
                }
            } else {
                var key = str.substring(0, str.indexOf("="));
                var value = str.substr(str.indexOf("=") + 1);
                theRequest[key] = decodeURI(value);
            }
        }
        return theRequest;
    };
    $(document).ready(function(){
        $('body')[0].addEventListener('touchmove',function(e){
            e.preventDefault();
        })
    })
    $(document).initHead();
})(window.jQuery || window.Zepto);

(function($){
    flux.slider = function(elem, opts){
        this.transitions = [];
        for(var fx in flux.transitions)
            this.transitions.push(fx);
        this.options = $.extend({
            hasArrow:true,
            hasLRArrow:false,
            hasMusic:true,
            transitions: this.transitions, //滑动方式 scale common cover
            autoplay: false,
            loop:false,
            music:"music/music.mp3",
            url:""
        }, opts);
        this.element = $(elem);
        if(this.options.hasArrow){
            this.addArrow();
        }
        if(this.options.hasMusic){
            this.addMusic();
        }
    };
    flux.slider.prototype = {
        start:function(transition){
            flux.transitions[transition].init(this, this.options);
            touch.addListener(transition);
            this.transitiontype = transition;
            var page = this.getPage();
            var id = '.page-'+page[0]+'-'+page[1]
            $(id).removeClass("hide");
            $(id).addClass('page-current');
            this.woAnimate($(id),'add');
        },
        stop:function(){
            touch.removeListener();
            //this.hideArrow();
        },
        woAnimate: function(o,method){
            var list = o.find(".animate");
            if(method == "remove"){
                list.each(function(){
                    var that = $(this);
                    that.removeClass(that.attr("animate-name"));
                })
            }else if(method == "add"){
                list.each(function(){
                    var that = $(this);
                    that.addClass(that.attr("animate-name"));
                });
            }
        },
        addMusic:function(){
            this.music = $('<div class="wo-music"> ' +
            '<img src="images/music-open.png" class="wo-btn-mopen" id="btn-music"> ' +
            '<audio src="music.mp3" id="music" preload="preload" loop="loop"></audio> ' +
            '</div>').appendTo($('body'));
            $('#music').attr('src', this.options.music);

            var ctrl = $("#btn-music"),
                playingClass = "wo-btn-mopen",
                music = document.getElementById("music");

            music.addEventListener("play", function () {
                ctrl.addClass("wo-btn-mopen");
            });

            music.addEventListener("pause", function () {
                ctrl.removeClass("btn-mopen");
            });
            $("#btn-music").bind("click",function(){
                if (music.paused) {
                    music.play();
                    ctrl.attr("src", "images/music-open.png");
                } else {
                    music.pause();
                    ctrl.attr("src", "images/music-close.png");
                }
            });
            document.addEventListener('DOMContentLoaded', function () {
                function audioAutoPlay() {
                    var audio = document.getElementById('music');
                    var audio = document.getElementById('music');
                    audio.play();
                    document.addEventListener("WeixinJSBridgeReady", function () {
                        audio.play();
                    }, false);
                }
                audioAutoPlay();
            });

        },
        addArrow:function(){
            this.arrow = $('<div class="wo-arrow" id="wo-arrow"> ' +
            '<img src="images/arrow.png" class="img"> ' +
            '</div>');
            this.arrow.appendTo($('body'));
        },
        hideArrow:function(){
            $("#wo-arrow").hide();
        },
        showArrow:function(){
            $("#wo-arrow").show();
        },
        getPage:function(){
            var cout =[];
            cout[0] = flux.transitions[this.transitiontype].upAndDown;
            cout[1] = flux.transitions[this.transitiontype].rightAndLeft;
            return cout;
        },
        setPage:function(upAndDown,rightAndLeft){
            var cout =[];
            cout[0] = flux.transitions[this.transitiontype].upAndDown;
            cout[1] = flux.transitions[this.transitiontype].rightAndLeft;
            var uppage = '.page-'+cout[0]+'-'+ cout[1];
            var newuppage = '.page-'+upAndDown+'-'+rightAndLeft;
            $(uppage).removeClass("page-current");
            $(uppage).addClass('hide');

            $(newuppage).removeClass("hide");
            $(newuppage).addClass('page-current');

            flux.transitions[this.transitiontype].upAndDown=parseInt(upAndDown);
            flux.transitions[this.transitiontype].rightAndLeft=parseInt(rightAndLeft);
            flux.slider.prototype.woAnimate($(uppage),'remove')
            flux.slider.prototype.woAnimate($(newuppage),'add')
        }
    };
    flux.transitions = {};
})(window.jQuery || window.Zepto);

//touch
(function($){
    touch = {
        zero :{},
        addListener: function(method){
            document.addEventListener("touchstart",  touch.handleTouchEvent, false);
            document.addEventListener("touchend", touch.handleTouchEvent, false);
            document.addEventListener("touchmove", touch.handleTouchEvent, false);
            this.slider = method;
        },
        removeListener:function(){
            document.removeEventListener("touchstart", touch.handleTouchEvent, false);
            document.removeEventListener("touchend", touch.handleTouchEvent, false);
            document.removeEventListener("touchmove", touch.handleTouchEvent, false);
        },
        handleTouchEvent:function(event) {
            switch (event.type) {
                case "touchstart":
                    touch.zero[0] = event.changedTouches[0].clientX;
                    touch.zero[1] = event.changedTouches[0].clientY;
                    break;
                case "touchend":
                    touch.zero[2] = event.changedTouches[0].clientX;
                    touch.zero[3] = event.changedTouches[0].clientY;
                    touch.swipetouch(touch.zero[0],touch.zero[1],touch.zero[2],touch.zero[3]);
                    break;
                case "touchmove":
                    event.preventDefault(); //阻止滚动
                    break;
            }
        },
        swipetouch:function(x1,y1,x2,y2){
            var swipe = touch.swipeDirection(x1,x2,y1,y2);
            switch(swipe){
                case "Left":
                    flux.transitions[this.slider].left();
                    if(this.LeftCallback != null && this.LeftCallback != undefined)
                        this.LeftCallback(flux.transitions[this.slider].upAndDown,flux.transitions[this.slider].rightAndLeft);
                    break;
                case "Right":
                    flux.transitions[this.slider].right();
                    if(this.RightCallback != null && this.RightCallback != undefined)
                        this.RightCallback(flux.transitions[this.slider].upAndDown,flux.transitions[this.slider].rightAndLeft);
                    break;
                case "Up":
                    flux.transitions[this.slider].up();
                    if(this.UpCallback != null && this.UpCallback != undefined)
                        this.UpCallback(flux.transitions[this.slider].upAndDown,flux.transitions[this.slider].rightAndLeft);
                    break;
                case "Down":
                    flux.transitions[this.slider].down();
                    if(this.DownCallback != null && this.DownCallback != undefined)
                        this.DownCallback(flux.transitions[this.slider].upAndDown,flux.transitions[this.slider].rightAndLeft);
                    break;
                default :break;
            }
        },
        swipeDirection:function(x1, x2, y1, y2) {
            if(Math.abs(x1 - x2) >= Math.abs(y1 - y2)){
                if(x1 - x2 > 30)
                    return 'Left';
                else if(x2 - x1 > 30)
                    return 'Right';
                else
                    return 'null';
            }else{
                if(y1 - y2 > 30)
                    return 'Up';
                else if(y2 - y1 > 30)
                    return 'Down';
                else
                    return 'null';
            }
        },
        swipeUpAndDown:function(callback){
            this.UpCallback = callback;
            this.DownCallback = callback;
        },
        swipeLeftAndRight:function(callback){
            this.LeftCallback = callback;
            this.RightCallback = callback;
        }
    }
})(window.jQuery || window.Zepto);

//common
(function($){
    flux.transitions.common = {
        ismove:true,
        init:function(_this, opts){
            this.slider = _this;
            this.opts = opts;
            this.pageSize = $('body').find(".page").size();
            this.upAndDown = 1;
            this. rightAndLeft = 1;
        },
        left:function(){
            log('left')
            if(!this.ismove) return;
            var nowPage = '.page-' + this.upAndDown +'-' + this.rightAndLeft;
            var nextPage = '.page-' + this.upAndDown +'-' + (this.rightAndLeft +1);
            if($(nextPage) == null || $(nextPage) == undefined || $(nextPage).length == 0){
                if(this.opts.url !='' && this.opts.url != false && this.opts.url !== null){
                    window.location.href = this.opts.url;
                }
                return;
            }
            this.pageMove($(nowPage),$(nextPage),'left');
            this.rightAndLeft ++;
        },
        right:function(){
            if(!this.ismove) return;
            log('right')
            var nowPage = '.page-' + this.upAndDown +'-' + this.rightAndLeft;
            var nextPage = '.page-' + this.upAndDown +'-' + (this.rightAndLeft -1);
            if(this.rightAndLeft <=1){
                return;
            }
            this.pageMove($(nowPage),$(nextPage),'right');
            this.rightAndLeft --;
        },
        up:function(){
            if(!this.ismove) return;
            log("up")
            if((this.upAndDown +1) == this.pageSize){
                if(!this.opts.loop) {
                    this.slider.hideArrow();
                }
            }
            var nowPage;
            var nextPage;
            if(this.upAndDown >= this.pageSize){
                if(this.opts.loop){
                    nowPage = '.page-' + this.upAndDown +'-' + this.rightAndLeft;
                    nextPage = '.page-' + 1 +'-' + 1;
                    this.upAndDown =0;
                    this.rightAndLeft=1;
                }else{
                    return;
                }
            }else{
                nowPage = '.page-' + this.upAndDown +'-' + this.rightAndLeft;
                nextPage = '.page-' + (this.upAndDown+1) +'-' + 1;
            }


            if($(nextPage) == null || $(nextPage) == undefined || $(nextPage).length == 0){
                if(this.opts.url !='' && this.opts.url != false && this.opts.url !== null){
                    window.location.href = this.opts.url;
                }

                return;
            }
            this.pageMove($(nowPage),$(nextPage),'up');
            this.upAndDown ++;
            this.rightAndLeft = 1;
        },
        down:function(){
            if(!this.ismove) return;
            log("down")
            var nowPage;
            var nextPage;
            if((this.upAndDown) == this.pageSize)
                this.slider.showArrow();
            if(this.upAndDown <= 1) {
                if(this.opts.loop){
                    nowPage = '.page-' + 1 +'-' + this.rightAndLeft;
                    nextPage = '.page-' + this.pageSize +'-' + 1;
                    this.upAndDown =this.pageSize+1;
                    this.rightAndLeft=1;
                }else{
                    return;
                }
            }else{
                nowPage = '.page-' + this.upAndDown +'-' + this.rightAndLeft;
                nextPage = '.page-' + (this.upAndDown-1) +'-' + 1;
            }

            this.pageMove($(nowPage),$(nextPage),'down');
            this.upAndDown --;
            this.rightAndLeft = 1;
        },
        pageMove:function(nowPage, nextPage, mode){
            var outClass =null,inClass =null;
            switch(mode) {
                case 'up':
                    outClass = 'pt-page-moveToTop';
                    inClass = 'pt-page-moveFromBottom';
                    break;
                case 'right':
                    outClass = 'pt-page-moveToRight';
                    inClass = 'pt-page-moveFromLeft';
                    break;
                case 'down':
                    outClass = 'pt-page-moveToBottom';
                    inClass = 'pt-page-moveFromTop';
                    break;
                case 'left':
                    outClass = 'pt-page-moveToLeft';
                    inClass = 'pt-page-moveFromRight';
                    break;
            }
            this.ismove = false;
            nextPage.removeClass("hide");
            nowPage.addClass(outClass).on('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',function(){
                nowPage.removeClass('page-current');
                nowPage.removeClass(outClass);
                nowPage.addClass("hide");
                flux.transitions.common.slider.woAnimate(nowPage,'remove');
            });
            nextPage.addClass(inClass).on('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',function(){
                nextPage.addClass('page-current');
                nextPage.removeClass(inClass);
                nextPage.removeClass("hide");
                flux.transitions.common.slider.woAnimate(nextPage,'add');
                flux.transitions.common.ismove = true;
            });
        }
    }


})(window.jQuery || window.Zepto);

//fadeout
(function($){
    flux.transitions.fadeout = {
        ismove:true,
        init:function(_this, opts){
            this.slider = _this;
            this.opts = opts;
            this.pageSize = $('body').find(".page").size();
            this.upAndDown = 1;
            this. rightAndLeft = 1;
        },
        left:function(){
            log('left')
            if(!this.ismove) return;
            var nowPage = '.page-' + this.upAndDown +'-' + this.rightAndLeft;
            var nextPage = '.page-' + this.upAndDown +'-' + (this.rightAndLeft +1);
            if($(nextPage) == null || $(nextPage) == undefined || $(nextPage).length == 0){
                if(this.opts.url !='' && this.opts.url != false && this.opts.url !== null){
                    window.location.href = this.opts.url;
                }
                return;
            }
            this.pageMove($(nowPage),$(nextPage),'left');
            this.rightAndLeft ++;
        },
        right:function(){
            log('right')
            if(!this.ismove) return;
            var nowPage = '.page-' + this.upAndDown +'-' + this.rightAndLeft;
            var nextPage = '.page-' + this.upAndDown +'-' + (this.rightAndLeft -1);
            if(this.rightAndLeft <=1){
                return;
            }
            this.pageMove($(nowPage),$(nextPage),'right');
            this.rightAndLeft --;
        },
        up:function(){
            log("up")
            if(!this.ismove) return;
            if((this.upAndDown +1) == this.pageSize)
                this.slider.hideArrow();
            if(this.upAndDown >= this.pageSize)
                return;

            var nowPage = '.page-' + this.upAndDown +'-' + this.rightAndLeft;
            var nextPage = '.page-' + (this.upAndDown+1) +'-' + 1;
            if($(nextPage) == null || $(nextPage) == undefined || $(nextPage).length == 0){
                if(this.opts.url !='' && this.opts.url != false && this.opts.url !== null){
                    window.location.href = this.opts.url;
                }
                return;
            }
            this.pageMove($(nowPage),$(nextPage),'up');
            this.upAndDown ++;
            this.rightAndLeft = 1;
        },
        down:function(){
            log("down")
            if(!this.ismove) return;
            if((this.upAndDown) == this.pageSize)
                $("#wo-arrow").show()
            if(this.upAndDown <= 1) return;

            var nowPage = '.page-' + this.upAndDown +'-' + this.rightAndLeft;
            var nextPage = '.page-' + (this.upAndDown-1) +'-' + 1;

            this.pageMove($(nowPage),$(nextPage),'down');
            this.upAndDown --;
            this.rightAndLeft = 1;
        },
        pageMove:function(nowPage, nextPage, mode){
            var outClass =null,inClass =null;
            switch(mode) {
                case 'up':
                    outClass = 'pt-page-fadeout';
                    inClass = 'pt-page-fadein';
                    break;
                case 'right':
                    outClass = 'pt-page-fadeout';
                    inClass = 'pt-page-fadein';
                    break;
                case 'down':
                    outClass = 'pt-page-fadeout';
                    inClass = 'pt-page-fadein';
                    break;
                case 'left':
                    outClass = 'pt-page-fadeout';
                    inClass = 'pt-page-fadein';;
                    break;
            }

            nextPage.removeClass("hide");
            nowPage.addClass(outClass);
            nextPage.addClass(inClass);

            setTimeout(function(){
                nowPage.removeClass('page-current');
                nowPage.removeClass(outClass);
                nowPage.addClass("hide");

                nextPage.addClass('page-current');
                nextPage.removeClass(inClass);
                nextPage.removeClass("hide");
                flux.transitions.fadeout.slider.woAnimate(nowPage,'remove')
            },1600);
            this.slider.woAnimate(nextPage,'add')
        }
    }


})(window.jQuery || window.Zepto);