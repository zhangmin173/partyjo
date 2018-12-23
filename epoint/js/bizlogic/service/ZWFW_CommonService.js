/**
 * 作者:  hybo
 * 时间: 2016-07-15 
 * 描述: 个人办事、企业办事、部门服务共用 
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
	//区分个人企业和部门
	var type = '';
	// 个人20 法人10
	var usertype = '20';
	//openid
	var UserPK = '';
	var url = '';
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
			'js/libs/zepto.min.js'
		], function() {
			if(WindowTools.getExtraDataByKey('type')) {
				type = WindowTools.getExtraDataByKey('type') || '';
			}
			//办事入口
			if(WindowTools.getExtraDataByKey('openId')) {
				UserPK = WindowTools.getExtraDataByKey('openId') || '';
			}
			// UserPK = 'o2256xEZ4PSX1VB3Cof5I8gxzV8w';
			//部门办事列表打开页面
			if(WindowTools.getExtraDataByKey('URL')) {
				specialUrl = WindowTools.getExtraDataByKey('URL') || '';
			}
			if(type == 'person') {
				document.title = '个人办事';
			} else if(type == 'business') {
				document.title = '企业办事';
				usertype = '10';
			} else if(type == 'department') {
				document.title = '部门服务';
			}
			//项目根路径
			Config.getProjectBasePath(function(path) {
				httppath = path;
			});
			if(type == 'person' || type == 'business') {
				url = Config.serverUrl + 'zwdtTask/getTaskKindsByThemes';
			} else if(type == 'department') {
				url = Config.serverUrl + 'zwdtTask/getTaskKindsByOu';
			}
			Config.getUserguidbyOpenID(UserPK, function(options, tips) {
				ajaxData(options);
			}, function(options) {
				ajaxData(options);
			});
		});

	}

	/*通用点击*/
	function onClick() {
		Zepto('.affairs-item').on('tap', function() {
			var nextUrl = '';
			var _this = Zepto(this);
			var id = _this.attr('id');
			var title = _this.attr('name');
			if(type == 'person') {
				nextUrl = httppath + 'html/service/ZWFW_Common_list.html?usertype=' + usertype + '&dictid=' + encodeURIComponent(id) + '&UserPK=' + UserPK;
			} else if(type == 'business') {
				nextUrl = httppath + 'html/service/ZWFW_Common_list.html?usertype=' + usertype + '&dictid=' + encodeURIComponent(id) + '&UserPK=' + UserPK;
			} else if(type = 'department') {
				nextUrl = httppath + 'html/service/ZWFW_Common_list.html?OUGuid=' + id + '&UserPK=' + UserPK + '&specialUrl=' + specialUrl + '&title=' + title;
			}
			window.location.href = nextUrl;
		});
	}
	/**
	 * @description 获取服务
	 */
	function ajaxData(options) {
		var requestData = {};
		requestData.token = Config.validateData;
		var data = {};
		if(type == 'person') {
			data = {
				usertype: usertype,
				ispcuse: 1
			};
		} else if(type == 'business') {
			data = {
				usertype: usertype,
				ispcuse: 1
			};
		} else if(type == 'department') {
			data = {
				usertype: '', //usertype
				areacode: Config.areacode
			};
		}
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
				if(type == 'person' || type == 'business') {
					dealItemList(response);
				} else if(type == 'department') {
					dealOUList(response);
				}
			},
			error: function(error) {
				UITools.closeWaiting();
				console.log("详情error");
				UITools.toast('请求数据失败');
				console.log(JSON.stringify(error));
			}
		});
	}
	/*个人办事、企业办事通用处理response*/
	function dealItemList(response) {
		if(response && response.custom && response.custom.code == 1 && response.status && response.status.code == 200 && response.custom.dictlist && Array.isArray(response.custom.dictlist)) {
			var tmpInfo = response.custom.dictlist;
			var lastInfo = [];
			for(var i = 0, len = tmpInfo.length; i < len; i++) {
				lastInfo[i] = tmpInfo[i];
			}
			var litemplate = "<li class='affairs-item'id='{{dictid}}'><a class='affairs-item-icon'style='background: url({{dictrul}});background-size: 50px 50px;'></a><a class='affairs-item-name'>{{dictname}}</a></li>";
			Zepto("#iteminfo").html('');
			var html = ''
			//遍历数组
			mui.each(lastInfo, function(key, value) {
				if(value) {
					html += Mustache.render(litemplate, value);
				}
			});
			if(html) {
				Zepto("#iteminfo").append(html);
			}
			onClick();
		}
	}
	/*部门处理response*/
	function dealOUList(response) {
		if(response && response.custom && response.custom.code == 1 && response.status && response.status.code == 200 && response.custom.oulist && Array.isArray(response.custom.oulist)) {
			var tmpInfo = response.custom.oulist;
			var lastInfo = [];
			for(var i = 0, len = tmpInfo.length; i < len; i++) {
				lastInfo[i] = tmpInfo[i];
			}
			var litemplate = "<li class='affairs-item'id='{{ouguid}}' name='{{ouname}}'><a class='affairs-item-icon'style='background: url({{ouurl}});background-size: 50px 50px;'></a><a class='affairs-item-name'>{{ouname}}</a></li>";
			Zepto("#iteminfo").html('');
			var html = ''
			//遍历数组
			mui.each(lastInfo, function(key, value) {
				if(value) {
					html += Mustache.render(litemplate, value);
				}
			});
			if(html) {
				Zepto("#iteminfo").append(html);
			}
			onClick();
		}
	}
});