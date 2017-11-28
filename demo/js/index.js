function Index() {
    if (!(this instanceof Index)) {
        return new Index();
    }
    this.init();
}
Index.prototype = {
    init: function () {
        var _this = this;

        _this.owlInit();
        _this.handle();
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