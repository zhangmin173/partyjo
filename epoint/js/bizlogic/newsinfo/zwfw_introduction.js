/**
 * 作者: 
 * 创建时间:2017/6/013 10:11:35
 * 版本:[1.0, 2017/6/13]
 * 版权:江苏国泰新点软件有限公司
 * 描述:中心简介
 */

define(function(require, exports, module) {
	"use strict";
	//每一个页面都要引入的工具类
	var CommonTools = require('CommonTools_Core');
	var WindowTools = require('WindowTools_Core');
	//下拉刷新
	//var PullToRefreshTools = require('PullToRefresh_Impl_Default_Core');
	//config引入-这里示例引入方式
	var Config = require('config_Bizlogic');
	//下拉刷新对象
	//var pullToRefreshObj;
	//搜索值
	//	var Affairs_TypeID = '';
	var openId = '';
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
			'js/libs/zepto.min.js'
		], function() {
			openId = WindowTools.getExtraDataByKey('openId') || '';
			Config.getUserguidbyOpenID(openId, function(options, tips) {
				getData(options);
			}, function(options) {
				getData(options);
			});
		});
	}
	var getData = function(options) {
		var url = Config.serverUrl + 'zwfwWxUser/getZxjjDetail';
		var requestData = {};
		//动态校验字段
		requestData.token = Config.validateData;
		var data = {
			"areacode": Config.areacode
		};
		requestData.params = data;
		requestData = JSON.stringify(requestData);
		//某一些接口是要求参数为字符串的
		//requestData = JSON.stringify(requestData);
		//console.log('url:' + url);
		console.log('请求数据:' + requestData);

		mui.ajax(url, {
			data: requestData,
			dataType: "json",
			type: "POST",
			headers: {
				Accept: "text/html;charset=utf-8",
				Authorization: "Bearer " + options.token || ''
			},
			contentType: 'application/json;charset=UTF-8',
			success: function(response) {
				//console.log(JSON.stringify(response));
				if(response.status.code != 200) {
					mui.toast(response.status.text);
					return false;
				}
				if(response.custom.code == 0) {
					mui.toast(response.custom.text);
					return false;
				}
				Zepto('.notice-info').append(response.custom.infocontent);
			},
			error: function(response) {
				console.log('请求失败');
				console.log(JSON.stringify(response))
			}
		});
	};
});