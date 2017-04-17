/**
 * Created by Ket on 2016/1/14.
 */
function log( str){
    console.log(str);
}
window.scroll = {
    version: '1.0.0'
};
(function($){
    scroll.slider = function(elem, opts,ispaly){
        var index = 1;
        var list = elem.find('img').length;
        var indeximg = null;
        var l_scrrollleft= null;
        var l_center= null;
        var l_scrrollright= null;
        var r_scrrollleft= null;
        var r_center= null;
        var r_scrrollright= null;
        elem.find('img').addClass('wo-scrroll').each(function(index, domEle){
            if(index == 0){
                $(domEle).show().addClass('wo-scrrollleft');
            }else if(index == 1){
                $(domEle).show().addClass('wo-center');
            }else if(index == 2){
                $(domEle).show().addClass('wo-scrrollright');
            }
        });
        var zero={};
        elem[0].addEventListener("touchstart",  function(event){
            zero[0] = event.changedTouches[0].clientX;
            zero[1] = event.changedTouches[0].clientY;
        }, false);
        elem[0].addEventListener("touchend",  function(event){
            zero[2] = event.changedTouches[0].clientX;
            zero[3] = event.changedTouches[0].clientY;
            scrolltouch(zero[0],zero[1],zero[2],zero[3]);
        }, false)
        elem[0].addEventListener("touchmove",  function(event){
            event.preventDefault(); //阻止滚动
        }, false)
        var isMove = true;
        function scrolltouch(x1,y1,x2,y2){
            if(!isMove) return;
            var scroll = scrollDirection(x1,x2,y1,y2);
            isMove = false;
            l_scrrollleft= null;
            l_center= null;
            l_scrrollright= null;
            r_scrrollleft= null;
            r_center= null;
            r_scrrollright= null;

            switch(scroll) {
                case "Left":
                    moveLeft('left');
                    chage();
                    return;
                case "Right":
                    moveRight();
                    chage();
                    return;
                default :
                    break;
            }
        }
        function scrollDirection(x1, x2, y1, y2){
             if(x1 - x2 > 30)
                 return 'Left';
             else if(x2 - x1 > 30)
                 return 'Right';
             else
                 return 'null';
        }
        function moveLeft(info){
            l_scrrollleft   = elem.find('.wo-scrrollleft');
            l_center = elem.find('.wo-center')
            l_scrrollright = elem.find('.wo-scrrollright');
            var imgElem = elem.find('img');
            index = index+1;
            if(index>=imgElem.length)index = 0;
            log("Left:"+info)
            var page = index+1
            if(page>(imgElem.length-1)) page = page - imgElem.length;
            indeximg = imgElem.get(page);
            l_center.addClass('anime-left');
            l_scrrollright.addClass('anime-center wo-center')
            setTimeout(function(){
                l_center.removeClass('anime-left wo-center');
                l_center.addClass('wo-scrrollleft');

                l_scrrollright.removeClass('anime-center wo-scrrollright');
                $(indeximg).show().addClass('wo-scrrollright');
                isMove = true;
            },600);

            //l_center.addClass('anime-left').on('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',function(){
            //    if(l_center == null) return;
            //
            //});
            //l_scrrollright.addClass('anime-center wo-center').on('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',function(){
            //    if(l_scrrollright == null) return;
            //
            //});
            l_scrrollleft.removeClass('wo-scrrollleft').hide();
        }
        function moveRight(){
            r_scrrollleft   = elem.find('.wo-scrrollleft');
            r_center = elem.find('.wo-center')
            r_scrrollright = elem.find('.wo-scrrollright');
            var imgElem = elem.find('img');
            index = index-1;
            if(index<0)index = imgElem.length-1;
            log("Right:"+index)
            var page = index-1;
            if(page<0) page = imgElem.length+page;
            indeximg = imgElem.get(page);
            r_center.addClass('anime-right wo-index');
            r_scrrollleft.addClass('anime-center wo-center');
            setTimeout(function(){
                r_center.removeClass('anime-right wo-center wo-index');
                r_center.addClass('wo-scrrollright');
                r_scrrollleft.removeClass('anime-center wo-scrrollleft');
                $(indeximg).show().addClass('wo-scrrollleft');
                //log('Right');
                isMove = true;

            },600);
            r_scrrollright.removeClass('wo-scrrollright').hide();
            //r_center.addClass('anime-right wo-index').on('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',function(){
            //    if(r_center == null) return;
            //    r_center.removeClass('anime-right wo-center wo-index');
            //    r_center.addClass('wo-scrrollright');
            //    log('Right');
            //});
            //r_scrrollleft.addClass('anime-center wo-center').on('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',function(){
            //    if(r_scrrollleft == null) return;
            //    r_scrrollleft.removeClass('anime-center wo-scrrollleft');
            //    $(indeximg).show().addClass('wo-scrrollleft');
            //    log('Right');
            //    isMove = true;
            //});

        }

        if(opts==true){
            var html = '<div class="li-dian center"> <ul> ';
            for(var i=0; i< list; i++){
                html = html+'<li></li>';
            }
            html=html+'</ul> </div>'
            $(html).appendTo(elem);
            $('.li-dian').width(list*20)
            chage();
        }
        if(ispaly == true){
            scrollPaly();
        }
        function scrollPaly(){
            isMove = false;
            moveLeft('auto');
            chage();
            setTimeout(function(){scrollPaly()},2000);
        }
        function chage(){
            $('.li-dian').find('ul li').each(function(i, domEle){
                $(domEle).removeClass('ling')
                if(i == index) {
                    $(domEle).addClass('ling')
                }
            });
        }
    };
})(window.jQuery || window.Zepto);