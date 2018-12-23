/**
 * 作者:  hybo
 * 时间: 2016-07-15 
 * 描述: 事项查看详情页 
 */
define(function(require, exports, module) {
	"use strict";
	//每一个页面都要引入的工具类
	var CommonTools = require('CommonTools_Core');
	//下拉刷新
	var WindowTools = require('WindowTools_Core');
	var UITools = require('UITools_Core');
	//config引入
	var Config = require('config_Bizlogic');
	//获取项目http的根目录，http://id:端口/项目名/
	var httppath = '';
	var UserPK = '';
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
			if(WindowTools.getExtraDataByKey('UserPK')) {
				UserPK = WindowTools.getExtraDataByKey('UserPK') || '';
			}
			//项目根路径
			Config.getProjectBasePath(function(path) {
				httppath = path;
			});
			Config.getUserguidbyOpenID(UserPK, function(options, tips) {
				ajaxData(options);
				initListeners();
			}, function(options) {
				ajaxData(options);
				initListeners();
			});
		});

	}
	/**
	 * @description 初始化监听
	 */
	function initListeners() {

	}
	/**
	 * @description 获取服务
	 */
	function ajaxData(options) {
		var url = Config.serverUrl + 'zwdtCommonSetting/getZwdtCodeList';
		var requestData = {};
		requestData.token = Config.validateData;
		var data = {
			codename: 'App便民服务模块'
		}
		requestData.params = data;
		requestData = JSON.stringify(requestData);
		console.log(requestData);
		UITools.showWaiting();
		mui.ajax(url, {
			data: requestData,
			timeout: "15000", //超时时间设置为3秒；
			type: "POST",
			headers: {
				Accept: "text/html;charset=utf-8",
				Authorization: "Bearer " + options.token || ''
			},
			contentType: 'application/json;charset=UTF-8',
			success: function(response) {
				UITools.closeWaiting();
				response = JSON.parse(response);
				if(response && response.status && response.status.code == 200 && response.custom && response.custom.code == 1) {
					if(response.custom.modellist && Array.isArray(response.custom.modellist) && response.custom.modellist.length > 0) {
						var infoList = response.custom.modellist;
						var litemplate = "<li class='affairs-item'><a href='{{modelurl}}'class='affairs-item-icon'style='background: url({{modelpicurl}});background-size: 50px 50px;'></a><a href='{{modelurl}}'class='affairs-item-name'>{{modelname}}</a></li>";
						var html = '';
						mui.each(infoList, function(key, value) {
							html += Mustache.render(litemplate, value);
						});
						Zepto("#iteminfo").append('');
						if(html) {
							Zepto("#iteminfo").append(html);
						}
					}
				}
			},
			error: function(error) {
				UITools.closeWaiting();
				console.log("详情error");
				UITools.toast('请求数据失败');
				console.log(JSON.stringify(error));
			}
		});
	}
});