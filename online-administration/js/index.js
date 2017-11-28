function Index() {
    if (!(this instanceof Index)) {
        return new Index();
    }
    this.init();
}
Index.prototype = {
    init: function () {
        var _this = this;

        _this.render();
        _this.handle();
    },
    render: function() {
        var _this = this;

        $.request('getMenuList',{ type: 'banner' },function(res) {
            $.render('tpl-banner',res,function(_html) {
                $('.j-owl').append(_html);
                _this.owlInit();
            })
        })

        $.request('getMenuList',{ type: 'cate' },function(res) {
            $.render('tpl-cate',res,function(_html) {
                $('.menu-wrap').append(_html);
                _this.owlInit();
            })
        })

        $.request('getMenuList',{ type: 'app' },function(res) {
            $.render('tpl-app',res,function(_html) {
                $('.block-wrap').append(_html);
                _this.owlInit();
            })
        })

        $.request('getNewsList',{ },function(res) {
            $.render('tpl-news',res,function(_html) {
                $('.j-news-wrap').append(_html);
                _this.owlInit();
            })
        })

    },
    handle: function() {
        var _this = this;

    },
    owlInit: function() {
        if ($(".j-owl").find('a').size() > 1) {
            $(".j-owl").owlCarousel({
                items: 1,
                loop: true,
                autoplay: true,
                autoplayTimeout: 3000,
                //autoHeight: true
            });
        }

    }
};
$(function() {
    new Index();
})