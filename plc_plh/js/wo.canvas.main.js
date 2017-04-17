function log( str){
    console.log(str);
}

(function($){
    Lottery = function(elem, opts, Callback){
        this.options = $.extend({
            cavsWidth:640,
            cavsHeight:960,
            canvas_url:'',
            coverType:'image',//现在只支持image
            leftpx:0,
            toppx:0
        }, opts);
        this.element = $(elem);
        this.conNode = node;

        this.background = null;
        this.backCtx = null;

        this.mask = null;
        this.maskCtx = null;

        this.lottery = null;
        this.lotteryType = 'image';

        this.cover = cover || "#000";
        this.coverType = coverType;
        this.pixlesData = null;


        this.lastPosition = null;
        this.drawPercentCallback = Callback;
        this.vail = false;

    }
    Lottery.prototype ={
        createElement: function(tagName, attributes) {
            var ele = document.createElement(tagName);
            for (var key in attributes) {
                ele.setAttribute(key, attributes[key]);
            }
            return ele;
        },

        getTransparentPercent: function(ctx, width, height) {
            var imgData = ctx.getImageData(0, 0, width, height),
                pixles = imgData.data,
                transPixs = [];

            for (var i = 0, j = pixles.length; i < j; i += 4) {
                var a = pixles[i + 3];
                if (a < 128) {
                    transPixs.push(i);
                }
            }
            return (transPixs.length / (pixles.length / 4) * 100).toFixed(2);
        },

        resizeCanvas: function(canvas, width, height) {
            canvas.width = width;
            canvas.height = height;
            canvas.getContext('2d').clearRect(0, 0, width, height);
        },

        resizeCanvas_w: function(canvas, width, height) {
            canvas.width = width;
            canvas.height = height;
            canvas.getContext('2d').clearRect(0, 0, width, height);

            if (this.vail) this.drawLottery();
            else this.drawMask();
        },

        drawPoint: function(x, y, fresh) {
            log(x+','+y+',')
            y=y-this.toppx;
            x=x-this.leftpx;
            this.maskCtx.beginPath();
            this.maskCtx.arc(x, y, 20, 0, Math.PI * 2);
            this.maskCtx.fill();

            this.maskCtx.beginPath();

            this.maskCtx.lineWidth = 40;
            this.maskCtx.lineCap = this.maskCtx.lineJoin = 'round';

            if (this.lastPosition) {
                //log(this.lastPosition[0]+'----'+this.lastPosition[1])
                this.maskCtx.moveTo(this.lastPosition[0], this.lastPosition[1]);
            }
            this.maskCtx.lineTo(x, y);
            this.maskCtx.stroke();

            this.lastPosition = [x, y];
            //log(this.lastPosition[0]+'???'+this.lastPosition[1])

            this.mask.style.zIndex = (this.mask.style.zIndex == 20) ? 21 : 20;
        },

        bindEvent: function() {
            var _this = this;
            var device = (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase()));
            var clickEvtName = device ? 'touchstart' : 'mousedown';
            var moveEvtName = device ? 'touchmove' : 'mousemove';
            if (!device) {
                var isMouseDown = false;
                _this.conNode.addEventListener('mouseup', function(e) {
                    e.preventDefault();

                    isMouseDown = false;
                    var per = _this.getTransparentPercent(_this.maskCtx, _this.width, _this.height);

                    if (per >= 80) {//在大于等于80%的时候调用回调函数
                        if (typeof(_this.drawPercentCallback) == 'function') _this.drawPercentCallback();
                    }
                }, false);
            } else {
                _this.conNode.addEventListener("touchmove", function(e) {
                    if (isMouseDown) {
                        e.preventDefault();
                    }
                    if (e.cancelable) {
                        e.preventDefault();
                    } else {
                        window.event.returnValue = false;
                    }
                }, false);
                _this.conNode.addEventListener('touchend', function(e) {
                    isMouseDown = false;
                    var per = _this.getTransparentPercent(_this.maskCtx, _this.width, _this.height);
                    if (per >= 80) {//在大于等于80%的时候调用回调函数
                        if (typeof(_this.drawPercentCallback) == 'function') _this.drawPercentCallback();
                    }
                }, false);
            }

            this.mask.addEventListener(clickEvtName, function(e) {
                e.preventDefault();

                isMouseDown = true;

                var x = (device ? e.touches[0].pageX : e.pageX || e.x);
                var y = (device ? e.touches[0].pageY : e.pageY || e.y);

                _this.drawPoint(x, y, isMouseDown);
            }, false);

            this.mask.addEventListener(moveEvtName, function(e) {
                e.preventDefault();

                if (!isMouseDown) return false;
                e.preventDefault();

                var x = (device ? e.touches[0].pageX : e.pageX || e.x);
                var y = (device ? e.touches[0].pageY : e.pageY || e.y);

                _this.drawPoint(x, y, isMouseDown);
            }, false);
        },

        drawLottery: function() {
            if (this.lotteryType == 'image') {
                var image = new Image(),
                    _this = this;
                image.onload = function() {
                    this.width = _this.width;
                    this.height = _this.height;
                    _this.resizeCanvas(_this.background, _this.width, _this.height);
                    _this.backCtx.drawImage(this, 0, 0, _this.width, _this.height);
                    _this.drawMask();
                }
                image.src = this.lottery;
            } else if (this.lotteryType == 'text') {
                this.width = this.width;
                this.height = this.height;
                this.resizeCanvas(this.background, this.width, this.height);
                this.backCtx.save();
                this.backCtx.fillStyle = '#FFF';
                this.backCtx.fillRect(0, 0, this.width, this.height);
                this.backCtx.restore();
                this.backCtx.save();
                var fontSize = 30;
                this.backCtx.font = 'Bold ' + fontSize + 'px Arial';
                this.backCtx.textAlign = 'center';
                this.backCtx.fillStyle = '#F60';
                this.backCtx.fillText(this.lottery, this.width / 2, this.height / 2 + fontSize / 2);
                this.backCtx.restore();
                this.drawMask();
            }
        },

        drawMask: function() {
            if (this.coverType == 'color') {
                this.maskCtx.fillStyle = this.cover;
                this.maskCtx.fillRect(0, 0, this.width, this.height);
                this.maskCtx.globalCompositeOperation = 'destination-out';
            } else if (this.coverType == 'image') {
                var image = new Image(),
                    _this = this;
                image.onload = function() {
                    _this.resizeCanvas(_this.mask, _this.width, _this.height);

                    var android = (/android/i.test(navigator.userAgent.toLowerCase()));

                    _this.maskCtx.globalAlpha = 1;//上面一层的透明度，1为不透明
                    _this.maskCtx.drawImage(this, 0, 0, this.width, this.height, 0, 0, _this.width, _this.height);

                    _this.maskCtx.globalCompositeOperation = 'destination-out';
                }
                image.src = this.cover;
            }
        },

        init: function(lottery, lotteryType) {
            if (lottery) {
                this.lottery = lottery;
                this.lottery.width = this.width;
                this.lottery.height = this.height;
                this.lotteryType = lotteryType || 'image';

                this.vail = true;
            }
            if (this.vail) {
                this.background = this.background || this.createElement('canvas', {
                    style: 'position:fixed;' + 'top:' + this.toppx + 'px;left:' + this.leftpx + 'px;background-color:transparent;'
                });
            }

            this.mask = this.mask || this.createElement('canvas', {
                style: 'position:fixed;' + 'top:' + this.toppx + 'px;left:' + this.leftpx + 'px;background-color:transparent;'
            });
            this.mask.style.zIndex = 20;

            if (!this.conNode.innerHTML.replace(/[\w\W]| /g, '')) {
                if (this.vail) this.conNode.appendChild(this.background);
                this.conNode.appendChild(this.mask);
                this.bindEvent();
            }
            if (this.vail) this.backCtx = this.backCtx || this.background.getContext('2d');
            this.maskCtx = this.maskCtx || this.mask.getContext('2d');

            if (this.vail) this.drawLottery();
            else this.drawMask();

            var _this = this;
            window.addEventListener('resize', function() {
                _this.width = document.documentElement.clientWidth;
                _this.height = document.documentElement.clientHeight;

                _this.resizeCanvas_w(_this.mask, _this.width, _this.height);
            }, false);

        }
    }
})(window.jQuery || window.Zepto);

function Lottery(node, cover, coverType, width, height, leftpx, toppx, drawPercentCallback) {
//node：canvas的id，cover：上面一层的图片地址，coverType：'image'or'color'，width：canvas宽, height：canvas高, drawPercentCallback：回调函数
//canvas
    this.conNode = node;

    this.background = null;
    this.backCtx = null;

    this.mask = null;
    this.maskCtx = null;

    this.lottery = null;
    this.lotteryType = 'image';

    this.cover = cover || "#000";
    this.coverType = coverType;
    this.pixlesData = null;

    this.width = width;
    this.height = height;

    this.leftpx = leftpx;
    this.toppx = toppx;

    this.lastPosition = null;
    this.drawPercentCallback = drawPercentCallback;

    this.vail = false;
}

Lottery.prototype = {
    createElement: function(tagName, attributes) {
        var ele = document.createElement(tagName);
        for (var key in attributes) {
            ele.setAttribute(key, attributes[key]);
        }
        return ele;
    },

    getTransparentPercent: function(ctx, width, height) {
        var imgData = ctx.getImageData(0, 0, width, height),
            pixles = imgData.data,
            transPixs = [];

        for (var i = 0, j = pixles.length; i < j; i += 4) {
            var a = pixles[i + 3];
            if (a < 128) {
                transPixs.push(i);
            }
        }
        return (transPixs.length / (pixles.length / 4) * 100).toFixed(2);
    },

    resizeCanvas: function(canvas, width, height) {
        canvas.width = width;
        canvas.height = height;
        canvas.getContext('2d').clearRect(0, 0, width, height);
    },

    resizeCanvas_w: function(canvas, width, height) {
        canvas.width = width;
        canvas.height = height;
        canvas.getContext('2d').clearRect(0, 0, width, height);

        if (this.vail) this.drawLottery();
        else this.drawMask();
    },

    drawPoint: function(x, y, fresh) {
        log(x+','+y+',')
        y=y-this.toppx;
        x=x-this.leftpx;
        this.maskCtx.beginPath();
        this.maskCtx.arc(x, y, 20, 0, Math.PI * 2);
        this.maskCtx.fill();

        this.maskCtx.beginPath();

        this.maskCtx.lineWidth = 40;
        this.maskCtx.lineCap = this.maskCtx.lineJoin = 'round';

        if (this.lastPosition) {
            //log(this.lastPosition[0]+'----'+this.lastPosition[1])
            this.maskCtx.moveTo(this.lastPosition[0], this.lastPosition[1]);
        }
        this.maskCtx.lineTo(x, y);
        this.maskCtx.stroke();

        this.lastPosition = [x, y];
        //log(this.lastPosition[0]+'???'+this.lastPosition[1])

        this.mask.style.zIndex = (this.mask.style.zIndex == 20) ? 21 : 20;
    },

    bindEvent: function() {
        var _this = this;
        var device = (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase()));
        var clickEvtName = device ? 'touchstart' : 'mousedown';
        var moveEvtName = device ? 'touchmove' : 'mousemove';
        if (!device) {
            var isMouseDown = false;
            _this.conNode.addEventListener('mouseup', function(e) {
                e.preventDefault();

                isMouseDown = false;
                var per = _this.getTransparentPercent(_this.maskCtx, _this.width, _this.height);

                if (per >= 80) {//在大于等于80%的时候调用回调函数
                    if (typeof(_this.drawPercentCallback) == 'function') _this.drawPercentCallback();
                }
            }, false);
        } else {
            _this.conNode.addEventListener("touchmove", function(e) {
                if (isMouseDown) {
                    e.preventDefault();
                }
                if (e.cancelable) {
                    e.preventDefault();
                } else {
                    window.event.returnValue = false;
                }
            }, false);
            _this.conNode.addEventListener('touchend', function(e) {
                isMouseDown = false;
                var per = _this.getTransparentPercent(_this.maskCtx, _this.width, _this.height);
                if (per >= 80) {//在大于等于80%的时候调用回调函数
                    if (typeof(_this.drawPercentCallback) == 'function') _this.drawPercentCallback();
                }
            }, false);
        }

        this.mask.addEventListener(clickEvtName, function(e) {
            e.preventDefault();

            isMouseDown = true;

            var x = (device ? e.touches[0].pageX : e.pageX || e.x);
            var y = (device ? e.touches[0].pageY : e.pageY || e.y);

            _this.drawPoint(x, y, isMouseDown);
        }, false);

        this.mask.addEventListener(moveEvtName, function(e) {
            e.preventDefault();

            if (!isMouseDown) return false;
            e.preventDefault();

            var x = (device ? e.touches[0].pageX : e.pageX || e.x);
            var y = (device ? e.touches[0].pageY : e.pageY || e.y);

            _this.drawPoint(x, y, isMouseDown);
        }, false);
    },

    drawLottery: function() {
        if (this.lotteryType == 'image') {
            var image = new Image(),
                _this = this;
            image.onload = function() {
                this.width = _this.width;
                this.height = _this.height;
                _this.resizeCanvas(_this.background, _this.width, _this.height);
                _this.backCtx.drawImage(this, 0, 0, _this.width, _this.height);
                _this.drawMask();
            }
            image.src = this.lottery;
        } else if (this.lotteryType == 'text') {
            this.width = this.width;
            this.height = this.height;
            this.resizeCanvas(this.background, this.width, this.height);
            this.backCtx.save();
            this.backCtx.fillStyle = '#FFF';
            this.backCtx.fillRect(0, 0, this.width, this.height);
            this.backCtx.restore();
            this.backCtx.save();
            var fontSize = 30;
            this.backCtx.font = 'Bold ' + fontSize + 'px Arial';
            this.backCtx.textAlign = 'center';
            this.backCtx.fillStyle = '#F60';
            this.backCtx.fillText(this.lottery, this.width / 2, this.height / 2 + fontSize / 2);
            this.backCtx.restore();
            this.drawMask();
        }
    },

    drawMask: function() {
        if (this.coverType == 'color') {
            this.maskCtx.fillStyle = this.cover;
            this.maskCtx.fillRect(0, 0, this.width, this.height);
            this.maskCtx.globalCompositeOperation = 'destination-out';
        } else if (this.coverType == 'image') {
            var image = new Image(),
                _this = this;
            image.onload = function() {
                _this.resizeCanvas(_this.mask, _this.width, _this.height);

                var android = (/android/i.test(navigator.userAgent.toLowerCase()));

                _this.maskCtx.globalAlpha = 1;//上面一层的透明度，1为不透明
                _this.maskCtx.drawImage(this, 0, 0, this.width, this.height, 0, 0, _this.width, _this.height);

                _this.maskCtx.globalCompositeOperation = 'destination-out';
            }
            image.src = this.cover;
        }
    },

    init: function(lottery, lotteryType) {
        if (lottery) {
            this.lottery = lottery;
            this.lottery.width = this.width;
            this.lottery.height = this.height;
            this.lotteryType = lotteryType || 'image';

            this.vail = true;
        }
        if (this.vail) {
            this.background = this.background || this.createElement('canvas', {
                style: 'position:fixed;' + 'top:' + this.toppx + 'px;left:' + this.leftpx + 'px;background-color:transparent;'
            });
        }

        this.mask = this.mask || this.createElement('canvas', {
            style: 'position:fixed;' + 'top:' + this.toppx + 'px;left:' + this.leftpx + 'px;background-color:transparent;'
        });
        this.mask.style.zIndex = 20;

        if (!this.conNode.innerHTML.replace(/[\w\W]| /g, '')) {
            if (this.vail) this.conNode.appendChild(this.background);
            this.conNode.appendChild(this.mask);
            this.bindEvent();
        }
        if (this.vail) this.backCtx = this.backCtx || this.background.getContext('2d');
        this.maskCtx = this.maskCtx || this.mask.getContext('2d');

        if (this.vail) this.drawLottery();
        else this.drawMask();

        var _this = this;
        window.addEventListener('resize', function() {
            _this.width = document.documentElement.clientWidth;
            _this.height = document.documentElement.clientHeight;

            _this.resizeCanvas_w(_this.mask, _this.width, _this.height);
        }, false);

    },
    drawImgae:function(number,zi){
        return;
        _this = this;
        var post_0=[226,288,226,290,222,302,220,304,220,306,220,308,218,310,204,312,202,310,200,308,198,306,194,304,194,302,192,300,192,298,190,298,192,280,194,278,196,278,196,276,198,276,200,274,202,272,204,270,206,268,208,266,210,266,212,264,214,264,216,264,218,264,220,264,222,264,224,264,226,264,228,264,230,264,232,264,234,264,236,262,238,262,240,262,242,262,244,262,246,260,248,260,250,260,252,260,254,260,256,260,258,260,260,260,262,260,264,260,266,260,268,260,270,260,270,262,272,262,274,264,276,266,276,268,276,272,276,274,276,276,276,278,276,280,276,282,276,284,276,286,276,288,276,290,276,292,274,294,274,296,272,298,270,300,268,302,266,302,264,304,262,306,262,308,258,308,258,310,256,312,256,314,254,318,254,320,254,322,254,324,250,328,248,328,246,332,244,332,242,334,242,336,242,338,240,338,240,340,240,342,238,344,236,346,234,346,234,348,232,348,232,350,230,352,228,352,228,354,226,354,224,354,222,354,220,354,218,354,216,354,214,354,212,354,210,356,208,356,206,356,204,356,202,358,200,358,198,358,196,358,194,360,192,362,190,364,188,366,186,368,186,370,186,372,182,374,180,376,178,378,176,380,174,380,172,380,170,382,168,384,166,384,164,384,162,384,162,386,160,386,160,388,156,390,156,392,154,392,152,394,152,396,150,396,148,396,144,398,144,400,142,400,140,400,140,402,138,404,136,406,134,408,134,410,132,412,132,414,130,416,128,418,128,420,128,422,128,424,128,426,126,428,126,430,126,432,124,434,124,436,124,438,122,440,122,442,122,444,124,448,126,450,128,452,130,454,134,454,136,456,140,456,142,456,146,456,148,456,152,456,154,456,158,456,160,456,164,456,166,456,170,456,172,456,176,456,178,456,180,456,182,456,184,456,186,456,188,456,194,454,196,454,198,452,200,450,202,450,204,450,206,448,208,448,210,448,212,448,214,446,216,444,218,444,220,444,222,444,226,444,228,442,230,442,232,442,234,442,238,440,240,440,242,438,244,438,244,436,246,436,246,434,248,434,250,434,252,434,254,434,254,432,256,432,260,430,262,430,264,430,266,430,268,428,270,428,272,428,274,428,276,428,278,428,280,426,282,426,284,426,288,424,290,424,292,424,296,424,298,424,300,422,302,422,304,422,306,422,308,422,310,422,312,422,314,422,314,420,316,420,318,420,320,420,322,418,324,418,326,418,328,418,328,416,330,416,332,416,334,416,336,416,338,416,340,416,342,416,344,416,346,416,348,416,350,416,352,416,352,414,354,414,356,414,358,414,360,414,362,414,364,414,366,414,368,414,370,416,372,416,374,416,378,416,380,416,384,416];
        switch(zi){
            case 0:
                break;
            case 1:
                break
            case 2:
                break
            case 3:
                break
        }
        if(post_0>= post.length) {
            this.lastPosition = null;
            setTimeout(function(){
                _this.drawImgae(0,1);
            },10);
            return;
        }else{
            this.drawPoint(post_0[number],post_0[number+1],true);
        }

        setTimeout(function(){
            _this.drawImgae(number+2);
        },10);
    }

}