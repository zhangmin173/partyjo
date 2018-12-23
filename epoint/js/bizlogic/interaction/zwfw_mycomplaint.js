/**
 * 作者: 
 * 创建时间:2017/6/013 10:11:35
 * 版本:[1.0, 2017/6/13]
 * 版权:江苏国泰新点软件有限公司
 * 描述:我的投诉 列表
 */
define(function(require, exports, module) {
	"use strict";
	//每一个页面都要引入的工具类
	var CommonTools = require('CommonTools_Core');
	//引入config-seaBizConfig.js里的别名配置
	var config = require('config_Bizlogic');
	var WindowTools = require('WindowTools_Core');
	//下拉刷新
	var PullToRefreshTools = require('PullToRefresh_Impl_Default_Core');
	//下拉刷新对象
	var pullToRefreshObj;
	var pageSize = '10';
	var OpenID = '';
	var searchValue = '';
	var totalcount = '';
	var url = config.serverUrl + 'zwdtConsult/private/getConsultListByType';
	var httppath = '';
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
			'js/libs/zepto.min.js',
		], function() {
			OpenID = WindowTools.getExtraDataByKey("openId") || '';
			//searchValue = document.getElementById('TaskName').value;
			//OpenID = 'o2256xOSO9s3FnPU3gAxRj7WfPI4';
			// 项目根路径
			config.getProjectBasePath(function(path) {
				httppath = path;
			});
			//通过openid获取用户信息
			config.getUserguidbyOpenID(OpenID, function(options, tips) {
				initPullRefreshList(options);
			}, function(response) {
				console.log(JSON.stringify(response));
				window.location.href = httppath + 'html/interaction/zwfw_user_binding.html' + '?openId=' + OpenID;
			});
			document.getElementById('addcomplain').addEventListener('tap', function() {
				self.location = 'zwfw_mycomplaint_add.html?UserPK=' + OpenID;
			});
			//搜索
			mui('#search').on('change', '#TaskName', function() {
				searchAction();
			});
			mui('#search').on('tap', '#input-searchName', function() {
				searchAction();
			});
		});
	}
	/**
	 * @description 初始化监听
	 */
	function searchAction() {

		searchValue = document.getElementById('TaskName').value;
		//刷新
		console.log("搜索:" + searchValue);
		pullToRefreshObj.refresh();

	}
	/**
	 * @description 初始化下拉刷新
	 */
	function initPullRefreshList(options) {
		//动态选择映射模板
		var getLitemplate = function(value) {
			var temple = '';
			if(value.isanswer == "0") {
				temple = "<li class='mui-table-view-cell' id='{{consultguid}}'><p class='appointment-matters' style='word-break: break-all;' id='{{consultguid}}' >{{question}}</p><p class='mui-clearfix' id='{{consultguid}}'><span class='appointment-date' id='{{consultguid}}'>{{askdate}}</span><span class='cancel-reservation current1' id='{{consultguid}}'>未答复</span></p></li>"
			} else {
				temple = "<li class='mui-table-view-cell' id='{{consultguid}}'><p class='appointment-matters' style='word-break: break-all;'  id='{{consultguid}}' >{{question}}</p><p class='mui-clearfix' id='{{consultguid}}'><span class='appointment-date' id='{{consultguid}}'>{{askdate}}</span><span class='cancel-reservation current2' id='{{consultguid}}'>已答复</span></p></li>"
			}
			return temple;
		};
		var getData = function(currPage) {
			var requestData = {};
			//动态校验字段
			requestData.token = config.validateData;
			var data = {
				"consulttype": "2",
				"currentpage": currPage,
				"pagesize": pageSize,
				"titlelimit": "",
				"contentlimit": "",
				"answerlimit": ""
			};
			requestData.params = data;
			//某一些接口是要求参数为字符串的
			console.log('请求数据:' + JSON.stringify(requestData));
			return JSON.stringify(requestData);
		};
		var onClickCallback = function(e) {
			var id = e.target.id;
			console.log(id)
			mui.openWindow({
				url: "zwfw_myconsult_detail.html?RowGuid=" + id + '&UserPK=' + OpenID
			});

		};
		//动态处理数据
		var changeResponseDataCallback = function(response) {
			console.log(JSON.stringify(response))
			if(response.status.code != 200) {
				mui.toast(response.status.text);
				return;
			};
			if(response.custom.code == 0) {
				mui.toast(response.custom.text);
				return;
			}
			var ConsultList = response.custom.consultlist;
			var projectlist = [];
			//去掉多余层
			for(var i = 0, len = ConsultList.length; i < len; i++) {
				projectlist.push(ConsultList[i]);
			}
			totalcount = response.custom.totalcount;

			return projectlist;
		}
		var changeToltalCountCallback = function() {
			return totalcount;
		}
		var successRequestCallback = function() {

		}
		PullToRefreshTools.initPullDownRefresh({
			isDebug: true,
			bizlogic: {
				defaultInitPageNum: 0,
				getLitemplate: getLitemplate,
				getUrl: url,
				getRequestDataCallback: getData,
				itemClickCallback: onClickCallback,
				changeResponseDataCallback: changeResponseDataCallback,
				changeToltalCountCallback: changeToltalCountCallback,
				//请求成功,并且成功处理后会调用的成功回调方法,传入参数是成功处理后的数据
				successRequestCallback: successRequestCallback,
				ajaxSetting: {
					headers: {
						Accept: "text/html;charset=utf-8",
						Authorization: "Bearer " + options.token || ''
					},
					contentType: 'application/json;charset=UTF-8'
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
				//console.log("刷新");
				pullToRefreshObj.refresh();
			}, 100);
		});

	}
});