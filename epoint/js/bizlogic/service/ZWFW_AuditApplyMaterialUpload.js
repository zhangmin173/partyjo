/**
 * 作者: daike
 * 时间: 2016-08-30
 * 描述: 申报页面 办件材料列表
 */
define(function(require, exports, module) {
	"use strict";
	// 每一个页面都要引入的工具类
	var CommonTools = require('CommonTools_Core');
	// 引入config-seaBizConfig.js里的别名配置
	var config = require('config_Bizlogic');
	var UITools = require('UITools_Core');
	var WindowTools = require('WindowTools_Core');
	var Bathpath = '';
	var ProjectGuid = '';
	var OpenID = '';
	var taskGuid = '';
	var materialGuid = '';
	var ClientGuid = '';
	var Mname = '';
	var status = '';
	var type = '';
	var userType = '';
	var centerGuid = '';
	var isSupply = '';
	var MaterialList = [];
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
			'js/libs/mui.min.js',
			'js/libs/mustache.min.js',
			'js/libs/zepto.min.js'
		], function() {
			OpenID = WindowTools.getExtraDataByKey("UserPK") || '';
			ProjectGuid = WindowTools.getExtraDataByKey('ProjectGuid') || '';
			taskGuid = WindowTools.getExtraDataByKey('taskGuid') || '';
			centerGuid = WindowTools.getExtraDataByKey('centerGuid') || '';
			materialGuid = WindowTools.getExtraDataByKey('materialGuid') || '';
			ClientGuid = WindowTools.getExtraDataByKey("ClientGuid") || '';
			Mname = decodeURIComponent(WindowTools.getExtraDataByKey("Mname"));
			status = WindowTools.getExtraDataByKey('status') || '';
			type = WindowTools.getExtraDataByKey('type') || '';
			userType = WindowTools.getExtraDataByKey('userType') || '';
			isSupply = WindowTools.getExtraDataByKey('isSupply') || '';
			isSupply = isSupply.split('#')[0];

			if(isSupply == '1') {
				Zepto('#submit').text('补正完成');
			}

			config.getUserguidbyOpenID(OpenID, function(options, tips) {
				if(materialGuid) {
					judgeProject(options);
				} else {
					getMaterialList(options);
				}
			}, function(response) {
				// console.log(JSON.stringify(response));
			});
			config.getProjectBasePath(function(bathpath) {
				console.log(bathpath);
				Bathpath = bathpath;
			})

		});
	}

	/*
	 * @description 判断是否上传
	 */
	function judgeProject(options) {
		var url = config.serverUrl + "zwdtProject/checkMaterialIsUploadByClientguid";
		var requestData = {
			token: config.validateData,
			params: {
				"clientguid": ClientGuid,
				"projectmaterialguid": materialGuid,
				"sharematerialiguid": "",
				"status": status,
				"type": type,
				"needload": "0"
			}
		};
		console.log('请求参数' + JSON.stringify(requestData) + ';请求地址' + url);
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
				console.log('请求成功');
				console.log(JSON.stringify(rtnData));
				if(rtnData.status.code != 200) {
					mui.toast(rtnData.status.text);
					return;
				}
				if(rtnData.custom.code == 0) {
					mui.toast(rtnData.custom.text);
					return;
				}
				if(rtnData.custom.showbutton == '0') {
					mui.toast('您还未上传相关附件！');
					return;
				}
				// 上传页面后重新加载材料列表
				returnMaterialList(options);
			},
			error: function(response) {
				console.log('请求失败');
				console.log(JSON.stringify(response));
			}
		});
	}

	/*
	 * @description 上传页面后重新加载材料列表
	 */
	function returnMaterialList(options) {
		var url = config.serverUrl + "zwdtProject/getInitMaterialList";
		var requestData = {
			token: config.validateData,
			params: {
				"projectguid": ProjectGuid,
				"type": '2'
			}
		};
		console.log('请求参数' + JSON.stringify(requestData) + ';请求地址' + url);
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
				console.log('请求成功');
				console.log(JSON.stringify(rtnData));
				if(rtnData.status.code != 200) {
					mui.toast(rtnData.status.text);
					return;
				}
				if(rtnData.custom.code == 0) {
					mui.toast(rtnData.custom.text);
					return;
				}
				if(rtnData.custom.materiallist && Array.isArray(rtnData.custom.materiallist)) {
					MaterialList = rtnData.custom.materiallist;
				}
				// 判断显示材料列表
				showList(options);
			},
			error: function(response) {
				console.log('请求失败');
				console.log(JSON.stringify(response));
			}
		});
	}

	/**
	 * 获取需要提交的材料列表
	 */
	function getMaterialList(options) {
		var url = config.serverUrl + "zwdtProject/getInitMaterialList";
		var requestData = {
			token: config.validateData,
			params: {
				"projectguid": ProjectGuid,
				"type": "",
				"taskcaseguid": ''
			}
		};
		// console.log('请求参数' + JSON.stringify(requestData) + ';请求地址' + url)
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
				console.log('请求成功');
				console.log(JSON.stringify(rtnData));
				if(rtnData.status.code != 200) {
					mui.toast(rtnData.status.text);
					return;
				}
				if(rtnData.custom.code == 0) {
					mui.toast(rtnData.custom.text);
					return;
				}
				if(rtnData.custom.materiallist && Array.isArray(rtnData.custom.materiallist)) {
					MaterialList = rtnData.custom.materiallist;
					// 判断显示材料列表
					showList(options);
				}
			},
			error: function(response) {
				console.log('请求失败');
				console.log(JSON.stringify(response));
			}
		});
	};

	/*
	 * @description 显示列表
	 */
	function showList(options) {
		var strTaskHtml = "";
		var isNext = true;

		if(MaterialList.length < 1) {
			strTaskHtml = " <div ><p>该申报事项无需申报材料</p></div>";

		} else {
			for(var i = 0, len = MaterialList.length; i < len; i++) {
				if(MaterialList[i].showbutton == '0') {
					MaterialList[i].showbutton = '未上传';
					MaterialList[i].uploadType = 'notupload';
				} else if(MaterialList[i].showbutton == '1') {
					MaterialList[i].showbutton = '已上传';
					MaterialList[i].uploadType = 'uploaded';
				}
				if(MaterialList[i].submittype == '提交纸质文件') {
					isNext = false;
				}
				strTaskHtml = strTaskHtml + "<li class='mui-table-view-cell' tmguid=" + MaterialList[i].taskmaterialguid + " status=" + MaterialList[i].status + "> ";
				if(MaterialList[i].necessary == "0") {
					strTaskHtml = strTaskHtml + "<a  id='" + MaterialList[i].projectmaterialname + ";" + MaterialList[i].clientguid + ";" + MaterialList[i].projectmaterialguid + ";" + MaterialList[i].status + ";" + MaterialList[i].type + "' class='mui-navigate-right mui-clearfix material-name'  > " + MaterialList[i].projectmaterialname + "<br><span id='" + MaterialList[i].projectmaterialname + ";" + MaterialList[i].clientguid + ";" + MaterialList[i].projectmaterialguid + ";" + MaterialList[i].status + ";" + MaterialList[i].type + "'class='material-count " + MaterialList[i].uploadType + "' >" + MaterialList[i].showbutton + "</span></a></li>";
				} else {
					strTaskHtml = strTaskHtml + "<a  id='" + MaterialList[i].projectmaterialname + ";" + MaterialList[i].clientguid + ";" + MaterialList[i].projectmaterialguid + ";" + MaterialList[i].status + ";" + MaterialList[i].type + "' class='mui-navigate-right mui-clearfix material-name' > " + MaterialList[i].projectmaterialname + "<span class='star'>(*)</span><br><span id='" + MaterialList[i].projectmaterialname + ";" + MaterialList[i].clientguid + ";" + MaterialList[i].projectmaterialguid + ";" + MaterialList[i].status + ";" + MaterialList[i].type + "' class='material-count " + MaterialList[i].uploadType + "' >" + MaterialList[i].showbutton + "</span></a></li>";
					// 存在必填材料未上传
					if(MaterialList[i].showbutton == "未上传" && isNext) {
						Zepto("#is_submit").val("0");
					}
				}
				console.log(strTaskHtml);

			}
			/**
			 * 绑定事件点击事件
			 */
			document.getElementById('iteminfo').addEventListener('tap', function(e) {
				if(e.target.tagName === 'A') {
					var pars = e.target.id.split(';');
					//var maxcount = e.target.attributes['count'].value;
					mui.openWindow({
						url: "ZWFW_MaterialAttachUpload.html?ProjectGuid=" + ProjectGuid + "&Mname=" + encodeURIComponent(pars[0]) + "&ClientGuid=" + pars[1] + "&materialGuid=" + pars[2] + "&status=" + pars[3] + "&type=" + pars[4] + "&UserPK=" + OpenID + '&userType=' + userType + '&taskGuid=' + taskGuid + '&isSupply=' + isSupply
					});
				}
				if(e.target.tagName === 'SPAN') {
					var pars = e.target.id.split(';');

					mui.openWindow({
						url: "ZWFW_MaterialAttachUpload.html?ProjectGuid=" + ProjectGuid + "&Mname=" + encodeURIComponent(pars[0]) + "&ClientGuid=" + pars[1] + "&materialGuid=" + pars[2] + "&status=" + pars[3] + "&type=" + pars[4] + "&UserPK=" + OpenID + '&userType=' + userType + '&taskGuid=' + taskGuid + '&isSupply=' + isSupply
					});
				}

			});
		}
		Zepto('#iteminfo').html(strTaskHtml);
		document.getElementById('submit').addEventListener('tap', function(e) {
			//					if(Zepto("#is_submit").val() == "0") {
			//						mui.toast("存在必需材料未提交！");
			//						return;
			//					}
			// 判断所有材料是否已提交
			judgeAll(options);

		})
	}

	/*
	 * @description 判断所有所有材料是否已提交
	 */
	function judgeAll(options) {
		var taskmaterialarray = [],
			statusarray = [];
		Zepto('.mui-table-view-cell').each(function() {
			var self = Zepto(this);
			taskmaterialarray.push(self.attr('tmguid'));
			statusarray.push(self.attr('status'));
		});
		var url = config.serverUrl + "zwdtProject/checkAllMaterialIsSubmit";
		var requestData = {
			token: config.validateData,
			params: {
				"statusarray": statusarray,
				"taskmaterialarray": taskmaterialarray,
				"taskcaseguid": ""
			}
		};
		console.log('请求参数' + JSON.stringify(requestData) + ';请求地址' + url);
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
				console.log('请求成功');
				console.log(JSON.stringify(rtnData));
				if(rtnData.status.code != 200) {
					mui.toast(rtnData.status.text);
					return;
				}
				if(rtnData.custom.code == 0) {
					mui.toast(rtnData.custom.text);
					return;
				}
				var leave = rtnData.custom.nosubmitnum;
				if(leave == 0) {
					if(isSupply == '1') {
						// 补正
						addCorrect(options);
					} else {
						// 提交办件
						submitTask(options);
					}
				} else {
					mui.toast('您还有' + leave + '份必要电子材料需要提交！');
				}
			},
			error: function(response) {
				console.log('请求失败');
				console.log(JSON.stringify(response));
			}
		});
	}

	/*
	 * @description 补正
	 */
	function addCorrect(options) {
		var url = config.serverUrl + 'zwdtProject/submitMaterial';
		var requestData = {};
		// 动态校验字段
		requestData.token = config.validateData;
		requestData.params = {
			areacode: config.areacode,
			projectguid: ProjectGuid,
			materiallist: MaterialList
		};
		// 某一些接口是要求参数为字符串的
		requestData = JSON.stringify(requestData);
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
					return;
				}
				if(response.custom.code != 1) {
					mui.toast(response.custom.text);
					return;
				}
				mui.toast('补正完成，2s后自动返回首页！');
				setTimeout(function() {
					WeixinJSBridge.call('closeWindow');
				}, 2000);
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

	/*
	 * @description 提交办件
	 */
	function submitTask(options) {
		var preAllDatas = window.localStorage.getItem('preAllDatas');
		var datas = JSON.parse(preAllDatas);
		var url = config.serverUrl + 'zwdtProject/private/submitProjectByTaskguid';
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
				if(response.status.code != 200) {
					mui.toast(response.status.text);
					return;
				}
				if(response.custom.code != 1) {
					mui.toast(response.custom.text);
					return;
				}
				//				if(isSupply == '1') {
				//					mui.toast('补正完成，2s后自动返回首页！');
				//					setTimeout(function() {
				//						WeixinJSBridge.call('closeWindow');
				//					}, 2000);
				//				} else {
				mui.openWindow({
					url: "ZWFW_AuditApply_Success.html?ProjectGuid=" + ProjectGuid + "&UserPK=" + OpenID
				});
				//				}

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
});