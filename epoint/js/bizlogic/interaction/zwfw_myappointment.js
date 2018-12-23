/**
 * 作者: 
 * 创建时间:2017/6/013 10:11:35
 * 版本:[1.0, 2017/6/13]
 * 版权:江苏国泰新点软件有限公司
 * 描述:我的预约
 */
define(function(require, exports, module) {
	"use strict";
	var WindowTools = require('WindowTools_Core');
	//每一个页面都要引入的工具类
	var CommonTools = require('CommonTools_Core');
	//下拉刷新
	var PullToRefreshTools = require('PullToRefresh_Impl_Default_Core');
	//等待框
	var UITools = require('UITools_Core');
	//config引入-这里示例引入方式
	var Config = require('config_Bizlogic');
	//下拉刷新对象
	var pullToRefreshObj;
	var searchValue = '';
	var count = 0;
	var maxPageIndex = 1;
	var url = "";
	var ValidateData = '';
	var pageSize = 10;
	var totalcount = '';
	//区分我的预约和历史预约，我的预约yjyy
	var ShowType = 1;
	var OpenID = ''; //oegp-jlrnLOzYaGkMe0HyQm9B_qQ
	var httppath = '';
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
			url = Config.serverUrl + "queueAppointment/private/getAppointList";
			OpenID = WindowTools.getExtraDataByKey("openId") || 'o2256xDMTUlXels2li6ll3rycEZg';
			//OpenID = 'o2256xEZ4PSX1VB3Cof5I8gxzV8w';
			// 项目根路径
			Config.getProjectBasePath(function(path) {
				httppath = path;
			});
			//通过openid获取用户信息
			Config.getUserguidbyOpenID(OpenID, function(options, tips) {
				initPullRefreshList(options);
				change(options);
				AddAppointment();
			}, function(response) {
				console.log(JSON.stringify(response));
				window.location.href = httppath + 'html/interaction/zwfw_user_binding.html' + '?openId=' + OpenID;
			});
		});

	}
	/**
	 * @description 初始化下拉刷新
	 */
	function initPullRefreshList(options) {
		//动态选择映射模板
		var getLitemplate = function(value) {
			var inputtype = Zepto('#inputtype').val()
			var temple = '';
			console.log(JSON.stringify(value));
			if(inputtype == "0") {
				var temple =
					'<li class="mui-table-view-cell"><div class="mui-slider-right mui-disabled"><a class="mui-btn mui-btn-red" id="{{appointguid}}">取消预约</a></div><div class="mui-slider-handle"><span class="appointment-date">预约事项:</span><p class="cancel-reservation"></p><p class="appointment-matters">{{taskname}}</p><label>{{appointtime}}</label></div></li>';
			} else {
				// 历史预约
				if(value.status === "0") {
					value.type = '未取号';
					// 未取号
					var temple =
						'<li class="mui-table-view-cell"><span class="appointment-date">预约事项:</span><p class="appointment-matters">{{taskname}}</p><p class="cancel-reservation current2">{{type}}</p><label>{{appointtime}}</label></li>';
				} else if(value.status === "1") {
					// 已取号
					value.type = '已取号';
					var temple =
						'<li class="mui-table-view-cell"><span class="appointment-date">预约事项:</span><p class="appointment-matters">{{taskname}}</p><p class="cancel-reservation current1">{{type}}</p><label>{{appointtime}}</label></li>';
				} else if(value.status === "2") {
					// 过号
					value.type = '已过号';
					var temple =
						'<li class="mui-table-view-cell"><span class="appointment-date">预约事项:</span><p class="appointment-matters">{{taskname}}</p><p class="cancel-reservation current1">{{type}}</p><label>{{appointtime}}</label></li>';
				} else {
					// 删除
					value.type = '已取消';
					var temple =
						'<li class="mui-table-view-cell"><span class="appointment-date">预约事项:</span><p class="appointment-matters">{{taskname}}</p><p class="cancel-reservation current1">{{type}}</p><label>{{appointtime}}</label></li>';
				}
			}
			return temple;
		};
		var getData = function(currPage) {
			var requestData = {};
			//动态校验字段
			requestData.token = Config.validateData;
			var data = {
				"currentpage": currPage,
				"pagesize": pageSize,
				//"taskname": searchValue,
				"type": ShowType

				//tabType: 'tab1',
				//搜索值,接口里没有实现,这里可以打印代表搜索值已经获取到
			};
			requestData.params = data;
			//某一些接口是要求参数为字符串的
			console.log('请求数据:' + JSON.stringify(requestData));
			return JSON.stringify(requestData);
		};
		var onClickCallback = function(e) {

		};
		var changeResponseDataCallback = function(response) {
			console.log(JSON.stringify(response))
			if(response.status.code != 200) {
				mui.toast(response.status.text);
				return;
			}
			if(response.custom.code == 0) {
				mui.toast(response.custom.text);
				return;
			}
			if(response.custom.appointdatelist && Array.isArray(response.custom.appointdatelist)) {
				var AppointmentList = response.custom.appointdatelist;
				var AppointmentInfo = [];
				//去掉多余层
				for(var i = 0, len = AppointmentList.length; i < len; i++) {
					AppointmentInfo.push(AppointmentList[i]);
				}
				var totalcount = response.custom.totalcount;
				Zepto('#totalnum').html(totalcount.toString());
				maxPageIndex = Math.ceil(totalcount / pageSize);
				return AppointmentInfo;
			}

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
				getLitemplate: getLitemplate,
				getUrl: url,
				getRequestDataCallback: getData,
				itemClickCallback: onClickCallback,
				successRequestCallback: successRequestCallback,
				changeResponseDataCallback: changeResponseDataCallback,
				changeToltalCountCallback: changeToltalCountCallback,
				ajaxSetting: {
					headers: {
						Accept: "text/html;charset=utf-8",
						Authorization: "Bearer " + options.token || ''
					},
					contentType: 'application/json;charset=UTF-8'
				}
			},
			skin: 'type1'
		}, function(pullToRefresh) {
			//console.log("生成下拉刷新成功");
			pullToRefreshObj = pullToRefresh;
			setTimeout(function() {
				//console.log("刷新");
				pullToRefreshObj.refresh();
			}, 1000);
		});
	}
	var change = function(options) {
		var inputtype = Zepto('#inputtype').val();
		Zepto('#myyy').on('tap', function(e) {
			Zepto('#inputtype').val("0");
			ShowType = 1;
			pullToRefreshObj.refresh();
		});
		Zepto('#lsyy').on('tap', function(e) {
			Zepto('#inputtype').val("1");
			ShowType = 2;
			pullToRefreshObj.refresh();
		});
		var btnArray = ['确认', '取消'];
		Zepto('#listdata').on('tap', '.mui-btn', function(event) {
			var elem = this;
			var li = elem.parentNode.parentNode;
			mui.confirm('确认取消该条预约？', '', btnArray, function(e) {
				if(e.index == 0) {
					var id = event.target.id;
					li.parentNode.removeChild(li);
					console.log(id)
					elem.parentNode.removeChild(elem);
					deleteappointment(event.target.id, options);
				};

			});
		});
	}

	function deleteappointment(s, options) {
		url = Config.serverUrl + "queueAppointment/deleteAppoint";
		var requestData = {};
		//动态校验字段
		requestData.token = Config.validateData;
		var data = {
			"appointguid": s
		};
		requestData.params = data;
		requestData = JSON.stringify(requestData);
		console.log('请求数据:' + JSON.stringify(requestData));
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
					return false;
				}
				if(response.custom.code == 0) {
					mui.toast(response.custom.text);
					return false;
				}
			},
			error: function(response) {
				console.log('请求失败');
				console.log(JSON.stringify(response))
			}
		});
	}
	var AddAppointment = function() {
		Zepto('#AddAppointment').on('tap', function() {
			Config.getProjectBasePath(function(bathpath) {
				var bathpath = bathpath;
				var openurl = 'html/service/ZWFW_CommonService.html';
				var url1 = bathpath + openurl + '?openId=' + OpenID + '&URL=html/interaction/zwfw_myappointment_add.html&type=department';
				WindowTools.createWin('detail2', url1, OpenID);
			});
		})
	}

});