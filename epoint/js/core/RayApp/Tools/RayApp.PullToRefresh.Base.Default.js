define(function(require,exports,module){"use strict";function e(e,t){"object"!=typeof e?this.element=e:(t=e,this.element=t.element),this.element=this.element||l.element,"string"==typeof this.element&&(this.element=document.querySelector(this.element)),this.options=i.extend(!0,{},l,t)}function t(){var e=o.options.down.callback;e&&e.apply(o)}function n(){var e=o.options.up.callback;e&&e.apply(o)}var o,i=require("CommonTools_Core"),l={down:{height:75,contentdown:"下拉可以刷新",contentover:"释放立即刷新",contentrefresh:"正在刷新",callback:i.noop},up:{auto:!1,offset:100,show:!0,contentdown:"上拉显示更多",contentrefresh:"正在加载...",contentnomore:"没有更多数据了",callback:i.noop},element:"#pullrefresh"};e.prototype.init=function(){var e,o=this;e={pullRefresh:{container:o.element,down:o.options.down?i.extend(!0,{},o.options.down,{callback:t}):null,up:o.options.up?i.extend(!0,{},o.options.up,{callback:n}):null}},mui.init(e),i.initReady(function(){o.initData()})},e.prototype.initData=function(){var e=this;e.isLoadingMore=!1,e.isNoMoreData=!1},e.prototype.pullupLoading=function(){var e=this;e.options.up&&(e.isLoadingMore||(e.isNoMoreData&&mui(e.element).pullRefresh().refresh(!0),mui(e.element).pullRefresh().pullupLoading(),window.plus&&"Android"===plus.os.name||mui(e.element).pullRefresh().scrollTo(0,0,100),e.isLoadingMore=!0))},e.prototype.resetLoadingState=function(e,t){var n=this;e&&mui(n.element).pullRefresh().endPulldownToRefresh(),t?(mui(n.element).pullRefresh().endPullupToRefresh(!0),n.isNoMoreData=!0):(n.isNoMoreData&&mui(n.element).pullRefresh().refresh(!0),n.isNoMoreData=!1,mui(n.element).pullRefresh().endPullupToRefresh(!1)),n.isLoadingMore=!1},e.prototype.endPullDownToRefresh=function(){var e=this;e.resetLoadingState(!0,!1)},e.prototype.endPullUpToRefresh=function(e){var t=this;t.resetLoadingState(!1,e)},exports.initPullToRefresh=function(t,n){return o||(o=new e(t,n),o.init()),o}});