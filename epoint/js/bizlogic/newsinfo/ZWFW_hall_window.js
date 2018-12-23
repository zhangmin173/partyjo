/**
 * 描述 :政务服务--窗口排队情况
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
	var hallguid = '';
	var centerguid = '';
	var qno = '';
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
				//初始化数据
				initData(options);
				//页面初始化监听
				initListeners(options);
			}, function(options) {
				//初始化数据
				initData(options);
				//页面初始化监听
				initListeners(options);
			});

		});
	});
	//初始化数据
	function initData(options) {
		hallguid = WindowTools.getExtraDataByKey('hallguid') || '';
		centerguid = WindowTools.getExtraDataByKey('centerguid') || '';
		qno = WindowTools.getExtraDataByKey('qno') || '';
		if(hallguid) {
			//獲取窗口等待情况
			getWindowInfo(options)
		} else {
			search(qno, options);
		}
	};
	//初始化监听
	function initListeners(options) {
		//点击进入对应的大厅窗口列表页面
		Zepto('.mui-content').on('tap', '#btn_search', function() {
			var keyword = Zepto('#keyword').val();
			if(Zepto('#keyword').val() == '') {
				mui.toast('取票号不能为空');
			} else {
				search(keyword, options);
			}
		});
	};
	/**
	 * @description 获取窗口等待情况
	 */
	function getWindowInfo(options) {
		var url = config.serverUrl + 'queueInformation/getWindowWaitCount';
		var requestData = {
			token: config.validateData,
			params: {
				hallguid: hallguid, //中心guid
				centerguid: centerguid,
				qno: qno
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
				if(response && response.custom && response.custom.windowlist && response.custom.windowlist.length > 0) {
					var template = Zepto('#template').html();
					//				var template2 = document.getElementById("template2").innerHTML;
					//				document.querySelector('.mui-content').innerHTML = template2;
					var output = '';
					var outData = response.custom.windowlist;
					mui.each(outData, function(key, value) {
						output += Mustache.render(template, value);
					})
					Zepto('#listdata').html('');
					Zepto('#listdata').append(output);
					Zepto('#nodata').css('display', 'none');
				} else {
					Zepto('#listdata').html('');
					Zepto('#nodata').css('display', 'block');
				}
			}
		});

	};

	/**
	 * @description 查询窗口等待情况 
	 */
	function search(qno, options) {
		var url = config.serverUrl + 'queueInformation/getWindowWaitCount';
		var requestData = {
			token: config.validateData,
			params: {
				hallguid: '', //中心guid,
				centerguid: centerguid,
				qno: qno
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
				console.error('热点：' + JSON.stringify(response));
				if(response && response.custom && response.custom.windowlist && response.custom.windowlist.length > 0) {
					var template = Zepto('#template').html();
					//				var template2 = document.getElementById("template2").innerHTML;
					//				document.querySelector('.mui-content').innerHTML = template2;
					var output = '';
					var outData = response.custom.windowlist;
					mui.each(outData, function(key, value) {
						output += Mustache.render(template, value);
					})
					Zepto('#listdata').html('');
					Zepto('#listdata').append(output);
					Zepto('#nodata').css('display', 'none');
				} else {
					Zepto('#listdata').html('');
					Zepto('#nodata').css('display', 'block');
				}
			}
		});

	};
});