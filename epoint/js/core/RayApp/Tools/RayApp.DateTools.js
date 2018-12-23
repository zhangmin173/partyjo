define(function(require,exports,module){"use strict";function t(t){return"[object Date]"===M.call(t)}function e(e,s){var n=t(e)?e.getTime():void 0,i=new Date(n),u=i.getFullYear(),o=i.getMonth(),r=i.getDate(),a=i.getHours(),c=i.getMinutes(),l=i.getSeconds();return!!s&&s(i,u,o,r,a,c,l),i}function s(t,e){try{var s=(e||(10===t.length||9===t.length||8===t.length?"YYYY-MM-DD":19===t.length?"YYYY-MM-DD hh:mm:ss":"YYYY-MM-DD hh:mm:ss:iii")).match(D),n=t.match(/(\d)+/g);if(s.length>0){for(var i=new Date(1970,0,1),u=0;u<s.length;u++){var o=parseInt(n[u],10)||0;switch(s[u].charAt(0)||""){case"Y":i.setFullYear(o);break;case"M":i.setMonth(o-1);break;case"D":i.setDate(o);break;case"h":i.setHours(o);break;case"m":i.setMinutes(o);break;case"s":i.setSeconds(o);break;case"i":i.setMilliseconds(o)}}return i}}catch(r){}return null}function n(t,e){for(var e=e-(t+"").length,s=0;s<e;s++)t="0"+t;return t}function i(e,s){if(!t(e))return"";try{return s=s||f,s.replace(D,function(t){switch(t.charAt(0)){case"Y":return n(e.getFullYear(),t.length);case"M":return n(e.getMonth()+1,t.length);case"D":return n(e.getDate(),t.length);case"h":return n(e.getHours(),t.length);case"m":return n(e.getMinutes(),t.length);case"s":return n(e.getSeconds(),t.length);case"i":return n(e.getMilliseconds(),t.length);case"w":return e.getDay();case"W":var s=["日","一","二","三","四","五","六"];return n(s[e.getDay()],t.length);default:return""}})}catch(i){return console.log("error:"+i),""}}function u(t){var e=new Date(t.getTime());return e.setMonth(e.getMonth()+1),e.setDate(0),e.getDate()}function o(){var e=arguments[0],n=arguments[1];if("number"==typeof e&&isFinite(value))this.myDate=new Date(e);else if(t(e))this.myDate=new Date(e.getTime());else if("string"==typeof e)"string"!=typeof n&&"undefined"!=typeof n&&(n=void 0),this.myDate=s(e,n);else{if(0!=arguments.length)throw"MyDate Constructor Error!";this.myDate=new Date}}function r(t,e,s){e.setFullYear(t)}function a(t,e,s){t>11?(t-=12,r(e.getFullYear()+1,e,s)):t<0&&(t+=12,r(e.getFullYear()-1,e,s)),e.setMonth(t,1)}function c(t,e,s){var n=e.getMonth(),i=s.getMonthDays(n+1);if(t>i)t-=i,a(e.getMonth()+1,e,s);else if(t<=0){var u=n>0?s.getMonthDays(n+1-1):s.getMonthDays(12);t+=u,a(e.getMonth()-1,e,s)}e.setDate(t)}function l(t,e,s){t>=24?(t-=24,c(e.getDate()+1,e,s)):t<0&&(t+=24,c(e.getDate()-1,e,s)),e.setHours(t)}function h(t,e,s){t>=60?(t-=60,l(e.getHours()+1,e,s)):finalHour<0&&(t+=60,l(e.getHours()-1,e,s)),e.setMinutes(t)}function g(t,e,s){t>=60?(t-=60,h(e.getMinutes()+1,e,s)):t<0&&(t+=60,h(e.getMinutes()-1,e,s)),e.setSeconds(t)}var M=Object.prototype.toString,D=/([YMDhmsiWw])(\1*)/g,f="YYYY-MM-DD hh:mm:ss:iii";o.prototype={getMonthDays:function(t){switch(t){case 1:case 3:case 5:case 7:case 8:case 10:case 12:return 31;case 4:case 6:case 9:case 11:return 30;case 2:return this.isLeapYear()?29:28;default:return 0}},plusYear:function(t){var s=this;return new o(e(this.myDate,function(e,n,i,u,o,a,c){r(n+t,e,s)}))},plusMonth:function(t){var s=this;return new o(e(this.myDate,function(e,n,i,u,o,r,c){a(i+t,e,s)}))},plusDate:function(t){var s=this;return new o(e(this.myDate,function(e,n,i,u,o,r,a){var l=u+t;c(l,e,s)}))},plusHours:function(t){var s=this;return new o(e(this.myDate,function(e,n,i,u,o,r,a){var c=o+t;l(c,e,s)}))},plusMinutes:function(t){var s=this;return new o(e(this.myDate,function(e,n,i,u,o,r,a){var c=r+t;h(c,e,s)}))},plusSeconds:function(t){var s=this;return new o(e(this.myDate,function(e,n,i,u,o,r,a){var c=a+t;g(c,e,s)}))},minusYear:function(t){return this.plusYear(-t)},minusMonth:function(t){return this.plusMonth(-t)},minusDate:function(t){return this.plusDate(-t)},minusHours:function(t){return this.plusHours(-t)},minusMinutes:function(t){return this.plusMinutes(-t)},minusSeconds:function(t){return this.plusSeconds(-t)},setYear:function(t){this.myDate.setFullYear(t)},setMonth:function(t){this.myDate.setMonth(t-1)},setDate:function(t){this.myDate.setDate(t)},setHours:function(t){this.myDate.setHours(t)},setMinutes:function(t){this.myDate.setMinutes(t)},setSeconds:function(t){this.myDate.setSeconds(t)},setMilliseconds:function(t){this.myDate.setMilliseconds(t)},getYear:function(){return this.myDate.getFullYear()},getMonth:function(){return this.myDate.getMonth()},getDate:function(){return this.myDate.getDate()},getHours:function(){return this.myDate.getHours()},getMinutes:function(){return this.myDate.getMinutes()},getSeconds:function(){return this.myDate.getSeconds()},getMilliseconds:function(){return this.myDate.getMilliseconds()},getAbsoluteYear:function(){return this.myDate.getFullYear()-1970},getAbsoluteMonth:function(){return 12*this.getAbsoluteYear()+this.myDate.getMonth()},getAbsoluteDate:function(){var t=this.getAbsoluteMillonsTime();return parseInt(t/1e3/60/60/24,10)},getAbsoluteHours:function(){return 24*this.getAbsoluteDate()+this.myDate.getHours()},getAbsoluteMinutes:function(){return 60*this.getAbsoluteHours()+this.myDate.getMinutes()},getAbsoluteSeconds:function(){return 60*this.getAbsoluteMinutes()+this.myDate.getSeconds()},getAbsoluteMillonsTime:function(){return this.myDate.getTime()},getDayOfWeek:function(t){return this.myDate.getDay()},isLeapYear:function(){return 0==this.myDate.getYear()%4&&(this.myDate.getYear()%100!=0||this.myDate.getYear()%400==0)},toDate:function(){return e(this.myDate)},clone:function(){return new o(e(this.myDate))},getBegin:function(t){return new o(e(this.myDate,function(e,s,n,i,u,o,r){switch(t){case"YYYY":e.setMonth(0),e.setDate(1),e.setHours(0),e.setMinutes(0),e.setSeconds(0),e.setMilliseconds(0);break;case"MM":e.setDate(1),e.setHours(0),e.setMinutes(0),e.setSeconds(0),e.setMilliseconds(0);case"DD":e.setHours(0),e.setMinutes(0),e.setSeconds(0),e.setMilliseconds(0);break;case"hh":e.setMinutes(0),e.setSeconds(0),e.setMilliseconds(0);break;case"mm":e.setSeconds(0),e.setMilliseconds(0);break;case"ss":e.setMilliseconds(0)}}))},getEnd:function(t){return new o(e(this.myDate,function(e,s,n,i,o,r,a){switch(t){case"YYYY":e.setMonth(11),e.setDate(31),e.setHours(23),e.setMinutes(59),e.setSeconds(59),e.setMilliseconds(999);break;case"MM":e.setDate(u(e)),e.setHours(23),e.setMinutes(59),e.setSeconds(59),e.setMilliseconds(999);case"DD":e.setHours(23),e.setMinutes(59),e.setSeconds(59),e.setMilliseconds(999);break;case"hh":e.setMinutes(59),e.setSeconds(59),e.setMilliseconds(999);break;case"mm":e.setSeconds(59),e.setMilliseconds(999);break;case"ss":e.setMilliseconds(999)}}))},compare:function(e,s){return t(e)||e instanceof o?(s=s||"iii","YYYY"===s?this.getAbsoluteYear()==e.getAbsoluteYear()?0:this.getAbsoluteYear()>e.getAbsoluteYear()?1:2:"MM"===s?this.getAbsoluteMonth()==e.getAbsoluteMonth()?0:this.getAbsoluteMonth()>e.getAbsoluteMonth()?1:2:"DD"===s?this.getAbsoluteDate()==e.getAbsoluteDate()?0:this.getAbsoluteDate()>e.getAbsoluteDate()?1:2:"hh"===s?this.getAbsoluteHours()==e.getAbsoluteHours()?0:this.getAbsoluteHours()>e.getAbsoluteHours()?1:2:"mm"===s?this.getAbsoluteMinutes()==e.getAbsoluteMinutes()?0:this.getAbsoluteMinutes()>e.getAbsoluteMinutes()?1:2:"ss"===s?this.getAbsoluteSeconds()==e.getAbsoluteSeconds()?0:this.getAbsoluteSeconds()>e.getAbsoluteSeconds()?1:2:this.getAbsoluteMillonsTime()==e.getAbsoluteMillonsTime()?0:this.getAbsoluteMillonsTime()>e.getAbsoluteMillonsTime()?1:2):-1},isMoreThan:function(t,e){return 1==this.compare(t,e)},isLessThan:function(t,e){return 2==this.compare(t,e)},isEqual:function(t,e){return 0==this.compare(t,e)},toString:function(t){return i(this.myDate,t)}},exports.MyDate=o});