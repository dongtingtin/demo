/**
 * Created by Ket on 2015/12/22.
 woDriftDown.init($('.Dlg_1'),{
				minSpeed: 5,
				maxSpeed: 10,
				minScale: 0.7,
				maxScale: 1,
				minOpacity: 1,
				maxOpacity: 1,
				count: 15,
				image: ['images/p1-2.png']
			});
 woDriftDown.statr();
 */

var woDriftDown={
    defaults:{minSpeed: 5,
        maxSpeed: 10,
        minScale:0.5,
        maxScale:1,
        minOpacity: 1,
        maxOpacity: 1,
        count: 10,
        image: ['images/lw_2.png']},
    settings:null,
    isStop:false,
    existcount:0,
    Width:0,
    Height:0,
    elem:null,
    init:function(elem,options){
        this.settings = $.extend({}, this.defaults, options);
        this.elem = elem;
        this.Width = window.innerWidth;
        this.Height = window.innerHeight;
    },
    create:function(){
        if(this.isStop) return;
        if(this.existcount > this.settings.count) {
            setTimeout(function(){woDriftDown.create();},(this.existcount- this.settings.count)*1000);
            return;
        }
        this.existcount++;
        
        var lef = this.createRandom(1,0,this.Width)[0] +'px';
        var top = -100 +'px';
        var scale = this.createRandom(1,this.settings.minScale*10,this.settings.maxScale*10)[0]/10;
        var Opacity = this.createRandom(1,this.settings.minOpacity*10,this.settings.maxOpacity*10)[0]/10;
        var Speed = this.createRandom(1,this.settings.minSpeed,this.settings.maxSpeed)[0];
        var srcimg = this.createRandom(1,0,this.settings.image.length)[0];
        var img = $('<img src="' +
        this.settings.image[srcimg] +
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
        '">').appendTo(this.elem);
        img.animate({'top':this.Height},Speed*1000, function(){
            img.remove();
            woDriftDown.existcount--;
        })
        setTimeout(function(){woDriftDown.create();},800);
    },
    stop:function(){
        this.isStop = true;
    },
    statr:function(){
        this.isStop = false;
        this.create();
    },
    createRandom:function(num , from , to){
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
};
