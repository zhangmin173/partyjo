/**
 * 作者:  hybo
 * 时间: 2016-07-15 
 * 描述: 事项搜索父页面 
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
	//下拉刷新
	var PullToRefreshTools = require('PullToRefresh_Impl_Default_Core');
	//下拉刷新对象
	//最大数据量默认为0
	var totalCount = 0;
	var pullToRefreshObj;
	//获取项目http的根目录，http://id:端口/项目名/
	var httppath = '';
	//openid
	var UserPK = '';
	var searchValue = document.getElementById('searchvalue').value;
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
			if(Zepto('#searchvalue').val() != '') {
				Zepto('#divhottask').hide();
				Zepto('#pullrefresh').show();
			} else {
				Zepto('#divhottask').show();
				Zepto('#pullrefresh').hide();
			}
			//事项搜索入口页面
			if(WindowTools.getExtraDataByKey('openId')) {
				UserPK = WindowTools.getExtraDataByKey('openId') || '';
			}
			//获取http根目录
			Config.getProjectBasePath(function(path) {
				httppath = path;
			});
			Config.getUserguidbyOpenID(UserPK, function(options, tips) {
				initPullRefreshList(options);
				ajaxHotItem(options);
				initListeners(options);
			}, function(options) {
				initPullRefreshList(options);
				ajaxHotItem(options);
				initListeners(options);
			});
		});

	}
	/**
	 * @description 初始化监听
	 */
	function initListeners(options) {
		mui('#search').on('tap', '#check', function() {
			searchValue = Zepto('#searchvalue').val();
			if(searchValue != '') {
				Zepto('#divhottask').hide();
				pullToRefreshObj.refresh();
				Zepto('#pullrefresh').show();
			} else {
				Zepto('#divhottask').show();
				Zepto('#pullrefresh').hide();
			}
		});
		mui('#search').on('change', '#searchvalue', function() {
			searchValue = Zepto('#searchvalue').val();
			if(searchValue != '') {
				Zepto('#divhottask').hide();
				pullToRefreshObj.refresh();
				Zepto('#pullrefresh').show();
			} else {
				Zepto('#divhottask').show();
				Zepto('#pullrefresh').hide();
			}
		});

		// 大项点击详情事件
		mui(".mui-table-view").on("tap", '.main-area', function() {
			var _this = Zepto(this);
			if(Zepto(this).find('i').length == 0) {
				Zepto('.mask-layer').css('display', 'none');
				var taskGuid = _this.attr('guid');
				var ouName = _this.attr('ouName');
				var taskName = _this.attr('taskName');
				var userType = _this.attr('type');
				if(userType != '20' && userType != '10') {
					userType = '20';
				}
				var nextUrl = httppath + 'html/service/ZWFW_ItemsCommon_detail.html?taskGuid=' + taskGuid + '&UserPK=' + UserPK + '&userType=' + userType;
				window.location.href = nextUrl;

			}
		});
		// 小项点击详情事件
		mui(".mui-table-view").on("tap", ".childarea-child", function() {
			var _this = Zepto(this);
			Zepto('.mask-layer').css('display', 'none');
			var taskGuid = _this.attr('guid');
			var ouName = _this.attr('ouName');
			var taskName = _this.attr('taskName');
			var userType = _this.attr('type');
			if(userType != '20' && userType != '10') {
				userType = '20';
			}
			var nextUrl = httppath + 'html/service/ZWFW_ItemsCommon_detail.html?taskGuid=' + taskGuid + '&UserPK=' + UserPK + '&userType=' + userType;
			window.location.href = nextUrl;

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
	}

	/**
	 * @description 请求通知通告五条数据
	 */
	function ajaxHotItem(options) {
		var url = Config.serverUrl + 'zwdtTask/getHotTaskList';
		var requestData = {};
		requestData.token = Config.validateData;
		var data = {
			"areacode": Config.areacode,
			"currentpage": 0,
			"pagesize": 10,
			"usertype": ""
		};
		requestData.params = data;
		requestData = JSON.stringify(requestData);
		console.log(url + requestData);
		mui.ajax(url, {
			data: requestData,
			dataType: "json",
			timeout: "15000", //超时时间设置为3秒；
			type: "POST",
			headers: {
				Accept: "text/html;charset=utf-8",
				Authorization: "Bearer " + options.token || ''
			},
			contentType: 'application/json;charset=UTF-8',
			success: function(response) {
				console.log("success");
				console.log(JSON.stringify(response));
				if(response && response.status && response.status.code == 200 && response.custom && response.custom.code == 1) {
					if(response.custom && response.custom.tasklist) {
						var tmpInfo = response.custom.tasklist;
						var lastInfo = [];
						for(var i = 0, len = tmpInfo.length; i < len; i++) {
							lastInfo[i] = tmpInfo[i];
						}
						console.log(JSON.stringify(lastInfo));
						//映射模板
						var litemplate = '<li class="mui-table-view-cell hot"id="{{taskguid}}"><a class="mui-navigate-right">{{taskname}}</a></li>';
						Zepto("#hotlist").html('');
						var html = ''
						//遍历数组
						mui.each(lastInfo, function(key, value) {
							if(value) {
								html += Mustache.render(litemplate, value);
							}
						});
						if(html) {
							Zepto("#hotlist").append(html);
						}
						Zepto('.hot').on('tap', function() {
							var taskGuid = Zepto(this).attr('id');
							window.location.href = httppath + 'html/service/ZWFW_ItemsCommon_detail.html?taskGuid=' + taskGuid + '&UserPK=' + UserPK;
						});
					}
				} else {
					UITools.toast('请求事项出错');
				}
			},
			error: function(error) {
				console.log("error");
				console.log(JSON.stringify(error));
				UITools.toast('请求事项出错');
			}
		});
	}
	/**
	 * @description 初始化下拉刷新
	 */
	function initPullRefreshList(options) {
		var url = Config.serverUrl + 'zwdtTask/getTaskListByCondition';
		//		var litemplate =
		//			'<li class="mui-table-view-cell"id="{{taskguid}}"type="{{applyertype}}"><a class="mui-navigate-right">{{taskname}}</a></li>';
		var pageSize = 10;
		var getData = function(currPage) {
			var requestData = {};
			//动态校验字段
			requestData.token = Config.validateData;
			var data = {
				"currentpage": currPage,
				"pagesize": pageSize,
				"searchcondition": searchValue,
				"areacode": Config.areacode,
				"ouguid": "",
				"applyertype": ""
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
			var outData = null;
			console.log("默认数据：" + JSON.stringify(response));
			if(response && response.custom && response.custom.code == 1 && response.status && response.status.code == 200) {
				if(Array.isArray(response.custom.tasklist)) {
					if(response.custom.totalcount) {
						totalCount = response.custom.totalcount;
					} else {
						totalCount = 0;
					}
					outData = [];
					for(var i = 0, len = response.custom.tasklist.length; i < len; i++) {
						outData[i] = response.custom.tasklist[i];
					}
				}
			}

			return outData;
		};
		//改变最大数据量
		var changeToltalCountCallback = function(response) {
			console.log(totalCount);
			return totalCount;
		};
		//映射模板
		var getLitemplate = function(data) {
			var litemplate = '';
			if(data) {
				// 不存在子项的时候
				if(!data.childtasklist || data.childtasklist.length == 0) {
					litemplate = '<li class="mui-table-view-cell"><div class="main-area" guid="{{taskguid}}" ouName="{{ouname}}" taskName="{{taskname}}" type="{{applyertype}}"><div class="mask-layer"><p><span class="circle1">申请</span><span class="circle2">预约</span><span class="circle3">收藏</span></p><div></div></div><div class="title">{{taskname}}</div><p>{{ouname}}</p></div></li>';
				} else {
					var childTaskList = data.childtasklist;
					// 存在子项的时候
					litemplate = '<li class="mui-table-view-cell noactive"><div class="main-area"guid="{{taskguid}}" ouName="{{ouname}}" taskName="{{taskname}}" type="{{applyertype}}"><i class="arrow"flag="1"></i><div class="mask-layer"><p><span class="circle1">申请</span><span class="circle2">预约</span><span class="circle3">收藏</span></p><div></div></div><div class="title mui-ellipsis-2">{{taskname}}</div></div>'
					litemplate += '<div class="childarea">';
					for(var i = 0, len = childTaskList.length; i < len; i++) {
						litemplate += '<div class="childarea-child"guid="' + childTaskList[i].taskguid + '" ouName="' + childTaskList[i].ouname + '" taskName="' + childTaskList[i].taskname + '" type="' + childTaskList[i].applyertype + '"><div class="mask-layer"><p><span class="circle1">申请</span><span class="circle2">预约</span><span class="circle3">收藏</span></p><div></div></div><div class="title mui-ellipsis-2">' + childTaskList[i].taskname + '</div><p>' + childTaskList[i].ouname + '</p></div>';
					}
					litemplate += '</div>';
					litemplate += '</li>';
				}
			}
			return litemplate;
		};
		//		var onClickCallback = function(e) {
		//			var _this = Zepto(this);
		//			var taskGuid = _this.attr('id');
		//			var userType = _this.attr('type');
		//			if(userType != '20' && userType != '10') {
		//				userType = '20';
		//			}
		//			var nextUrl = httppath + 'html/service/ZWFW_ItemsCommon_detail.html?taskGuid=' + taskGuid + '&UserPK=' + UserPK + '&userType=' + userType;
		//			window.location.href = nextUrl;
		//		};
		PullToRefreshTools.initPullDownRefresh({
			isDebug: true,
			up: {
				auto: true
			},
			bizlogic: {
				defaultInitPageNum: 0,
				getLitemplate: getLitemplate,
				//				getLitemplate: litemplate,
				getUrl: url,
				getRequestDataCallback: getData,
				changeResponseDataCallback: changeResponseDataCallback,
				changeToltalCountCallback: changeToltalCountCallback,
				successRequestCallback: successRequestCallback,
				//requestTimeOut:3000,
//				itemClickCallback: onClickCallback,
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
				//console.log("刷新");
				//pullToRefreshObj.refresh();
			}, 1000)
		});
	}

});