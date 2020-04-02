
if(!window.YH){
	window.YH={};
}
YH.url = 'https://puser.zjzwfw.gov.cn/sso';
YH.servicecode = "cxwxgz";

YH.config = {
	editUserUrl: YH.url+'/usp.do?action=ssoLogin&method=editUser&servicecode='+YH.servicecode,
	editPwdUrl: YH.url+'/usp.do?action=ssoLogin&method=editPwd&servicecode='+YH.servicecode,
	autoLoginUrl:YH.url+'/js.do?action=autoLogin&servicecode='+YH.servicecode,
	loginUrl:YH.url+'/js.do?action=login&servicecode='+YH.servicecode,
	autoLoginForJsUrl:YH.url+'/js.do?action=autoLogin&js=true&servicecode='+YH.servicecode,
	loginForJsUrl:YH.url+'/js.do?action=login&js=true&servicecode='+YH.servicecode,
	logoutUrl:YH.url+'/js.do?action=logout&servicecode='+YH.servicecode,
	loginAppUrl:YH.url+'/usp.do?action=redirect&servicecode='+YH.servicecode,
	appListUrl:YH.url+'/usp.do?action=ssoLogin&method=index&servicecode='+YH.servicecode,
	forgotPwdUrl:YH.url+'/usp.do?action=forgotPwd',
	loginUSPUrl:YH.url+'/js.do?action=loginUSP',
	accessUserUrl:YH.url+'/usp.do?action=useraccess&servicecode='+YH.servicecode
}

YH.load = {
	addStyle:function(href){
		var style;
		var styleElements = document.getElementsByTagName("link");
		if(styleElements){
			var l = styleElements.length;
			for (var i = 0; i < l; i++) {
				if(styleElements[i].href == href)
					return ;
			}
		}
		style = document.createElement("link");
		style.type = "text/css";
		style.rel="stylesheet" 
		style.href = href;
		document.getElementsByTagName("head")[0].appendChild(style);
	},
	addScript:function(src){
		var script;
		var scriptElements = document.getElementsByTagName("script");
		if(scriptElements){
			var l = scriptElements.length;
			for (var i = 0; i < l; i++) {
				if(scriptElements[i].src == src)
					return ;
			}
		}
		script = document.createElement("script");
		script.type = "text/javascript";
		script.src = src;
		document.getElementsByTagName("HEAD")[0].appendChild(script);
	},
	
	createHidIframe:function(src){
		if(document.getElementById(YH.config.hidIframeName)){
			document.getElementById(YH.config.hidIframeName).src = src;
		}
		
		var iframe = document.createElement("iframe");
		iframe.src = src;
		iframe.setAttribute("class","test");
		document.getElementsByTagName("body")[0].appendChild(iframe);
	},
	
	editScript:function(src){
		var scriptElement = document.getElementById("_ssoedit");
		if(scriptElement){
			scriptElement = scriptElement.parentNode.removeChild(scriptElement)
		}
		if(src.indexOf("?") == -1){
			src += "?1=1";
		}
		src += "&rd="+Math.random();
		var script;
		script = document.createElement("script");
		script.type = "text/javascript";
		script.src = src;
		script.id = "_ssoedit";
		document.getElementsByTagName("HEAD")[0].appendChild(script);
	}
	
}
YH.method = {
	editUser:function(){
		window.open(YH.config.editUserUrl,'_blank','left=400,top=200,resizable=yes,height=810,width=510');
	},
	editPwd:function(){
		window.open(YH.config.editPwdUrl,'_blank','left=400,top=200,resizable=yes,height=390,width=510');
	},
	autoLogin:function(){
		YH.load.editScript(YH.config.autoLoginUrl);
	},
	login:function(loginname, loginpwd, orgcoding){
		if(orgcoding){
		}else{
			orgcoding = "";
		}
		YH.load.editScript(YH.config.loginUrl+"&loginname="+loginname+"&loginpwd="+loginpwd+"&orgcoding="+orgcoding);
	},
	autoLoginForJs:function(){
		YH.load.editScript(YH.config.autoLoginForJsUrl);
	},
	loginForJs:function(loginname, loginpwd, orgcoding){
		YH.load.editScript(YH.config.loginForJsUrl+"&loginname="+loginname+"&loginpwd="+loginpwd+"&orgcoding="+orgcoding);
	},
	
	logout:function(){
		YH.cookie.del(YH.cookie.loginSign,true);
		YH.load.editScript(YH.config.logoutUrl);
	},
	
	applist:function(){
		window.open(YH.config.appListUrl,'_blank','left=400,top=200,resizable=yes,height=370,width='+(screen.availWidth-550)/2);
	},
	
	forgotPwd:function(){
		window.open(YH.config.forgotPwdUrl,'_blank','left=400,top=200,resizable=yes,height=365,width=510');
	},
	
	uspTalk:function(loginname){
		var url = YH.config.loginUSPUrl+'&type=1';
		if(loginname){
			url = url + '&talktoid='+loginname;
		}
		YH.load.editScript(url);
	},
	
	uspSms:function(telphone){
		var url = YH.config.loginUSPUrl+'&type=2';
		if(telphone){
			url = url + '&telenum='+telphone;
		}
		YH.load.editScript(url);
	},
	uspMulSms:function(){
		YH.load.editScript(YH.config.loginUSPUrl+'&type=3');
	},
	
	uspCallTel:function(telphone){
		var url = YH.config.loginUSPUrl+'&type=4';
		if(telphone){
			url = url + '&telenum='+telphone;
		}
		YH.load.editScript(url);
	},
	accessUser:function(){
		window.open(YH.config.accessUserUrl,'_blank','left=400,top=200,resizable=yes,height=370,width='+(screen.availWidth-550)/2);
	}
	
}

YH.callback = {
	loginApp:function(ticket, isjs, isfirst){
		if(YH.cookie.islogin() == false){
			YH.cookie.set(YH.cookie.loginSign,true);
			if(isjs){
				YH.callback.loginAppForJs(ticket);
			}else{
				var url = YH.config.loginAppUrl;
				if(isfirst){
					url = url + "&isfirst=true";
				}
				window.location.href = url+"&ticket="+ticket;
			}
		}
	},
	loginAppForJs:function(ticket){
		
	},
	logoutForJs:function(){
		
	},
	loginUsp:function(url){
		window.location.href = url;
	},
	showErrcode:function(errorMsg, errorcode){
		alert("发生错误，"+errorMsg);
	},
	accessUser:function(){
		window.location.href = YH.config.accessUserUrl;
	}
}

YH.cookie={
	loginSign:'yh_app_islogin',
	islogin:function(){
		//var value = YH.cookie.get(YH.cookie.loginSign);
		//if(value && (value == true || value == 'true')){
		//	return true;
		//}
		//return false;
		return false;
	},
	set:function(name, value, time){
		var value = name + "="+ escape (value);
		if(time){//小时
		    var exp  = new Date(); //new Date("December 31, 9998");
		    exp.setTime(exp.getTime() + time*60*60*1000);
			value = value + ";expires=" + exp.toGMTString();
		}
		document.cookie = value
	},
	get:function(name){
		var arr = document.cookie.match(new RegExp("(^| )"+name+"=([^;]*)(;|$)"));
		if(arr != null) return unescape(arr[2]); return null;
	},
	del:function(name){
		var exp = new Date();
	    exp.setTime(exp.getTime() - 1);
	    var cval=this.get(name);
	    if(cval!=null) document.cookie= name + "="+cval+";expires="+exp.toGMTString();
	}
}
