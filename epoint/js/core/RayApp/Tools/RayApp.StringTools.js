define(function(require, exports, module) {
	"use strict";

	function r(r, e) {
		return !(!e || "string" != typeof e) && 1 == r.test(e)
	}

	function e(r) {
		return r = "number" == typeof r ? r : "string" == typeof r ? parseInt(r) : parseInt(r.toString())
	}
	var n = require("IDCardTools_Core");
	exports.isNumber = function(e) {
		var n = /^[0-9]*$/;
		return r(n, e)
	}, exports.validateUserIdendity = function(r, e) {
		return n.validateUserIdendity(r, e)
	}, exports.getUserBirthDayByIdendity = function(r, e) {
		return n.getUserBirthDayByIdendity(r, e)
	}, exports.isPhoneNumber = function(e) {
		var n = /^(0|86|17951)?(13[0-9]|15[012356789]|17[0135678]|18[0-9]|14[579]|19[89])[0-9]{8}$/;
		return r(n, e)
	}, exports.isPhoneAndTeleNumber = function(e) {
		var n = /^1\d{10}$|^(0\d{2,3}-?|\(0\d{2,3}\))?[1-9]\d{4,7}(-\d{1,8})?$/;
		return r(n, e)
	}, exports.isEmail = function(e) {
		var n = /^(\w)+(\.\w+)*@(\w)+((\.\w{2,3}){1,3})$/;
		return r(n, e)
	}, exports.getMaxValue = function(r, n) {
		return r = e(r), n = e(n), r > n ? r : n
	}, exports.getMinValue = function(r, n) {
		return r = e(r), n = e(n), r < n ? r : n
	}, exports.getEncodeIdCardType = function(r) {
		if(r = r.toString().trim(), 15 != r.length && 18 != r.length) return r;
		var e = "";
		if(15 == r.length) {
			e += r.substring(0, 6);
			for(var n = 6; n < 12; n++) e += "*";
			e += r.substring(12)
		} else if(18 == r.toString().trim().length) {
			e += r.substring(0, 10);
			for(var n = 10; n < 14; n++) e += "*";
			e += r.substring(14)
		}
		return e
	}, exports.isPosFloatWithZero = function(e) {
		var n = /^\d+(\.\d+)?$/;
		return r(n, e)
	}, exports.isPositiveIntegerWithZero = function(e) {
		var n = /^\d+$/;
		return r(n, e)
	}, exports.isPositiveInteger = function(e) {
		var n = /^[0-9]*[1-9][0-9]*$/;
		return r(n, e)
	}, exports.getGuidGenerator = function() {
		var r = function() {
			return(65536 * (1 + Math.random()) | 0).toString(16).substring(1)
		};
		return r() + r() + "-" + r() + "-" + r() + "-" + r() + "-" + r() + r() + r()
	}, exports.formatJson = function(r, e) {
		var n = null,
			t = "",
			i = 0,
			o = "    ";
		return e = e || {}, e.newlineAfterColonIfBeforeBraceOrBracket = e.newlineAfterColonIfBeforeBraceOrBracket === !0, e.spaceAfterColon = e.spaceAfterColon !== !1, "string" != typeof r ? r = JSON.stringify(r) : (r = JSON.parse(r), r = JSON.stringify(r)), n = /([\{\}])/g, r = r.replace(n, "\r\n$1\r\n"), n = /([\[\]])/g, r = r.replace(n, "\r\n$1\r\n"), n = /(\,)/g, r = r.replace(n, "$1\r\n"), n = /(\r\n\r\n)/g, r = r.replace(n, "\r\n"), n = /\r\n\,/g, r = r.replace(n, ","), e.newlineAfterColonIfBeforeBraceOrBracket || (n = /\:\r\n\{/g, r = r.replace(n, ":{"), n = /\:\r\n\[/g, r = r.replace(n, ":[")), e.spaceAfterColon && (n = /\:/g, r = r.replace(n, ": ")), $.each(r.split("\r\n"), function(r, e) {
			var n = 0,
				a = 0,
				u = "";
			for(e.match(/\{$/) || e.match(/\[$/) ? a = 1 : e.match(/\}/) || e.match(/\]/) ? 0 !== i && (i -= 1) : a = 0, n = 0; n < i; n++) u += o;
			t += u + e + "\r\n", i += a
		}), t
	}
});