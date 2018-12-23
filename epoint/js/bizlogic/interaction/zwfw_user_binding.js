/**
 * 作者: 
 * 创建时间:2017/6/013 10:11:35
 * 版本:[1.0, 2017/6/13]
 * 版权:江苏国泰新点软件有限公司
 * 描述:帐号绑定
 */
define(function(require, exports, module) {
	"use strict";
	//每一个页面都要引入的工具类
	var CommonTools = require('CommonTools_Core');
	//引入config-seaBizConfig.js里的别名配置
	var config = require('config_Bizlogic');
	var UITools = require('UITools_Core');
	var WindowTools = require('WindowTools_Core');
	var StringTools = require('StringTools_Core');
	var OpenID = ''; //oegp-jlrnLOzYaGkMe0HyQm9B_qQ
	var httppath = '';
	//下一个页面的url地址
	var URL = '';
	var UserName = '';
	var Password = '';
	var ouName = '';
	var taskName = '';
	var isAppointment = '';
	var taskGuid = '';
	var currentType = '';
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
			'js/libs/zepto.min.js',
			'js/libs/jquery.js',
			'js/libs/md5-min.js',
			'js/libs/epoint.js'
		], function() {
			OpenID = WindowTools.getExtraDataByKey("openId") || '';
			//OpenID = 'o2256xEZ4PSX1VB3Cof5I8gxzV8w';
			ouName = decodeURIComponent(WindowTools.getExtraDataByKey("ouName"));
			taskName = decodeURIComponent(WindowTools.getExtraDataByKey("taskName"));
			URL = decodeURIComponent(WindowTools.getExtraDataByKey("URL"));
			isAppointment = WindowTools.getExtraDataByKey("isAppointment") || '';
			taskGuid = WindowTools.getExtraDataByKey("taskGuid") || '';
			currentType = WindowTools.getExtraDataByKey("currentType") || '';
			config.getProjectBasePath(function(bathpath) {
				httppath = bathpath;
				config.getUserguidbyOpenID(OpenID, function(options, tips) {
					// 已绑定
					mui.openWindow(httppath + 'html/interaction/zwfw_user_management.html' + '?openId=' + OpenID);
				}, function(options) {
					// 未绑定
					initlisenter(options);
				});
			});

		});
	}
	/**
	 * 初始化监听
	 */
	function initlisenter(options) {
		//点击绑定
		Zepto('#bind').on('tap', function() {
			UserName = document.getElementById("labLoginID").value;
			Password = document.getElementById("labPassword").value;
			//IDType=document.getElementById("IDType").value;
			if(UserName == '') {
				UITools.toast('手机号或身份证号不能为空!');
				return;
			}
			if(Password == '') {
				UITools.toast('密码不能为空!');
				return;
			}
			if(!StringTools.isPhoneNumber(UserName)) {
				if(!StringTools.validateUserIdendity(UserName)) {
					UITools.toast('请输入正确的手机号或身份证号！');
					return;
				}
			}
			//				if(IDType == '') {
			//					UITools.toast('登录类型不能为空!');
			//					return;
			//				}
			initBJinfo(options);

		});
		//点击注册
		Zepto('#register').on('tap', function() {
			mui.openWindow({
				url: 'zwfw_user_register.html?UserPK=' + OpenID + '&URL=' + encodeURIComponent(URL)
			})
		});
	}
	/**
	 * 绑定信息
	 */
	function initBJinfo(options) {
		var url = config.serverUrl + "zwfwWxUser/wxUserBind";
		var requestData = {
			token: config.validateData,
			params: {
				"idnumormobile": UserName,
				"password": hex_md5(Password),
				"encodepassword": epoint.encode(Password),
				"openid": OpenID
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
				if(rtnData.custom.code != 1) {
					mui.toast(rtnData.custom.text);
					return;
				}
				if(rtnData.custom.text == '用户已绑定') {
					mui.confirm('该用户已绑定其他微信，是否需要重新绑定？', '温馨提示', ['确认', '取消'], function(e) {
						if(e.index == 0) {
							// 强制绑定
							forceBind(options);
						}
					});
				} else {
					UITools.alert({
						content: '绑定成功'
					}, function() {
						if(URL == "undefined" || URL == '' || URL == "null") {
							mui.openWindow({
								url: 'zwfw_user_management.html?openId=' + OpenID
							});
						} else {
							mui.openWindow({
								url: URL + '&ouName=' + encodeURIComponent(ouName) + '&taskName=' + encodeURIComponent(taskName) + '&isAppointment=' + isAppointment + '&taskGuid=' + taskGuid + '&currentType=' + currentType
							});
						}
					});
				}
			}
		});
	}
	
	/*
	 * @description 强制绑定
	 */
	function forceBind(options) {
		var url = config.serverUrl + "zwfwWxUser/wxNewUserBind";
		var requestData = {
			token: config.validateData,
			params: {
				"idnumormobile": UserName,
				"password": hex_md5(Password),
				"encodepassword": epoint.encode(Password),
				"openid": OpenID
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
				if(response.status.code != 200) {
					mui.toast(response.status.text);
					return;
				}
				if(response.custom.code != 1) {
					mui.toast(response.custom.text);
					return;
				}
				UITools.alert({
					content: '强制绑定成功'
				}, function() {
					if(URL == "undefined" || URL == '' || URL == "null") {
						mui.openWindow({
							url: 'zwfw_user_management.html?openId=' + OpenID
						});
					} else {
						// h5页面之前已经传了openId，但是入口页面没有传，需要自己拼接在url中
						if(URL.indexOf('openId') == '-1' && URL.indexOf('UserPK') == '-1') {
							URL = URL + '?openId=' + OpenID;
						}
						mui.openWindow({
							url: URL + '&ouName=' + encodeURIComponent(ouName) + '&taskName=' + encodeURIComponent(taskName) + '&isAppointment=' + isAppointment + '&taskGuid=' + taskGuid + '&currentType=' + currentType
						});
					}
				});
			}
		});
	}
});