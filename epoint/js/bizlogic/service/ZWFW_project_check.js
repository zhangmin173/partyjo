/* 
 * 作者 :黄赟博
 * 创建时间 :2017/06/14 10:11:36
 * 版本 :[1.0, 2017/5/24]
 * 版权：江苏国泰新点软件有限公司
 * 描述：办件查询
 */
define(function(require, exports, module) {
	"use strict";
	var CommonTools = require('CommonTools_Core');
	var WindowTools = require('WindowTools_Core');
	var UITools = require('UITools_Core');
	var config = require('config_Bizlogic');
	var openId = '';
	CommonTools.initReady(function() {
		//引入必备文件,下拉刷新依赖于mui与mustache
		CommonTools.importFile([
			'js/libs/mui.min.js',
			'js/libs/mustache.min.js',
			'js/libs/zepto.min.js'
		], function() {
			openId = WindowTools.getExtraDataByKey('openId') || '';
			config.getUserguidbyOpenID(openId, function(options, tips) {
				init(options);
			}, function(options) {
				init(options);
			});
		});
	});

	function init(options) {
		Zepto('.btn').on('tap', function() {
			var projectno = Zepto('#projectno').val();
			if(!projectno) {
				mui.toast('请输入办件编号');
			} else {
				ajaxCheck(projectno, options);
			}
		});
	}
	/**
	 * @description 
	 */
	function ajaxCheck(projectno, options) {
		var url = config.serverUrl + 'zwdtProject/getProjectDetailByFlowSN';
		var requestData = {
			token: config.validateData,
			params: {
				"areacode": config.areacode,
				"flowsn": projectno
			}
		}
		requestData = JSON.stringify(requestData);
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
				if(response.status.code != 200) {
					mui.toast(response.status.text);
					return;
				}
				if(response.custom.code != 1) {
					mui.toast(response.custom.text || '获取办件信息失败，请检查办件编号是否正确');
					return;
				}
				location.href = './ZWFW_project_result.html?projectno=' + projectno + '&openId=' + openId;
			}
		});
	};
});