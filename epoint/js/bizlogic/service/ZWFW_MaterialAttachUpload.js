/**
 * 作者: daike
 * 时间: 2016-08-30
 * 描述: 申报 材料上传 选择文件
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
	var OpenID = '';
	var ProjectGuid = '';
	var materialGuid = ''; // 事项主键
	var status = '';
	var type = '';
	var attachfiles = [];
	var attachnum = 0;
	var ClientGuid = '';
	var Mname = '';
	var IS_IOS = '';
	var taskGuid = '';
	var userType = '';
	var isSupply = '';
	//最大上传数量
	//var maxcount = '';

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
			if(CommonTools.os.ios) {
				IS_IOS = '1';
				console.log(IS_IOS)
			}
			//maxcount = WindowTools.getExtraDataByKey("maxcount");
			OpenID = WindowTools.getExtraDataByKey("UserPK") || '';
			ProjectGuid = WindowTools.getExtraDataByKey("ProjectGuid") || '';
			ClientGuid = WindowTools.getExtraDataByKey("ClientGuid") || '';
			Mname = decodeURIComponent(WindowTools.getExtraDataByKey("Mname"));
			materialGuid = WindowTools.getExtraDataByKey('materialGuid') || '';
			status = WindowTools.getExtraDataByKey('status') || '';
			type = WindowTools.getExtraDataByKey('type') || '';
			taskGuid = WindowTools.getExtraDataByKey('taskGuid') || '';
			userType = WindowTools.getExtraDataByKey('userType') || '';
			isSupply = WindowTools.getExtraDataByKey('isSupply') || '';
			isSupply = isSupply.split('#')[0];
			document.getElementById('Mname').innerHTML = Mname;

			config.getUserguidbyOpenID(OpenID, function(options, tips) {
				initListener(options);
				GETlist(options);
				// 监听返回按钮
				Zepto(function() {
					pushHistory();
					window.addEventListener("popstate", function(e) {
						// 判断材料是否上传
						judgeMaterialUpload(options);
						pushHistory();
					}, false);
				});
			}, function(options) {
				GETlist(options);
				// 监听返回按钮
				Zepto(function() {
					pushHistory();
					window.addEventListener("popstate", function(e) {
						// 判断材料是否上传
						judgeMaterialUpload(options);
						pushHistory();
					}, false);
				});
				// console.log(JSON.stringify(response));
			});

			config.getProjectBasePath(function(bathpath) {
				//console.log(bathpath);
			})
			//			var oFile = document.getElementById("fileuploadbtn");
			//			oFile.addEventListener('change', function(evt) {
			//				console.log(oFile.files[0]);
			//				if(oFile.files) // upfile.files，一般来说这个对象也是由系统提供的，不可以自己生成
			//				{
			//					attachfiles = [{
			//						name: oFile.files[0].name,
			//						file: oFile.files[0]
			//					}];
			//					console.log(JSON.stringify(attachfiles))
			//					upload();
			//				}
			//			});
			//			attachdetail();
			//			document.getElementById('finish').addEventListener('tap', function(e) {
			//				mui.openWindow({
			//					url: "ZWFW_AuditApplyMaterialUpload.html?ProjectGuid=" + ProjectGuid + "&UserPK=" + OpenID
			//
			//				});
			//
			//			});

		});
	}

	function pushHistory() {
		var state = {
			title: "title",
			url: "#"
		};
		window.history.pushState(state, "title", "#");
	}

	function initListener(options) {
		var oFile = document.getElementById("fileuploadbtn");
		oFile.addEventListener('change', function(evt) {
			var fileName = oFile.files[0].name;
			var _date = new Date();
			var _time = _date.getTime();
			// 判断手机系统
			var u = navigator.userAgent,
				app = navigator.appVersion;
			var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //android终端或者uc浏览器   
			var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端   
			// IOS 拍照后面加上时间戳
			if(isiOS) {
				if(fileName.toUpperCase() == 'IMAGE.JPG') {
					var preFile = fileName.split('.')[0];
					var abFile = fileName.split('.')[1];
					fileName = (preFile + _time + '.' + abFile).toLowerCase();
				}
			}
			if(oFile.files) // upfile.files，一般来说这个对象也是由系统提供的，不可以自己生成
			{
				attachfiles = [{
					name: fileName,
					file: oFile.files[0]
				}];
				console.log(JSON.stringify(attachfiles))
				upload(options, fileName);
			}
		});
		attachdetail(options);
		// 点击上传完成
		document.getElementById('finish').addEventListener('tap', function(e) {
			// 判断材料是否上传
			judgeMaterialUpload(options);

		});
		mui('.mui-content').on('tap', '.doclist_cell', function() {
			var id = Zepto(this).attr('attachUrl');
			// 判断手机系统
			var u = navigator.userAgent,
				app = navigator.appVersion;
			var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //android终端或者uc浏览器   
			var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端   
			if(isiOS) {
				if(isWeiXin()) {
					mui.toast('如无法打开请您点击右上角通过浏览器下载附件！');
				} else {
					location.href = id;
				}
			} else {
				location.href = id;
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

	/*
	 * @description 检查材料是否上传
	 */
	function judgeMaterialUpload(options) {
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
				if(rtnData.custom.code != 1) {
					mui.toast(rtnData.custom.text);
					return;
				}
				if(rtnData.custom.showbutton == '0') {
					mui.toast('您还未上传相关附件！');
					return;
				}
				mui.openWindow({
					url: "ZWFW_AuditApplyMaterialUpload.html?ProjectGuid=" + ProjectGuid + "&UserPK=" + OpenID + "&ClientGuid=" + ClientGuid + "&Mname=" + encodeURIComponent(Mname) + "&materialGuid=" + materialGuid + "&status=" + status + "&type=" + type + '&userType=' + userType + '&taskGuid=' + taskGuid + '&isSupply=' + isSupply
				});
			},
			error: function(response) {
				console.log('请求失败');
				console.log(JSON.stringify(response));
			}
		});
	}

	function GETlist(options) {
		var url = config.serverUrl + "zwdtProject/getMaterialAttachListbyClientguid";
		var requestData = {
			token: config.validateData,
			params: {
				"clientguid": ClientGuid,
				"uploadtype": ""
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
				if(rtnData.custom.attachlist && Array.isArray(rtnData.custom.attachlist)) {
					var AttachList = rtnData.custom.attachlist;
					var strTaskHtml = "";
					//				if(maxcount == rtnData.UserArea.TotalCount) {
					//					Zepto('#uploader').hide();
					//				} else {
					//					Zepto('#uploader').show();
					//				}
					if(AttachList.length < 1) {
						//  strTaskHtml = " <div ><p>请点击右边按钮上传附件</p></div>";
						Zepto('.hasupload').show();
					} else {
						Zepto('.hasupload').hide();
						strTaskHtml = '';
						for(var i = 0, len = AttachList.length; i < len; i++) {
							// strTaskHtml += '<li class="mui-table-view-cell doclist_cell mui-transitioning"attachUrl="' + AttachList[i].attachicon + '"id="' + AttachList[i].attachguid + '"><div class="mui-slider-right mui-disabled"><a class="mui-btn mui-btn-red"style="transform: translate(0px, 0px);"id="' + AttachList[i].attachguid + '">删除</a></div><div class="mui-navigate-right"id=' + AttachList[i].attachicon + ' ><div class="mui-slider-handle"style="transform: translate(0px, 0px);"id="' + AttachList[i].attachguid + '">' + AttachList[i].attachname + '</div></div></li>';
							strTaskHtml += '<li class="mui-table-view-cell"attachUrl="' + AttachList[i].attachicon + '"><div class="mui-slider-right mui-disabled"><a class="mui-btn mui-btn-red"id="' + AttachList[i].attachguid + '">删除</a></div><div class="mui-slider-handle"id="' + AttachList[i].attachguid + '"><p class="material-title">' + AttachList[i].attachname + '</p><div class="mui-icon mui-icon-arrowright"></div></div></li>';
						}
						Zepto('.doclist').html('');
						Zepto('.doclist').append(strTaskHtml);

					}
				}

			},
			error: function(response) {
				console.log('请求失败');
				console.log(JSON.stringify(response));
			}
		});
	}
	/*
	 * 上传
	 */
	function upload(options, fileName) {
		UITools.showWaiting();
		UploadH5Tools.upLoadFiles({
			url: config.serverUrl + 'zwdtAttach/private/attachUpload',
			data: {
				"clientguid": ClientGuid,
				"attachname": fileName,
				"source": ""
			},
			contentType: 'application/json;charset=UTF-8',
			headers: {
				Accept: "text/html;charset=utf-8",
				Authorization: "Bearer " + options.token || ''
			},
			files: attachfiles,
			beforeUploadCallback: function() {
				console.log("准备上传");

			},
			successCallback: function(response, detail) {
				console.log("上传成功:" + JSON.stringify(response));
				console.log("detail:" + detail);
				Zepto('.doclist').html('');
				UITools.closeWaiting();
				GETlist(options);
			},
			errorCallback: function(msg, detail) {
				console.log("上传失败:" + msg);
				console.log("detail:" + detail);

			},
			uploadingCallback: function(percent, msg, speed) {
				console.log("上传中:" + percent + ',msg:' + msg + ',speed:' + speed);

			}
		});
	}

	function attachdetail(options) {
		Zepto('#doclist').on('tap', '.mui-slider-handle', function(event) {
			var id = event.target.id;
			var extStart = this.innerText;
			console.log(extStart);

			var ext = extStart.substring(extStart, extStart.length).toUpperCase();
			if(ext != ".BMP" && ext != ".PNG" && ext != ".GIF" && ext != ".JPG" && ext != ".JPEG") {
				//getattachurl(id);
			} else {
				mui.openWindow({
					url: "ZWFW_Attach.html?AttachGuid=" + id + '&OpenID=' + OpenID
				});
			}
		});

		var btnArray = ['确认', '取消'];
		//第二个demo，向左拖拽后显示操作图标，释放后自动触发的业务逻辑
		Zepto('#doclist').on('tap', '.mui-btn-red', function(event) {

			var id = event.target.id;
			var elem = this;
			var pnode = elem.parentNode;
			var linode = pnode.parentNode;
			mui.confirm('确认删除该附件？', '', btnArray, function(e) {
				if(e.index == 0) {
					deleteattach(id, linode, options);
				}
			});
		});
	}
	/**
	 * 删除附件
	 * @param {Object} s
	 */
	function deleteattach(s, $, options) {
		var url = config.serverUrl + "zwdtAttach/private/attachDelete";

		var requestData = {
			token: config.validateData,
			params: {
				"attachguid": s
			}
		}
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
				mui.toast(rtnData.custom.text);
				$.parentNode.removeChild($);
				GETlist(options);
			},
			error: function(response) {
				console.log('请求失败');
				console.log(JSON.stringify(response));
			}
		});

	}
	/**
	 * 获取附件下载地址
	 */
	//	function getattachurl(s) {
	//		var url = config.serverUrl + "/Attach/GetAttachURL";
	//
	//		var requestData = {
	//			ValidateData: config.validateData,
	//			paras: {
	//				AttachGuid: s
	//			}
	//		}
	//		mui.ajax(url, {
	//			data: JSON.stringify(requestData),
	//			dataType: "json",
	//			type: "POST",
	//			success: function(rtnData) {
	//				console.log('请求成功');
	//				console.log(JSON.stringify(rtnData));
	//				if(rtnData.ReturnInfo.Code == "0") {
	//					mui.toast(rtnData.ReturnInfo.Description);
	//					return;
	//				}
	//				if(rtnData.BusinessInfo.Code == "0") {
	//					mui.toast(rtnData.BusinessInfo.Description);
	//					return;
	//				}
	//				var AttachInfo = rtnData.UserArea.AttachURL;
	//				var strTaskHtml = "";
	//				if(AttachInfo.length < 1) {} else {
	//					mui.openWindow(AttachInfo);
	//				}
	//			},
	//			error: function(response) {
	//				console.log('请求失败');
	//				console.log(JSON.stringify(response));
	//			}
	//		});
	//	}
});