/**
 * 作者: hybo
 * 时间: 2016-07-15 
 * 描述: 事项详情
 */
define(function(require, exports, module) {
	"use strict";
	// 每一个页面都要引入的工具类
	var CommonTools = require('CommonTools_Core');
	// 下拉刷新
	var WindowTools = require('WindowTools_Core');
	var UITools = require('UITools_Core');
	// config引入
	var Config = require('config_Bizlogic');
	// 获取项目http的根目录，http:// id:端口/项目名/
	var httppath = '';
	var taskGuid = '';
	var UserPK = ''; // oegp-jlrnLOzYaGkMe0HyQm9B_qQ
	var ProjectGuid = '';
	var ouName = ''; // 部门名称
	var taskName = ''; // 事项名称
	var userType = '';
	var isAppointment = '1'; // 能否预约
	var currentType = ''; // 个人 法人 个人，法人
	//  initready 要在所有变量初始化做完毕后
	CommonTools.initReady(initData);
	/**
	 * @description 初始化数据,结合initReady使用
	 * plus情况为plusready
	 * 其它情况为直接初始化
	 */
	function initData() {
		// 引入必备文件,下拉刷新依赖于mui与mustache
		CommonTools.importFile([
			'js/libs/mui.min.js',
			'js/libs/mustache.min.js',
			'js/libs/zepto.min.js',
		], function() {

			taskGuid = WindowTools.getExtraDataByKey('taskGuid') || '';

			if(WindowTools.getExtraDataByKey('UserPK')) {
				UserPK = WindowTools.getExtraDataByKey('UserPK') || '';
			}
			userType = WindowTools.getExtraDataByKey('userType') || '';

			// 项目根路径
			Config.getProjectBasePath(function(path) {
				httppath = path;
			});

			Config.getUserguidbyOpenID(UserPK, function(options, tips) {
				consult();
				//yuYue(token);
				ajaxData(options);
			}, function(options) {
				consult();
				//yuYue(token);
				ajaxData(options);
			});
		});
	}

	// 咨询
	function consult() {
		Zepto('#consult').on('tap', function() {
			Config.getUserguidbyOpenID(UserPK, function(options, tips) {
				location.href = httppath + 'html/interaction/zwfw_myconsult_add.html?UserPK=' + UserPK + '&taskGuid=' + taskGuid;
			}, function(response) {
				var specialUrl = encodeURIComponent('zwfw_myconsult_add.html?UserPK=' + UserPK + '&taskGuid=' + taskGuid);
				location.href = httppath + 'html/interaction/zwfw_user_binding.html?URL=' + specialUrl + '&openId=' + UserPK;
			});
		});
	}
	// 预约
	function yuYue() {
		Zepto('#appointment').on('tap', function() {
			if(isAppointment == '1') {
				Config.getUserguidbyOpenID(UserPK, function(options, tips) {
					location.href = httppath + 'html/interaction/zwfw_myappointment_add.html?UserPK=' + UserPK + '&taskGuid=' + taskGuid + '&ouName=' + encodeURIComponent(ouName) + '&taskName=' + encodeURIComponent(taskName) + '&isAppointment=' + isAppointment;
				}, function(response) {
					var specialUrl = encodeURIComponent('zwfw_myappointment_add.html?UserPK=' + UserPK + '&taskGuid=' + taskGuid + '&isAppointment=' + isAppointment);
					location.href = httppath + 'html/interaction/zwfw_user_binding.html?URL=' + specialUrl + '&openId=' + UserPK + '&ouName=' + encodeURIComponent(ouName) + '&taskName=' + encodeURIComponent(taskName);
				});
			} else {
				mui.toast('该事项不支持网上预约！');
			}
		});
	}
	// 申报
	function webSB(canSB) {
		Zepto('#apply').on('tap', function() {
			if(canSB == '0') {
				UITools.toast('该事项暂不支持外网申报！');
			} else {
				// 判断用户是否绑定
				Config.getUserguidbyOpenID(UserPK, function(options, tips) {
					// 用户已绑定：打开申报页面
					location.href = httppath + 'html/service/ZWFW_AuditApply.html?UserPK=' + UserPK + '&taskGuid=' + taskGuid + '&userType=' + userType + '&currentType=' + currentType;
				}, function(response) {
					// 用户未绑定：打开用户绑定页面
					var specialUrl = encodeURIComponent('../service/ZWFW_AuditApply.html?UserPK=' + UserPK);
					location.href = httppath + 'html/interaction/zwfw_user_binding.html?URL=' + specialUrl + '&openId=' + UserPK + '&taskGuid=' + taskGuid + '&currentType=' + currentType;
				});
			}
		});
	}

	/**
	 * 请求接口 获取事项详情
	 * @param {Object} token
	 */
	function ajaxData(options) {
		var url = Config.serverUrl + 'zwdtTask/getTaskBasicInfo';
		var requestData = {};
		requestData.token = Config.validateData;
		var data = {
			"taskguid": taskGuid, // 510a68da-e69a-4712-813d-097dbe1b5198
			"isneedall": "1" // 0 基本信息 1所有信息
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
				if(response && response.custom && response.custom.code == 1 && response.status && response.status.code == 200) {
					var matericalLength = '';
					if(Array.isArray(response.custom.taskmaterials)) {
						matericalLength = response.custom.taskmaterials.length;
					}
					var tmp = response.custom;
					tmp.matericalLength = matericalLength;
					// 判断是否可以外网申报
					var canSB = tmp.taskelement.onlinehandle;
					if(tmp.taskelement.appointment == '0') {
						isAppointment = '0';
					} else {
						isAppointment = '1';
					}
					if(tmp.taskoutimg && tmp.taskoutimg != '') {
						tmp.picLength = 1;
					} else {
						tmp.picLength = 0;
					}
					tmp.charge = '收费';
					if(tmp.chargeitems.length < 1) {
						tmp.charge = '不收费';
					}
					ouName = tmp.taskbasic.implementsubject;
					currentType = tmp.taskbasic.managementobj;
					taskName = tmp.taskname;
					var moban = "<li class='mui-table-view-cell'><a class='mui-navigate-right current  mui-clearfix'><label>事项名称</label><span>{{taskname}}</span></a></li><li class='mui-table-view-cell'><a class='mui-navigate-right current  mui-clearfix'><label>事项编码</label><span>{{itemid}}</span></a></li><li class='mui-table-view-cell'><a class='mui-navigate-right current  mui-clearfix'><label>办理部门</label><span>{{taskbasic.implementsubject}}</span></a></li><li class='mui-table-view-cell'><a class='mui-navigate-right current  mui-clearfix'><label>事项性质</label><span>{{taskbasic.type}}</span></a></li><li class='mui-table-view-cell'><a class='mui-navigate-right current  mui-clearfix'><label>承诺期限</label><span class='current'>{{taskbasic.promiseday}}</span></a></li><li class='mui-table-view-cell'><a class='mui-navigate-right current  mui-clearfix'><label>收费情况</label><span class='current1'>{{charge}}</span></a></li><li class='mui-table-view-cell'><a href='tel:{{taskbasic.linktel}}'class='mui-navigate-right current  mui-clearfix'><label>窗口电话</label><span class='current'>{{taskbasic.linktel}}</span></a></li><li class='mui-table-view-cell'><a href='tel:{{taskbasic.supervisetel}}'class='mui-navigate-right current  mui-clearfix'><label>监督电话</label><span class='current'>{{taskbasic.supervisetel}}</span></a></li><li class='mui-table-view-divider'></li><li class='mui-table-view-cell'id='cailiao'><a class='mui-navigate-right mui-clearfix'><label>所需材料</label><span id='materials'>材料列表({{matericalLength}})</span></a></li><li class='mui-table-view-cell'id='pic'href='{{taskoutimg}}'><a class='mui-navigate-right mui-clearfix'><label>办理流程</label><span>流程图片({{picLength}})</span></a></li><li class='mui-table-view-cell'><a class='mui-navigate-right current mui-clearfix'><label>受理条件</label><span>{{handlecondition}}</span></a></li>";
					var output = Mustache.render(moban, tmp);
					Zepto('#content').html('');
					Zepto('#content').append(output);
					Zepto('#cailiao').on('tap', function() {
						location.href = httppath + 'html/service/ZWFW_MaterialCheck_parent.html?TaskGuid=' + taskGuid + '&UserPK=' + UserPK;
					});
					Zepto('#pic').on('tap', function() {
						var imgUrl = Zepto(this).attr('href');
						if(imgUrl != '') {
							location.href = httppath + 'html/service/ZWFW_PicCheck.html?imgUrl=' + imgUrl;
						}
					});
					webSB(canSB);
					yuYue();

				} else {
					UITools.toast('请求数据失败');
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

	/**
	 * 通过taskguid生成projectguid
	 * @param {Object} token
	 * @param {Object} LoginID
	 */
	function getProjectGuid(token, LoginID) {
		var url = Config.serverUrl + 'zwdtProject/private/initProjectReturnMaterials';
		var requestData = {};
		requestData.ValidateData = token;
		var data = {
			"taskGuid": taskGuid,
			"areacode": "",
			"centerGuid": ""
		}
		requestData.paras = data;
		requestData = JSON.stringify(requestData);
		console.log(requestData);
		UITools.showWaiting();
		mui.ajax(url, {
			data: requestData,
			timeout: "15000", // 超时时间设置为3秒；
			type: "POST",
			success: function(response) {
				UITools.closeWaiting();
				console.log("事项详情success");
				console.log(response);
				if(response && response.ReturnInfo && response.ReturnInfo.Code == 1 && response.BusinessInfo && response.BusinessInfo.Code == 1 && response.UserArea) {
					ProjectGuid = response.UserArea.ProjectGuid;
					console.log("ProjectGuid:" + ProjectGuid);
					// 用户已绑定：打开申报页面
					if(LoginID && LoginID != '') {
						location.href = httppath + 'html/service/ZWFW_AuditApply.html?ProjectGuid=' + ProjectGuid + '&UserPK=' + UserPK + '&taskGuid=' + taskGuid;
					}
					// 用户未绑定：打开用户绑定页面
					else {
						var specialUrl = encodeURIComponent('../service/ZWFW_AuditApply.html?UserPK=' + UserPK + '&ProjectGuid=' + ProjectGuid);
						console.log(specialUrl)
						location.href = httppath + 'html/interaction/zwfw_user_binding.html?URL=' + specialUrl + '&openId=' + UserPK;
					}
				}
			},
			error: function(error) {
				UITools.closeWaiting();
				// UITools.toast('请求数据失败');
				console.log(JSON.stringify(error));
			}
		});
	}

});