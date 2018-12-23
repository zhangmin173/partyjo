/**
 * 作者: 
 * 创建时间:2017/6/013 10:11:35
 * 版本:[1.0, 2017/6/13]
 * 版权:江苏国泰新点软件有限公司
 * 描述:我的办件
 */
define(function(require, exports, module) {
	"use strict";
	var count = 0;
	var maxPageIndex = 1;
	var WindowTools = require('WindowTools_Core');
	//每一个页面都要引入的工具类
	var CommonTools = require('CommonTools_Core');
	//下拉刷新
	var PullToRefreshTools = require('PullToRefresh_Impl_Default_Core');
	//config引入-这里示例引入方式
	var Config = require('config_Bizlogic');
	//下拉刷新对象
	var pullToRefreshObj;
	var url = '';
	var pageSize = 10;
	//搜索值
	var ulpull = '';
	var SearchValue = '';
	var ValidateData = '';
	var OpenID = ''; //oegp-jlrnLOzYaGkMe0HyQm9B_qQ
	var TotalCount = '';
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
			//获取token
			url = Config.serverUrl + "zwdtProject/private/getMyProject";
			OpenID = WindowTools.getExtraDataByKey("openId") || '';
			//OpenID = 'o2256xKbOA1a1UJOVpACBVwVqm84'; //o2256xBTZWiov4dnmfYyD4krhPzY 
			// 项目根路径
			Config.getProjectBasePath(function(path) {
				httppath = path;
			});

			//通过openid获取用户信息
			Config.getUserguidbyOpenID(OpenID, function(options, tips) {
				initPullRefreshList(options);
				initListeners();
			}, function(response) {
				location.href = httppath + 'html/interaction/zwfw_user_binding.html' + '?openId=' + OpenID;
				console.log(JSON.stringify(response));
			});
		});

	}
	/*初始化监听*/
	function initListeners() {
		//搜索
		mui('#search').on('tap', '#input-searchName', function() {
			searchAction();
		});
		mui('#search').on('change', '#TaskName', function() {
			searchAction();
		});
	}
	/**
	 * @description 初始化监听
	 */
	function searchAction() {
		SearchValue = document.getElementById('TaskName').value;
		//刷新
		pullToRefreshObj.refresh();
		console.log("搜索:" + SearchValue);
	}
	/**
	 * @description 初始化下拉刷新
	 */
	function initPullRefreshList(options) {
		//动态选择映射模板
		var getLitemplate = function(value) {
			var temple = '';
			console.log(JSON.stringify(value));
			if(value.projectstatus == '外网申报未提交') {
				temple = '<li id="{{projectguid}}" _task="{{projectstatus}}" centerGuid="{{centerguid}}" taskGuid="{{taskguid}}" class="mui-table-view-cell mui-clearfix"><div class="mui-slider-right mui-disabled"><a id="{{projectguid}}" class="mui-btn mui-btn-red">删除</a></div><div class="mui-slider-handle mui-table"><div class="mui-table-cell"><p id="{{projectguid}}" _task="{{projectstatus}}"  class="mui-clearfix"><span class="itme-number"><label>办件编号：</label>{{flowsn}}</span><span class="state"><label>状态：</label>{{projectstatus}}</span></p><p id="{{projectguid}}" _task="{{projectstatus}}" class="requirement">{{projectname}}</p><p id="{{projectguid}}" _task="{{projectstatus}}"  class="unit"><label>办理部门：</label>{{ouname}}</p></div></div></li>';
			} else {
				temple = '<li id="{{projectguid}}" _task="{{projectstatus}}" centerGuid="{{centerguid}}" taskGuid="{{taskguid}}" class="mui-table-view-cell mui-clearfix"><div class="mui-slider-handle mui-table"><div class="mui-table-cell"><p id="{{projectguid}}" _task="{{projectstatus}}"  class="mui-clearfix"><span class="itme-number"><label>办件编号：</label>{{flowsn}}</span><span class="state"><label>状态：</label>{{projectstatus}}</span></p><p id="{{projectguid}}" _task="{{projectstatus}}" class="requirement">{{projectname}}</p><p id="{{projectguid}}" _task="{{projectstatus}}"  class="unit"><label>办理部门：</label>{{ouname}}</p></div></div></li>';
			}
			return temple;
		};
		var getData = function(currPage) {
			var requestData = {};
			//动态校验字段
			requestData.token = Config.validateData;
			var data = {
				"currentpage": currPage,
				"pagesize": 5,
				"areacode": Config.areacode,
				"status": 0,
				"keyword": SearchValue
				//搜索值,接口里没有实现,这里可以打印代表搜索值已经获取到
			};
			requestData.params = data;
			//某一些接口是要求参数为字符串的
			console.log('请求数据:' + JSON.stringify(requestData));
			return JSON.stringify(requestData);
		};
		var onClickCallback = function(e) {};
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
			if(response.custom.projectlist && Array.isArray(response.custom.projectlist)) {
				var tasklist = response.custom.projectlist;
				var projectlist = [];
				//去掉多余层
				for(var i = 0, len = tasklist.length; i < len; i++) {
					projectlist.push(tasklist[i]);
				}
				TotalCount = response.custom.totalcount;
				Zepto('#totalnum').html(TotalCount.toString());
				maxPageIndex = Math.ceil(TotalCount / pageSize);
				return projectlist;
			}
		}
		var successRequestCallback = function() {
			del(options);
			document.getElementsByTagName('ul')[0].addEventListener('tap', function(e) {
					var id = e.target.id;
					var pars = id;
					var task = Zepto("#" + pars).attr('_task');
					var taskGuid = Zepto("#" + pars).attr('taskGuid');
					var centerGuid = Zepto("#" + pars).attr('centerGuid');
					if(e.target.tagName === 'li') {
						if(task == '外网申报未提交') {
							mui.openWindow({
								url: "../service/ZWFW_AuditApply.html?ProjectGuid=" + pars + "&UserPK=" + OpenID
							});
						} else if(task == '待补办') {
							mui.openWindow({
								url: "../service/ZWFW_AuditProjectDetail.html?ProjectGuid=" + pars + "&UserPK=" + OpenID + "&EditM=1" + '&taskGuid=' + taskGuid + '&centerGuid=' + centerGuid
							});
						} else {
							mui.openWindow({
								url: "../service/ZWFW_AuditProjectDetail.html?ProjectGuid=" + pars + "&UserPK=" + OpenID + "&EditM=0" + '&taskGuid=' + taskGuid + '&centerGuid=' + centerGuid
							});
						}
					}
					if(e.target.tagName === 'P') {
						if(task == '外网申报未提交') {
							mui.openWindow({
								url: "../service/ZWFW_AuditApply.html?ProjectGuid=" + pars + "&UserPK=" + OpenID

							});
						} else if(task == '待补办') {
							mui.openWindow({
								url: "../service/ZWFW_AuditProjectDetail.html?ProjectGuid=" + pars + "&UserPK=" + OpenID + "&EditM=1" + '&taskGuid=' + taskGuid + '&centerGuid=' + centerGuid

							});
						} else {
							mui.openWindow({
								url: "../service/ZWFW_AuditProjectDetail.html?ProjectGuid=" + pars + "&UserPK=" + OpenID + "&EditM=0" + '&taskGuid=' + taskGuid + '&centerGuid=' + centerGuid

							});
						}
					}
				}

			);
		}
		var changeToltalCountCallback = function() {
			return TotalCount;
		}
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
				itemClickCallback: onClickCallback,
				changeResponseDataCallback: changeResponseDataCallback,
				//				changeToltalCountCallback: changeToltalCountCallback,
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
		});

	}

	function del(options) {
		Zepto('#listdata').on('tap', '.mui-btn', function(event) {
			var elem = this;
			var li = elem.parentNode.parentNode;
			mui.confirm('确认删除该条记录？', '', btnArray, function(e) {
				if(e.index == 0) {
					li.parentNode.removeChild(li);
					var id = event.target.id;
					console.log(id)
					elem.parentNode.removeChild(elem);
				} else {
					mui.swipeoutClose(li);
				};
				deleteProject(id, options);
			});
		});
		var btnArray = ['确认', '取消'];
	}

	function deleteProject(s, options) {
		url = Config.serverUrl + "zwdtProject/private/deleteProject";
		var requestData = {};
		//动态校验字段
		requestData.token = Config.validateData;
		var data = {
			projectguid: s,
			areacode: Config.areacode
		};
		requestData.params = data;
		requestData = JSON.stringify(requestData);
		console.log('请求数据:' + requestData);
		mui.ajax(url, {
			data: requestData,
			headers: {
				Accept: "text/html;charset=utf-8",
				Authorization: "Bearer " + options.token || ''
			},
			dataType: "json",
			type: "POST",
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
});