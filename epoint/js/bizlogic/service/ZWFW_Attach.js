/**
 * 作者: 
 * 时间: 
 * 描述:  
 */
define(function(require, exports, module) {
	"use strict";
	//每一个页面都要引入的工具类
	var CommonTools = require('CommonTools_Core');
	//引入config-seaBizConfig.js里的别名配置
	var config = require('config_Bizlogic');
	var UITools = require('UITools_Core');
	var WindowTools = require('WindowTools_Core');
	var AttachGuid = '';
	var Token = '';
	var OpenID = '';
	//每一个页面都要引入的工具类
	// initready 要在所有变量初始化做完毕后
	CommonTools.initReady(initData);
	/**
	 * @description 初始化数据,结合initReady使用
	 * plus情况为plusready
	 * 其它情况为直接初始化
	 */
	function initData(isPlus) {
		//引入必备文件,下拉刷新依赖于mui与mustache
		CommonTools.importFile([
			'js/libs/mui.min.js',
			'js/libs/mustache.min.js',
			'js/libs/zepto.min.js'
		], function() {
			AttachGuid = WindowTools.getExtraDataByKey('AttachGuid') || '';
			OpenID = WindowTools.getExtraDataByKey('OpenID') || '';
			config.getUserguidbyOpenID(OpenID, function(options, tips) {
				GetDetail(options);
			}, function(options) {
				GetDetail(options);
			});
		});
	}

	function GetDetail(options) {
		var url = config.serverUrl + '/Attach/GetAttachURL';
		var requestData = {
			ValidateData: Token,
			paras: {
				AttachGuid: AttachGuid
			}
		}
		mui.ajax(url, {
			data: JSON.stringify(requestData),
			dataType: "json",
			type: "POST",
			headers: {
				Accept: "text/html;charset=utf-8",
				Authorization: "Bearer " + options.token || ''
			},
			success: function(response) {

				if(response.ReturnInfo.Code == "0") {
					mui.toast(response.ReturnInfo.Description);
					return;
				}
				if(response.BusinessInfo.Code == "0") {
					mui.toast(response.BusinessInfo.Description);
					return;
				}
				var AttachInfo = response.UserArea.AttachURL;
				var strTaskHtml = "";

				if(AttachInfo.length < 1) {
					strTaskHtml = " <div ><p>无数据</p></div>";

				} else {

					strTaskHtml = strTaskHtml + "<img height='100%' width='100%'  src='" + AttachInfo + "' />";

				}
				Zepto('#attachinfo').html(strTaskHtml);

			}
		});
	}
});