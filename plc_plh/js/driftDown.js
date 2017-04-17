/**
 * Created by Ket on 2015/12/22.
 * var driftDown = $(document).driftDown($('.game'),{
				minSpeed: 5,
				maxSpeed: 10,
				minScale:0.5,
				maxScale:1,
				minOpacity: 1,
				maxOpacity: 1,
				count: 10,
				image: 'images/moneey.png'
			});
 */
(function($){
    var defaults = {
        minSpeed: 5,
        maxSpeed: 10,
        minScale:0.5,
        maxScale:1,
        minOpacity: 1,
        maxOpacity: 1,
        count: 10,
        image: 'images/lw_2.png'
    };
    $.fn.driftDown = function(elem, options){
        var settings = $.extend({}, defaults, options);
        var Width = window.innerWidth;
        var Height = window.innerHeight;
        var existcount = 0;
        create();
        function create(){
            if(existcount > settings.count) {
                setTimeout(function(){create();},settings.maxSpeed*1000);
                return;
            }
            existcount++;
            var lef = createRandom(1,0,Width)[0] +'px';
            var top = -100 +'px';
            var scale = createRandom(1,settings.minScale*10,settings.maxScale*10)[0]/10;
            var Opacity = createRandom(1,settings.minOpacity*10,settings.maxOpacity*10)[0]/10;
            var Speed = createRandom(1,settings.minSpeed,settings.maxSpeed)[0];
            var img = $('<img src="' +
            settings.image +
            '" style="position: absolute; left: ' +
            lef +
            '; top: ' +
            top +
            ';  -webkit-transform: scale(' +
            scale +
            ');transform: scale(' +
            scale +
            '); opacity:' +
            Opacity +
            '">').appendTo(elem);
            img.animate({'top':Height},Speed*1000, function(){
                img.remove();
                existcount--;
            })
            setTimeout(function(){create();},800);
        }

        function createRandom(num , from , to){
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
        }
    }

})(window.jQuery || window.Zepto);