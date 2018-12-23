/**
 * 作者: 
 * 创建时间:2017/6/013 10:11:35
 * 版本:[1.0, 2017/6/13]
 * 版权:江苏国泰新点软件有限公司
 * 描述:办事窗口
 */
define(function(require, exports, module) {
	"use strict";
	//每一个页面都要引入的工具类
	var CommonTools = require('CommonTools_Core');
	var WindowTools = require('WindowTools_Core');
	//下拉刷新
	var PullToRefreshTools = require('PullToRefresh_Impl_Default_Core');
	//config引入-这里示例引入方式
	var Config = require('config_Bizlogic');
	var openId = '';
	var choosetext = '';
	var totalcount = '';
	//下拉刷新对象
	var pullToRefreshObj;
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
			'css/libs/mui.previewimage.css',
			'js/libs/mui.min.js',
			'js/libs/mustache.min.js',
			'js/libs/zepto.min.js',
			'js/libs/mui.zoom.js',
			'js/libs/mui.previewimage.js'
		], function() {
			openId = WindowTools.getExtraDataByKey('openId') || '';
			//给图片绑定预览功能
			mui.previewImage();
			Config.getUserguidbyOpenID(openId, function(options, tips) {
				initPullRefreshList(options);
			}, function(options) {
				initPullRefreshList(options);
			});
		});

	}

	var aClick = function() {
		var finda = Zepto('#listdata').find('.mui-clearfix').find('.region-tel');
		mui.each(finda, function(key, value) {
			Zepto(this).on('tap', function() {
				window.location.href = 'tel:' + Zepto(this).attr('id');
			})
		})
	}

	/**
	 * @description 初始化下拉刷新
	 */
	function initPullRefreshList(options) {
		var url = Config.serverUrl + "zwfwWxUser/getAuditWindowList";
		var getLitemplate = function(value) {
			if(value.Tel == "") {
				var temple =
					'<li class="mui-clearfix"><span class="region-name">{{windowname}}</span><span class="noTel">暂无数据</span></li>';
			} else {
				var temple =
					'<li class="mui-clearfix"><span class="region-name">{{windowname}}</span><a href="#" class="region-tel" id="{{tel}}">{{tel}}</a></li>';
			}
			return temple;
		}
		var pageSize = 15;
		var getData = function(currPage) {
			var requestData = {};
			//动态校验字段
			requestData.token = Config.validateData;
			var data = {
				"windwosname": "",
				"lobbytype": choosetext,
				"currentpage": currPage,
				"pagesize": pageSize,
				"areacode": Config.areacode
			};
			requestData.params = data;
			//某一些接口是要求参数为字符串的
			//requestData = JSON.stringify(requestData);
			console.log('请求数据:' + JSON.stringify(requestData));

			return JSON.stringify(requestData);
		};
		var changeResponseDataCallback = function(response) {
			console.log(JSON.stringify(response));
			if(response.status.code != 200) {
				mui.toast(response.status.text);
				return false;
			}
			if(response.custom.code == 0) {
				mui.toast(response.custom.text);
				return false;
			}
			totalcount = response.custom.windowlist.length;
			var wdlist = response.custom.windowlist;
			var windowlist = [];
			//去掉多余层
			for(var i = 0, len = wdlist.length; i < len; i++) {
				windowlist.push(wdlist[i]);
			}
			return windowlist;
		}
		var changeToltalCountCallback = function() {
			return totalcount;
		}
		var successRequestCallback = function(response) {
			aClick();
		};
		PullToRefreshTools.initPullDownRefresh({
			isDebug: true,
			bizlogic: {
				defaultInitPageNum: 0,
				getLitemplate: getLitemplate,
				getUrl: url,
				getRequestDataCallback: getData,
				//requestTimeOut:3000,
				//itemClickCallback: onClickCallback,
				changeResponseDataCallback: changeResponseDataCallback,
				changeToltalCountCallback: changeToltalCountCallback,
				successRequestCallback: successRequestCallback,
				ajaxSetting: {
					contentType: 'application/json;charset=UTF-8',
					headers: {
						Accept: "text/html;charset=utf-8",
						Authorization: "Bearer " + options.token || ''
					},
				}
			},
			//三种皮肤
			//default -默认人的mui下拉刷新,webview优化了的
			//type1 -自定义类别1的默认实现, 没有基于iscroll
			//type1_material1 -自定义类别1的第一种材质
			skin: 'default'
		}, function(pullToRefresh) {
			//console.log("生成下拉刷新成功");
			pullToRefreshObj = pullToRefresh;
			setTimeout(function() {
				pullToRefreshObj.refresh();
			}, 1000);
		});
	}
});