/**
 * 作者: daike
 * 时间: 2016-09-07
 * 描述: 回复材料查看
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
	var ClientGuid = ''; // projectguid
	var OpenID = '';
	var attachCount = '';
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
			OpenID = WindowTools.getExtraDataByKey("UserPK");
			ClientGuid = WindowTools.getExtraDataByKey('ClientGuid') || '';
			attachCount = WindowTools.getExtraDataByKey('attachCount') || '';
			$('#totalnum').html(attachCount);
			config.getUserguidbyOpenID(OpenID, function(options, tips) {
				getMaterialList(options);
				//初始化按钮
				init();
			}, function(options) {
				getMaterialList(options);
				//初始化按钮
				init();
			});
		});
	}

	function init() {
		//查看附件
		document.getElementById('iteminfo').addEventListener('tap', function(e) {
			if(e.target.tagName === 'A') {
				var id = e.target.id;
				var pars = id.split(';');
				var extStart = pars[1].lastIndexOf(".");
				var ext = pars[1].substring(extStart, pars[1].length).toUpperCase();
				// 判断手机系统
				var u = navigator.userAgent,
					app = navigator.appVersion;
				var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //android终端或者uc浏览器   
				var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端   
				if(isiOS) {
					if(isWeiXin()) {
						mui.toast('请您点击右上角通过浏览器下载附件！');
					} else {
						location.href = config.serverUrl + 'auditattach/readAttach?attachguid=' + pars[0];
					}
				} else {
					location.href = config.serverUrl + 'auditattach/readAttach?attachguid=' + pars[0];
				}

				//				if(ext != ".BMP" && ext != ".PNG" && ext != ".GIF" && ext != ".JPG" && ext != ".JPEG") {
				//					mui.toast('请您点击右上角通过浏览器下载附件！');
				//					location.href = 'http://218.4.136.120:8089/epoint-web-zwdt/rest/auditattach/readAttach?attachguid=' + pars[0];
				//				} else {
				//					location.href = 'http://218.4.136.120:8089/epoint-web-zwdt/rest/auditattach/readAttach?attachguid=' + pars[0];
				//					mui.toast('请您点击右上角通过浏览器下载附件！');
				//					//					mui.openWindow({
				//					//						url: "ZWFW_Attach.html?AttachGuid=" + pars[0]
				//					//					});
				//				}
			}

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
	 * 获取材料列表
	 */
	function getMaterialList(options) {
		var url = config.serverUrl + "zwdtAttach/getAttachList";
		var requestData = {
			token: config.validateData,
			params: {
				clientguid: ClientGuid
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

				var AttachList = rtnData.custom.attachList;
				var strTaskHtml = "";
				var totalcount = rtnData.custom.attachList.length;
				$('#totalnum').html(totalcount.toString());

				if(AttachList.length < 1) {

					strTaskHtml = " <div ><p>没有找到相应的数据</p></div>";

				} else {

					for(var i = 0, len = AttachList.length; i < len; i++) {
						strTaskHtml = strTaskHtml + "<li class='mui-table-view-cell'> ";
						strTaskHtml = strTaskHtml + "<a  id='" + AttachList[i].attachguid + ";" + AttachList[i].attachfilename + "'>" + AttachList[i].attachfilename + "</a></li>";
					}
				}
				$('#iteminfo').html(strTaskHtml);

			},
			error: function(response) {
				console.log('请求失败');
				console.log(JSON.stringify(response));
			}
		});
	};

});