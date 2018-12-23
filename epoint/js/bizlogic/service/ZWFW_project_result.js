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
	var projectno = '';
	var openId = '';
	CommonTools.initReady(function() {
		//引入必备文件,下拉刷新依赖于mui与mustache
		CommonTools.importFile([
			'js/libs/mui.min.js',
			'js/libs/mustache.min.js',
			'js/libs/zepto.min.js'
		], function() {
			openId = WindowTools.getExtraDataByKey('openId') || '';
			projectno = WindowTools.getExtraDataByKey('projectno') || '';
			config.getUserguidbyOpenID(openId, function(options, tips) {
				ajaxDetail(options);
			}, function(options) {
				ajaxDetail(options);
			});
		});
	});
	/**
	 * @description 
	 */
	function ajaxDetail(options) {
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
				var tmpInfo = response.custom;
				tmpInfo.flowsn=projectno;
				var template = '<li class="mui-table-view-cell"><span>事项名称</span><span>{{taskname}}</span></li><li class="mui-table-view-cell"><span>事项编码</span><span>{{itemid}}</span></li><li class="mui-table-view-cell"><span>办件名称</span><span>{{taskname}}</span></li><li class="mui-table-view-cell"><span>办件编号</span><span>{{flowsn}}</span></li><li class="mui-table-view-cell long"><span>申请单位或申请人</span><span>{{applyername}}</span></li><li class="mui-table-view-cell"><span>收件单位</span><span>{{receivename}}</span></li><li class="mui-table-view-cell"><span>经办人</span><span>{{receiveusername}}</span></li><li class="mui-table-view-cell"><span>受理时间</span><span>{{receivedate}}</span></li><li class="mui-table-view-cell width-100"><span>当前办理状态</span><span>{{status}}</span></li>';
				var output = Mustache.render(template, tmpInfo);
				Zepto('.mui-table-view').html('');
				Zepto('.mui-table-view').append(output);
			}
		});
	};
});