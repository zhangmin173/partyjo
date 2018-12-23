/**
 * 作者: ykx
 * 时间: 2016年8月26日
 * 描述: 预约时间
 */
define(function(require, exports, module) {
	"use strict";
	var WindowTools = require('WindowTools_Core');
	//每一个页面都要引入的工具类
	var CommonTools = require('CommonTools_Core');
	//等待框
	var UITools = require('UITools_Core');
	//config引入-这里示例引入方式
	var Config = require('config_Bizlogic');
	var ValidateData = '';
	var TaskGuid = '';
	var TaskName = '';
	var OUName = '';
	var Name = '';
	var SFZ = '';
	var PHONE = '';
	var userguid = ''; //872b987c-fef2-4eb9-bc71-8efdeb74ded5
	var centerGuid = ''; // 中心guid
	var OpenID = ''; //oegp-jlrnLOzYaGkMe0HyQm9B_qQ
	var isAppointment = '';
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
			'css/libs/mui.picker.min.css',
			'css/libs/mui.poppicker.css',
			'js/libs/mui.min.js',
			'js/libs/mustache.min.js',
			'js/libs/zepto.min.js',
			'js/libs/mui.picker.min.js',
			'js/libs/mui.poppicker.js',
		], function() {
			TaskGuid = WindowTools.getExtraDataByKey("taskGuid") || '';
			TaskName = decodeURIComponent(WindowTools.getExtraDataByKey('TaskName'));
			OUName = decodeURIComponent(WindowTools.getExtraDataByKey('OUName'));
			Name = decodeURIComponent(WindowTools.getExtraDataByKey('Name'));
			SFZ = WindowTools.getExtraDataByKey('SFZ') || '';
			OpenID = WindowTools.getExtraDataByKey("UserPK") || '';
			PHONE = WindowTools.getExtraDataByKey('PHONE') || '';
			centerGuid = WindowTools.getExtraDataByKey('centerGuid') || '';
			isAppointment = WindowTools.getExtraDataByKey('isAppointment') || '';
			//通过OpenID获取用户信息
			Config.getUserguidbyOpenID(OpenID, function(options, tips) {
				ready(options);
			}, function(response) {
				console.log(JSON.stringify(response));
			});
		});
	};
	var ready = function(options) {
		Zepto("#spanouname").text(unescape(OUName));
		Zepto("#spantaskname").text(unescape(TaskName));
		//设置日期切换
		var requestData = {};
		var url = Config.serverUrl + "queueAppointment/getAppointDate";
		requestData.token = Config.validateData;
		var data = {
			"centerguid": centerGuid,
			"showdays": "5"
		};
		requestData.params = data;
		requestData = JSON.stringify(requestData);
		//console.log('请求数据:' + JSON.stringify(requestData));
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
				console.log('请求数据:' + JSON.stringify(response));
				var YuYueDateList = response.custom.appointdatelist;
				var option = [];
				if(YuYueDateList.length > 0) {
					for(var i = 0, len = YuYueDateList.length; i < len; i++) {
						var value = YuYueDateList[i].appointdate;
						var text = YuYueDateList[i].appointdate;
						var jsonText = {
							value: value,
							text: text
						}
						option.push(jsonText);
					}
					Zepto('#selectdate').val(YuYueDateList[0].appointdate);
					YuYueTimeList(YuYueDateList[0].appointdate, options);
					console.log(JSON.stringify(option));
					Zepto("#selectbut").on('tap', function() {
						UITools.showPopPicker(option, function(text, value, item) {
							Zepto('#selectdate').val(text);
							Zepto('#select').val(value);
							YuYueTimeList(Zepto('#selectdate').val(), options);
						});
					})
				}
			}
		})
	};
	var YuYueTimeList = function(s, options) {
		var url = Config.serverUrl + "queueAppointment/private/getAppointTime";
		var requestData = {};
		requestData.token = Config.validateData;
		var data = {
			"centerguid": centerGuid,
			"appointdate": s,
			"taskguid": TaskGuid
		};
		var litemplate = '';
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
				};
				if(response.custom.code == 0) {
					mui.toast(response.custom.text);
					return false;
				};
				var YuYueTimeList = response.custom.appointtimelist;
				var YuYueTimeInfoNew = [];
				//去掉多余层
				for(var i = 0, len = YuYueTimeList.length; i < len; i++) {
					YuYueTimeInfoNew.push(YuYueTimeList[i]);
				};
				getLitemplate(YuYueTimeInfoNew);

			},
			error: function(response) {
				console.log('请求失败');
				console.log(JSON.stringify(response))
			}
		});
		return JSON.stringify(requestData);
	};
	//动态选择映射模板
	var getLitemplate = function(value) {
		var temple = '';
		Zepto('#spantimelist').empty();
		if(value.length > 0) {
			console.log(JSON.stringify(value))
			for(var i = 0, len = value.length; i < len; i++) {
				if((value[i].appointmaxsum - value[i].appointsum) == 0 || (value[i].appointmaxsum - value[i].appointsum) < 0) {
					temple = '<li class="mui-table-view-cell"><span class="appointment-time">{{appointtimestart}}~{{appointtimeend}}</span><span class="appointment-number">预约人数已满</span></li>';
					var output = Mustache.render(temple, value[i]);
					Zepto('#spantimelist').append(output);
				} else {
					var person = parseInt(value[i].appointmaxsum) - parseInt(value[i].appointsum);
					temple = '<li class="mui-table-view-cell clickconfirm" _start="{{appointtimestart}}" _end="{{appointtimeend}}" ><span class="appointment-time">{{appointtimestart}}~{{appointtimeend}}</span><span class="appointment-number">剩余：<span>' + person + '</span>人</span></li>';
					var output = Mustache.render(temple, value[i]);
					Zepto('#spantimelist').append(output);
				}
			}

		}
		confirm();
		return temple;
	}

	//设置每个li的点击事件
	var confirm = function() {
		Zepto(".mui-table-view").on('tap', '.clickconfirm', function() {
			var data = {
				UserPK: OpenID,
				taskguid: TaskGuid,
				centerGuid: centerGuid,
				YuYueDate: Zepto("#selectdate").val(),
				YuYueTimeStart: Zepto(this).attr('_start'),
				YuYueTimeEnd: Zepto(this).attr('_end'),
				Name: encodeURIComponent(Name),
				SFZ: SFZ,
				PHONE: PHONE,
				OUName: encodeURIComponent(OUName),
				TaskName: encodeURIComponent(TaskName),
				isAppointment: isAppointment
			};
			WindowTools.createWin('test', 'zwfw_myappointment_add.html', data);
		})
	}
});