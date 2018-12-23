/**
 * 作者: ykx
 * 时间: 2016年8月26日
 * 描述: 热点咨询
 */
define(function(require, exports, module) {
	"use strict";
	var WindowTools = require('WindowTools_Core');
	var CommonTools = require('CommonTools_Core');
	//下拉刷新
	var PullToRefreshTools = require('PullToRefresh_Impl_Default_Core');
	//等待框
	var UITools = require('UITools_Core');
	//config引入
	var Config = require('config_Bizlogic');
	//下拉刷新对象
	var pullToRefreshObj;
	var count = 0;
	var maxPageIndex = 1;
	var jsondata = "";
	var searchValue = '';
	var pageSize = 10;
	var temple = '';
	var url = '';
	var types = 0;
	var totalcount = '';
	var OpenID = ''; //oegp-jlrnLOzYaGkMe0HyQm9B_qQ
	var httppath = '';
	//搜索值
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
			OpenID = WindowTools.getExtraDataByKey("openId") || '';
			//OpenID = 'o2256xOSO9s3FnPU3gAxRj7WfPI4';
			// 项目根路径
			Config.getProjectBasePath(function(path) {
				httppath = path;
			});
			//通过openid获取用户信息
			Config.getUserguidbyOpenID(OpenID, function(options, tips) {
				initPullRefreshList(options);
				initListeners();
				change();
			}, function(response) {
				console.log(JSON.stringify(response));
				window.location.href = httppath + 'html/interaction/zwfw_user_binding.html' + '?openId=' + OpenID;
			});
		});

	}
	/*初始化监听*/
	function initListeners() {
		//搜索
		mui('.search').on('tap', '#input-searchName', function() {
			searchAction();
		});
		mui('.search').on('change', '#search', function() {
			searchAction();
		});
	}
	/**
	 * @description 初始化监听
	 */
	function searchAction() {
		searchValue = document.getElementById('search').value;
		//刷新
		pullToRefreshObj.refresh();
		console.log("搜索:" + searchValue);
	}
	/**
	 * @description 初始化下拉刷新
	 */
	function initPullRefreshList(options) {
		var getLitemplate = function(value) {
			if(value.isanswer == "0") {
				var temple =
					'<li class="mui-table-view-cell" id="{{consultguid}}"><p class="appointment-matters" style="word-break: break-all;"  id="{{consultguid}}">{{question}}</p><p class="mui-clearfix" id="{{consultguid}}"><span class="appointment-date" id="{{consultguid}}">{{askdate}}</span><span class="cancel-reservation current1" id="{{consultguid}}">未回复</span></p></li>';
			} else {
				var temple =
					'<li class="mui-table-view-cell" id="{{consultguid}}"><p class="appointment-matters" style="word-break: break-all;"  id="{{consultguid}}">{{question}}</p><p class="mui-clearfix" id="{{consultguid}}"><span class="appointment-date" id="{{consultguid}}">{{askdate}}</span><span class="cancel-reservation current2" id="{{consultguid}}">已回复</span></p></li>';
			}
			return temple;
		}
		var geturl = function() {
			url = Config.serverUrl + "zwdtConsult/private/getConsultListByType";
			console.log(url);
			return url;
		}
		var getData = function(currPage) {
			var search = Zepto('#search').val();
			var requestData = {};
			requestData.token = Config.validateData;
			var data = {
				"consulttype": "1",
				"currentpage": currPage,
				"pagesize": pageSize,
				"titlelimit": "",
				"contentlimit": "",
				"answerlimit": ""
				//					QUESTION: search
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
				url: "zwfw_myconsult_detail.html?RowGuid=" + id + '&UserPK=' + OpenID + '&isConsult=1'
			});
		};
		var changeResponseDataCallback = function(response) {
			console.log(JSON.stringify(response));
			if(response.status.code != 200) {
				mui.toast(response.status.text);
				return;
			}
			if(response.custom.code == 0) {
				mui.toast(response.custom.text);
				return;
			}
			var ConsultList = response.custom.consultlist;
			var ConsultInfo = [];
			//			去掉多余层
			for(var i = 0, len = ConsultList.length; i < len; i++) {
				ConsultInfo.push(ConsultList[i]);
			}
			totalcount = response.custom.totalcount;
			Zepto('#totalnum').html(totalcount.toString());
			maxPageIndex = Math.ceil(totalcount / pageSize);
			return ConsultInfo;
			//			return response.UserArea.TotalCount
		};
		//mock完成后回调函数
		var successRequestCallback = function() {

		};
		var changeToltalCountCallback = function() {
			return totalcount;
		}
		PullToRefreshTools.initPullDownRefresh({
			isDebug: true,
			bizlogic: {
				defaultInitPageNum: 0,
				getRequestDataCallback: getData,
				getUrl: geturl,
				getLitemplate: getLitemplate,
				itemClickCallback: onClickCallback,
				changeResponseDataCallback: changeResponseDataCallback,
				successRequestCallback: successRequestCallback,
				changeToltalCountCallback: changeToltalCountCallback,
				ajaxSetting: {
					headers: {
						Accept: "text/html;charset=utf-8",
						Authorization: "Bearer " + options.token || ''
					},
					contentType: 'application/json;charset=UTF-8'
				}
			},
			//三种皮肤
			skin: 'default'
		}, function(pullToRefresh) {
			//console.log("生成下拉刷新成功");
			pullToRefreshObj = pullToRefresh;
			setTimeout(function() {
				//console.log("刷新");
				pullToRefreshObj.refresh();
			}, 1000);
		});
	}
	var change = function() {
		var hetconsult = Zepto('#hotconsult');
		hetconsult.on('tap', function(e) {
			types = 0;
			pullToRefreshObj.refresh();
			//				initListeners();
		});
		var myconsult = Zepto('#myconsult');
		myconsult.on('tap', function() {
			types = 1;
			pullToRefreshObj.refresh();
			//				initListeners();
		});
		var AddConsult = Zepto('#AddConsult');
		AddConsult.on('tap', function() {
			Config.getProjectBasePath(function(bathpath) {
				var bathpath = bathpath;
				console.log(bathpath)
				var openurl = 'html/interaction/zwfw_myconsult_add.html';
				var url = bathpath + openurl + '?UserPK=' + OpenID;
				console.log(openurl);
				WindowTools.createWin('detail2', url, OpenID);
			});
		});
	}

});