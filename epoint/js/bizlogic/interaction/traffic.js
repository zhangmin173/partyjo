/**
 * 作者: 郭天琦
 * 时间: 2016年09月01日15:58:43
 * 描述: 招标公告下拉刷新父页面
 * 一些监听的设置还是放在本页面比较好,要不然不容易找到
 */
define(function(require, exports, module) {
	"use strict";
	//每一个页面都要引入的工具类
	var CommonTools = require('CommonTools_Core');
	var WindowTools = require('WindowTools_Core');
	var UITools = require('UITools_Core');
	//每一个页面都要引入的工具类
	
	//config引入-这里示例引入方式
	var Config = require('config_Bizlogic');

//	var tabDaiban = document.getElementById('MyBJ'),
//		tabYiban = document.getElementById('JDSearch');

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
			'js/libs/mui.min.js'
		], function() {
//			if(Config.isWechat()) {
				createSubWins('http://api.map.baidu.com/marker?location=32.148981,114.093941&title=信阳市行政服务中心&content=信阳市行政服务中心&output=html&src=信阳市行政服务中心');
				initListeners();
//			} else {
//				alert('请在微信中打开此页面！');
//				window.location.href = '../Interaction/ningxiang_white.html';
//			}

		});
	}
	/**
	 * @description 监听
	 */
	function initListeners() {
//		// 点击待办加载待办模块
//		tabDaiban.addEventListener('tap', function() {
//			var classListLength = this.classList.length;
//			for(var i = 0; i < classListLength; i++) {
//				if(this.classList[i] == 'cur') {
//					return;
//				} else {
//					this.classList.add('cur');
//					tabYiban.classList.remove('cur');
//				}
//			}
//			createSubWins('http://api.map.baidu.com/marker?location=28.285606,112.561363&title=宁乡市政府大楼&content=宁乡市政府大楼&output=html&src=宁乡政务服务微信');
//		});

	}

	/**
	 * @description 创建子页面,注意格式
	 */
	function createSubWins(page) {
		var childPage = page;
		var PageArray = [{
			url: childPage, //下拉刷新内容页面地址
			id: childPage, //内容页面标志
			styles: {
				top: '0px', //内容页面顶部位置,需根据实际页面布局计算，若使用标准mui导航，顶部默认为48px；
				bottom: '0px' //其它参数定义
			}
		}];
		//生成子页面
		WindowTools.createSubWins(PageArray, null, function() {
			console.log("加载完毕");
		});
	}
});