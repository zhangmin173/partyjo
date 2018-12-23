/**
 * 作者: 
 * 创建时间:2017/6/013 10:11:35
 * 版本:[1.0, 2017/6/13]
 * 版权:江苏国泰新点软件有限公司
 * 描述:中心新闻 详情
 */

define(function(require, exports, module) {
	"use strict";
	//每一个页面都要引入的工具类
	var CommonTools = require('CommonTools_Core');
	var WindowTools = require('WindowTools_Core');
	//下拉刷新
	//var PullToRefreshTools = require('PullToRefresh_Impl_Default_Core');
	//config引入-这里示例引入方式
	var Config = require('config_Bizlogic');
	//下拉刷新对象
	//var pullToRefreshObj;
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
			'js/libs/mustache.min.js',
			'js/libs/zepto.min.js'
		], function() {
			//初始化
			console.log("初始化");
			getData();

		});
	}
	var getData = function() {
		var value = WindowTools.getExtraDataByKey('InfoID') || '';
		var url = Config.websiteUrl + 'webBuilderWebServiceForMicroPortalImpl/getInfoDetail';
		var litemplate =
			'<div class="details-hd"><h1 id="title">{{{title}}}</h1><div class="publishing-unit mui-clearfix"><span class="unit-name" id="Author">{{Author}}</span><span class="publishing-time" id="InfoDate">{{infoDate}}</span></div></div><div ><span id="InfoContent">{{{infoContent}}}</span></div>';
		var requestData = {};
		//动态校验字段
		requestData.token = 'epointoa@83OZsT5IdXL2uwu_XMvEfpdpzrc=@MjE0NzQ4MzY0Nw==';
		var data = {
			//每个列表的id
			infoID: value
		};
		requestData.params = data;
		requestData = JSON.stringify(requestData);
		//某一些接口是要求参数为字符串的
		//requestData = JSON.stringify(requestData);
		console.log('请求数据:' + JSON.stringify(requestData));

		mui.ajax(url, {
			data: requestData,
			dataType: "json",
			type: "POST",
			contentType: 'application/json;charset=UTF-8',
			accepts: '',
			success: function(response) {
				//console.log(JSON.stringify(response));
				if(response.status.code != 200) {
					mui.toast(response.status.text);
					return false;
				}
				var outdata = response.custom;
				outdata.infoDate = outdata.infoDate.split('.')[0];
				var output = Mustache.render(litemplate, outdata);
				Zepto('.mui-content').append(output);
				
				// 遍历图片
				Zepto('.mui-content').each(function() {
					var regExp = new RegExp(/^http[s]?:\/\//);
					var _this = Zepto(this).find('img');
					mui.each(_this, function(key, value) {
						Zepto(this).addClass('img');
						var src = value.getAttribute('src');
						var _src = src.split('.');
						_src = _src[_src.length - 1].toUpperCase();
						if(_src == 'GIF') {
							Zepto(this).removeClass('img');
						}
						if(!regExp.test(src)) {
							value.setAttribute('src', Config.imgUrl + src);
						}
					});
				});
			},
			error: function(response) {
				console.log('请求失败');
				console.log(JSON.stringify(response))
			}
		});
	};
});