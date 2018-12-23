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
	var centerguid = '';
	var hallguid = '';
	var openId = '';
	CommonTools.initReady(function() {
		//引入必备文件,下拉刷新依赖于mui与mustache
		CommonTools.importFile([
			'js/libs/mui.min.js',
			'js/libs/zepto.min.js',
			'js/libs/mustache.min.js'
		], function() {
			openId = WindowTools.getExtraDataByKey('openId') || '';
			config.getUserguidbyOpenID(openId, function(options, tips) {
				// 获取中心guid
				getCenterGuid(options);
				initListeners();
			}, function(options) {
				// 获取中心guid
				getCenterGuid(options);
				initListeners();
			});
		});
	});
//	//初始化数据
//	function initData() {
//		//辖区code
//		centerguid = WindowTools.getExtraDataByKey('centerguid')||'';
//	};
	//初始化监听
	function initListeners() {
		//点击进入对应的大厅窗口列表页面
		Zepto('.mui-content').on('tap', '.mui-table-view-cell', function() {
			var _this = Zepto(this);
			var hallguid = _this.attr('data-code');
			location.href = './ZWFW_hall_window.html?hallguid=' + hallguid + '&centerguid=' + centerguid + '&openId=' + openId;
		});
		//点击搜索按钮
		Zepto('.mui-content').on('tap', '#btn_search', function() {
			var keyword = Zepto('#keyword').val();
			if(keyword == '') {
				mui.toast('取票号不能为空');
			} else {
				location.href = './ZWFW_hall_window.html?qno=' + keyword + '&centerguid=' + centerguid + '&openId=' + openId;
			}
		})
	};
	
	/*
	 * @description 获取中心guid
	 */
	function getCenterGuid(options) {
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
			headers: {
				Accept: "text/html;charset=utf-8",
				Authorization: "Bearer " + options.token || ''
			},
			contentType: 'application/json;charset=UTF-8',
			success: function(response) {
				if(response && response.status && response.status.code == 200) {
					if(response.custom && response.custom.code == 1) {
						if(response.custom.centerlist && Array.isArray(response.custom.centerlist) && response.custom.centerlist.length > 0) {
							centerguid = response.custom.centerlist[0].centerguid;
						} else {
							mui.toast('无中心数据！');
						}
						// 获取大厅等待情况
						getHallInfo(options);
					} else {
						mui.toast(response.custom.text);
					}
				} else {
					mui.toast(response.status.text);
				}
			}
		});
	}
	
	/**
	 * @description 获取大厅等待情况
	 */
	function getHallInfo(options) {
		var url = config.serverUrl + 'queueInformation/getHallWaitCount';
		var requestData = {
			token: config.validateData,
			params: {
				centerguid: centerguid //中心guid
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
			contentType: 'application/json;charset=UTF-8',
			success: function(response) {
				if(response && response.custom && response.custom.halllist) {
				var template = Zepto('#template').html();
				var template2 = Zepto('#template2').html();
				var html = '';
				var output = '';
				var outData = response.custom;
				html += Mustache.render(template, outData);
				var outData2 = response.custom.halllist;
				Zepto('#listdata').html('');
				Zepto('#listdata').append(html);
				if(outData.halllist.length > 0) {
					mui.each(outData2, function(key, value) {
						output += Mustache.render(template2, value);
					});
					Zepto('#listdata2').html('');
					Zepto('#listdata2').append(output);
				} else {
					Zepto('#nodata').css('display','block');
				}
			}
			}
		});

	};
});