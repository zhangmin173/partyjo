/**
 * 作者: dailc
 * 时间: 2016-05-21 
 * 描述: 项目中用到的通用config文件 
 */
define(function(require, exports, module) {
	//是否正式发布
	exports.isFormal = true;
	//是否使用Mock,优先级高于前面的url
	exports.isUserMock = false;
	//usersession key
	exports.userSessionKey = 'UserSessionKey_showcase';
	//settingSession key
	exports.settingSessionKey = 'SettingSessionKey_showcase';
	//oauth key 包括授权和登录等
	exports.oauthSessionKey = 'OauthSessionKey_showcase';
	//全局服务器地址
	exports.serverUrl = '';
	//全局验证参数
	exports.validateData = 'Epoint_WebSerivce_**##0601';
	//更新文件地址 
	exports.updateFileUrl = '';
	// 网站大师接口地址
	exports.websiteUrl = 'http://192.168.202.161/epoint-web-zwdtwzds/rest/';
	exports.imgUrl = 'http://192.168.204.45';
	// 辖区编码
	exports.areacode = '320582'; // http://192.168.202.160:8089/epoint-web-zwdt/

	//根据OpenID获取userguid
	exports.getUserguidbyOpenID = function(OpenID, successcallback, errorcallback) {
		var options = {};
		var tips = ''; 
		var url = "http://192.168.202.161/epoint-web-zwdt-76/rest/zwfwWxUser/wzUserDetailByOpenID";
		var requestData = {
			token: 'Epoint_WebSerivce_**##0601',
			params: {
				"openid": OpenID
			}
		}
		//console.log('openid请求参数' + JSON.stringify(requestData) + ';请求地址' + url)
		mui.ajax(url, {
			data: JSON.stringify(requestData),
			dataType: "json",
			type: "POST",
			contentType: 'application/json;charset=UTF-8',
			success: function(rtnData) {
				//console.log('openid请求结果')
				//console.log(JSON.stringify(rtnData));
				if(rtnData.status.code != 200) {
					tips = rtnData.status.text;
					mui.toast(rtnData.status.text);
					//errorcallback && errorcallback(rtnData);
					return false;
				}
				if(rtnData.custom.code == 0) {
					tips = rtnData.custom.text;
					errorcallback && errorcallback(rtnData);
					//self.location = '../interaction/Account_binding.aspx?UserPK=' + userguid;
					return false;
				}
				options.userName = rtnData.custom.username;
				options.idNum = rtnData.custom.idnum;
				options.mobile = rtnData.custom.mobile;
				options.token = rtnData.custom.token;
				tips = '请求成功';
				successcallback && successcallback(options, tips);
			},
			error: function(response) {
				//console.log('请求失败');
				//console.log(JSON.stringify(response));
				//errorcallback && errorcallback(response);
			}
		});

	}
	/**
	 * @description 得到一个项目的根路径,
	 * h5模式下例如:http://id:端口/项目名/
	 * @return {String} 项目的根路径
	 */
	exports.getProjectBasePath = function(success) {
		//非本地
		var obj = window.location;
		var patehName = obj.pathname;
		//h5
		var contextPath = '';
		//这种获取路径的方法有一个要求,那就是所有的html必须在html文件夹中,并且html文件夹必须在项目的根目录
		//普通浏览器
		contextPath = patehName.substr(0, patehName.lastIndexOf("/html/") + 1);
		//var contextPath = obj.pathname.split("/")[1] + '/';
		var basePath = obj.protocol + "//" + obj.host + contextPath;
		//console.log(basePath);
		success && success(basePath);
	};
	/**
	 * 匿名函数中进行全局配置
	 */
	(function() {
		//正式地址
		var serverUrl_formal = 'http://192.168.202.161/epoint-web-zwdt-76/rest/'; //http://218.4.136.120:8089/epoint-web-zwdt/rest/   http://192.168.202.160:8118/epoint-web-zwdt/rest/
		var udateFileUrl_formal = '';
		//测试地址
		var serverUrl_test = '';
		var udateFileUrl_test = '';
		//mock地址
		var serverUrl_mock = 'http://218.4.136.118:8086/mockjs/143/';
		if(exports.isFormal === true) {
			exports.serverUrl = serverUrl_formal;
			exports.spdateFileUrl = udateFileUrl_formal;
		} else {
			exports.serverUrl = serverUrl_test;
			exports.updateFileUrl = udateFileUrl_test;
		}
		//mock重写
		if(exports.isUserMock === true) {
			exports.serverUrl = serverUrl_mock;
		}
	})();
});