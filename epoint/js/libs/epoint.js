if (!window.epoint) {
    window.epoint = {};
}

jQuery.extend(epoint, (function (win, $) {

    function dealUrl(url) {
        // action形式的url需要加上页面路径
        // 例如在 "/pages/login/login.xhtml"中，url为"login.autoLoad"
        // 则url会转换为 "/pages/login/login.autoLoad"
        url = getRequestMapping() + '/' + url;

        // 将"a.b"类型的url转化为"a/b"
        if (url.indexOf('.') != -1 && url.indexOf('.jspx') == -1) {
            url = url.replace('.', '/');

        }
        // 加上页面地址中的请求参数
        var all = window.location.href;
        var index = all.indexOf('?');
        var hasParam = url.indexOf('?') > -1;

        if (index != -1) {
            if (hasParam) {
                url += '&' + all.substring(index + 1);
            } else {
                url += '?' + all.substring(index + 1);
            }

            // 加上isCommondto标识
            // 用来给后台区分与其他不是通过epoint中的三个方法发送的请求
            url += '&isCommondto=true';
        } else {
            if (hasParam) {
                url += '&isCommondto=true';
            } else {
                url += '?isCommondto=true';
            }
        }

        url = Util.getRightUrl('rest/' + url);

        return url;
    }

    /**
     * 获取请求映射前缀
     *
     * @return /frame/sysconf/code/codemainlist
     */
    function getRequestMapping() {
        var url = window.location.protocol + '//' + window.location.host + window.location.pathname;
        var root = Util.getRootPath();
        return url.substring(root.length, url.lastIndexOf('/'));
    }

    function initDialogOptions(title, url, callback, settings, isTop) {
        settings = settings || {};
        settings.url = Util.getRightUrl(url);
        settings.title = title;

        // 这里避免每个开发人员去写这种不友好的传参，在默认里面用全局变量进行了实现，
        // 前提是一个页面只能同时打开一个dialog，否则将会发生串的风险，
        // 最好是用另外的容器进行维护，就没有问题了
        if (!settings.onload) {
            settings.onload = function () {
                var iframe = this.getIFrameEl();
                // 防止弹出页面跨域而报错导致无法后续不响应
                try {
                    if (iframe.contentWindow.pageLoad) {
                        iframe.contentWindow.pageLoad(settings.param);
                    }
                } catch (e) {
                    console.error('跨域了!' + e.message, 'font-size: 16px;');
                }
            };
        }
        if (!settings.ondestroy) {
            settings.ondestroy = function (action) {
                // 调用工作流页面设置的回调
                var iframe = this.getIFrameEl(),
                    setCallBack;
                // 防止弹出页面跨域而报错导致无法后续不响应
                try {
                    setCallBack = iframe.contentWindow.setCallBack;
                } catch (e) {
                    console.error('跨域了!' + e.message, 'font-size: 16px;');
                }

                if (setCallBack) {
                    setCallBack();
                }

                if (callback) {
                    action = mini.clone(action);
                    callback.call(this, action);
                }
            };
        }

        var winSize = (isTop && top.Util && top.Util.getWinSize) ? top.Util.getWinSize() : Util.getWinSize(),
            width = settings.width,
            height = settings.height,
            isMax = false;

        if (width) {
            width = parseInt(width, 10);
            if (width >= winSize.width || width <= 0) {
                width = winSize.width - 20;
            }
        } else {
            width = winSize.width - 20;
            isMax = true;
        }

        if (height) {
            height = parseInt(height, 10);
            if (height >= winSize.height || height <= 0) {
                height = winSize.height - 20;
            }
        } else {
            height = winSize.height - 20;
            isMax = true;
        }


        settings.width = width;
        settings.height = height;

        if (isMax) {
            settings.allowDrag = false;
        }

        // mini中默认为true，在不传时设置其为false
        if (settings.allowResize == undefined) {
            settings.allowResize = false;
        }

        // add
        // 给url中加上一个参数作为Dialog的id 用以高效查找Dialog 解决IE8下高概率的崩溃问题。
        settings.dialogId = Util.uuid();

        if (!settings.url) settings.url = '';

        var urls = settings.url.split('#');

        url = urls[0];
        if (url.indexOf('?') === -1) {
            url += '?_dialogId_=' + settings.dialogId;
        } else {
            url += '&_dialogId_=' + settings.dialogId;
        }
        settings.url = url + (urls[1] ? urls[1] : '');
        // end


        return settings;
    }

    function Str2Hex(s) {
        var c = "";
        var n;
        var ss = "0123456789ABCDEF";
        var digS = "";
        for (var i = 0; i < s.length; i++) {
            c = s.charAt(i);
            n = ss.indexOf(c);
            digS += Dec2Dig(eval(n));
        }
        // return value;
        return digS;
    }

    function Dec2Dig(n1) {
        var s = "";
        var n2 = 0;
        for (var i = 0; i < 4; i++) {
            n2 = Math.pow(2, 3 - i);
            if (n1 >= n2) {
                s += '1';
                n1 = n1 - n2;
            } else s += '0';

        }
        return s;
    }

    function Dig2Dec(s) {
        var retV = 0;
        if (s.length == 4) {
            for (var i = 0; i < 4; i++) {
                retV += eval(s.charAt(i)) * Math.pow(2, 3 - i);
            }
            return retV;
        }
        return -1;
    }

    function Hex2Utf8(s) {
        var retS = "";
        var tempS = "";
        var ss = "";
        if (s.length == 16) {
            tempS = "1110" + s.substring(0, 4);
            tempS += "10" + s.substring(4, 10);
            tempS += "10" + s.substring(10, 16);
            var sss = "0123456789ABCDEF";
            for (var i = 0; i < 3; i++) {
                retS += "%";
                ss = tempS.substring(i * 8, (eval(i) + 1) * 8);

                retS += sss.charAt(Dig2Dec(ss.substring(0, 4)));
                retS += sss.charAt(Dig2Dec(ss.substring(4, 8)));
            }
            return retS;
        }
        return "";
    }

    function fGetPEUtf8(sUtf8PE) {
        sUtf8PE = sUtf8PE.replace(/%/, "");
        // IWrite.write("<br/>sUtfPE: "+sUtf8PE);
        var Ar = sUtf8PE.split("%");
        for (var i = 0,
                j = Ar.length; i < j; i++) {
            Ar[i] = parseInt(Ar[i], 16).toString(2);
            var iZeroIndex = Ar[i].indexOf("0");
            Ar[i] = Ar[i].slice(iZeroIndex + 1);
        }
        var sBin = Ar.join("");
        var iCode = parseInt(sBin, 2);
        return String.fromCharCode(iCode);
    }

    function fGetPEUtf8Bound(cUtf8PE) {
        cUtf8PE = cUtf8PE.replace(/%/, "");
        var iCharCode = parseInt(cUtf8PE, 16);
        var iLBound = 0,
            iUBound = 0;
        // 00-7F
        iLBound = 0;
        iUBound = 0x7f;
        if (iCharCode >= iLBound && iCharCode <= iUBound) return 1;
        // C2-DF
        iLBound = 0xC2;
        iUBound = 0xDF;
        if (iCharCode >= iLBound && iCharCode <= iUBound) return 2;
        // E0-EF
        iLBound = 0xE0;
        iUBound = 0xEF;
        if (iCharCode >= iLBound && iCharCode <= iUBound) return 3;
        // F0-F4
        iLBound = 0xF0;
        iUBound = 0xF4;
        if (iCharCode >= iLBound && iCharCode <= iUBound) return 4;

        return 0;
    }

    function fGeneratingBoundStr(iPadBegin, iLen) {
        if (!iPadBegin) iPadBegin = 0;
        if (!iLen) iLen = 10;
        var Ar = [];
        var iLBound = 0,
            iUBound = 0;

        iLBound = 0 + iPadBegin;
        iUBound = iLBound + iLen;
        for (; iLBound < iUBound; iLBound++) {
            Ar.push(String.fromCharCode(iLBound));
        }

        iLBound = 0x000080 + iPadBegin;
        iUBound = iLBound + iLen;
        // IWrite.write("<br/>iLBound: "+iLBound);
        for (; iLBound < iUBound; iLBound++) {
            Ar.push(String.fromCharCode(iLBound));
        }

        iLBound = 0x000800 + 19000 + iPadBegin;
        iUBound = iLBound + iLen;
        // IWrite.write("<br/>iLBound: "+iLBound);
        for (; iLBound < iUBound; iLBound++) {
            Ar.push(String.fromCharCode(iLBound));
        }

        iLBound = 0x010000 + iPadBegin;
        iUBound = iLBound + iLen;
        // IWrite.write("<br/>iLBound: "+iLBound);
        for (; iLBound < iUBound; iLBound++) {
            Ar.push(String.fromCharCode(iLBound));
        }

        return Ar;
    }


    return {
        /**
         * 初始化页面
         *
         * @param url ajax请求地址(如果不传，默认为page_Load)
         * @param ids  要回传的页面元素id，是个数组['tree', 'datagrid1']
         * @param callback 回调事件
         * @param opt 其他参数
         *        isPostBack 是否是回传，默认为false
         *        keepPageIndex 是否停留在当前页码 默认为false
         *        initHook: 初始化时控件在setValue后的回调
         */
        initPage: function (url, ids, callback, fail, opt) {
            var initHook;
            if (typeof fail === 'object' && opt === undefined) {
                opt = fail;
                fail = undefined;
            }

            opt = opt || {};
            if (typeof opt == 'function') {
                initHook = opt;
                opt = {};
            } else {
                initHook = opt.initHook;
            }

            var urlArr = url.split('?'),
                subUrl = urlArr[0],
                urlParam = urlArr[1];

            var len = subUrl.indexOf('.'),
                action = (len > 0 ? subUrl.substr(0, len) : subUrl);

            if (!epoint.getCache('action')) {
                epoint.setCache('action', action);
                epoint.setCache('urlParam', urlParam)
                epoint.setCache('callback', callback);

            }
            // 数据模拟时不处理url
            if (!SrcBoot.mock) {
                if (len < 0) {
                    subUrl += ".page_load";
                }

                url = subUrl + (urlParam ? '?' + urlParam : '');
            }

            mini.parse();

            var params;
            if (ids && jQuery.isPlainObject(ids)) {
                params = mini.encode(ids);
                ids = undefined;
            }

            //加载页面数据(树,表格)
            var commonDto = DtoUtils.getCommonDto(ids, action, !opt.keepPageIndex, initHook);

            if (commonDto) {
                commonDto.init({
                    url: SrcBoot.mock ? url : dealUrl(url),
                    params: params,
                    done: function (data) {
                        if (win.epoint_beforeInit) {
                            win.epoint_beforeInit(data);
                        }
                        if (callback) {
                            callback.call(this, data);
                        }

                        if (win.epoint_afterInit) {
                            win.epoint_afterInit(data);
                        }

                        Util.hidePageLoading();

                        // 表示页面已初始化完成
                        // 该参数可用于防止父页面在子页面未初始化完就来操作子页面
                        win.isInitPageFinished = true;
                    },
                    fail: fail
                });
            }
        },

        /**
         * 刷新页面
         *
         * @param ids  要回传的页面元素id，是个数组['tree', 'datagrid1'],如果不传，默认为整个form
         * @param callback 回调事件
         */
        refresh: function (ids, callback, keepPageIndex) {
            var url = epoint.getCache('action');
            if (!SrcBoot.mock) {
                url += '.page_Refresh';
                var urlParam = epoint.getCache('urlParam');

                if (urlParam) {
                    url += '?' + urlParam;
                }
            }

            if (typeof ids == 'function') {
                callback = ids;
                ids = '@all';
            }

            callback = callback || epoint.getCache('callback');

            epoint.initPage(url, ids, callback, {
                keepPageIndex: keepPageIndex
            });
        },

        /**
         * 提交表单数据
         *
         * @param url ajax请求地址
         * @param ids  要回传的页面元素id，是个数组['tree', 'datagrid1'],如果不传，默认为整个form
         * @param callback 回调事件
         * @param notShowLoading 是否不显示loading效果
         */
        execute: function (url, ids, params, callback, notShowLoading) {
            var action,
                index = url.indexOf('.');
            // 数据模拟时不处理url
            if (!SrcBoot.mock) {
                // url不带'.'，则表示没带action，则自动加上initPage时的action
                if (index < 0) {
                    action = epoint.getCache('action');

                    url = action + '.' + url;
                } else {
                    action = url.substr(0, index);
                }
            }
            var commonDto = DtoUtils.getCommonDto(ids, action);
            if (typeof params == 'function') {
                callback = params;
                params = null;
            }

            commonDto.init({
                url: SrcBoot.mock ? url : dealUrl(url),
                params: (params ? (typeof params == 'string' ? params : mini.encode(params)) : null),
                done: callback,
                notShowLoading: notShowLoading
            });
        },

        /**
         * 验证表单
         *
         * @param ids  要验证的范围，是个数组['tree', 'datagrid1'],如果不传，默认为整个form
         *
         * 验证成功，则返回true，失败返回false
         */
        validate: function (ids) {
            var action = epoint.getCache('action');
            var form = DtoUtils.getCommonDto(ids, action);

            return form.validate();
        },

        /**
         * 获取组织成commonDto格式的数据
         *
         * @param ids  范围，是个数组['tree', 'datagrid1'],如果不传，默认为整个body
         *
         * commonDto格式的数据
         */
        getCommonDtoData: function (ids) {
            var action = epoint.getCache('action');
            var form = DtoUtils.getCommonDto(ids, action);

            return form.getData();
        },

        /**
         * 渲染datagrid的列
         *
         * @param e 渲染事件
         * @param cls 列的样式
         * @param func 事件名称
         * @param fieldName 要跟到func函数里面的参数，默认为行对象的idField值，你可以手动指定其他字段名称,支持多个以,分割，如果设置epoint_total,那么将传递所有
         */
        renderCell: function (e, cls, func, fieldName) {
            var param = '',
                isJson = false;

            if (fieldName) {
                //如果是total，处理成json
                if (fieldName == 'epoint_total') {
                    param = epoint.encodeJson(e.row);
                    isJson = true;
                }
                //如果是多个，处理成json
                else if (fieldName.indexOf(',') != -1) {
                    var pp = {};
                    var names = fieldName.split(',');
                    for (var i = 0, l = names.length; i < l; i++) {
                        var r = names[i];
                        pp[r] = e.row[r];
                    }
                    param = epoint.encodeJson(pp);
                    isJson = true;
                } else {
                    param = e.row[fieldName];
                }
            } else {
                fieldName = e.sender.idField;
                param = e.row[fieldName];
            }

            if (isJson) {
                param = param.replace(/\"/g, "\'");
                return '<a href="javascript:void(0);" onclick="' + func + "(" + param + ")\" class=\"" + cls + '"></a>';
            } else {
                if (typeof param == 'string') {
                    param = param.replace(/'/g, "\\'");
                    param = param.replace(/\\/g, "/");
                }
                return '<a href="javascript:void(0);" onclick="' + func + "('" + param + "')\" class=\"" + cls + '"></a>';
            }

        },

        /**
         * 清理某块区域
         *
         * @param id  一般为form的id
         *
         */
        clear: function (formId) {
            var form = new mini.Form('#' + formId);

            form.clear();
        },

        /**
         * 打开dialog窗口
         *
         * @param url ajax请求地址
         * @param title 弹出框的标题
         * @param callback 关闭时的回调方法
         * var settings = {
                param: Object,              //要传递给弹出页面的参数
                width: String,              //宽度
                height: String,             //高度
                iconCls: String,            //标题图标
                allowResize: Boolean,       //允许尺寸调节
                allowDrag: Boolean,         //允许拖拽位置
                showCloseButton: Boolean,   //显示关闭按钮
                showMaxButton: Boolean,     //显示最大化按钮
                showModal: Boolean,         //显示遮罩
                loadOnRefresh: false,       //true每次刷新都激发onload事件
                onload: function () {       //弹出页面加载完成
                    var iframe = this.getIFrameEl();
                    var data = {};
                    //调用弹出页面方法进行初始化
                    iframe.contentWindow.SetData(data);

                },
                ondestroy: function (action) {  //弹出页面关闭前
                    if (action == "ok") {       //如果点击“确定”
                        var iframe = this.getIFrameEl();
                        //获取选中、编辑的结果
                        var data = iframe.contentWindow.GetData();
                        data = mini.clone(data);    //必须。克隆数据。
                        ......
                    }
                }
           };
         *
         */
        openDialog: function (title, url, callback, settings) {
            settings = initDialogOptions(title, url, callback, settings);

            url = settings.url;
            if (!url) url = "";

            var urls = url.split("#");
            url = urls[0];

            if (url && url.indexOf("_winid") == -1) {
                var t = "_winid=" + mini._WindowID;
                if (url.indexOf("?") == -1) {
                    url += "?" + t;
                } else {
                    url += "&" + t;
                }
                if (urls[1]) {
                    url = url + "#" + urls[1];
                }
            }

            settings.url = url;

            settings.Owner = window;
            //调用底层mini的api打开窗口
            // return mini._doOpen(settings);

            // 自动给url上加上Dialog的id，用于高效查找Dialog，解决在IE8下高概率的崩溃问题。
            var dialog = mini._doOpen(settings);
            dialog.setId(settings.dialogId);
            return dialog;
            // end
        },

        /**
         * 在顶层打开dialog窗口
         *
         */
        openTopDialog: function (title, url, callback, settings) {
            settings = initDialogOptions(title, url, callback, settings, true);

            //调用底层mini的api打开窗口
            // return mini.open(settings);

            // 自动给url上加上Dialog的id，用于高效查找Dialog，解决在IE8下高概率的崩溃问题。
            var dialog = mini.open(settings);
            dialog.setId(settings.dialogId);
            return dialog;
            // end
        },

        /**
         * 关闭dialog窗口
         *
         * @param action 要传递的参数
         */
        closeDialog: function (action) {
            if (win.CloseOwnerWindow) {
                // 给按钮绑定onclick="epoint.closeDialog"时参数action为miniui自动生成的一个事件参数
                // 这种情况其实参数action应该为空
                if (action && action.htmlEvent) {
                    action = undefined;
                }
                return win.CloseOwnerWindow(action);
            } else {
                win.close();
            }
        },

        /**
         * 在Dialog子页面中获取Dialog实例
         */
        getOwnerDialog: function () {
            if (!parent || !parent.mini) {
                return null;
            }
            // 自动从url中查找此Dialog的id 如果有就可以直接从父页面中反馈
            var dialogId = Util.getUrlParams('_dialogId_');
            if (dialogId) {
                return parent.mini.get(dialogId);
            }
            // end
            var cmps = parent.mini.getComponents();
            for (var i = 0, l = cmps.length; i < l; i++) {
                var o = cmps[i];
                if (o.getIFrameEl) {
                    var iframe = o.getIFrameEl();
                    if (iframe && iframe.contentWindow == window) {
                        return o;
                    }
                }
            }
        },

        setDialogTitle: function (title) {
            var dialog = epoint.getOwnerDialog();

            if (dialog) {
                dialog.setTitle(title);
            }
        },

        /**
         * 打开div窗口
         *
         * @param id  div窗口id
         * @param formId  要清空数据的form的id，默认为div的id，如果不需要内部默认清理，传递none
         */
        openDiv: function (id, formId) {
            var editWindow = mini.get(id);
            if (editWindow) {
                if (formId === undefined) {
                    formId = id;
                }
                if (formId != "none") {
                    new mini.Form('#' + formId).clear();
                }
                editWindow.show();
            }
        },

        /**
         * 关闭div窗口
         *
         * @param id  div窗口id
         *
         */
        closeDiv: function (id) {
            var editWindow = mini.get(id);
            if (editWindow) {
                editWindow.hide();
            }
        },

                /**
         * 打开信息提示框
         *
         * @param message  提示信息
         * @param title  标题,默认为系统提示
         * @param callback  回调事件
         * @param icon  显示的图标，可选值为 'success', 'info','warning' ,'question' ,'deny','error'，默认为'info'
         *
         */
        alert: function (message, title, callback, icon, forceAlert) {
            // 优化框架的提示信息的用户体验
            // alert 方法默认转化为更轻量的 showTips 形式
            // 转化需满足下面条件：
            // 1.系统参数开启支持showTips模式，即系统参数 alertToTips 为 true
            // 2.callback 为空
            // 3.icon 为 success、info或者空
            if(!forceAlert && Util.getFrameSysParam('alertToTips') && !callback) {
                if(!icon || 'success,info'.indexOf(icon) > -1) {
                    this.showTips(message, {
                        state: icon || 'info'
                    });
                    return;
                }
            }

            mini.showMessageBox({
                minWidth: 250,
                title: title || mini.MessageBox.alertTitle,
                buttons: ["ok"],
                message: message,
                iconCls: "mini-messagebox-" + (icon || "info"),
                callback: callback
            });
        },

        /**
         * 打开confirm确认提示框
         *
         * @param message  提示信息
         * @param title  标题,默认为系统提示
         * @param callback  回调事件
         *
         */
        confirm: function (message, title, okCallback, cancelCallback) {
            mini.confirm(message, title, function (action) {
                if (action == 'ok') {
                    if (okCallback) {
                        okCallback();
                    }
                } else {
                    if (cancelCallback) {
                        cancelCallback();
                    }
                }
            });
        },

        /**
         * 打开alert提示框,点击确定后关闭当前窗口(用于保存并关闭按钮)
         *
         * @param message  提示信息
         * @param title  标题,默认为系统提示
         * @param callback  回调事件
         * @param options.backParam  回传到父页面的参数
         * @param options.chkMsg  检查信息(当该参数有值时，会判断message中是否包含该参数值，如果包含才真正关闭窗口，否则仅做alert,默认为成功)
         * @param options.needCheck 是否必须对chkMsg进行检查，默认为false
         * @param iconCls 显示的图标，可选值为 'success', 'info','warning' ,'question' ,'deny','error'，默认为'info'
         *
         */
        alertAndClose: function (message, title, callback, options, iconCls) {

            options = jQuery.extend({}, {
                chkMsg: '成功',
                backParam: 'ok',
                needCheck: false
            }, options);

            var close = true;

            // 如果传递了需要检查条件的参数,并且条件没有满足的话,不允许关闭
            if (options.needCheck && message.indexOf(options.chkMsg) < 0) {
                close = false;
            }
            // 只有在需要关闭的时候，才调用关闭回调
            if (close) {
                epoint.alert(message, title, function () {
                    epoint.closeDialog(options.backParam);
                }, iconCls);
            } else {
                epoint.alert(message, title, callback, iconCls);
            }
        },

        /**
         * 打开alert消息提示框并刷新父页面(用于保存并刷新按钮)
         *
         * @param message  提示信息
         * @param title  标题,默认为系统提示
         * @param iconCls 显示的图标，可选值为 'success', 'info','warning' ,'question' ,'deny','error'，默认为'info'
         */
        alertAndRefresh: function (message, title, iconCls) {
            //getDialog(dialogId).getOptions('callback')('ok');
            epoint.alert(message, title, function (action) {
                epoint.refresh();
            }, iconCls);
        },

        showTips: function (content, options) {
            var opt = {
                state: 'info',
                x: 'center',
                y: 'center',
                timeout: 3000
            };

            opt.content = content;

            if (options) {
                jQuery.extend(opt, options);
            }

            mini.showTips(opt);
        },

        /**
         * 禁用页面上的所有按钮
         */
        disableAllButtons: function () {
            this.allButtons = mini.findControls(function (control) {
                if (control.type == 'button' && control.enabled) {
                    return true;
                }
                return false;
            });

            for (var i = this.allButtons.length - 1; i >= 0; i--) {
                this.allButtons[i].disable();
            }
        },

        enableAllButtons: function () {
            if (this.allButtons) {
                for (var i = this.allButtons.length - 1; i >= 0; i--) {
                    this.allButtons[i].enable();
                }
            }
        },

        /**
         * [validateDateInterval 验证结束时间与开始时间的间隔是否满足要求]
         * @param  {[type]} start    [description]
         * @param  {[type]} end      [description]
         * @param  {[type]} interval [description]
         * @return {[Boolean]}          [description]
         */
        validateDateInterval: function (start, end, interval) {
            interval = parseInt(interval) || 0;

            var time = end.getValue() - start.getValue();

            if (time >= (interval * 86400000)) {
                return true;
            }
            return false;
        },

        showLoading: function () {
            mini.mask({
                el: document.body,
                cls: 'mini-mask-loading'
            });
        },

        hideLoading: function () {
            mini.unmask(document.body);
        },
        /**
         * 自定义编码函数
         *
         * @param input  要编码的数据
         */
        encode: function (input) {
            // 先进行utf-8编码,解决中文问题
            input = epoint.encodeUtf8(input);
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
        /**
         * utf-8编码函数,并且会替换%为_PERCENT_
         *
         * @param s1  要编码的数据
         */
        encodeUtf: function (s1) {
            if (s1) {
                // s1 = EncodeUtf8(s1);
                // s1 = s1.replace("/%/g", "_PERCENT_");
                // cause 没有EncodeUtf8方法，使用将报错 后面应是正则表达式
                // modify by chendongshun at 2017.05.23
                s1 = this.encodeUtf8(s1);
                s1 = s1.replace(/%/g, "_PERCENT_");
            }
            return s1;
        },

        /**
         * utf-8编码函数
         *
         * @param s1  要编码的数据
         */
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

        /**
         * utf-8解码函数
         *
         * @param sUtf8PE  经过utf-8编码的数据
         */
        decodeUtf8: function (sUtf8PE) {
            var TempStr,
                sHexExt;

            if (sUtf8PE === undefined) {
                return;
            }
            if (sUtf8PE.indexOf("%") === -1) return sUtf8PE;
            sUtf8PE = sUtf8PE.replace(/\+/g, " ");

            for (var i = 0, j = sUtf8PE.length; i < j; i++) {
                var iIndex = sUtf8PE.indexOf("%", i);
                if (iIndex === -1) break;
                i = iIndex + 1;

                var iBound = fGetPEUtf8Bound(sUtf8PE.slice(i, i + 2));
                switch (iBound) {
                    case 1:
                        sHexExt = sUtf8PE.slice(i, i + 2);
                        TempStr = String.fromCharCode(parseInt(sHexExt, 16));
                        sUtf8PE = [sUtf8PE.slice(0, i - 1), TempStr, sUtf8PE.slice(i + 2)].join("");
                        i -= 1;
                        break;

                    case 2:
                        sHexExt = sUtf8PE.slice(i + 2, i + 5);
                        if (/%../.test(sHexExt)) {
                            TempStr = sUtf8PE.slice(i - 1, i + 5);
                            TempStr = fGetPEUtf8(TempStr);
                            sUtf8PE = [sUtf8PE.slice(0, i - 1), TempStr, sUtf8PE.slice(i + 5)].join("");
                            i -= 1;
                        }
                        break;

                    case 3:
                        sHexExt = sUtf8PE.slice(i + 2, i + 8);
                        if (/\%..\%/.test(sHexExt)) {
                            TempStr = sUtf8PE.slice(i - 1, i + 8);
                            TempStr = fGetPEUtf8(TempStr);
                            sUtf8PE = [sUtf8PE.slice(0, i - 1), TempStr, sUtf8PE.slice(i + 8)].join("");
                            i -= 1;
                        }
                        break;
                }
            }
            return sUtf8PE;
        },


        /**
         * 将某个对象转换成json字符串
         *
         * @param obj  对象
         * @param dateFormat  日期格式,默认为yyyy-MM-dd HH:mm:ss
         */
        encodeJson: function (obj, dateFormat) {
            return mini.encode(obj, dateFormat);
        },

        /**
         * 将json字符串转换为对象
         *
         * @param json  要转换的json字符串
         * @param parseDate  是否自动将日期字符串转换为日期类型，默认为true
         */
        decodeJson: function (json, parseDate) {
            return mini.decode(json, parseDate);
        },


        /**
         * 将某个网址加入收藏夹
         *
         * @param sURL  网址
         * @param sTitle  标题
         */
        addFavorite: function (sURL, sTitle) {
            try {
                window.external.addFavorite(sURL, sTitle);
            } catch (e) {
                try {
                    window.sidebar.addPanel(sTitle, sURL, "");
                } catch (e) {
                    alert("加入收藏失败，请使用Ctrl+D进行添加");
                }
            }
        },

        /**
         * 设置为首页
         *
         * @param obj  浏览器对象
         * @param vrl  网址
         */
        setHome: function (obj, vrl) {
            try {
                obj.style.behavior = 'url(#default#homepage)';
                obj.setHomePage(vrl);
            } catch (e) {
                if (window.netscape) {
                    try {
                        netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
                    } catch (e) {
                        alert("此操作被浏览器拒绝！\n请在浏览器地址栏输入“about:config”并回车\n然后将[signed.applets.codebase_principal_support]设置为'true'");
                    }
                    var prefs = Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefBranch);
                    prefs.setCharPref('browser.startup.homepage', vrl);
                }
            }
        },

        // 在epoint上增加缓存操作
        _cache: {},

        setCache: function (key, value) {
            this._cache[key] = value;
        },

        getCache: function (key) {
            return this._cache[key];
        },

        delCache: function (key) {
            this._cache[key] = null;
            delete this._cache[key];
        },

        // 调整content区域表格的pageSize
        // 使得表格每页显示的行数可以撑满content区域
        // 该方法必须使用在标准的框架contentPage布局，且content区域只能有一个表格，不能有其他任何东西
        adjustDataGridPageSize: function () {
            var grid = mini.get('datagrid');
            if (grid) {
                var thead_h = 35,
                    tr_h = 30,
                    pager_h = grid.showPager ? 36 : 0,

                    win_h = $(win).height(),

                    toolbar_h = $('.fui-toolbar').outerHeight() || 0,
                    condition_h = $('.fui-condition').outerHeight() || 0,

                    grid_h = win_h - toolbar_h - condition_h,

                    content_h = grid_h - thead_h - pager_h,

                    pageSize = parseInt(content_h / tr_h);

                if (pageSize > 0) {

                    if (pageSize * tr_h > content_h) {
                        pageSize -= 1;
                    }
                    grid.setPageSize(pageSize);
                    grid.setSizeList([pageSize, pageSize * 2, pageSize * 5, pageSize * 10]);
                }
            }


        },

        // 处理页面参数配置中的地址
        // 给地址加上"rest"前缀
        dealRestfulUrl: function (url) {
            var index;

            // 对于未指定方法（即没有"/"）的自动加上"page_load"方法
            if (url.indexOf('/') == -1) {
                index = url.indexOf('?');
                if (index == -1) {
                    url += '/page_load';
                } else {
                    url = url.substr(0, index) + '/page_load' + url.substr(index);
                }
            }

            // 是否是相对路径
            var isRelative = url.indexOf('./') != -1 || url.indexOf('../') != -1;

            if (isRelative) {
                index = url.lastIndexOf('./');

                url = url.substr(0, index + 2) + 'rest/' + url.substr(index + 2);
            } else {
                url = 'rest/' + getRequestMapping() + '/' + url;
            }

            // 加上isCommondto标识，以保证通过epoint处理的方法都有这个标识
            if (url.indexOf('?') !== -1) {
                url += '&isCommondto=true';
            } else {
                url += "?isCommondto=true";
            }

            // 加上页面地址中的请求参数
            var all = window.location.href;
            var pIndex = all.indexOf('?');

            if(pIndex > -1) {
                url += '&' + all.substring(pIndex + 1);
            }
            return url;
        }
    };

}(this, jQuery)));