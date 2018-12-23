/**
 * 作者: hybo
 * 时间: 2016-07-15 
 * 描述: 事项列表
 */
define(function(require, exports, module) {
	"use strict";
	//每一个页面都要引入的工具类
	var CommonTools = require('CommonTools_Core');
	var WindowTools = require('WindowTools_Core');
	var UITools = require('UITools_Core');
	//下拉刷新
	var PullToRefreshTools = require('PullToRefresh_Impl_Default_Core');

	//config引入
	var Config = require('config_Bizlogic');
	//下拉刷新对象
	var pullToRefreshObj;
	//搜索值
	var searchContent = '';
	//最大数据量默认为0
	var totalCount = 0;
	var httppath = '';
	//	var ApplyerType = '';
	var dictid = ''; // dictid
	var OUGuid = '';
	var UserPK = ''; // openid
	var specialUrl = '';
	var usertype = '';
	var title = '';
	//是否是第一次下拉刷新
	var isFirst = true;
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
			'js/core/RayApp/PullToRefresh/PullToRefresh-Skin.css'
		], function() {
			if(WindowTools.getExtraDataByKey('UserPK')) {
				UserPK = WindowTools.getExtraDataByKey('UserPK') || '';
			}
			if(WindowTools.getExtraDataByKey('usertype')) {
				usertype = WindowTools.getExtraDataByKey('usertype') || '';
			}
			if(WindowTools.getExtraDataByKey('dictid')) {
				dictid = decodeURIComponent(WindowTools.getExtraDataByKey('dictid'));
			}
			//			if(WindowTools.getExtraDataByKey('tasktypeqy')) {
			//				tasktypeqy = decodeURIComponent(WindowTools.getExtraDataByKey('tasktypeqy'));
			//			}
			if(WindowTools.getExtraDataByKey('OUGuid')) {
				OUGuid = WindowTools.getExtraDataByKey('OUGuid') || '39430fbf-2b6c-4fcf-94eb-d1c16628522b';
			}
			if(WindowTools.getExtraDataByKey('specialUrl')) {
				specialUrl = WindowTools.getExtraDataByKey('specialUrl') || '';
			}
			title = WindowTools.getExtraDataByKey('title') || '';
			document.title = title;
			//项目根路径
			Config.getProjectBasePath(function(path) {
				httppath = path;
			});
			Config.getUserguidbyOpenID(UserPK, function(options, tips) {
				// 初始化下拉刷新
				initPullRefreshList(options);
				initListener(options);
			}, function(options) {
				// 初始化下拉刷新
				initPullRefreshList(options);
				initListener(options);
			});
		});

	}

	function initListener(options) {
		bindevent(options);
	}

	/**
	 * @description 初始化下拉刷新
	 */
	function initPullRefreshList(options) {
		var url = Config.serverUrl + 'zwdtTask/getTaskListByCondition';
		var pageSize = 10;
		var getData = function(currPage) {
			var requestData = {};
			//动态校验字段
			requestData.token = Config.validateData;
			var data = {
				"currentpage": currPage.toString(),
				"pagesize": pageSize,
				"ouguid": OUGuid,
				"dictid": dictid, // 关联主题分类的guid
				"usertype": usertype,
				"areacode": Config.areacode, // 辖区编码
				"searchcondition": searchContent,
				"onlinehandle": ''
			};
			requestData.params = data;
			//某一些接口是要求参数为字符串的
			requestData = JSON.stringify(requestData);
			//console.log('url:' + url);
			console.log('请求数据:' + requestData);
			return requestData;
		};
		//成功回调
		var successRequestCallback = function(response) {
			//console.log("请求成功-最终映射数据:" + JSON.stringify(response));
		};
		//改变接口返回的数据
		var changeResponseDataCallback = function(response) {
			console.log(JSON.stringify(response));
			//定义临时数组
			var tempArray = [];
			if(response && response.custom && response.custom.tasklist) {
				tempArray = response.custom.tasklist;
			}
			return tempArray;
		};
		//映射模板
		var getLitemplate = function(data) {
			var litemplate = '';
			if(data) {
				// 不存在子项的时候
				if(!data.childtasklist || data.childtasklist.length == 0) {
					litemplate = '<li class="mui-table-view-cell"><div class="main-area" guid="{{taskguid}}" ouName="{{ouname}}" taskName="{{taskname}}"><div class="mask-layer"><p><span class="circle1">申请</span><span class="circle2">预约</span><span class="circle3">收藏</span></p><div></div></div><div class="title">{{taskname}}</div><p>{{ouname}}</p></div></li>';
				} else {
					var childTaskList = data.childtasklist;
					// 存在子项的时候
					litemplate = '<li class="mui-table-view-cell noactive"><div class="main-area"guid="{{taskguid}}" ouName="{{ouname}}" taskName="{{taskname}}"><i class="arrow"flag="1"></i><div class="mask-layer"><p><span class="circle1">申请</span><span class="circle2">预约</span><span class="circle3">收藏</span></p><div></div></div><div class="title mui-ellipsis-2">{{taskname}}</div></div>'
					litemplate += '<div class="childarea">';
					for(var i = 0, len = childTaskList.length; i < len; i++) {
						litemplate += '<div class="childarea-child"guid="' + childTaskList[i].taskguid + '" ouName="' + childTaskList[i].ouname + '" taskName="' + childTaskList[i].taskname + '"><div class="mask-layer"><p><span class="circle1">申请</span><span class="circle2">预约</span><span class="circle3">收藏</span></p><div></div></div><div class="title mui-ellipsis-2">' + childTaskList[i].taskname + '</div><p>' + childTaskList[i].ouname + '</p></div>';
					}
					litemplate += '</div>';
					litemplate += '</li>';
				}
			}
			return litemplate;
		};
		var onClickCallback = function(e) {
			//			var _this = Zepto(this);
			//			var taskGuid = _this.attr('id');
			//			var ouName = _this.attr('ouName');
			//			var taskName = _this.attr('taskName');
			//			if(specialUrl != '') {
			//				// 获取事项详情(传递appointment是否预约)
			//				getTaskDetail(taskGuid, ouName, taskName, options);
			//			} else {
			//				window.location.href = httppath + 'html/service/ZWFW_ItemsCommon_detail.html?taskGuid=' + taskGuid + '&UserPK=' + UserPK + '&userType=' + usertype + '&ouName=' + ouName + '&taskName=' + taskName;
			//			}
		};
		PullToRefreshTools.initPullDownRefresh({
			isDebug: true,
			up: {
				auto: true
			},
			bizlogic: {
				defaultInitPageNum: 0,
				getLitemplate: getLitemplate,
				getUrl: url,
				getRequestDataCallback: getData,
				changeResponseDataCallback: changeResponseDataCallback,
				successRequestCallback: successRequestCallback,
				//requestTimeOut:3000,
				itemClickCallback: onClickCallback,
				refreshCallback: function() {
					isFirst = true;
				},
				listdataId: 'listdata',
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
			skin: 'type1'
		}, function(pullToRefresh) {
			//console.log("生成下拉刷新成功");
			pullToRefreshObj = pullToRefresh;
			setTimeout(function() {
				//console.log("刷新");
				//pullToRefreshObj.refresh();
			}, 1000)
		});
	}

	// 获取事项详情
	function getTaskDetail(taskGuid, ouName, taskName, options) {
		var url = Config.serverUrl + 'zwdtTask/getTaskBasicInfo';
		var requestData = {};
		requestData.token = Config.validateData;
		var data = {
			"taskguid": taskGuid,
			"isneedall": "0"
		}
		requestData.params = data;
		requestData = JSON.stringify(requestData);
		UITools.showWaiting();
		mui.ajax(url, {
			data: requestData,
			timeout: "15000", // 超时时间设置为3秒；
			type: "POST",
			headers: {
				Accept: "text/html;charset=utf-8",
				Authorization: "Bearer " + options.token || ''
			},
			contentType: 'application/json;charset=UTF-8',
			success: function(response) {
				UITools.closeWaiting();
				console.log("事项详情success");
				var response = JSON.parse(response);
				console.log(JSON.stringify(response));
				if(response && response.status && response.status.code == 200) {
					if(response.custom && response.custom.code == 1) {
						var tmp = response.custom;
						var isAppointment = '';
						if(tmp.taskelement.appointment == '0') {
							isAppointment = '0';
						} else {
							isAppointment = '1';
						}
						// 跳转新增预约页面
						window.location.href = httppath + specialUrl + '?taskGuid=' + taskGuid + '&UserPK=' + UserPK + '&ouName=' + ouName + '&taskName=' + taskName + '&isAppointment=' + isAppointment;
					} else {
						UITools.toast('请求数据失败');
					}
				} else {
					UITools.toast(response.status.text);
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

	//绑定列表事件
	function bindevent(options) {
		// 大项点击详情事件
		mui(".mui-table-view").on("tap", '.main-area', function() {
			var _this = Zepto(this);
			if(Zepto(this).find('i').length == 0) {
				Zepto('.mask-layer').css('display', 'none');
				var taskGuid = _this.attr('guid');
				var ouName = _this.attr('ouName');
				var taskName = _this.attr('taskName');
				if(specialUrl != '') {
					// 获取事项详情(传递appointment是否预约)
					getTaskDetail(taskGuid, ouName, taskName, options);
				} else {
					window.location.href = httppath + 'html/service/ZWFW_ItemsCommon_detail.html?taskGuid=' + taskGuid + '&UserPK=' + UserPK + '&userType=' + usertype + '&ouName=' + ouName + '&taskName=' + taskName;
				}
			}
		});
		// 小项点击详情事件
		mui(".mui-table-view").on("tap", ".childarea-child", function() {
			var _this = Zepto(this);
			Zepto('.mask-layer').css('display', 'none');
			var taskGuid = _this.attr('guid');
			var ouName = _this.attr('ouName');
			var taskName = _this.attr('taskName');
			if(specialUrl != '') {
				// 获取事项详情(传递appointment是否预约)
				getTaskDetail(taskGuid, ouName, taskName, options);
			} else {
				window.location.href = httppath + 'html/service/ZWFW_ItemsCommon_detail.html?taskGuid=' + taskGuid + '&UserPK=' + UserPK + '&userType=' + usertype + '&ouName=' + ouName + '&taskName=' + taskName;
			}
		});
		// 手风琴（展开、缩小）
		mui(".mui-table-view").on("tap", ".main-area", function(e) {
			var _this = this.getElementsByTagName('i')[0];
			if(_this) {
				e.stopPropagation();
				if(_this.getAttribute("flag") == 1) {
					_this.parentNode.nextElementSibling.style.height = _this.parentNode.nextElementSibling.scrollHeight + 'px';
					_this.parentNode.nextElementSibling.style.borderTopWidth = "1px";
					_this.style.backgroundImage = "url(../../img/service/img_arrowup.png)";
					_this.setAttribute("flag", 0);
				} else {
					_this.parentNode.nextElementSibling.style.height = 0;
					_this.parentNode.nextElementSibling.style.borderTopWidth = 0;
					_this.style.backgroundImage = "url(../../img/service/img_arrowdown.png)";
					_this.setAttribute("flag", 1);
				}
			}
		});
		// 点击事件
		mui(".mui-table-view").on("tap", ".mask-layer", function(e) {
			e.stopPropagation();
			this.style.display = 'none';
		});
		// 大事项长按事件
		//		mui("#listdata").on("longtap", ".main-area", function(e) {
		//			e.stopPropagation();
		//			this.querySelector('.mask-layer').style.display = 'block';
		//			return false;
		//		});
		// 小事项长按事件
		//		mui("#listdata").on("longtap", ".childarea-child", function(e) {
		//			e.stopPropagation();
		//			console.log("正在长按显示遮罩");
		//			this.querySelector('.mask-layer').style.display = 'block';
		//			return false;
		//		});

		// 搜索
		document.getElementById('searchContent').addEventListener('change', function() {
			searchContent = Zepto('#searchContent').val();
			// 当然也可以换为其它的刷新方法
			pullToRefreshObj.refresh();
		});

	}
});