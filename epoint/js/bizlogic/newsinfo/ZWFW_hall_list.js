/**
 * 描述 :政务服务--大厅等待情况
 * 作者 :Created By lipeng
 * 版本 :1.0.0
 * 时间 :2017-03-01 18:00:20
 */
define(function(require, exports, module) {
	"use strict";
	var StringTools = require('StringTools_Core');
	var config = require('config_Bizlogic');
	var CommonTools = require('CommonTools_Core');
	var WindowTools = require('WindowTools_Core');
	var config = require('config_Bizlogic');
	CommonTools.initReady(function() {
		//引入必备文件,下拉刷新依赖于mui与mustache
		CommonTools.importFile([
			'js/libs/mui.min.js',
			'js/libs/zepto.min.js',
			'js/libs/mustache.min.js'
		], function() {
			initListeners();
			getHall();
		});
	});

	//初始化监听
	function initListeners() {
		//企业空间
		Zepto('.mui-content').on('tap', '.mui-table-view-cell', function() {
			var _this = Zepto(this);
			var centerguid = _this.attr('data-code');
			location.href = './ZWFW_hall_queuing_information.html?centerguid=' + centerguid;
		});
	};
	/**
	 * @description 获取大厅
	 */
	function getHall() {
		var url = config.serverUrl + 'queueInformation/getCenterByAreacode';
		var requestData = {
			token: config.validateData,
			params: {
				areacode: config.areacode //辖区code
			}
		}
		mui.ajax(url, {
			data: JSON.stringify(requestData),
			dataType: "json",
			type: "POST",
			contentType: 'application/json;charset=UTF-8',
			success: function(response) {
				if(response && response.custom && response.custom.centerlist) {
					var template = Zepto('#template').html();
					var html = '';
					var outData = response.custom.centerlist;
					mui.each(outData, function(key, value) {
						html += Mustache.render(template, value);
					})
					Zepto('#listdata').append(html);
				}
			}
		});

	};
});