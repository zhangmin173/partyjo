define(function(require,exports,module){var t="mui-pull-top-tips",n=require("CommonTools_Core"),i=require("PullToRefresh_Base_Type1_Core"),e=i.PullToRefresh.extend({init:function(t,i){this._super(t,i),this.options=n.extend(!0,{down:{tips:{colors:["008000","d8ad44","d00324","dc00b8","017efc"],size:200,lineWidth:15,duration:1e3,tail_duration:2500}}},this.options),this.options.down.tips.color=this.options.down.tips.colors[0],this.options.down.tips.colors=this.options.down.tips.colors.map(function(t){return{r:parseInt(t.substring(0,2),16),g:parseInt(t.substring(2,4),16),b:parseInt(t.substring(4,6),16)}})},initPullDownTips:function(){var i=this;n.isFunction(i.options.down.callback)&&(i.pullDownTips=function(){var n=document.querySelector("."+t);return n&&n.parentNode.removeChild(n),n||(n=document.createElement("div"),n.classList.add(t),n.innerHTML='<div class="mui-pull-top-wrapper"><div class="mui-pull-top-canvas"><canvas id="pullDownTips" width="'+i.options.down.tips.size+'" height="'+i.options.down.tips.size+'"></canvas></div></div>',n.addEventListener("webkitTransitionEnd",i),document.body.appendChild(n)),i.pullDownCanvas=document.getElementById("pullDownTips"),i.pullDownCanvasCtx=i.pullDownCanvas.getContext("2d"),i.canvasUtils.init(i.pullDownCanvas,i.options.down.tips),n}())},removePullDownTips:function(){this._super(),this.canvasUtils.stopSpin()},pulling:function(t){var n=Math.min(t/(1.5*this.options.down.height),1),i=Math.min(1,2*n);this.pullDownTips.style.webkitTransform="translate3d(0,"+(t<0?0:t)+"px,0)",this.pullDownCanvas.style.opacity=i,this.pullDownCanvas.style.webkitTransform="rotate("+300*n+"deg)";var e=this.pullDownCanvas,s=this.pullDownCanvasCtx,o=this.options.down.tips.size;s.lineWidth=this.options.down.tips.lineWidth,s.fillStyle="#"+this.options.down.tips.color,s.strokeStyle="#"+this.options.down.tips.color,s.stroke(),s.clearRect(0,0,o,o),e.style.display="none",e.offsetHeight,e.style.display="inherit",this.canvasUtils.drawArcedArrow(s,o/2+.5,o/2,o/4,0*Math.PI,5/3*Math.PI*i,!1,1,2,.7853981633974483,25,this.options.down.tips.lineWidth,this.options.down.tips.lineWidth)},beforeChangeOffset:function(t){},afterChangeOffset:function(t){},dragEndAfterChangeOffset:function(t){t?(this.canvasUtils.startSpin(),this.pulldownLoading()):(this.canvasUtils.stopSpin(),this.endPullDownToRefresh())},canvasUtils:function(){function t(t,n,i,e){return i*t/e+n}function i(t,n,i,e){return(t/=e/2)<1?i/2*t*t+n:-i/2*(--t*(t-2)-1)+n}function e(t,n,i){var e=Math.min(n,i),s=Math.max(n,i);return t<e?e:t>s?e:t}var s=null,o=null,a=200,r=15,l=0,p=0,h=0,d=0,u=0,c=180,f=Math.PI/180,v=1e3,M=2500,w=["35ad0e","d8ad44","d00324","dc00b8","017efc"],g=null,y=function(t,n,i,e,s,o,a,r){"use strict";"string"==typeof n&&(n=parseInt(n)),"string"==typeof i&&(i=parseInt(i)),"string"==typeof e&&(e=parseInt(e)),"string"==typeof s&&(s=parseInt(s)),"string"==typeof o&&(o=parseInt(o)),"string"==typeof a&&(a=parseInt(a));2*Math.PI;switch(t.save(),t.beginPath(),t.moveTo(n,i),t.lineTo(e,s),t.lineTo(o,a),r){case 0:var l=Math.sqrt((o-n)*(o-n)+(a-i)*(a-i));t.arcTo(e,s,n,i,.55*l),t.fill();break;case 1:t.beginPath(),t.moveTo(n,i),t.lineTo(e,s),t.lineTo(o,a),t.lineTo(n,i),t.fill();break;case 2:t.stroke();break;case 3:var p=(n+e+o)/3,h=(i+s+a)/3;t.quadraticCurveTo(p,h,n,i),t.fill();break;case 4:var d,u,c,f,l,v=5;if(o==n)l=a-i,d=(e+n)/2,c=(e+n)/2,u=s+l/v,f=s-l/v;else{l=Math.sqrt((o-n)*(o-n)+(a-i)*(a-i));var M=(n+o)/2,w=(i+a)/2,g=(M+e)/2,y=(w+s)/2,T=(a-i)/(o-n),b=l/(2*Math.sqrt(T*T+1))/v,m=T*b;d=g-b,u=y-m,c=g+b,f=y+m}t.bezierCurveTo(d,u,c,f,n,i),t.fill()}t.restore()},T=function(t,n,i,e,s,o,a,r,l,p,h,d,u){"use strict";r="undefined"!=typeof r?r:3,l="undefined"!=typeof l?l:1,p="undefined"!=typeof p?p:Math.PI/8,d=d||1,u=u||10,h="undefined"!=typeof h?h:10,t.save(),t.lineWidth=d,t.beginPath(),t.arc(n,i,e,s,o,a),t.stroke();var c,f,v,M,w;1&l&&(c=Math.cos(s)*e+n,f=Math.sin(s)*e+i,v=Math.atan2(n-c,f-i),a?(M=c+10*Math.cos(v),w=f+10*Math.sin(v)):(M=c-10*Math.cos(v),w=f-10*Math.sin(v)),b(t,c,f,M,w,r,2,p,h)),2&l&&(c=Math.cos(o)*e+n,f=Math.sin(o)*e+i,v=Math.atan2(n-c,f-i),a?(M=c-10*Math.cos(v),w=f-10*Math.sin(v)):(M=c+10*Math.cos(v),w=f+10*Math.sin(v)),b(t,c-u*Math.sin(o),f+u*Math.cos(o),M-u*Math.sin(o),w+u*Math.cos(o),r,2,p,h)),t.restore()},b=function(t,n,i,e,s,o,a,r,l){"use strict";"string"==typeof n&&(n=parseInt(n)),"string"==typeof i&&(i=parseInt(i)),"string"==typeof e&&(e=parseInt(e)),"string"==typeof s&&(s=parseInt(s)),o="undefined"!=typeof o?o:3,a="undefined"!=typeof a?a:1,r="undefined"!=typeof r?r:Math.PI/8,l="undefined"!=typeof l?l:10;var p,h,d,u,c="function"!=typeof o?y:o,f=Math.sqrt((e-n)*(e-n)+(s-i)*(s-i)),v=(f-l/3)/f;1&a?(p=Math.round(n+(e-n)*v),h=Math.round(i+(s-i)*v)):(p=e,h=s),2&a?(d=n+(e-n)*(1-v),u=i+(s-i)*(1-v)):(d=n,u=i),t.beginPath(),t.moveTo(d,u),t.lineTo(p,h),t.stroke();var M=Math.atan2(s-i,e-n),w=Math.abs(l/Math.cos(r));if(1&a){var g=M+Math.PI+r,T=e+Math.cos(g)*w,b=s+Math.sin(g)*w,m=M+Math.PI-r,I=e+Math.cos(m)*w,C=s+Math.sin(m)*w;c(t,T,b,e,s,I,C,o)}if(2&a){var g=M+r,T=n+Math.cos(g)*w,b=i+Math.sin(g)*w,m=M-r,I=n+Math.cos(m)*w,C=i+Math.sin(m)*w;c(t,T,b,n,i,I,C,o)}},m=function(n,i){var s=n%i;s<h&&w.push(w.shift());var o=w[0],a=w[1],r=e(t(s,o.r,a.r-o.r,i),o.r,a.r),l=e(t(s,o.g,a.g-o.g,i),o.g,a.g),p=e(t(s,o.b,a.b-o.b,i),o.b,a.b);return h=s,"rgb("+parseInt(r)+","+parseInt(l)+","+parseInt(p)+")"},I=function(n){var e=n||(new Date).getTime();p||(p=e),l=e-p,d=i((l+M/2)%M,0,v,M),u=t((l+d)%v,0,360,v),c=20+Math.abs(t((l+M/2)%M,-300,600,M)),o.lineWidth=r,o.lineCap="round",o.strokeStyle=m(l,v),o.clearRect(0,0,a,a),s.style.display="none",s.offsetHeight,s.style.display="inherit",o.beginPath(),o.arc(a/2,a/2,a/4,parseInt(u-c)%360*f,parseInt(u)%360*f,!1),o.stroke(),g=requestAnimationFrame(I)},C=function(){p=0,h=0,g=requestAnimationFrame(I)},P=function(){g&&cancelAnimationFrame(g)},D=function(t,i){s=t,o=s.getContext("2d");var i=n.extend(!0,{},i);w=i.colors,v=i.duration,M=i.tail_duration,a=i.size,r=i.lineWidth};return{init:D,drawArcedArrow:T,startSpin:C,stopSpin:P}}()});exports.PullToRefresh=e,exports.initPullToRefresh=function(t,n){var i=new exports.PullToRefresh(t,n);return i}});