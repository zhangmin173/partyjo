/**
 * 作者: 
 * 创建时间:2017/6/013 10:11:35
 * 版本:[1.0, 2017/6/13]
 * 版权:江苏国泰新点软件有限公司
 * 描述:我的预约 新增成功
 */
define(function(require, exports, module) {
	"use strict";
	var WindowTools = require('WindowTools_Core');
	//每一个页面都要引入的工具类
	var CommonTools = require('CommonTools_Core');
	//等待框
	var UITools = require('UITools_Core');
	//config引入-这里示例引入方式
	var Config = require('config_Bizlogic');
	var OpenID = ''; //oegp-jlrnLOzYaGkMe0HyQm9B_qQ
	var AddAppointment = '';
	var appointGuid = ''; // 预约guid 
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
			AddAppointment = Zepto('#AddAppointment');
			OpenID = WindowTools.getExtraDataByKey("UserPK") || '';
			appointGuid = WindowTools.getExtraDataByKey('appointGuid') || '';
			
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
				AddAppointment.on('tap', function() {
					Config.getProjectBasePath(function(bathpath) {
						bathpath = bathpath;
						console.log(bathpath)
						var openurl = 'html/interaction/zwfw_myappointment.html';
						var ram = Math.random();
						window.location.href = bathpath + openurl + '?openId=' + OpenID + '&ram=' + ram;;
					});
				})
			}, function(response) {
				console.log(JSON.stringify(response));
			});
		});
	};
	
	function pushHistory() {
		var state = {
			title: "title",
			url: "#"
		};
		window.history.pushState(state, "title", "#");
	}
});