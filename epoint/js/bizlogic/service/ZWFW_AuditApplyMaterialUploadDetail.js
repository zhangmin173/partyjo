/**
 * 作者: daike
 * 时间: 2016-08-30
 * 描述:  办件材料提交
 */
define(function(require, exports, module) {
	"use strict";
	//每一个页面都要引入的工具类
	var CommonTools = require('CommonTools_Core');
	//引入config-seaBizConfig.js里的别名配置
	var config = require('config_Bizlogic');
	var UITools = require('UITools_Core');
	var WindowTools = require('WindowTools_Core');
	var Token = '';
	var Bathpath = '';
	var ProjectGuid = '';
	var OpenID = '';
	//每一个页面都要引入的工具类
	// initready 要在所有变量初始化做完毕后
	CommonTools.initReady(initData);
	/**
	 * @description 初始化数据,结合initReady使用
	 * plus情况为plusready
	 * 其它情况为直接初始化
	 */
	function initData(isPlus) {
		//引入必备文件,下拉刷新依赖于mui与mustache
		CommonTools.importFile([
			'js/libs/mui.min.js',
			'js/libs/mustache.min.js',
			'js/libs/zepto.min.js'
		], function() {
			OpenID = WindowTools.getExtraDataByKey("UserPK") || '';
			ProjectGuid = WindowTools.getExtraDataByKey('ProjectGuid') || '';

			config.getProjectBasePath(function(bathpath) {
				console.log(bathpath);
				Bathpath = bathpath;
			});
			config.getUserguidbyOpenID(OpenID, function(options, tips) {
				getMaterialList(options);
			}, function(options) {
				getMaterialList(options);
			});
			document.getElementById('submit').addEventListener('tap', function(e) {
				mui.openWindow({
					url: "../interaction/zwfw_mytask.html?openId=" + OpenID
				});
			})
		});
	}
	/**
	 * 获取需要提交的材料列表
	 */
	function getMaterialList(options) {
		var url = config.serverUrl + "zwdtProject/getSubmitMaterialList";
		var requestData = {
			token: config.validateData,
			params: {
				"projectguid": ProjectGuid
			}
		};
		//console.log('请求参数' + JSON.stringify(requestData) + ';请求地址' + url)
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
					var MaterialList = rtnData.custom.materiallist;
					var strTaskHtml = "";

					if(MaterialList.length < 1) {
						strTaskHtml = " <div ><p>该申报事项无需申报材料</p></div>";

					} else {
						for(var i = 0, len = MaterialList.length; i < len; i++) {
							strTaskHtml = strTaskHtml + "<li class='mui-table-view-cell'> ";
							//							if(MaterialList[i].necessary == 0) {
							//								strTaskHtml = strTaskHtml + "<a  id='" + MaterialList[i].projectmaterialname + ";" + MaterialList[i].projectmaterialguid + "' class='mui-navigate-right mui-clearfix material-name'  > " + MaterialList[i].projectmaterialname + "<br><span id='" + MaterialList[i].projectmaterialname + ";" + MaterialList[i].projectmaterialguid + "' class='material-count' >已上传</span></a></li>";
							//							} else {
							//								strTaskHtml = strTaskHtml + "<a  id='" + MaterialList[i].projectmaterialname + ";" + MaterialList[i].projectmaterialguid + "' class='mui-navigate-right mui-clearfix material-name' > " + MaterialList[i].projectmaterialname + "<span class='star'>(*)</span><br><span id='" + MaterialList[i].projectmaterialname + ";" + MaterialList[i].projectmaterialguid + "' class='material-count' >已上传</span></a></li>";
							//								//存在必填材料未上传
							//								if(MaterialList[i].AttachCount == "0") {
							//									Zepto("#is_submit").val("0");
							//								}
							//							}
							if(MaterialList[i].necessary == 0) {
								strTaskHtml = strTaskHtml + "<a  id='" + MaterialList[i].projectmaterialname + ";" + MaterialList[i].projectmaterialguid + ";" + MaterialList[i].cliengguid + "' class='mui-clearfix material-name'  > " + MaterialList[i].projectmaterialname + "<br><span id='" + MaterialList[i].projectmaterialname + ";" + MaterialList[i].projectmaterialguid + "' class='material-count' >已上传</span></a></li>";
							} else {
								strTaskHtml = strTaskHtml + "<a  id='" + MaterialList[i].projectmaterialname + ";" + MaterialList[i].projectmaterialguid + ";" + MaterialList[i].cliengguid + "' class='mui-clearfix material-name' > " + MaterialList[i].projectmaterialname + "<span class='star'>(*)</span><br><span id='" + MaterialList[i].projectmaterialname + ";" + MaterialList[i].projectmaterialguid + "' class='material-count' >已上传</span></a></li>";
								//存在必填材料未上传
								if(MaterialList[i].AttachCount == "0") {
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
								mui.openWindow({
									url: "ZWFW_MaterialAttachDetail.html?projectguid=" + ProjectGuid + "&Mname=" + encodeURIComponent(pars[0]) + "&ClientGuid=" + pars[2] + "&UserPK=" + OpenID
								});
							}
							if(e.target.tagName === 'SPAN') {
								var pars = e.target.id.split(';');
								mui.openWindow({
									url: "ZWFW_MaterialAttachDetail.html?projectguid=" + ProjectGuid + "&Mname=" + encodeURIComponent(pars[0]) + "&ClientGuid=" + pars[2] + "&UserPK=" + OpenID
								});
							}

						});
					}
					$('#iteminfo').html(strTaskHtml);
				}

			},
			error: function(response) {
				console.log('请求失败');
				console.log(JSON.stringify(response));
			}
		});
	};

});