/**
 * 作者: 
 * 创建时间:2017/6/013 10:11:35
 * 版本:[1.0, 2017/6/13]
 * 版权:江苏国泰新点软件有限公司
 * 描述:我的投诉 新增成功
 */
define(function(require, exports, module) {
	"use strict";
	var WindowTools = require('WindowTools_Core');
	//每一个页面都要引入的工具类
	var CommonTools = require('CommonTools_Core');
	//config引入-这里示例引入方式
	var Config = require('config_Bizlogic');
	// initready 要在所有变量初始化做完毕后
	CommonTools.initReady(initData);
	/**
	 * @description 初始化数据,结合initReady使用
	 * plus情况为plusready
	 * 其它情况为直接初始化
	 */
	function initData() {
		//引入必备文件,下拉刷新依赖于mui与mustache
		CommonTools.importFile([
			'js/libs/mui.min.js',
			'js/libs/mustache.min.js',
			'js/libs/zepto.min.js',
		], function() {
			// 监听返回按钮
			Zepto(function() {
				pushHistory();
				window.addEventListener("popstate", function(e) {
					mui.confirm('无法返回，是否返回首页？', '', ['是', '否'], function(e) {
						if(e.index == 0) {
							WeixinJSBridge.call('closeWindow');
						}
					});
					pushHistory();
				}, false);
			});
			
			ConsultList();
		});

	}
	var ConsultList = function() {
		//非本地

		var ConsultList = Zepto('#ConsultList');
		ConsultList.on('tap', function() {

			var value = WindowTools.getExtraDataByKey("UserPK") || '';
			var ram = Math.random();
			mui.openWindow({
				url: 'zwfw_mycomplaint.html?openId=' + value + '&ram=' + ram
			})

		})
	}
	
	function pushHistory() {
		var state = {
			title: "title",
			url: "#"
		};
		window.history.pushState(state, "title", "#");
	}

});