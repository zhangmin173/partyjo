/**
 * 作者: 
 * 创建时间:2017/6/013 10:11:35
 * 版本:[1.0, 2017/6/13]
 * 版权:江苏国泰新点软件有限公司
 * 描述:帐号管理
 */
define(function(require, exports, module) {
	"use strict";
	//每一个页面都要引入的工具类
	var CommonTools = require('CommonTools_Core');
	//引入config-seaBizConfig.js里的别名配置
	var config = require('config_Bizlogic');
	var WindowTools = require('WindowTools_Core');
	var UITools = require('UITools_Core');
	var OpenID = ''; //oegp-jlrnLOzYaGkMe0HyQm9B_qQ
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
			'js/libs/zepto.min.js'
		], function() {
			OpenID = WindowTools.getExtraDataByKey("openId") || '';

			// 监听返回按钮
			Zepto(function() {
				pushHistory();
				window.addEventListener("popstate", function(e) {
					location.href = './zwfw_user_binding.html?openId=' + OpenID;
					pushHistory();
				}, false);
			});

			//通过openid获取用户信息
			config.getUserguidbyOpenID(OpenID, function(options, tips) {
				Zepto("#labLoginID").val(options.userName);
				initListeners(options);
			}, function(response) {
				UITools.alert({
					content: response.BusinessInfo.Description
				})
				console.log(JSON.stringify(response));
			});

		});
	}

	function pushHistory() {
		var state = {
			title: "title",
			url: ""
		};
		window.history.pushState(state, "title", "");
	}

	function initListeners(options) {
		Zepto('#JCBD').on('tap', function() {
			var btnArray = ['是', '否'];
			mui.confirm('你确定要解除微信绑定？', '', btnArray, function(e) {
				if(e.index == 0) {
					JCBD(options);
				}
			});
		});
	}

	/**
	 * 解除绑定
	 */
	function JCBD(options) {
		var url = config.serverUrl + "zwfwWxUser/wxUserUnBind";
		var requestData = {
			token: config.validateData,
			params: {
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
				//console.log('解除绑定成功');
				console.log(JSON.stringify(rtnData));
				if(rtnData.status.code != 200) {
					mui.toast(rtnData.status.text);
					return;
				}
				if(rtnData.custom.code == 0) {
					mui.toast(rtnData.custom.text);
					return;
				}
				UITools.alert({
					content: '解绑成功'
				}, function() {
					self.location = 'zwfw_user_binding.html?openId=' + OpenID;
				})
			}
		});
	}
});