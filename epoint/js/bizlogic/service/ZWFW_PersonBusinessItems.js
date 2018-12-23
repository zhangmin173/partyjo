/**
 * 作者:  hybo
 * 时间: 2016-07-15 
 * 描述: 事项分类（个人办事、企业办事、部门服务）
 */
define(function(require, exports, module) {
	"use strict";
	//每一个页面都要引入的工具类
	var CommonTools = require('CommonTools_Core');
	//下拉刷新
	var WindowTools = require('WindowTools_Core');
	var UITools = require('UITools_Core');
	//config引入
	var Config = require('config_Bizlogic');
	//获取项目http的根目录，http://id:端口/项目名/
	var httppath = '';
	//openid
	var UserPK = '';
	// 个人20 法人10
	var usertype = '20';
	var url = Config.serverUrl + 'zwdtTask/getTaskKindsByThemes';
	//我要预约进去也是部门办事，事项搜索进去需要区分
	var specialUrl = '';
	// initready 要在所有变量初始化做完毕后
	CommonTools.initReady(initData);
	/**
	 * @description 初始化数据,结合initReady使用
	 * plus情况为plusready
	 * 其它情况为直接初始化
	 */
	function initData() {
		//引入必备文件,下拉刷新依赖于mui与mustache
		CommonTools.importFile([
			'js/libs/mui.min.js',
			'js/libs/mustache.min.js',
			'js/libs/zepto.min.js',
		], function() {
			//入口
			if(WindowTools.getExtraDataByKey('openId')) {
				UserPK = WindowTools.getExtraDataByKey('openId') || '';
			}
			//UserPK = 'o2256xOSO9s3FnPU3gAxRj7WfPI4';
			//项目根路径
			Config.getProjectBasePath(function(path) {
				httppath = path;
			});
			Config.getUserguidbyOpenID(UserPK, function(options, tips) {
				ajaxPersonData(options);
				ajaxBusinessData(options);
				initListeners();
			}, function(options) {
				ajaxPersonData(options);
				ajaxBusinessData(options);
				initListeners();
			});
		});

	}
	/**
	 * @description 初始化监听
	 */
	function initListeners() {
		Zepto('.mui-control-item').on('tap', function() {
			Zepto(this).addClass('mui-active');
			Zepto(this).removeClass('mui-active');
			var type = Zepto(this).attr('id');
			if(type == 'grbs') {
				Zepto('#iteminfo1').show();
				Zepto('#iteminfo2').hide();
			} else if(type == 'qybs') {
				Zepto('#iteminfo1').hide();
				Zepto('#iteminfo2').show();

			}
		});
	}
	/*通用点击*/
	function onClick() {
		Zepto('.person').on('tap', function() {
			var nextUrl = '';
			var id = Zepto(this).attr('id');
			nextUrl = httppath + 'html/service/ZWFW_Common_list.html?usertype=20' + '&dictid=' + encodeURIComponent(id) + '&UserPK=' + UserPK;
			window.location.href = nextUrl;
		});
		Zepto('.business').on('tap', function() {
			var nextUrl = '';
			var id = Zepto(this).attr('id');
			nextUrl = httppath + 'html/service/ZWFW_Common_list.html?usertype=10' + '&dictid=' + encodeURIComponent(id) + '&UserPK=' + UserPK;
			window.location.href = nextUrl;
		});
	}
	/**
	 * @description 获取个人办事
	 */
	function ajaxPersonData(options) {
		var requestData = {};
		requestData.token = Config.validateData;
		var data = {
			usertype: usertype,
			ispcuse: 1
		};
		requestData.params = data;
		requestData = JSON.stringify(requestData);
		console.log(requestData);
		UITools.showWaiting();
		mui.ajax(url, {
			data: requestData,
			timeout: "15000", //超时时间设置为3秒；
			type: "POST",
			headers: {
				Accept: "text/html;charset=utf-8",
				Authorization: "Bearer " + options.token || ''
			},
			contentType: 'application/json;charset=UTF-8',
			success: function(response) {
				UITools.closeWaiting();
				console.log("success");
				console.log(response);
				var response = JSON.parse(response);
				dealPerson(response);
			},
			error: function(error) {
				UITools.closeWaiting();
				console.log("详情error");
				UITools.toast('请求数据失败');
				console.log(JSON.stringify(error));
			}
		});
	}
	/*个人处理response*/
	function dealPerson(response) {
		if(response && response.custom && response.custom.code == 1 && response.status && response.status.code == 200 && response.custom.dictlist && Array.isArray(response.custom.dictlist)) {
			var tmpInfo = response.custom.dictlist;
			var lastInfo = [];
			for(var i = 0, len = tmpInfo.length; i < len; i++) {
				lastInfo[i] = tmpInfo[i];
			}
			var litemplate = "<li class='affairs-item person' id='{{dictid}}'><a class='affairs-item-icon'style='background: url({{dictrul}});background-size: 50px 50px;'></a><a class='affairs-item-name'>{{dictname}}</a></li>";
			Zepto("#iteminfo1").html('');
			var html = ''
			//遍历数组
			mui.each(lastInfo, function(key, value) {
				if(value) {
					html += Mustache.render(litemplate, value);
				}
			});
			if(html) {
				Zepto("#iteminfo1").append(html);
			}
			onClick();
		}
	}
	/**
	 * @description 获取企业办事
	 */
	function ajaxBusinessData(options) {
		usertype = '10';
		var requestData = {};
		requestData.token = Config.validateData;
		var data = {
			usertype: usertype,
			ispcuse: 1
		};
		requestData.params = data;
		requestData = JSON.stringify(requestData);
		console.log(requestData);
		UITools.showWaiting();
		mui.ajax(url, {
			data: requestData,
			timeout: "15000", //超时时间设置为3秒；
			type: "POST",
			headers: {
				Accept: "text/html;charset=utf-8",
				Authorization: "Bearer " + options.token || ''
			},
			contentType: 'application/json;charset=UTF-8',
			success: function(response) {
				UITools.closeWaiting();
				console.log("success");
				console.log(response);
				var response = JSON.parse(response);
				dealBusiness(response);
			},
			error: function(error) {
				UITools.closeWaiting();
				console.log("详情error");
				UITools.toast('请求数据失败');
				console.log(JSON.stringify(error));
			}
		});
	}
	/*企业处理response*/
	function dealBusiness(response) {
		if(response && response.custom && response.custom.code == 1 && response.status && response.status.code == 200 && response.custom.dictlist && Array.isArray(response.custom.dictlist)) {
			var tmpInfo = response.custom.dictlist;
			var lastInfo = [];
			for(var i = 0, len = tmpInfo.length; i < len; i++) {
				lastInfo[i] = tmpInfo[i];
			}
			var litemplate = "<li class='affairs-item business' id='{{dictid}}'><a class='affairs-item-icon'style='background: url({{dictrul}});background-size: 50px 50px;'></a><a class='affairs-item-name'>{{dictname}}</a></li>";
			Zepto("#iteminfo2").html('');
			var html = ''
			//遍历数组
			mui.each(lastInfo, function(key, value) {
				if(value) {
					html += Mustache.render(litemplate, value);
				}
			});
			if(html) {
				Zepto("#iteminfo2").append(html);
			}
			Zepto('#iteminfo2').hide();
			onClick();
		}
	}
});