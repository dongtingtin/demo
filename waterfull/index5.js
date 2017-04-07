$(function() {
    var loadedNum = 0;
    var columns = $('.waterfull .bigDiv').toArray().length;
    var timmer;

    function loadData() {
        $.ajax('data.json', {

            method: 'GET',
            success: function(rtn) {
                rtn.forEach(function(url) {
                    loadImage(url);
                });
            }
        });
    }

    function loadImage(url) {

        var addToColumn = loadedNum % columns;
        $($('.waterfull .bigDiv').get(addToColumn)).append(
            `<div class=box>
                <img src="${url}">
                <span>站长图片</span>
            </div>`
        );
        loadedNum++;
    }
    loadData();
    $(window).scroll(function() {
        var documentBottm = $(window).height() + $(document).scrollTop();
        var documentHeight = $(document).height();
        if (documentBottm > documentHeight - 200) {
            clearTimeout(timmer);
            timmer = setTimeout(function() {
                loadData();
            }, 1000);
        }
    });
});