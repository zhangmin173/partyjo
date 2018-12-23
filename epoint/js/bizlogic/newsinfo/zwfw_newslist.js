/**
 * 作者: 
 * 创建时间:2017/6/013 10:11:35
 * 版本:[1.0, 2017/6/13]
 * 版权:江苏国泰新点软件有限公司
 * 描述:中心新闻 列表
 */

define(function(require, exports, module) {
	"use strict";
	//每一个页面都要引入的工具类
	var CommonTools = require('CommonTools_Core');
	var WindowTools = require('WindowTools_Core');
	//下拉刷新
	var PullToRefreshTools = require('PullToRefresh_Impl_Default_Core');
	//config引入-这里示例引入方式
	var Config = require('config_Bizlogic');
	//下拉刷新对象
	var pullToRefreshObj;
	var CategoryNum = '';
	var totalcount = '';
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
			'js/libs/zepto.min.js',
		], function() {
			initPullRefreshList();
		});

	}

	/**
	 * @description 初始化下拉刷新
	 */
	function initPullRefreshList() {
		var url = Config.websiteUrl + 'webBuilderWebServiceForMicroPortalImpl/getInfoList';
		var litemplate =
			"<li class='news-item mui-clearfix' id='{{infoID}}'><div class='news-pic' id='{{infoID}}'><img src='{{imgUrlList}}' id='{{infoID}}'/> </div><div class='news-info' id='{{infoID}}'><span class='news-title' id='{{infoID}}'>{{{title}}}</span><div class='news-tagging mui-clearfix' id='{{infoID}}'><span class='tagging-name' id='{{infoID}}'>{{Author}}</span><span class='tagging-time' id='{{infoID}}'>{{infoDate}}</span></div></div></li>";
		var pageSize = 10;
		var getData = function(currPage) {
			var requestData = {};
			//动态校验字段
			requestData.token = 'epointoa@83OZsT5IdXL2uwu_XMvEfpdpzrc=@MjE0NzQ4MzY0Nw==';
			var data = {
				currentPageIndex: currPage,
				pageSize: pageSize,
				cateNum: "003",
				infoType: "1",
				title: "",
				height: "480",
				width: "960"
			};
			requestData.params = data;
			//某一些接口是要求参数为字符串的
			console.log('请求数据:' + JSON.stringify(requestData));
			return JSON.stringify(requestData);
		};
		var onClickCallback = function(e) {
			var InfoID = this.id;
			console.log("点击:" + InfoID);
			var data = {
				InfoID: InfoID
			};
			WindowTools.createWin('test', 'zwfw_newsdetail.html', data);
		};
		var changeResponseDataCallback = function(response) {
			console.log(JSON.stringify(response))
			if(response.status.code != 200) {
				mui.toast(response.status.text);
				return false;
			}
			if(response.custom.code == 0) {
				mui.toast(response.custom.text);
				return false;
			}
			totalcount = response.custom.infoList.length;
			var cglist = response.custom.infoList;

			var categorylist = [];
			//去掉多余层
			for(var i = 0, len = cglist.length; i < len; i++) {
				cglist[i].infoDate = cglist[i].infoDate.split('.')[0];
				cglist[i].imgUrlList = cglist[i].imgUrlList[0];
				categorylist.push(cglist[i]);
			}
			return categorylist;
		}
		var changeToltalCountCallback = function() {
			return totalcount;
		}
		PullToRefreshTools.initPullDownRefresh({
			isDebug: true,
			bizlogic: {
				defaultInitPageNum: 0,
				getLitemplate: litemplate,
				getUrl: url,
				getRequestDataCallback: getData,
				//requestTimeOut:3000,
				itemClickCallback: onClickCallback,
				changeResponseDataCallback: changeResponseDataCallback,
				changeToltalCountCallback: changeToltalCountCallback,
				ajaxSetting: {
					contentType: 'application/json;charset=UTF-8',
					headers: {
						Accept: "text/html;charset=utf-8",
					}
				}
			},
			//三种皮肤
			//default -默认人的mui下拉刷新,webview优化了的
			//type1 -自定义类别1的默认实现, 没有基于iscroll
			//type1_material1 -自定义类别1的第一种材质
			skin: 'type1'
		}, function(pullToRefresh) {
			//console.log("生成下拉刷新成功");
			pullToRefreshObj = pullToRefresh;
			setTimeout(function() {
				//console.log("刷新");
				pullToRefreshObj.refresh();
			}, 1000);
		});
	}
});