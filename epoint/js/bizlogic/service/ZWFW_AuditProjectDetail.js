/**
 * 作者: daike
 * 时间: 2016-08-29
 * 描述: 我的办件 办件详情
 */
define(function(require, exports, module) {
	"use strict";

	var CommonTools = require('CommonTools_Core');

	var config = require('config_Bizlogic');
	var UITools = require('UITools_Core');
	var WindowTools = require('WindowTools_Core');

	var ProjectGuid = ''; //6a7204e2-ffea-452e-99f7-8d4ef1adedb8
	var Bathpath = '';
	var OpenID = ''; //oegp-juHNw3zwjIAQm3T4OPYAKHk
	var EditM = '0';
	var attachCount = ''; // 审核附件数
	var centerGuid = '';
	var taskGuid = '';

	CommonTools.initReady(initData);

	function initData(isPlus) {

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
			ProjectGuid = WindowTools.getExtraDataByKey("ProjectGuid") || '';
			EditM = WindowTools.getExtraDataByKey("EditM") || '';
			centerGuid = WindowTools.getExtraDataByKey("centerGuid") || '';
			taskGuid = WindowTools.getExtraDataByKey("taskGuid") || '';
			if(EditM == '1') {
				$('#btnnext').html("补正材料");
			} 
//			else {
//				$('#btnnext').html("查看材料");
//			}
			config.getProjectBasePath(function(bathpath) {
				Bathpath = bathpath;
				//console.log(Bathpath)
			});
			config.getUserguidbyOpenID(OpenID, function(options, tips) {
				initBJinfo(options);
				init();
			}, function(options) {
				initBJinfo(options);
				init();
			});
		});
	}

	function init() {
		// 初始化scroll控件
		mui('.mui-scroll-wrapper').scroll({
			deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
		});
		Zepto('#btnnext').on('tap', function() {
			if(EditM == '1') {
				mui.openWindow({
					url: "ZWFW_AuditApplyMaterialUpload.html?ProjectGuid=" + ProjectGuid + "&UserPK=" + OpenID + '&taskGuid=' + taskGuid + '&centerGuid=' + centerGuid + '&isSupply=1'
				});
			} 
//			else {
//				mui.openWindow({
//					url: "ZWFW_AuditApplyMaterialUploadDetail.html?ProjectGuid=" + ProjectGuid + "&UserPK=" + OpenID
//				});
//			}
		});
		document.getElementById('divspjg').addEventListener('tap', function(e) {
			if(e.target.id === 'xgfj') {
				mui.openWindow({
					url: "ZWFW_AttachList.html?ClientGuid=" + ProjectGuid + '&attachCount=' + attachCount + "&UserPK=" + OpenID
				});

			}

		});
	}
	/**
	 * 初始化申报信息
	 */
	function initBJinfo(options) {
		//办件详情
		var url = config.serverUrl + "zwdtProject/getProjectDetail";

		var requestData = {
			token: config.validateData,
			params: {
				"projectguid": ProjectGuid,
				"taskguid": taskGuid,
				"areacode": config.areacode
			}
		}
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
				if(rtnData.status.code != 200) {
					mui.toast(rtnData.status.text);
					return;
				}
				if(rtnData.custom.code == 0) {
					mui.toast(rtnData.custom.text);
					return;
				}

				var CSHInfo = rtnData.custom;
				if (CSHInfo.applyertype == '20') {
					$('#spxm').html("申请人");
				} else {
					$('#spxm').html("企业名称");
				}
				$('#spsfz').text(CSHInfo.certtype);
				$('#xm').text(CSHInfo.applyername);
				$('#sfz').text(CSHInfo.applyercertnum);
				if(CSHInfo.contactperson) {
					$('.lxr').show();
					$('#lxr').text(CSHInfo.contactperson);
				} else {
					$('.lxr').hide();
				}
				if(CSHInfo.contactmobile) {
					$('.lxsj').show();
					$('#lxsj').text(CSHInfo.contactmobile);
				} else {
					$('.lxsj').hide();
				}
				$('#lxdz').text(CSHInfo.address);
				$('#sqrq').text(CSHInfo.applydate);
				if(CSHInfo.status == "正常办结") {

					if(CSHInfo.ProjectResult == "50") {
						$('#bljd').text("正常办结(不予许可)");
					} else {
						$('#bljd').text("正常办结(准予许可)");
					}
				} else {
					$('#bljd').text(CSHInfo.status);
				}
				$('#taskname').text(CSHInfo.taskname);
				$('#flowsn').text(CSHInfo.itemid);

				//					if(CSHInfo.ResultAttachCount == "0") {
				//						document.getElementById("divspjg").style.display = none;
				//					} else {
				//						document.getElementById("divspjg").style.display = "";
				//					}
				document.getElementById("divspjg").style.display = "";
				$('.sprq').hide();
				//$('#sprq').text(CSHInfo.BanwanDate);

				// 审批
				$('#spjg').text(CSHInfo.resultname);
				attachCount = CSHInfo.attachcount || '0';
				$('#xgfj').text("共有" + attachCount + "个附件");

			}
		});
	}

});