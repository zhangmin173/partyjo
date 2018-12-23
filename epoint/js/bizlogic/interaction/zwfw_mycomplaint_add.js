/**
 * 作者: 
 * 创建时间:2017/6/013 10:11:35
 * 版本:[1.0, 2017/6/13]
 * 版权:江苏国泰新点软件有限公司
 * 描述:我的投诉 新增
 */
define(function(require, exports, moddive) {
	"use strict";
	var WindowTools = require('WindowTools_Core');
	//每一个页面都要引入的工具类
	var CommonTools = require('CommonTools_Core');
	//等待框
	var UITools = require('UITools_Core');
	//config引入-这里示例引入方式
	var Config = require('config_Bizlogic');
	var taskGuid = WindowTools.getExtraDataByKey("taskGuid") || '';
	var centerGuid = '';
	var departArr = []; // 部门代码项
	var OpenId = ''; //oegp-jlrnLOzYaGkMe0HyQm9B_qQ
	var isAnonymous = ''; // 是否匿名
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
			'css/libs/mui.poppicker.css',
			'js/libs/mui.poppicker.js',
			'css/libs/mui.picker.min.css',
			'js/libs/mui.picker.min.js',
			'js/libs/mustache.min.js',
			'js/libs/zepto.min.js',
		], function() {
			OpenId = WindowTools.getExtraDataByKey("UserPK") || '';
			Config.getUserguidbyOpenID(OpenId, function(options, tips) {
				// 获取中心
				getCenter(options);
				initListeners();
			});

		});

	};

	function initListeners() {
		// 切换是否匿名
		mui('.anonymous').on('tap', '.mui-switch', function() {
			if(Zepto(this).hasClass('mui-active')) {
				isAnonymous = 'true';
			} else {
				isAnonymous = '';
			}
		})
	}

	var getCenter = function(options) {
		var url = Config.serverUrl + "zwdtTask/getCenterListByAreaCode";
		var requestData = {
			token: Config.validateData,
			params: {
				"areacode": Config.areacode
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
				if(rtnData.custom.code == 0) {
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
					Zepto('#center').text(rtnData.custom.centerlist[0].centername);
					centerGuid = rtnData.custom.centerlist[0].centerguid;
					// 点击选择中心
					Zepto('#area').on('tap', function() {
						var picker = new mui.PopPicker();
						picker.setData(departArr);
						picker.show(function(items) {
							Zepto('#center').text(items[0].text);
							Zepto('#centerValue').val(items[0].value);
							centerGuid = items[0].value;
							picker.dispose();
						});
					})
					// 点击提交
					Zepto('#tijiao').on('tap', function() {
						var content = Zepto('#textarea').val();
						if(content == "") {
							mui.toast("所填内容不能为空！");
						} else {
							submitcont(content, options);
						}
					})

				}
			}
		});
	}

	var submitcont = function(content, options) {
		var url = Config.serverUrl + 'zwdtConsult/private/addConsult';
		var requestData = {};
		//动态校验字段
		requestData.token = Config.validateData;
		var data = {
			"question": content,
			"title": "",
			"consulttype": "2",
			"clientguid": "",
			"servicecenterguid": centerGuid,
			"ispublic": "",
			"isanonymous": isAnonymous,
			"askname": options.userName,
			"mobile": options.mobile,
			"ouguid": "",
			"taskguid": taskGuid
		};
		requestData.params = data;
		requestData = JSON.stringify(requestData);
		console.log('请求数据:' + requestData);
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
				var data = {
					UserPK: OpenId
				}
				Config.getProjectBasePath(function(bathpath) {
					var bathpath = bathpath;
					console.log(bathpath)
					var openurl = 'html/interaction/zwfw_mycomplaint_success.html';
					var url = bathpath + openurl + '?UserPK=' + OpenId;
					console.log(openurl);
					WindowTools.createWin('detail2', url, OpenId);
				});
				//					WindowTools.createWin('test', '', data);
			},
			error: function(response) {
				console.log('请求失败');
				console.log(JSON.stringify(response))
			}
		});
	};
});