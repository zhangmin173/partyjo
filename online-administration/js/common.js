if (typeof jQuery == "undefined") {
    throw new Error("丢失jQuery库文件");
}
window.debug = false
window._global = {
	browser: null,
    url: {
        // api: '/api/'
        api: '//wechat.nextdog.cc/partyjo-web/api/'
        //api: 'http://zhangmin.com/partyjo-web/api/'
    },
    root: 'https://yc.huzhou.gov.cn:8088/wsdt/rest',
    key: 'WXUSERINFO'
};

+function($) {
    //微信接口总配置
    var jsApiList = ['openAddress','onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'startRecord', 'stopRecord', 'onVoiceRecordEnd', 'playVoice', 'pauseVoice', 'stopVoice', 'onVoicePlayEnd', 'uploadVoice', 'downloadVoice', 'chooseImage', 'previewImage', 'uploadImage', 'downloadImage', 'translateVoice', 'getNetworkType', 'openLocation', 'getLocation', 'hideOptionMenu', 'showOptionMenu', 'hideMenuItems', 'showMenuItems', 'hideAllNonBaseMenuItem', 'showAllNonBaseMenuItem', 'closeWindow', 'scanQRCode', 'chooseWXPay', 'openProductSpecificView', 'addCard', 'chooseCard', 'openCard'];

    if (_global && _global.jsapi_config) {
        wx.config({
            debug: debug, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: _global.jsapi_config.appId, // 必填，公众号的唯一标识
            timestamp: _global.jsapi_config.timestamp, // 必填，生成签名的时间戳
            nonceStr: _global.jsapi_config.nonceStr, // 必填，生成签名的随机串
            signature: _global.jsapi_config.signature, // 必填，签名，见附录1
            jsApiList: jsApiList // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
        });
        wx.ready(function() {

	    });
    }

    $.extend({
        // 初始化
        init: function() {
            this.templateConfig();
            // 浏览器信息
            _global.browser = {
            	agent: $.browser.agent(),
            	system: $.browser.system()
            }
            this.log(_global,'全局参数');
            this.h5show();
        },
        // 模板引擎初始化
        templateConfig: function() {
        	template.config('escape', false);
            template.config('openTag', '{');
            template.config('closeTag', '}');
        },
        // 全局菜单
        h5show: function() {
            $(function() {
                var _html = '<a class="home-menu" href="index.html"><img src="./img/icon/home.png"></a>';
                $('body').append(_html);
            })
        },
        // 浏览器判断
        browser: {
            u: window.navigator.userAgent,
            type: function() {
                u = this.u.toLowerCase();
                if (u.indexOf("khtml") > -1 || u.indexOf("konqueror") > -1 || u.indexOf("applewebKit") > -1) {
                    var isChrome = u.indexOf("chrome") > -1;
                    var isSafari = u.indexOf("applewebKit") > -1 && !isChrome;
                }
                if (window.opr && u.indexOf('opr') > -1) {
                    return "Opera";
                } else if (isChrome) {
                    return "Chrome";
                } else if (isSafari) {
                    return "Safari";
                } else if (u.indexOf("firefox") > 0) {
                    return "Firefox";
                } else {
                    return "unknow";
                }
            },
            agent: function() {
                u = this.u.toLowerCase();
                var external = window.external;
                if (/msie/.test(u)) {
                    return "IE";
                } else if (u.indexOf("firefox") > 0) {
                    return "Firefox";
                } else if (u.indexOf('micromessenger') > -1) {
                    return 'weixin';
                } else if (u.indexOf("opr") > 0) {
                    return "Opera";
                } else if (u.indexOf('qqbrowser') > -1) {
                    return 'qq';
                } else if (u.indexOf('se 2.x') > -1) {
                    return 'sogou';
                } else if (u.indexOf('maxthon') > -1) {
                    return 'maxthon';
                } else if (u.indexOf('baiduboxapp') > -1) {
                    return 'baidu';
                } else if (u.indexOf('ucbrowser') > -1) {
                    return 'uc';
                } else if (window.chrome && external && 'LiebaoGetVersion' in external) {
                    return 'liebao';
                } else {
                    return 'unknow';
                }
            },
            //判断访问终端
            system: function() {
                u = this.u;
                if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) {
                    return 'Android';
                } else if (!!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) {
                    return 'ios';
                } else {
                    return 'unknow';
                }
            }
        },
        // 获取url参数
        getUrlPara: function (name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return unescape(r[2]); return null;
        },
        // 微信分享
        wxShare: function(data) {
            data = $.extend({
                title: '', // 分享标题
                desc: '', // 分享描述
                link: '', // 分享链接
                imgUrl: '', // 分享图标
                type: 'link', // 分享类型,music、video或link，不填默认为link
                dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                trigger: function() {},
                complete: function() {},
                success: function() {

                },
                fail: function() {}
            }, data);
            //调微信分享接口
            wx.ready(function() {
                var BaseData = {
                        title: data.title, // 分享标题
                        link: data.link, // 分享链接
                        imgUrl: data.imgUrl, // 分享图标
                        trigger: data.trigger,
                        complete: data.complete,
                        success: data.success,
                        fail: data.fail
                    }
                //分享给朋友
                wx.onMenuShareAppMessage(
                    $.extend(BaseData, {
                        desc: data.desc,
                        type: data.type,
                        dataUrl: data.dataUrl
                    })
                );
                //分享给朋友圈
                wx.onMenuShareTimeline(
                    BaseData
                );
                //分享到QQ
                wx.onMenuShareQQ(
                    $.extend(BaseData, {
                        desc: data.desc
                    })
                );
                //分享到腾讯微博
                wx.onMenuShareWeibo(
                    $.extend(BaseData, {
                        desc: data.desc
                    })
                );
            });
        },
        isRegister: function(successcallback, errorcallback) {
            if (window.debug) {
                $.fetch({
                    url: '/hzzwfwWxUser/wzUserDetailByOpenID',
                    data: {
                        openid: 'o9-y-0zpSkPbcDqRpUel0kK50Adc'
                    },
                    success: function(res) {
                        successcallback(res)
                    },
                    fail: function(res) {
                        $.pop(res.custom.text)
                        var targetUrl = location.href;
                        errorcallback ? errorcallback(res) : location.href = '/partyjo/online-administration/bindind.html?openid=' + res.data.openid + '&targetUrl=' + targetUrl;
                    }
                }) 
            } else {
                $.request('is_oauth', { url: window.location.href }, function(res) {
                    console.log(res)
                    var OpenID = res.data.openid
                    $.fetch({
                        url: '/hzzwfwWxUser/wzUserDetailByOpenID',
                        data: {
                            openid: OpenID
                        },
                        success: function(r) {
                            r.wx = res.data
                            successcallback(r)
                        },
                        fail: function(res) {
                            $.pop(res.custom.text)
                            var targetUrl = location.href;
                            errorcallback ? errorcallback(res) : location.href = '/partyjo/online-administration/binding.html?openid=' + OpenID + '&targetUrl=' + encodeURIComponent(targetUrl);
                        }
                    })
                })
            }
        },
        wxUserBind: function(data, successcallback, errorcallback) {
            $.fetch({
                url: '/hzzwfwWxUser/wxUserBind',
                data: data,
                success: function(res) {
                    successcallback(res)
                },
                fail: function(res) {
                    errorcallback && errorcallback(res)
                }
            })
        },
        register: function(data, successcallback, errorcallback) {
            $.fetch({
                url: '/hzzwfwWxUser/wxUserRegister',
                data: data,
                success: function(res) {
                    successcallback(res)
                },
                fail: function(res) {
                    errorcallback && errorcallback(res)
                }
            })
        },
        encodeUtf8: function (s1) {
            var s = escape(s1);
            var sa = s.split("%");
            var retV = "";
            if (sa[0] !== "") {
                retV = sa[0];
            }
            for (var i = 1; i < sa.length; i++) {
                if (sa[i].substring(0, 1) == "u") {
                    retV += Hex2Utf8(Str2Hex(sa[i].substring(1, 5)));
                    if (sa[i].length > 5) {
                        retV += sa[i].substring(5);
                    }

                } else retV += "%" + sa[i];
            }

            return retV;
        },
        encode: function (input) {
            // 先进行utf-8编码,解决中文问题
            input = $.encodeUtf8(input);
            // 对%做replace替换
            input = input.replace(/%/g, "_PERCENT_");

            // 对所有字符做ascii码转换
            var output = "",
                chr1 = "",
                i = 0,
                l =input.length;
            do {
                // 取字符的ascii码
                chr1 = input.charCodeAt(i++);
                // 偏移比较复杂，这里做个递减
                chr1 -= i;
                // =分割便于后台解析
                output = output + "=" + (chr1);
            } while (i < l);

            return output;
        },
        // ajax请求
        request: function(url, data, call, type, USER) {
            var userinfo = JSON.parse(window.localStorage.getItem(window._global.key))
            if (url === 'is_oauth' && userinfo) {
                window._global.user = userinfo
                console.log(userinfo)
                call && call({
                    data: userinfo
                });
                return false;
            }
            var methods = 'post';
            if (type) {
                methods = type;
            }
            $.loading();
            paras = $.extend({
                // app_key: _global.app_key,
                // access_token: _global.access_token,
                // site_id: _global.site_info.id,
                }, data);
            if (USER) {
                paras.token = USER.token
            }
            $.log(paras,url + '请求参数');
            $.ajax({
                type: methods,
                url: _global.url.api + url,
                dataType: 'json',
                data: paras
            }).done(function(res) {
                $.loading();
                $.log(res,url + '返回数据');
                if (res.ret == 999) {
                    $.request('is_oauth',{ url: window.location.href });
                } else if (res.ret == 1001) {
                    window.location.href = res.data;
                } else if (res.ret == 1002) {
                    var path = window.location.href;
                    if (path.indexOf('register')>=0) {
                        
                    } else {
                        if (confirm('现在去注册？')) {
                            window.location.href = 'register.html';
                        }
                    }
                    window.localStorage.setItem(window._global.key, JSON.stringify(res.data))
                    window._global.user = res.data
                } else {
                    if (url === 'is_oauth') {
                        window.localStorage.setItem(window._global.key, JSON.stringify(res.data))
                        window._global.user = res.data
                    }
                    // res.ret = res.code;
                    call && call(res);
                }
            }).fail(function() {
                $.pop('请求失败');
                setTimeout(function() {
                    $.loading();
                },800);
                $.log('请求失败',url + '接口错误');
            });
        },
        // ajax请求
        fetch: function(options) {
            var _default = {
                url: '',
                data: {}, 
                success: null,
                fail: null,
                type: 'post', 
                user: {
                    token: ''
                }, 
                error: null
            }
            var opts = $.extend(_default, options)
            $.loading();
            paras = $.extend({
                centerguid: '6bef18db-f0b8-49fd-9d39-e406ad6d5bd5'
            }, opts.data);
            var requestData = {
                token: 'Epoint_WebSerivce_**##0601',
                params: paras
            }
            $.log(requestData, opts.url + '请求参数');
            $.ajax({
                type: opts.type,
                url: _global.root + opts.url,
                dataType: 'json',
                data: JSON.stringify(requestData),
                headers: {
                    Accept: "text/html;charset=utf-8",
                    Authorization: "Bearer " + opts.user.token || ''
                },
                contentType: 'application/json;charset=UTF-8',
            }).done(function(res) {
                $.loading();
                $.log(res,opts.url + '返回数据');
                if (res.status.code == 200 && res.custom.code == 1) {
                    opts.success && opts.success(res)
                } else {
                    if (opts.fail) {
                        opts.fail(res)
                    } else {
                        $.pop(res.custom.text)
                    }
                }
            }).fail(function() {
                $.pop('请求失败');
                setTimeout(function() {
                    $.loading();
                },800);
                $.log('请求失败',opts.url + '接口错误');
            });
        },
        // 浏览器尺寸改变函数
        resize: function(fn) {
            fn();
            $(window).on('resize', function() {
                fn();
            });
        },
        // 模板加载
        render: function(tempid,data,call) {
            var html = template(tempid,data);
            call(html);
        },
        // 打点信息
        log: function(msg,info) {
            if (debug) {
            	if (info) {
	            	console.log('------- ' + info + ' -------');
	            }
	            console.log(msg);
	            if (info) {
	            	console.log('------- ' + info + ' -------');
	            }
            }
        },
        // 表单数据转json便于提交
        form2Json: function(id) {
            var a = $(id).serializeArray();
            var d = {};
            $.each(a, function() {
                if (d[this.name]) {
                    if (!d[this.name].push) {
                        d[this.name] = [d[this.name]];
                    }
                    d[this.name].push(this.value || '');
                } else {
                    d[this.name] = this.value || '';
                }
            });
            $.log(d,id+' 表单数据');
            return d;
        },
        // 获取下拉框选中值
        getSelectVal: function(id) {
            return $(id + ' option:selected').val();
        },
        // 获取多选的值
        getCheckVal: function(name) {
            var obj = $('input[name="'+name+'"]:checked');
            var d = [];
            obj.each(function() {
                d.push($(this).val());
            });
            return d;
        },
        // 常用正则
        regCheck: {
            def: function(reg, str) {
                return reg.test(str);
            },
            userName: function(str) {
                var reg = /^[_A-Za-z0-9]{6,16}$/;
                return reg.test(str);
            },
            psw: function(str) {
                var reg = /^[\w~!@#$%^&*()_+{}:"<>?\-=[\];\',.\/A-Za-z0-9]{6,16}$/;
                return reg.test(str);
            },
            email: function(str) {
                var reg = /^([a-zA-Z0-9]|[._])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
                return reg.test(str);
            },
            telNum: function(str) {
                var reg = /^((0\d{2,3}-\d{7,8})|(1[3|5|4|7|8][0-9]\d{8}))$/;
                return reg.test(str);
            },
            mobile: function(str) {
                var reg = /^(1[3|4|5|7|8][0-9]\d{8})$/;
                return reg.test(str);
            },
            verify: function(str) {
                var reg = /^\d{6}$/;
                return reg.test(str);
            },
            CN: function(str) {
                var reg = /^[\u4E00-\u9FA5]+$/;
                return reg.test(str);
            },
            carsh: function(str) {
                return /^\d*\.?\d+$/.test(str);
            },
            num: function(str) {
                return /^\+?[1-9][0-9]*$/.test(str);
            }
        },
        // 格式化字段
        format: {
            mobile: function(phoneNum) {
                return phoneNum.substring(0, 3) + "****" + phoneNum.substring(7);
            }
        },
        // 报错
        pop: function(msg) {
            var _html = '<div class="m-pop">'+msg+'</div>';
            $('body').append(_html);
            setTimeout(function() {
                $('.m-pop').remove();
            },2000);
        },
        // 加载动画
        loading: function() {
            var _html = '<div class="m-loading"><span></span><span></span><span></span></div>';

            if ($('.m-loading').size()) {
                $('.m-loading').remove();
            } else {
                $('body').append(_html);
            }
        },
        // 加载动画
        loadingEnd: function() {
            if ($('.m-loading').size()) {
                $('.m-loading').remove();
            }
        },
        // 回到顶部
        toTop: function(options) {
            var opts = $.extend({}, {
                publish: false,
                bottom: '1.36rem',
                str: '<div class="sidebar">'+
                        '<a id="j-note-add" class="sidebar-item note-add" href="/note/add"></a>'+
                        '<a id="j-refresh" class="sidebar-item refresh active" href="javascript:window.location.reload();"></a>'+
                        '<div id="j-top" class="sidebar-item go-top"></div>'+
                    '</div>',
            }, options);
            $('body').append(opts.str);

            if (_global.site_info.config.is_open_publish && opts.publish) {
                $('#j-note-add').addClass('active');
            }
            var obj = $('#j-top');
            obj.css('bottom', opts.bottom);
            obj.hide();
            $(window).on('scroll', function() {
                if ($(window).scrollTop() >= 800) {
                    obj.fadeIn();
                } else {
                    obj.stop(true).fadeOut();
                }
            });
            obj.css({ bottom: opts.bottom });
            obj.on('click', function() {
                $('html, body').animate({
                    scrollTop: 0
                }, 500);
                return false;
            });
        }
    });

    $.fn.extend({

    })

    $.init();
}(jQuery);
