/**
 * 作者: daike
 * 时间: 2016-08-30
 * 描述:  我的办件 材料补正 附件上传
 */
define(function(require, exports, module) {
	"use strict";
	//每一个页面都要引入的工具类
	var CommonTools = require('CommonTools_Core');
	//引入config-seaBizConfig.js里的别名配置
	var config = require('config_Bizlogic');
	var UploadH5Tools = require('UpLoadH5Tools_Core');
	var UITools = require('UITools_Core');
	var WindowTools = require('WindowTools_Core');
	var OpenID = ''; //oegp-juHNw3zwjIAQm3T4OPYAKHk
	var ProjectGuid = ''; //019ca242-d7bc-4d1a-a88e-ef04d5018dbf
	var attachfiles = [];
	var attachnum = 0;
	var ClientGuid = ''; //C86B0C70-FE5F-4C32-8185-3AB7F2BF3563
	var Token = '';
	var Mname = '';
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
			ProjectGuid = WindowTools.getExtraDataByKey("ProjectGuid") || '';
			ClientGuid = WindowTools.getExtraDataByKey("ClientGuid") || '';
			Mname = decodeURIComponent(WindowTools.getExtraDataByKey("Mname"));
			//console.log(Mname)
			document.getElementById('Mname').innerHTML = Mname;
			config.getProjectBasePath(function(bathpath) {
				//console.log(bathpath);
			});
			config.getUserguidbyOpenID(OpenID, function(options, tips) {
				getList(options);
			}, function(options) {
				getList(options);
			});
			document.getElementById('finish').addEventListener('tap', function(e) {
				mui.back();
			});
		});
	}

	function getList(options) {
		var url = config.serverUrl + "zwdtProject/getMaterialAttachListbyClientguid";
		var requestData = {
			token: config.validateData,
			params: {
				clientguid: ClientGuid,
				uploadtype: ''
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
				//console.log('请求成功');
				//console.log(JSON.stringify(rtnData));
				if(rtnData.status.code != 200) {
					mui.toast(rtnData.status.text);
					return;
				}
				if(rtnData.custom.code == 0) {
					mui.toast(rtnData.custom.text);
					return;
				}
				if(rtnData.custom.attachlist && Array.isArray(rtnData.custom.attachlist)) {
					var AttachList = rtnData.custom.attachlist;
					var strTaskHtml = '';
					if(AttachList.length > 0) {
						for(var i = 0; i < AttachList.length; i++) {
							strTaskHtml += '<li class=" mui-table-view-cell doclist_cell "id="' + AttachList[i].attachname + ";" + AttachList[i].attachguid + '">' + AttachList[i].attachname + '</li>';
						}

						Zepto('.doclist').append(strTaskHtml);

						attachdetail();
					}
				}
			},
			error: function(response) {
				console.log('请求失败');
				console.log(JSON.stringify(response));
			}
		});
	}

	function attachdetail() {
		//		Zepto('.mui-slider-handle').on('tap',function(){
		//			alert(1)
		//		})
		mui('#doclist').on('tap', '.doclist_cell', function() {
			var id = this.getAttribute("id");
			var pars = id.split(';');
			var extStart = pars[0].lastIndexOf(".");
			var ext = pars[0].substring(extStart, pars[0].length).toUpperCase();

			// 判断手机系统
			var u = navigator.userAgent,
				app = navigator.appVersion;
			var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //android终端或者uc浏览器   
			var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端   

			//			if(ext != ".BMP" && ext != ".PNG" && ext != ".GIF" && ext != ".JPG" && ext != ".JPEG") {
			if(isiOS) {
				if(isWeiXin()) {
					mui.toast('请您点击右上角通过浏览器下载附件！');
				} else {
					location.href = config.serverUrl + 'auditattach/readAttach?attachguid=' + pars[1];
				}
			} else {
				location.href = config.serverUrl + 'auditattach/readAttach?attachguid=' + pars[1];
			}
			//			} else {
			//				location.href = 'http://218.4.136.120:8089/epoint-web-zwdt/rest/auditattach/readAttach?attachguid=' + pars[1];
			//				mui.toast('请您点击右上角通过浏览器下载附件！');
			//				//				mui.openWindow({
			//				//					url: "ZWFW_Attach.html?AttachGuid=" + id
			//				//				});
			//			}
		});

	}

	/*
	 * @description 判断是否为微信环境
	 */
	function isWeiXin() {
		var ua = window.navigator.userAgent.toLowerCase();
		if(ua.match(/MicroMessenger/i) == 'micromessenger' || ua.match(/_SQ_/i) == '_sq_') {
			return true;
		} else {
			return false;
		}
	}

	/**
	 * 获取附件下载地址
	 */
	function getattachurl(s) {
		var url = config.serverUrl + "/Attach/GetAttachURL";

		var requestData = {
			ValidateData: Token,
			paras: {
				AttachGuid: s
			}
		}
		mui.ajax(url, {
			data: JSON.stringify(requestData),
			dataType: "json",
			type: "POST",
			success: function(rtnData) {
				//console.log('请求成功');
				//console.log(JSON.stringify(rtnData));
				if(rtnData.ReturnInfo.Code == "0") {
					mui.toast(rtnData.ReturnInfo.Description);
					return;
				}
				if(rtnData.BusinessInfo.Code == "0") {
					mui.toast(rtnData.BusinessInfo.Description);
					return;
				}
				var AttachInfo = rtnData.UserArea.AttachURL;
				//console.log(AttachInfo);
				var strTaskHtml = "";
				if(AttachInfo.length < 1) {} else {
					mui.openWindow({
						url: AttachInfo
					});
				}
			},
			error: function(response) {
				console.log('请求失败');
				console.log(JSON.stringify(response));
			}
		});
	}
});