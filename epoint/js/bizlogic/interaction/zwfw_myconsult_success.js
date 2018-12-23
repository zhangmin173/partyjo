/**
 * 作者: ykx
 * 时间: 2016年9月5日
 * 描述: 咨询成功
 */
define(function(require, exports, module) {
	"use strict";
	var WindowTools = require('WindowTools_Core');
	var CommonTools = require('CommonTools_Core');
	var Config = require('config_Bizlogic');
	var OpenID = ''; //oegp-jlrnLOzYaGkMe0HyQm9B_qQ
	var ConsultList = '';
	// initready 要在所有变量初始化做完毕后
	CommonTools.initReady(initData);

	function initData() {
		//引入必备文件,下拉刷新依赖于mui与mustache
		CommonTools.importFile([
			'js/libs/mui.min.js',
			'js/libs/mustache.min.js',
			'js/libs/zepto.min.js',
		], function() {
			ConsultList = Zepto('#ConsultList');
			OpenID = WindowTools.getExtraDataByKey("UserPK") || '';
			
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
			
			//通过openid获取用户信息
			Config.getUserguidbyOpenID(OpenID, function(options, tips) {
				ConsultList.on('tap', function() {
					Config.getProjectBasePath(function(bathpath) {
						bathpath = bathpath;
						console.log(bathpath)
						var openurl = 'html/interaction/zwfw_myconsult.html';
						var ram = Math.random();
						window.location.href = bathpath + openurl + '?openId=' + OpenID + '&ram=' + ram;
					});
				})
			}, function(response) {
				console.log(JSON.stringify(response));
			});

		});
	}
	
	function pushHistory() {
		var state = {
			title: "title",
			url: "#"
		};
		window.history.pushState(state, "title", "#");
	}
});