define(function(require,exports,module){"use strict";function t(t){var i={str:["a","b","c","d","e","f","g","h","i","j","k","l","m","o","p","q","r","s","t","x","u","v","y","z","w","n","0","1","2","3","4","5","6","7","8","9"],randint:function(t,i){var o=i-t+1,s=Math.random()*o+t;return Math.floor(s)},randStr:function(){var t=this,i=t.str.length-1,o=t.randint(0,i);return t.str[o]},create:function(t){for(var i=this,o=t||s,e="",n=0;n<o;n++)e+=i.randStr();return e}};return t=t?t:s,i.create(t)}function i(t,i){var o=i-t+1,s=Math.random()*o+t;return Math.floor(s)}function o(t,i){this.codeDoms=[],this.lineDoms=[],this.initOptions(i),this.dom=t,this.init(),this.addEvent(),this.update(),this.mask()}var s=4;o.prototype.init=function(){this.dom.style.position="relative",this.dom.style.overflow="hidden",this.dom.style.cursor="pointer",this.dom.title="点击更换验证码",this.dom.style.background=this.options.bgColor,this.w=this.dom.clientWidth,this.h=this.dom.clientHeight,this.uW=this.w/this.options.len},o.prototype.mask=function(){var t=document.createElement("div");t.style.cssText=["width: 100%","height: 100%","left: 0","top: 0","position: absolute","cursor: pointer","z-index: 9999999"].join(";"),t.title="点击更换验证码",this.maskDom=t,this.dom.appendChild(t)},o.prototype.addEvent=function(){var t=this;t.dom.addEventListener("click",function(){t.update.call(t)})},o.prototype.initOptions=function(t){var i=function(){this.len=s,this.fontSizeMin=20,this.fontSizeMax=48,this.sizeWeight=30,this.colors=["green","red","blue","#53da33","#AA0000","#FFBB00"],this.bgColor="#FFF",this.fonts=["Times New Roman","Georgia","Serif","sans-serif","arial","tahoma","Hiragino Sans GB"],this.lines=8,this.lineColors=["#888888","#FF7744","#888800","#008888"],this.lineHeightMin=1,this.lineHeightMax=3,this.lineWidthMin=1,this.lineWidthMax=60};if(this.options=new i,"object"==typeof t)for(var o in t)this.options[o]=t[o]},o.prototype.update=function(){if(this.dom){for(var t=0;t<this.codeDoms.length;t++)this.dom.removeChild(this.codeDoms[t]);for(var t=0;t<this.lineDoms.length;t++)this.dom.removeChild(this.lineDoms[t]);this.createCode(),this.draw()}},o.prototype.createCode=function(){this.code=t(this.options.len)},o.prototype.verify=function(t){return this.code===t},o.prototype.draw=function(){if(this.dom){this.codeDoms=[];for(var t=0;t<this.code.length;t++)this.codeDoms.push(this.drawCode(this.code[t],t));this.drawLines()}},o.prototype.drawCode=function(t,o){var s=document.createElement("span"),e=this.options.sizeWeight;return s.style.cssText=["font-size:"+i(this.options.fontSizeMin,this.options.fontSizeMax)+"px","color:"+this.options.colors[i(0,this.options.colors.length-1)],"position: absolute","left:"+i(this.uW*o,this.uW*o+this.uW-10)+"px","top:"+i(0,this.h-e)+"px","transform:rotate("+i(-e,e)+"deg)","-ms-transform:rotate("+i(-e,e)+"deg)","-moz-transform:rotate("+i(-e,e)+"deg)","-webkit-transform:rotate("+i(-e,e)+"deg)","-o-transform:rotate("+i(-e,e)+"deg)","font-family:"+this.options.fonts[i(0,this.options.fonts.length-1)],"font-weight:"+i(400,900)].join(";"),s.innerHTML=t,this.dom.appendChild(s),s},o.prototype.drawLines=function(){this.lineDoms=[];for(var t=this.options.sizeWeight,o=0;o<this.options.lines;o++){var s=document.createElement("div");s.style.cssText=["position: absolute","opacity: "+i(3,8)/10,"width:"+i(this.options.lineWidthMin,this.options.lineWidthMax)+"px","height:"+i(this.options.lineHeightMin,this.options.lineHeightMax)+"px","background: "+this.options.lineColors[i(0,this.options.lineColors.length-1)],"left:"+i(0,this.w-20)+"px","top:"+i(0,this.h)+"px","transform:rotate("+i(-t,t)+"deg)","-ms-transform:rotate("+i(-t,t)+"deg)","-moz-transform:rotate("+i(-t,t)+"deg)","-webkit-transform:rotate("+i(-t,t)+"deg)","-o-transform:rotate("+i(-t,t)+"deg)","font-family:"+this.options.fonts[i(0,this.options.fonts.length-1)],"font-weight:"+i(400,900)].join(";"),this.dom.appendChild(s),this.lineDoms.push(s)}},o.prototype.dispose=function(){if(this.maskDom&&this.maskDom.parentNode.removeChild(this.maskDom),this.maskDom=null,this.lineDoms)for(var t=0;t<this.lineDoms.length;t++)this.lineDoms[t].parentNode.removeChild(this.lineDoms[t]);if(this.lineDoms=null,this.codeDoms)for(var t=0;t<this.codeDoms.length;t++)this.codeDoms[t].parentNode.removeChild(this.codeDoms[t]);this.codeDoms=null,this.dom=null,this.code=null},exports.generateVerifyCode=function(t,i){var s=new o(t,i);return s}});