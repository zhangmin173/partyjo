/**
 * 作者: daike
 * 时间: 2016-08-29
 * 描述: 自助申报 
 */
define(function(require, exports, module) {
	"use strict";
	// 每一个页面都要引入的工具类
	var CommonTools = require('CommonTools_Core');
	// 引入config-seaBizConfig.js里的别名配置
	var config = require('config_Bizlogic');
	var UITools = require('UITools_Core');
	var WindowTools = require('WindowTools_Core');
	var StringTools = require('StringTools_Core');

	var ProjectGuid = ''; // 8a9bfa76-e46c-46c8-9738-d8461399db2f
	var Bathpath = '';
	var OpenID = ''; // oegp-jlrnLOzYaGkMe0HyQm9B_qQ
	var taskGuid = '';
	var userType = '';
	var centerGuid = '';
	var departArr = []; // 部门代码项
	var currentType = ''; // 个人 法人 个人，法人
	var isPrevent = true; // 是否禁止切换
	// 每一个页面都要引入的工具类
	//  initready 要在所有变量初始化做完毕后
	CommonTools.initReady(initData);
	/**
	 * @description 初始化数据,结合initReady使用
	 * plus情况为plusready
	 * 其它情况为直接初始化
	 */
	function initData(isPlus) {
		// 引入必备文件,下拉刷新依赖于mui与mustache
		CommonTools.importFile([
			'css/libs/mui.picker.min.css',
			'css/libs/mui.poppicker.css',
			'js/libs/mui.min.js',
			'js/libs/mustache.min.js',
			'js/libs/zepto.min.js',
			'js/libs/mui.picker.min.js',
			'js/libs/mui.poppicker.js'
		], function() {

			OpenID = WindowTools.getExtraDataByKey("UserPK") || '';
			//ProjectGuid = WindowTools.getExtraDataByKey("ProjectGuid")||'';
			taskGuid = WindowTools.getExtraDataByKey('taskGuid') || '';
			userType = WindowTools.getExtraDataByKey("userType") || '20';
			currentType = WindowTools.getExtraDataByKey("currentType") || '';
			if(currentType == '个人') {
				userType = '20';
			} else if(currentType == '法人') {
				userType = '10';
			} else {
				isPrevent = false;
			}
			if(userType == '10') {
				Zepto('#applyertypeTxt').val('企业');
				Zepto('#applyertype').val('10');
				Zepto('.type1').hide();
				Zepto('.type2').show();
				Zepto('.name').text('企业名称');
			} else {
				Zepto('.type1').show();
				Zepto('.type2').hide();
				Zepto('.name').text('申请人');
			}
			
			config.getUserguidbyOpenID(OpenID, function(options, tips) {
				declareProject(options); // 申报须知
				initLinstener(options);
			});
			//initBJinfo(); // 初始化申报信息

			config.getProjectBasePath(function(bathpath) {
				Bathpath = bathpath;
			});

		});
	}

	function initLinstener(options) {
		// 点击申请类型
		Zepto('.firstType').on('tap', function() {
			if(isPrevent) {
				mui.toast('当前事项无法切换！');
			} else {
				var optionArr = [{
					value: '10',
					text: '企业'
				}, {
					value: '20',
					text: '个人'
				}];
				UITools.showPopPicker(optionArr, function(text, value, item) {
					Zepto('#applyertypeTxt').val(text);
					Zepto('#applyertype').val(value);
					if(document.getElementById("applyertype").value == "20") {
						userType = '20';
						Zepto('.type1').show();
						Zepto('.type2').hide();
						Zepto('.name').text('申请人');
						Zepto('#applyername').val(options.userName);
						Zepto('#applyername').attr('placeholder', '请输入申请人名称（必填）');
						Zepto('#idcard').val(options.idNum);
						Zepto('#idcard').attr('readonly', 'readonly');
					} else {
						userType = '10';
						Zepto('.type1').hide();
						Zepto('.type2').show();
						Zepto('.name').text('企业名称');
						Zepto('#applyername').val('');
						Zepto('#applyername').attr('placeholder', '请输入企业名称（必填）');
						Zepto('#idcard').val('');
						Zepto('#idcard').removeAttr('readonly');
					}
				});
			}
		});

		// 下一步按钮 操作
		Zepto('#btnnext').on('tap', function() {
			var datas = getInputData();
			if(checkInput(datas) == true) {
				console.log("发布:" + JSON.stringify(datas));
				publish(datas, options);
			}
		});

		// 点击证件类型
		Zepto('.idcardtype').on('tap', function() {
			var optionArr = [{
				value: '14',
				text: '组织机构代码证'
			}, {
				value: '16',
				text: '统一社会信用代码'
			}]
			UITools.showPopPicker(optionArr, function(text, value, item) {
				Zepto('#certtypetxt').val(text);
				Zepto('#certtype').val(value);
			});
		});

	}

	/*
	 * @description 初始化办件
	 */
	function initProject(options) {
		var url = config.serverUrl + "zwdtProject/private/initProjectReturnMaterials";
		var requestData = {
			token: config.validateData,
			params: {
				"taskguid": taskGuid,
				"areacode": config.areacode,
				"centerguid": centerGuid,
				"taskcaseguid": "",
				"applyertype": userType,
				"ismobile": "1"
			}
		};
		mui.ajax(url, {
			data: JSON.stringify(requestData),
			headers: {
				Accept: "text/html;charset=utf-8",
				Authorization: "Bearer " + options.token || ''
			},
			dataType: "json",
			type: "POST",
			contentType: 'application/json;charset=UTF-8',
			success: function(rtnData) {
				if(rtnData.status.code != 200) {
					mui.toast(rtnData.status.text);
					return;
				}
				if(rtnData.custom.code != 1) {
					mui.toast(rtnData.custom.text);
					return;
				}
				ProjectGuid = rtnData.custom.projectguid;
			},
			error: function(response) {
				console.log('请求失败');
				console.log(JSON.stringify(response));
			}
		});
	}

	/*
	 * @description 申报须知
	 */
	function declareProject(options) {
		if(userType == '20') {
			Zepto('#applyername').val(options.userName);
			Zepto('#idcard').val(options.idNum);
			Zepto('#idcard').attr('readonly', 'readonly');
		}
		Zepto('#contactidnum').val(options.idNum);
		Zepto('#contactname').val(options.userName);
		Zepto('#contactmobile').val(options.mobile);
		var url = config.serverUrl + "zwdtProject/declareProjectNotice";
		var requestData = {
			token: config.validateData,
			params: {
				"taskguid": taskGuid,
			}
		}
		// console.log('请求参数' + JSON.stringify(requestData) + ';请求地址' + url)
		mui.ajax(url, {
			data: JSON.stringify(requestData),
			dataType: "json",
			type: "POST",
			headers: {
				Accept: "text/html;charset=utf-8",
				Authorization: "Bearer " + options.token || ''
			},
			contentType: 'application/json;charset=UTF-8',
			success: function(rtnData) {
				if(rtnData.status.code != 200) {
					mui.toast(rtnData.status.text);
					return;
				}
				if(rtnData.custom.code != 1) {
					mui.toast(rtnData.custom.text);
					return;
				}
				var taskid = rtnData.custom.taskid;
				// 获取事项中心guid
				getCenterGuid(taskid, options);
			}
		});
	}

	/*
	 * @description 获取事项中心guid
	 */
	function getCenterGuid(taskid, options) {
		var url = config.serverUrl + "zwdtTask/getCenterListByTaskId";
		var requestData = {
			token: config.validateData,
			params: {
				"taskid": taskid
			}
		}
		// console.log('请求参数' + JSON.stringify(requestData) + ';请求地址' + url)
		mui.ajax(url, {
			data: JSON.stringify(requestData),
			dataType: "json",
			type: "POST",
			headers: {
				Accept: "text/html;charset=utf-8",
				Authorization: "Bearer " + options.token || ''
			},
			contentType: 'application/json;charset=UTF-8',
			success: function(rtnData) {
				if(rtnData.status.code != 200) {
					mui.toast(rtnData.status.text);
					return;
				}
				if(rtnData.custom.code != 1) {
					mui.toast(rtnData.custom.text);
					return;
				}
				if(rtnData.custom.centerlist && Array.isArray(rtnData.custom.centerlist)) {
					for(var i = 0, len = rtnData.custom.centerlist.length; i < len; i++) {
						departArr.push({
							value: rtnData.custom.centerlist[i].centerguid,
							text: rtnData.custom.centerlist[i].centername
						});
					}
					Zepto('#center').val(rtnData.custom.centerlist[0].centername);
					centerGuid = rtnData.custom.centerlist[0].centerguid;
					// 初始化办件
					initProject(options);
					// 点击中心
					Zepto('.area').on('tap', function() {
						var picker = new mui.PopPicker();
						picker.setData(departArr);
						picker.show(function(items) {
							Zepto('#center').val(items[0].text);
							Zepto('#centerValue').val(items[0].value);
							centerGuid = items[0].value;
							picker.dispose();
						});
					})
				}
			}
		});
	}

	/**
	 * @description 获取文本框的值
	 */
	function getInputData() {
		var data = {};
		var inputs = Zepto("input");
		Zepto.each(inputs, function(key, value) {
			var _this = Zepto(this);
			var id = _this.attr('id');
			var val = _this.val();
			if(id != null && id != '') {
				eval("data." + id + "='" + val + "'");
			}
		});
		data.projectguid = ProjectGuid;
		data.contactphone = ''; // 联系人电话
		data.postcode = ''; // 邮编
		data.areacode = ''; // 区域标识
		data.remark = ''; // 备注
		data.if_express = ''; // 是否使用物流
		data.ismobile = "1";
		delete data.applyertypeTxt;
		delete data.certtypetxt;
		delete data.centerValue;
		delete data.center;
		if(userType == '20') {
			delete data.legal;
			data.certtype = '22';
		}
		console.log(JSON.stringify(data));
		return data;
	}
	/**
	 * @description 判断文本框是否为空以及格式
	 * @param {Json} data
	 */
	function checkInput(data) {
		var flag = true;
		var err = '';
		if(userType == '20') {
			if(data.applyername == '') {
				err += "\n申请人名称不能为空!";
				flag = false;
				UITools.toast(err);
				return flag;
			}
		} else {
			if(data.applyername == '') {
				err += "\n企业名称不能为空!";
				flag = false;
				UITools.toast(err);
				return flag;
			}
			if(data.legal == '') {
				err += "\n法人代表不能为空!";
				flag = false;
				UITools.toast(err);
				return flag;
			}
		}
		if(data.idcard == '') {
			err += "\n证件号不能为空!";
			flag = false;
			UITools.toast(err);
			return flag;
		}
		if(data.contactidnum == '') {
			err += "\n联系人身份证号不能为空!";
			flag = false;
			UITools.toast(err);
			return flag;
		}
		if(data.contactname == '') {
			err += "\n联系人不能为空!";
			flag = false;
			UITools.toast(err);
			return flag;
		}
		if(data.contactmobile == '') {
			err += "\n联系手机不能为空!";
			flag = false;
			UITools.toast(err);
			return flag;
		}
		if(data.address == '') {
			err += "\n联系地址不能为空!";
			flag = false;
			UITools.toast(err);
			return flag;
		}
		if(!StringTools.isPhoneNumber(data.contactmobile)) {
			err += "\n联系手机号码不正确!";
			flag = false;
			UITools.toast(err);
			return flag;
		}
		//		if(userType == '20') {
		if(!StringTools.validateUserIdendity(data.contactidnum)) {
			err += "\n联系人身份证号不正确!";
			flag = false;
			UITools.toast(err);
			return flag;
		}
		//		}
		return flag;
	}

	/*
	 * @description 保存办件
	 */
	function publish(datas, options) {
		var url = config.serverUrl + 'zwdtProject/private/saveProjectInfo';
		var requestData = {};
		// 动态校验字段
		requestData.token = config.validateData;
		requestData.params = datas;
		// 某一些接口是要求参数为字符串的
		requestData = JSON.stringify(requestData);
		console.log(requestData + '请求地址' + url);
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
				console.log(JSON.stringify(response));
				if(response.status.code != 200) {
					mui.toast(response.status.text);
					return;
				}
				if(response.custom.code != 1) {
					mui.toast(response.custom.text);
					return;
				}
				datas.taskguid = taskGuid;
				var preAllDatas = JSON.stringify(datas);
				window.localStorage.setItem('preAllDatas', preAllDatas);
				// 打开附件上传页面
				mui.openWindow({
					url: "ZWFW_AuditApplyMaterialUpload.html?UserPK=" + OpenID + '&ProjectGuid=' + ProjectGuid + '&taskGuid=' + taskGuid + '&centerGuid=' + centerGuid + '&userType=' + userType
				});
			},
			timeout: 9000,
			error: function(response) {
				console.log('发布失败')
				console.log(JSON.stringify(response));
				UITools.alert({
					content: '发布失败'
				})
			}
		});
	}

	//	/*
	//	 * @description 提交办件
	//	 */
	//	function submitTask(datas, options) {
	//		datas.taskguid = taskGuid;
	//		var url = config.serverUrl + 'zwdtProject/private/submitProjectByTaskguid';
	//		var requestData = {};
	//		// 动态校验字段
	//		requestData.token = config.validateData;
	//		requestData.params = datas;
	//		// 某一些接口是要求参数为字符串的
	//		requestData = JSON.stringify(requestData);
	//		console.log(requestData + '请求地址' + url);
	//		mui.ajax(url, {
	//			data: requestData,
	//			headers: {
	//				Accept: "text/html;charset=utf-8",
	//				Authorization: "Bearer " + options.token || ''
	//			},
	//			dataType: "json",
	//			type: "POST",
	//			contentType: 'application/json;charset=UTF-8',
	//			success: function(response) {
	//				if(response.status.code != 200) {
	//					mui.toast(response.status.text);
	//					return;
	//				}
	//				if(response.custom.code != 1) {
	//					mui.toast(response.custom.text);
	//					return;
	//				}
	//				// 打开附件上传页面
	//				mui.openWindow({
	//					url: "ZWFW_AuditApplyMaterialUpload.html?UserPK=" + OpenID + '&ProjectGuid=' + ProjectGuid + '&taskGuid=' + taskGuid + '&centerGuid=' + centerGuid + '&userType=' + userType + '&name=' + encodeURIComponent(datas.applyername) + '&idNum=' + datas.contactidnum + '&contactName=' + encodeURIComponent(datas.contactname) + '&mobile=' + datas.contactmobile + '&address=' + encodeURIComponent(datas.address)
	//				});
	//			},
	//			timeout: 9000,
	//			error: function(response) {
	//				console.log('发布失败')
	//				console.log(JSON.stringify(response));
	//				UITools.alert({
	//					content: '发布失败'
	//				})
	//			}
	//		});
	//	}
});