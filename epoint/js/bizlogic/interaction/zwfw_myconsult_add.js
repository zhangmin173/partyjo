/**
 * 作者: ykx
 * 时间: 2016年8月30日
 * 描述: 新增咨询
 */
define(function(require, exports, moddive) {
	"use strict";
	var WindowTools = require('WindowTools_Core');
	var CommonTools = require('CommonTools_Core');
	//等待框
	var UITools = require('UITools_Core');
	//config引入-这里示例引入方式
	var Config = require('config_Bizlogic');
	var textareaval = '';
	var taskGuid = '';
	var OpenID = '';
	var url = '';
	var departArr = []; // 部门代码项
	var centerGuid = '';
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
			taskGuid = WindowTools.getExtraDataByKey("taskGuid") || '';
			OpenID = WindowTools.getExtraDataByKey("UserPK") || '';
			//通过OpenID获取用户信息
			Config.getUserguidbyOpenID(OpenID, function(options, tips) {
				// 获取中心
				getCenter(options);
			}, function(response) {
				console.log(JSON.stringify(response));
			});
		});

	};
	var submitcont = function(textareaval, options) {
		url = Config.serverUrl + 'zwdtConsult/private/addConsult';
		var requestData = {};
		//动态校验字段
		requestData.token = Config.validateData;
		var data = {
			"question": textareaval,
			"title": "",
			"consulttype": "1",
			"clientguid": "",
			"servicecenterguid": centerGuid,
			"ispublic": "",
			"isanonymous": "",
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
					UserPK: OpenID
				}
				Config.getProjectBasePath(function(bathpath) {
					var bathpath = bathpath;
					console.log(bathpath)
					var openurl = 'html/interaction/zwfw_myconsult_success.html';
					var url = bathpath + openurl + '?UserPK=' + OpenID;
					console.log(openurl);
					WindowTools.createWin('detail2', url, OpenID);
				});
			},
			error: function(response) {
				console.log('请求失败');
				console.log(JSON.stringify(response))
			}
		});
	};

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
				// console.log(JSON.stringify(rtnData));

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
						textareaval = Zepto('#textarea').val();
						if(textareaval == "") {
							mui.toast("所填内容不能为空！");
						} else {
							// 提交咨询
							submitcont(textareaval, options);
						}
					})

				}
			}
		});
	}
});