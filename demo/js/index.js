function Index() {
    if (!(this instanceof Index)) {
        return new Index();
    }
    this.init();
}
Index.prototype = {
    init: function () {
        var _this = this;


        _this.handle();
    },
    handle: function() {
        var _this = this;


    }
};
$(function() {
    new Index();
})