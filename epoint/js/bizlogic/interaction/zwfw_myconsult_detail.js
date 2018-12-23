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
	var WindowTools = require('WindowTools_Core');
	var OpenID = '';
	var RowGuid = '';
	var isConsult = ''; // 咨询详情还是投诉详情
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
			OpenID = WindowTools.getExtraDataByKey("UserPK") || '';
			RowGuid = WindowTools.getExtraDataByKey("RowGuid") || '';
			isConsult = WindowTools.getExtraDataByKey("isConsult") || '';
			if(isConsult == '1') {
				document.title = '咨询详情';
			} else {
				document.title = '投诉详情';
			}
			//通过openid获取用户信息
			config.getUserguidbyOpenID(OpenID, function(options, tips) {
				getdetail(options);
				initListener();
			}, function(response) {
				console.log(JSON.stringify(response));
			});
		});
	}

	function initListener() {
		// 点击附件
		mui('.attach').on('tap', '.mui-table-view-cell', function() {
			var guid = Zepto(this).attr('id');
			// 判断手机系统
			var u = navigator.userAgent,
				app = navigator.appVersion;
			var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //android终端或者uc浏览器   
			var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端   
			if(isiOS) {
				if(isWeiXin()) {
					mui.toast('请您点击右上角通过浏览器下载附件！');
				} else {
					location.href = config.serverUrl + 'auditattach/readAttach?attachguid=' + guid;
				}
			} else {
				location.href = config.serverUrl + 'auditattach/readAttach?attachguid=' + guid;
			}
		});
	}
	
	/*
	 * @description 判断是否为微信环境
	 */
	function isWeiXin() {
		var ua = window.navigator.userAgent.toLowerCase();
		if(ua.match(/MicroMessenger/i) == 'micromessenger' || ua.match(/_SQ_/i) == '_sq_') {
			return true;
		} else {
			return false;
		}
	}

	function getdetail(options) {
		var url = config.serverUrl + "zwdtConsult/private/getConsultDetailByRowGuid";
		var requestData = {
			token: config.validateData,
			params: {
				consultguid: RowGuid
			}
		}
		console.log('请求参数' + JSON.stringify(requestData) + ';请求地址' + url)
		mui.ajax(url, {
			data: JSON.stringify(requestData),
			dataType: "json",
			type: "POST",
			headers: {
				Accept: "text/html;charset=utf-8",
				Authorization: "Bearer " + options.token || ''
			},
			contentType: 'application/json;charset=UTF-8',
			success: function(rtnData) {
				console.log('初始化办件请求成功');
				console.log(JSON.stringify(rtnData));
				if(rtnData.status.code != 200) {
					mui.toast(rtnData.status.text);
					return;
				}
				if(rtnData.custom.code == 0) {
					mui.toast(rtnData.custom.text);
					return;
				}
				Zepto("#QUESTION").html(rtnData.custom.consultdetail.question);
				Zepto("#ANSWER").html(rtnData.custom.consultdetail.answer);
				var template = document.getElementById("template").innerHTML;
				if(rtnData.custom.consultdetail) {
					if(rtnData.custom.consultdetail.answerattachlist) {
						var answerList = rtnData.custom.consultdetail.answerattachlist;
						if(Array.isArray(answerList) && answerList.length > 0) {
							Zepto('.picShow').show();
							var html = '';
							mui.each(answerList, function(key, value) {
								html += Mustache.render(template, value);
							});
							Zepto('.attach').append(html);
						} else {
							Zepto('.picShow').hide();
						}
					}
				}
			}
		});
	}
});