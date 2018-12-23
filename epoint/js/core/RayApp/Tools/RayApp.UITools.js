define(function(require, exports, module) {
	"use strict";

	function t(t) {
		t = t || {};
		var e = "",
			i = t.id ? 'id="' + t.id + '"' : "";
		if(e += "<div " + i + ' class="mui-popover mui-popover-action mui-popover-bottom">', null != t.title && (e += '<ul class="mui-table-view">', e += '<li class="mui-table-view-cell">', e += '<a class="titleActionSheet"><b>' + t.title + "</b></a>", e += "</li>", e += "</ul>"), e += '<ul class="mui-table-view">', t.data && Array.isArray(t.data))
			for(var n = 0; n < t.data.length; n++) {
				var o = t.data[n];
				e += '<li class="mui-table-view-cell">', o.className = o.className || "", e += '<a class="' + o.className + '">' + o.title + "</a>", e += '<span style="display:none;" class="hiddenValue">' + o.value + "</span>", e += "</li>"
			}
		return e += "</ul>", e += '<ul class="mui-table-view">', e += '<li class="mui-table-view-cell">', e += '<a class="cancelActionSheet"><b>取消</b></a>', e += "</li>", e += "</ul>", e += "</div>"
	}

	function e(t) {
		return "number" == typeof t || "string" == typeof t ? (t = parseInt(t, 10), t < 10 && (t = "0" + t), t) : ""
	}

	function i(t) {
		var e = {
			value: t.getFullYear() + "-" + (t.getMonth() + 1) + "-" + t.getDate(),
			text: t.getFullYear() + "-" + (t.getMonth() + 1) + "-" + t.getDate(),
			y: {
				value: t.getFullYear(),
				text: t.getFullYear()
			},
			m: {
				value: t.getMonth() + 1,
				text: t.getMonth() + 1
			},
			d: {
				value: t.getDate(),
				text: t.getDate()
			},
			h: {
				value: t.getHours(),
				text: t.getHours()
			},
			i: {
				value: t.getMinutes(),
				text: t.getMinutes()
			}
		};
		return e
	}

	function n(t, e) {
		t = t || {}, window.mui && window.mui.DtPicker ? (c !== t.type && (u && (u.dispose(), u = null), c = t.type), u = u || new mui.DtPicker(t), u.show(function(i) {
			"date" === t.type ? e && e(i, i.y.value, i.m.value, i.d.value) : "time" === t.type ? e && e(i, i.h.value, i.i.value) : e && e(i, i.y.value, i.m.value, i.d.value, i.h.value, i.i.value)
		})) : console.error("错误,缺少引用的css或js,无法使用mui的dtpicker")
	}
	var o = require("CommonTools_Core"),
		a = null,
		l = null;
	! function(t) {
		function e(t, e) {
			if(this.loadingDiv = i(), document.body.appendChild(this.loadingDiv), this.setTitle(t), e && 1 == e.padlock) {
				var n = this;
				this.loadingDiv.addEventListener("click", function() {
					n.close()
				})
			}
		}

		function i() {
			var t = document.getElementById("MFRAME_LOADING");
			return t || (t = document.createElement("div"), t.id = "MFRAME_LOADING", t.className = "mui-backdrop mui-loading", t.innerHTML = '<span class=" mui-spinner mui-spinner-white" style=" width: 20%;height: 20%;max-width:46px;max-height: 46px;position:absolute;top:46%;left:46%;"></span><span class="tipsContent" style="position:absolute;font-size: 14px;top:54%;left:46%;text-align: center;">加载中...</span>'), t
		}
		t.showWaiting = function(t, i) {
			return new e(t, i)
		}, e.prototype.setTitle = function(t) {
			t = t || "", this.loadingDiv ? (this.loadingDiv.style.display = "block", this.loadingDiv.querySelector(".tipsContent").innerText = t) : console.error("h5 dialog对象已经销毁,无法再次显示")
		}, e.prototype.onclose = function() {}, e.prototype.close = function() {
			this.loadingDiv && (this.loadingDiv.style.display = "none", this.onclose())
		}, e.prototype.dispose = function() {
			this.loadingDiv && this.loadingDiv.parentNode && this.loadingDiv.parentNode.removeChild(this.loadingDiv)
		}
	}(exports.h5WaitingDialog = {}),
	function(t) {
		var e = "mui-popup",
			i = "mui-popup-backdrop",
			n = "mui-popup-in",
			o = "mui-popup-out",
			a = "mui-popup-inner",
			l = "mui-popup-title",
			s = "mui-popup-text",
			u = "mui-popup-input",
			c = "mui-popup-buttons",
			d = "mui-popup-button",
			r = "mui-popup-button-bold",
			i = "mui-popup-backdrop",
			p = "mui-active",
			m = [],
			f = function() {
				var t = document.createElement("div");
				return t.classList.add(i), t.addEventListener("webkitTransitionEnd", function() {
					this.classList.contains(p) || t.parentNode && t.parentNode.removeChild(t)
				}), t
			}(),
			v = function(t) {
				return '<div class="' + u + '"><input type="text" autofocus placeholder="' + (t || "") + '"/></div>'
			},
			g = function(t, e, i) {
				return '<div class="' + a + '"><div class="' + l + '">' + e + '</div><div class="' + s + '">' + t + "</div>" + (i || "") + "</div>"
			},
			h = function(t) {
				for(var e = t.length, i = [], n = 0; n < e; n++) i.push('<span class="' + d + (n === e - 1 ? " " + r : "") + '">' + t[n] + "</span>");
				return '<div class="' + c + '">' + i.join("") + "</div>"
			},
			y = function(t, i) {
				t = t.replace(/\n/g, "<BR />");
				var a = document.createElement("div");
				a.className = e, a.innerHTML = t;
				var l = function() {
					a.parentNode && a.parentNode.removeChild(a), a = null
				};
				a.addEventListener("webkitTransitionEnd", function(t) {
					a && t.target === a && a.classList.contains(o) && l()
				}), a.style.display = "block", document.body.appendChild(a), a.offsetHeight, a.classList.add(n), f.classList.contains(p) || (f.style.display = "block", document.body.appendChild(f), f.offsetHeight, f.classList.add(p));
				var s = a.querySelectorAll("." + d),
					c = a.querySelector("." + u + " input"),
					r = {
						element: a,
						close: function(t, e) {
							if(a) {
								var s = c ? c.value : t || 0;
								i && i(s, {
									index: t || 0,
									value: s
								}), e !== !1 ? (a.classList.remove(n), a.classList.add(o)) : l(), m.pop(), m.length ? m[m.length - 1].show(e) : f.classList.remove(p)
							}
						}
					},
					v = function(t) {
						r.close([].slice.call(s).indexOf(t.target))
					},
					g = document.querySelectorAll("." + d);
				if(g && g.length > 0)
					for(var h = 0; h < g.length; h++) g[h].addEventListener("click", v);
				return m.length && m[m.length - 1].hide(), m.push({
					close: r.close,
					show: function(t) {
						a.style.display = "block", a.offsetHeight, a.classList.add(n)
					},
					hide: function() {
						a.style.display = "none", a.classList.remove(n)
					}
				}), r
			};
		t.createAlert = function(t, e) {
			if(t && "undefined" != typeof t.content) return "function" == typeof t && (e = t, t = {}), t.title = t.title || "提示", t.buttonValue = t.buttonValue || "确定", y(g(t.content, t.title) + h([t.buttonValue]), e)
		}, t.createConfirm = function(t, e) {
			if(t && "undefined" != typeof t.content) return "function" == typeof t && (e = t, t = {}), t.title = t.title || "提示", t.buttons = t.buttons || ["确认", "取消"], y(g(t.content, t.title) + h(t.buttons), e)
		}, t.createPrompt = function(t, e) {
			if(t && "undefined" != typeof t.content) return "function" == typeof t && (e = t, t = {}), t.content = t.content || "请输入内容", t.title = t.title || "您好", t.tips = t.tips || "请输入内容", t.buttons = t.buttons || ["确定", "取消"], y(g(t.content, t.title, v(t.tips)) + h(t.buttons), e)
		}
	}(exports.h5MessageDialog = {}), exports.actionSheet = function(e, i, n) {
		if(window.plus) {
			if(i.length > 0) {
				var o = {
					cancel: "取消",
					buttons: i
				};
				e && (o.title = e), plus.nativeUI.actionSheet(o, function(t) {
					t.index > 0 && n && "function" == typeof n && n(i[t.index - 1].title, i[t.index - 1].value, i[t.index - 1])
				})
			}
		} else {
			var a = {};
			a.title = e, a.data = i, a.id = a.id || "defaultActionSheetId";
			var l = t(a);
			if(null == document.getElementById("actionSheetContent")) {
				var s = document.createElement("div");
				s.id = "actionSheetContent", s.innerHTML = l, document.body.appendChild(s), mui("body").on("shown", ".mui-popover", function(t) {}), mui("body").on("hidden", ".mui-popover", function(t) {}), mui("body").on("tap", ".mui-popover-action li>a", function(t) {
					var e = this.innerText,
						i = void 0,
						o = this.className;
					this.nextSibling && this.nextSibling.textContent && (i = this.nextSibling.textContent), this.className.indexOf("titleActionSheet") == -1 && (mui("#" + a.id).popover("toggle"), this.className.indexOf("cancelActionSheet") == -1 && n && n(e, i, {
						title: e,
						value: i,
						className: o
					}))
				})
			} else document.getElementById("actionSheetContent").innerHTML = l;
			mui("#" + a.id).popover("toggle")
		}
	}, exports.alert = function(t, e) {
		if(t = t || {}, window.plus) {
			if(null == t.content) return;
			t.title = t.title || "提示", t.buttonValue = t.buttonValue || "确定", plus.nativeUI.alert(t.content, e, t.title, t.buttonValue)
		} else {
			if(exports.h5MessageDialog) return exports.h5MessageDialog.createAlert(t, e);
			window.alert(t.content)
		}
	}, exports.confirm = function(t, e) {
		if(t = t || {}, null != t.content)
			if(window.plus) t.title = t.title || "确认", t.buttons = t.buttons || ["确认", "取消"], plus.nativeUI.confirm(t.content, function(i) {
				e && e(i.index, {
					index: i.index,
					value: t.buttons[i.index]
				})
			}, t.title, t.buttons);
			else {
				if(exports.h5MessageDialog) return exports.h5MessageDialog.createConfirm(t, e);
				window.confirm(t.content) ? e(!0, {
					index: 0
				}) : e(!1, {
					index: 1
				})
			}
	};
	var s = {
		size: "20px",
		padlock: !0,
		modal: !1,
		color: "#ffff00",
		background: "rgba(0,0,0,0.8)",
		loading: {
			display: "inline"
		}
	};
	exports.showWaiting = function(t, e) {
		var i = e || {};
		if(o.os.plus) {
			for(var n in s) void 0 === i[n] && (i[n] = s[n]);
			return null == a ? (a = plus.nativeUI.showWaiting(t, i), a.onclose = function() {
				a = null
			}) : a.setTitle(t), a
		}
		return null == l ? l = exports.h5WaitingDialog.showWaiting(t, e) : l.setTitle(t), l
	}, exports.closeWaiting = function() {
		window.plus ? a && (a.close(), a = null) : l && (l.dispose(), l = null)
	}, exports.pickDate = function(t, o) {
		if(t = t || {}, t.date && "Date" == t.date.constructor.name || (t.date = new Date), t.title = t.title || "请选择日期", window.plus && !t.isForceH5 && "month" !== t.type) plus.nativeUI.pickDate(function(t) {
			var e = t.date;
			if(o && "function" == typeof o) {
				var n = i(e);
				o(n, e.getFullYear(), e.getMonth() + 1, e.getDate())
			}
		}, function(t) {}, t);
		else {
			var a = t.date.getFullYear() + "-" + e(t.date.getMonth() + 1) + "-" + e(t.date.getDate()),
				l = t.minDate && t.minDate.getFullYear() || 1900,
				s = t.maxDate && t.maxDate.getFullYear() || 2100;
			n({
				type: t.type || "date",
				value: a,
				beginYear: l,
				endYear: s
			}, o)
		}
	}, exports.pickTime = function(t, o) {
		if(t = t || {}, t.dTime && "Date" == t.dTime.constructor.name || (t.dTime = new Date), t.title = t.title || "请选择时间", t.is24Hour = t.is24Hour || !1, window.plus && !t.isForceH5) plus.nativeUI.pickTime(function(t) {
			var e = t.date;
			if(o && "function" == typeof o) {
				var n = i(e);
				o(n, e.getHours(), e.getMinutes())
			}
		}, function(t) {}, t);
		else {
			var a = t.dTime.getFullYear() + "-" + e(t.dTime.getMonth() + 1) + "-" + e(t.dTime.getDate()) + " " + e(t.dTime.getHours()) + ":" + e(t.dTime.getMinutes());
			n({
				type: "time",
				value: a
			}, o)
		}
	}, exports.pickDateTime = function(t, i) {
		t = t || {}, t.dateTime && "Date" == t.dateTime.constructor.name || (t.dateTime = new Date);
		var o = t.dateTime.getFullYear() + "-" + e(t.dateTime.getMonth() + 1) + "-" + e(t.dateTime.getDate()) + " " + e(t.dateTime.getHours()) + ":" + e(t.dateTime.getMinutes());
		n({
			type: null,
			value: o,
			beginYear: t.beginYear,
			endYear: t.endYear
		}, i)
	}, exports.prompt = function(t, e) {
		if(window.plus) t = t || {}, t.content = t.content || "请输入内容", t.title = t.title || "您好", t.tips = t.tips || "请输入内容", t.buttons = t.buttons || ["确定", "取消"], plus.nativeUI.prompt(t.content, function(t) {
			0 == t.index && e && "function" == typeof e && e(t.value, {
				index: t.index || 0,
				value: t.value
			})
		}, t.title, t.tips, t.buttons);
		else {
			if(exports.h5MessageDialog) return exports.h5MessageDialog.createPrompt(t, e);
			var i = window.prompt(t.content);
			i && callback(i, {
				index: 0,
				value: i
			})
		}
	}, exports.toast = function(t, e) {
		if(window.plus) {
			if("undefined" == typeof t) return;
			plus.nativeUI.toast(t, e)
		} else {
			var i = document.createElement("div");
			i.classList.add("mui-toast-container"), i.innerHTML = '<div class="mui-toast-message">' + t + "</div>", i.addEventListener("webkitTransitionEnd", function() {
				i.classList.contains("mui-active") || i.parentNode.removeChild(i)
			}), document.body.appendChild(i), i.offsetHeight, i.classList.add("mui-active"), setTimeout(function() {
				i.classList.remove("mui-active")
			}, 3000) // 2e3
		}
	};
	var u = null,
		c = null,
		d = null,
		r = null;
	exports.showPopPicker = function(t, e, i) {
		window.mui && window.mui.PopPicker ? (i = i || 1, r !== i && (d && (d.dispose(), d = null), r = i), d = d || new mui.PopPicker({
			layer: i
		}), t = t || [], d.setData(t), d.show(function(t) {
			e && "function" == typeof e && e(t[0].text, t[0].value, t[0])
		})) : console.error("未引入mui pop相关js(css)")
	}
});