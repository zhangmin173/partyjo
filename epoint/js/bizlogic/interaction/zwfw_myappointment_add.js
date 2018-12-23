/**
 * 作者: ykx
 * 时间: 2016年8月26日
 * 描述: 新增预约
 */
define(function(require, exports, moddive) {
	"use strict";
	//var userguid = ''; //872b987c-fef2-4eb9-bc71-8efdeb74ded5
	var OpenID = ''; //oegp-jlrnLOzYaGkMe0HyQm9B_qQ
	var WindowTools = require('WindowTools_Core');
	var YuYueDate = ''
	var YuYueTimeStart = '';
	var YuYueTimeEnd = '';
	var taskGuid = '';
	var Name = '';
	var SFZ = '';
	var PHONE = '';
	var ouName = '';
	var taskName = '';
	var centerGuid = ''; // 中心guid b309ffca-7331-431e-a5f3-ff04523c4852
	var isAppointment = '';
	//每一个页面都要引入的工具类
	var CommonTools = require('CommonTools_Core');
	//等待框
	var UITools = require('UITools_Core');
	//文字编译
	var StringTools = require('StringTools_Core');
	//config引入
	var Config = require('config_Bizlogic');
	// initready 要在所有变量初始化做完毕后
	CommonTools.initReady(initData);

	function initData() {
		//引入必备文件,下拉刷新依赖于mui与mustache
		CommonTools.importFile([
			'js/libs/mui.min.js',
			'js/libs/mustache.min.js',
			'js/libs/zepto.min.js'
		], function() {
			OpenID = WindowTools.getExtraDataByKey("UserPK") || '';
			PHONE = WindowTools.getExtraDataByKey('PHONE') || '';
			SFZ = WindowTools.getExtraDataByKey('SFZ') || '';
			Name = decodeURIComponent(WindowTools.getExtraDataByKey('Name'));
			YuYueTimeEnd = WindowTools.getExtraDataByKey('YuYueTimeEnd') || '';
			YuYueTimeStart = WindowTools.getExtraDataByKey('YuYueTimeStart') || '';
			YuYueDate = WindowTools.getExtraDataByKey('YuYueDate') || '';
			taskGuid = WindowTools.getExtraDataByKey('taskGuid') || '';
			ouName = decodeURIComponent(WindowTools.getExtraDataByKey('ouName'));
			taskName = decodeURIComponent(WindowTools.getExtraDataByKey('taskName'));
			centerGuid = WindowTools.getExtraDataByKey('centerGuid') || '';
			isAppointment = WindowTools.getExtraDataByKey('isAppointment') || '';
			//通过OpenID获取用户信息
			Config.getUserguidbyOpenID(OpenID, function(options, tips) {
				//getTaskDetail();
				Zepto('#spanouname').text(unescape(ouName));
				Zepto('#spantaskname').text(unescape(taskName));
				getCenterGuid(options);
				if(isAppointment == '1') {
					Zepto('#appointmentadd').removeAttr('disabled');
					appointmentadd(options);
				} else {
					Zepto('#appointmentadd').attr('disabled', 'disabled');
					mui.toast('该事项不支持网上预约！');
				}
			}, function(response) {
				console.log(JSON.stringify(response));
			});
			yuyuetimeclick();
		});

	};

	/*
	 * @description 获取预约事项所属中心
	 */
	function getCenterGuid(options) {
		var url = Config.serverUrl + 'queueAppointment/getAppointCenter';
		var requestData = {};
		//动态校验字段
		requestData.token = Config.validateData;
		var data = {
			"taskguid": taskGuid
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
				console.log(JSON.stringify(response));

				if(response.status.code != 200) {
					mui.toast(response.status.text);
					return false;
				}
				if(response.custom.code == 0) {
					mui.toast(response.custom.text);
					return false;
				}
				var outdata = response.custom;
				if(response.custom.centerlist && Array.isArray(response.custom.centerlist)) {
					centerGuid = response.custom.centerlist[0].centerguid;
				}
				getYuYueDetail(options);
			},
			error: function(response) {
				console.log('请求失败');
				console.log(JSON.stringify(response))
			}
		});
		return requestData;
	}

	//首先请求将预约部门和办理事项填充完毕
	//	var getTaskDetail = function() {
	//		var url = Config.serverUrl + '/AuditTask/GetTaskDetail';
	//		//var url = 'http://218.4.136.118:8086/mockjs/143/Appointment_Add';
	//		var requestData = {};
	//		//动态校验字段
	//		requestData.ValidateData = Token;
	//		var data = {
	//			TaskGuid: taskGuid
	//		};
	//		requestData.paras = data;
	//		requestData = JSON.stringify(requestData);
	//		console.log('请求数据:' + JSON.stringify(requestData));
	//		mui.ajax(url, {
	//			data: requestData,
	//			dataType: "json",
	//			type: "POST",
	//			success: function(response) {
	//				console.log(JSON.stringify(response));
	//				var outdata = response.UserArea;
	//
	//				if(response.ReturnInfo.Code == "0") {
	//					mui.toast(response.ReturnInfo.Description);
	//					return false;
	//				}
	//				if(response.BusinessInfo.Code == "0") {
	//					mui.toast(response.BusinessInfo.Description);
	//					return false;
	//				}
	//				Zepto('#spanouname').text(outdata.OUName);
	//				Zepto('#spantaskname').text(outdata.TaskName);
	//
	//			},
	//			error: function(response) {
	//				console.log('请求失败');
	//				console.log(JSON.stringify(response))
	//			}
	//		});
	//		return requestData;
	//	};

	//获取该列表中的其他项信息
	var getYuYueDetail = function(options) {
		if(YuYueDate != "" && YuYueDate != null) {
			Zepto("#yuyuetime").val(YuYueDate + " " + YuYueTimeStart + "~" + YuYueTimeEnd);
			Zepto("#name").val(Name);
			Zepto("#id-number").val(SFZ);
			Zepto("#phone").val(PHONE);
		} else {
			//初始化人员信息获取默认申请人
			var url = Config.serverUrl + 'zwdtUserSeting/private/getAccountInfo';
			var requestData = {};
			//动态校验字段
			requestData.token = Config.validateData;
			var data = {};
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
					console.log(JSON.stringify(outdata));
					if(response.status.code != 200) {
						mui.toast(response.status.text);
					}
					if(response.custom.code == 0) {
						mui.toast(response.custom.text);
						return false;
					}
					var outdata = response.custom;
					Zepto("#name").val(outdata.clinetname);
					Zepto("#id-number").val(outdata.idnum);
					Zepto("#phone").val(outdata.mobile);
				},
				error: function(response) {
					console.log('请求失败');
					console.log(JSON.stringify(response))
				}
			});
			return requestData;
		}
	};
	//设置预约时间点击事件
	var yuyuetimeclick = function() {
		Zepto("#yuyuetimeselect").on('tap', function() {
			var data = {
				UserPK: OpenID,
				taskguid: taskGuid,
				centerGuid: centerGuid,
				TaskName: encodeURIComponent(Zepto("#spantaskname").text()),
				OUName: encodeURIComponent(Zepto("#spanouname").text()),
				Name: encodeURIComponent(Zepto("#name").val()),
				SFZ: Zepto("#id-number").val(),
				PHONE: Zepto("#phone").val(),
				isAppointment: isAppointment
			};
			WindowTools.createWin('', 'zwfw_myappointment_time.html', data);
		})
	}

	var appointmentadd = function(options) {
		Zepto('#appointmentadd').on('tap', function() {
			Name = Zepto("#name").val();
			SFZ = Zepto("#id-number").val();
			PHONE = Zepto("#phone").val();
			if(Zepto("#yuyuetime").val() == "") {
				mui.toast("请选择您要预约的时间段！");
				return;
			}
			if(Name == "") {
				mui.toast("请输入您的姓名！");
				return;
			}
			if(SFZ == "") {
				mui.toast("请输入您的身份证！");
				return;
			}
			if(PHONE == "") {
				mui.toast("您输入的手机号为空或者不正确！");
				return;
			}
			if(StringTools.validateUserIdendity(SFZ) == false) {
				mui.toast("您输入的身份证不正确！");
				return;
			}
			var regPhone = /^1[3|4|5|7|8][0-9]{9}$/;
			if(PHONE.match(regPhone) == null) {
				mui.toast("您输入的手机号不正确！");
				return;
			}
			//将信息发送给后台
			var url = Config.serverUrl + 'queueAppointment/private/getAppointQno';
			var requestData = {};
			//动态校验字段
			requestData.token = Config.validateData;
			var data = {
				"centerguid": centerGuid,
				"appointdate": YuYueDate,
				"taskguid": taskGuid,
				"appointtimestart": YuYueTimeStart,
				"appointtimeend": YuYueTimeEnd,
				"appointtype": "3",
				"username": Name,
				"identitycardid": SFZ,
				"mobile": PHONE
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
						return;
					}
					if(response.custom.code == 0) {
						mui.toast(response.custom.text);
						return;
					}
					var appointGuid = response.custom.appointguid;
					var data = {
						UserPK: OpenID,
						appointGuid: appointGuid
					}
					WindowTools.createWin('', 'zwfw_myappointment_success.html', data);
				},
				error: function(response) {
					console.log('请求失败');
					console.log(JSON.stringify(response));
				}
			});
			return requestData;
		})
	}

});