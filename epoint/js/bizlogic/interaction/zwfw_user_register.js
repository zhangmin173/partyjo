/**
 * 作者: 
 * 创建时间:2017/6/013 10:11:35
 * 版本:[1.0, 2017/6/13]
 * 版权:江苏国泰新点软件有限公司
 * 描述:帐号注册
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
	var OpenID = '';
	//下一个页面的url地址
	var URL = '';
	var UserName = '';
	var Password = '';
	var secPassword = '';
	var mobile = '';
	var idCard = '';
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
			'js/libs/md5-min.js'
		], function() {
			OpenID = WindowTools.getExtraDataByKey("UserPK") || '';
			URL = WindowTools.getExtraDataByKey("URL") || '';

			config.getUserguidbyOpenID(OpenID, function(options, tips) {
				initListeners(options);
			}, function(options) {
				initListeners(options);
			});
		});
	}

	function initListeners(options) {
		//点击注册
		Zepto('#register').on('tap', function() {
			var kongreg = /\s/;
			UserName = document.getElementById("labLoginID").value;
			Password = document.getElementById("labPassword").value;
			secPassword = document.getElementById("labPassword2").value;
			mobile = document.getElementById("labMobile").value;
			idCard = document.getElementById("labIDcard").value;
			if(UserName == '') {
				UITools.toast('用户名不能为空!');
				return;
			}
			if(mobile == '') {
				UITools.toast('手机号不能为空!');
				return;
			}
			if(idCard == '') {
				UITools.toast('身份证号不能为空!');
				return;
			}
			if(Password == '') {
				UITools.toast('密码不能为空!');
				return;
			}
			var namefirst = UserName.slice(0, 1);
			if(kongreg.test(UserName)) {
				UITools.toast('用户名不允许输入空格!');
				return false;
			}
			if(!StringTools.isPhoneNumber(mobile)) {
				UITools.toast('手机号输入不正确!');
				return;
			}
			if(!StringTools.validateUserIdendity(idCard)) {
				UITools.toast('身份证号输入不正确!');
				return;
			}
			if(Password.length < 6) {
				UITools.toast('密码不能少于6位字符!');
				return;
			}
			if(Password != secPassword) {
				UITools.toast('两次输入密码不一致!');
				return;
			}
			register(options);
		});
	}

	/**
	 * 注册
	 */
	function register(options) {
		var url = config.serverUrl + "zwfwWxUser/wxUserRegister";
		var requestData = {
			token: config.validateData,
			params: {
				"username": UserName,
				"password": hex_md5(Password),
				"mobile": mobile,
				"idnum": idCard.toUpperCase()
			}
		}
		//console.log('请求参数' + JSON.stringify(requestData) + ';请求地址' + url)
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
				//console.log(JSON.stringify(rtnData));
				if(rtnData.status.code != 200) {
					mui.toast(rtnData.status.text);
					return;
				}
				if(rtnData.custom.code == 0) {
					mui.toast(rtnData.custom.text);
					return;
				}
				UITools.alert({
					content: '注册成功'
				}, function() {
					mui.openWindow({
						url: 'zwfw_user_binding.html?openId=' + OpenID + '&URL=' + encodeURIComponent(URL)
					})

				});

			}
		});
	}
});