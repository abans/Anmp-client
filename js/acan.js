/*
	Acan
	www.abans.cn	abans@qq.com
	2010-10-12
*/
var Acan=Object();
var Apps=Object();
Acan = function(obj){}
Acan.ready = function(){
	if(top.Abody=='abans'){top.Acan.url.refresh(Acan.url.get());}
}
Acan.get = function(str){
	if(str.split("#")[1]){
		return document.getElementById(str.split("#")[1]);
	}else if(str.split("&")[1]){
		return document.getElementsByName(str.split("&")[1]);
	}else if(str.split(".")[1]){
		return document.getElementsByClassName(str.split(".")[1]);
	}else{
		return document.getElementsByTagName(str);
	}
}
Acan.regexp = {
	"mail":/([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-]+)/g,
	"phone":/1(3|5|8)[0-9]{9}/g,
	"tel":/([0-9]{3,4}-[0-9]{7,8})/g
};
var userAgent = navigator.userAgent.toLowerCase();
Acan.browser = {
	version: (userAgent.match( /.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/ ) || [0,'0'])[1],
	webkit: /webkit/.test( userAgent ),
	safari: /webkit/.test( userAgent ),
	opera: /opera/.test( userAgent ),
	msie: /msie/.test( userAgent ) && !/opera/.test( userAgent ),
	mozilla: /mozilla/.test( userAgent ) && !/(compatible|webkit)/.test( userAgent )
};
//---------Acan.url 类---------
Acan.url = function(obj){	return Acan.url.anew(obj);}
Acan.url.anew = function(obj){this.obj = obj;return this;}
//刷新
Acan.url.back = function(){
	window.location.href = document.referrer;
}
Acan.url.refresh = function(url){
	if(url){
		window.location.href=url;
	}else{
		window.location.reload();
	}
}
Acan.url.open = function(url,name,parameters){
	window.open(url,name,parameters);//window.open('page.html','newwindow','height=100,width=400,top=0,left=0,toolbar=no,menubar=no,scrollbars=no, resizable=no,location=no, status=no');
}
//获取url地址
Acan.url.get = function(){
	return window.location.href;
}
Acan.url.host = function(){
	return window.location.host;
}
Acan.url.arr = function(obj){
	var uall = window.location.href.split('?');
	var urls = Object();
	urls[0]= uall[0];
	if(uall[1]){
		var url = uall[1].split('&');
		for(var i in url){
			urr = url[i].split('=');
			urls[urr[0]] = urr[1];
		}
	}
	if(obj){
		for(var i in obj){
			urls[i] = obj[i];
		}
	}
	return urls;
}
Acan.url.uni = function(obj){
	var url = obj[0]+'?';
	var i = 0;
	for(var x in obj){
		if(x==0){continue;}
		if(i==0){
			url += x+'='+obj[x];
		}else{
			url += '&'+x+'='+obj[x];
		}
		i++;
	}
	return url;
}
//获取aurl
Acan.url.aurl = function(){
	var aurl = window.location.search.split("a=")[1];//动态地址参数
	if(!aurl){
		aurl = window.location.href.split(window.location.host+"/")[1];//静态地址参数
	}
	var arr = aurl.split("/");
	var aurls = new Array();
	aurls[0] = arr[0];
	aurls[1] = arr[1];
	aurls[2] = arr[2];
	for(var i=3;i<arr.length;i=i+2){
		aurls[arr[i]] = arr[i+1];
	}
	return aurls;
}
//--awhere 重定向
Acan.url.locations = function(key,str,val){
	var aurl = Acan.url.aurl();
	where = Acan.url.where_arr();
	if(val==""){
		delete aurl.awhere;//不存在awhere的时候增加
	}else if(where == false ){
		aurl.awhere = str+'='+val;//不存在awhere的时候增加
	}else{
		//重定义awhere
		if(where.where[str]!=val){
			where.where[str] = val;
		}else{
			return false;
		}
		//合并awhere
		aurl.awhere = Acan.url.where_unite(where);
	}
	//合并aurl
	var newurl = Acan.url.unite(aurl);
	window.location.href = newurl;
	return true;
}
//合并aurl
Acan.url.unite = function(arr){
	var aurl = arr[0];
	for(var v in arr){
		if(v != '0'){
			aurl += '/'+v+'/'+arr[v];
		}
	}
	if(Acan.url.get().split("aurl=")[1]){
		return Acan.url.get().split("aurl=")[0]+'aurl='+aurl;
	}else if(Acan.url.get().split("a=")[1]){
		return Acan.url.get().split("a=")[0]+'a='+aurl;
	}else{
		return 'http://' + window.location.host + '/' + aurl;
	}
}
//合并url where数组
Acan.url.where_unite = function(arr){
	var url;
	var where = arr.where;
	for(var v in where){
		if(url){
			url += ','+v+'='+where[v];
		}else{
			url = v+'='+where[v];
		}
	}
	return url;
}
//获取where数组
Acan.url.where_arr = function(){
	var awhere = Acan.url.aurl().awhere;
	if(awhere){
		if(awhere.length<1){
			return false;
		}
	}else{
		return false;
	}
	var arr = awhere.split(',');
	var where = new Array()
	for(var v in arr){
		var brr = arr[v].split('=');
		where[brr[0]] = brr[1];
	}
	var rs = new Array()
	rs['where'] = where;
	rs['num'] = arr.length;
	return rs;
}
//url编码
Acan.url.encode = function(str) {
	str = str.replace(/:/g,"%3A");
	str = str.replace(/\//g,"%2F");
	return str;
}
Acan.url.aencode = function(str) {
	str = str.replace(/:/g,"%3A");
	str = str.replace(/\?/g,"%3F");
	str = str.replace(/\&/g,"%26");
	str = str.replace(/\=/g,"%3D");
	str = str.replace(/\//g,"$2F");
	return str;
}
//----Acan.url 类 end
//----menu 类
Acan.menu = function(obj){	return Acan.menu.anew(obj);}
Acan.menu.anew = function(obj){this.obj=obj;	return this;}
//--over,移上
Acan.menu.li_over = function(id,val){
	var li_id = id;
	var amenu = Acan.cookie.get('amenu');
	if(amenu){
		amenu = Acan.base.str_obj(amenu);
	}else{
		var amenu = new Array;
	}
	jQuery(".amenu_ul li").removeClass('amenu_li_hover');
	jQuery("#"+li_id).addClass('amenu_li_hover');
	if(li_id == amenu[val]){
		jQuery("#"+li_id+" div").fadeTo('1000',0.9);
		return;
	}
	amenu[val] = li_id;
	//jQuery("#"+val+"-amenu_ul div").fadeOut('500');
	jQuery("#"+val+"-amenu_ul div").hide();
	jQuery("#"+li_id+" div").fadeTo('1000',0.9);
	Acan.cookie.add('amenu',Acan.base.obj_str(amenu),3600);
}
//--out,离开
Acan.menu.li_out = function(id){
	//setTimeout(function(){ jQuery("#"+id+" div").fadeOut('2000');}, 2000);
	return;
}
Acan.menu.li2_over = function(id){
	jQuery("#"+id).fadeTo('1000',1);
}
Acan.menu.li2_out = function(id){
	jQuery("#"+id).fadeTo('1000',0.9);
}
Acan.menu.over = function(id,val){
	return;
}
Acan.menu.out = function(id,val){
	return;
}
//--menu初始化
Acan.menu.ready = function(val){
	var amenu = Acan.cookie.get('amenu');
	if(!amenu){
		return;
	}
	amenu = Acan.base.str_obj(amenu);
	if(amenu[val]){
		jQuery("#"+amenu[val]).addClass('amenu_li_hover');
		jQuery("#"+amenu[val]+" div").fadeTo('1000',0.9);
	}
	jQuery(function(){
		jQuery(".i-amenu_li").hover(//菜单一
			function (){Acan.menu.li_over(this.id,'i');},
			function (){Acan.menu.li_out(this.id);}
		);
		jQuery(".i-amenu_li2").hover(//菜单二
			function (){Acan.menu.li2_over(this.id);},
			function (){Acan.menu.li2_out(this.id);}
		);
		jQuery(".i-amenu2").hover(//菜单二
			function (){Acan.menu.over(this.id);},
			function (){Acan.menu.out(this.id);}
		);
		jQuery(".-body").click( function () {
			jQuery("#i-amenu_ul div").hide();
		});
	})
}
//所有关闭按钮
function ajax_close(str){
	jQuery("*").removeClass("dis_show");
	if(str){
		jQuery("#"+str).fadeOut(1000);
	}
	if(str){
		setTimeout('ajax_close_a(str)',2000);
	}
	Acan.ajax_bg();
}
//单个ID关闭按钮
function ajax_close_a(str){
	jQuery("#"+str).remove();
}

//----Acan.cookie
Acan.cookie = function(obj){	return Acan.cookie.anew(obj);}
Acan.cookie.anew = function(obj){this.obj=obj;	return this;}

Acan.cookie.add = function(objName,objValue,objHours){//添加cookie
	var str = objName + "=" + escape(objValue);
	if(objHours > 0){//为0时不设定过期时间，浏览器关闭时cookie自动消失
		var date = new Date();
		var ms = objHours*3600*1000;
		date.setTime(date.getTime() + ms);
		str += "; expires=" + date.toGMTString();
	}
	document.cookie = str;
	//alert("添加cookie成功");
}
Acan.cookie.get = function(objName){//获取指定名称的cookie的值
	var arrStr = document.cookie.split("; ");
	for(var i = 0;i < arrStr.length;i ++){
		var temp = arrStr[i].split("=");
		if(temp[0] == objName) return unescape(temp[1]);
	}
}
Acan.cookie.del = function(name){//为了删除指定名称的cookie，可以将其过期时间设定为一个过去的时间
	var date = new Date();
	date.setTime(date.getTime() - 10000);
	document.cookie = name + "=a; expires=" + date.toGMTString();
}
//读取所有保存的cookie字符串
Acan.cookie.all = function(){
	var str = document.cookie;
	if(str == ""){str = "没有保存任何cookie";}
	alert(str);
}
//----Acan.cookie end
//----Acan.html 类
Acan.html = function(obj){return Acan.html.anew(obj);}
Acan.html.anew = function(obj){this.obj=obj;return this;}
//---------Acan.html.tag-----------生成html标签
Acan.html.span = function(html,arr){return this.tag('span',arr,html);}
Acan.html.p = function(html,arr){return this.tag('p',arr,html);}
Acan.html.a = function(html,arr){return this.tag('a',arr,html);}
Acan.html.li = function(html,arr){return this.tag('li',arr,html);}
Acan.html.ul = function(html,arr){return this.tag('ul',arr,html);}
Acan.html.dd = function(html,arr){return this.tag('dd',arr,html);}
Acan.html.dt = function(html,arr){return this.tag('dt',arr,html);}
Acan.html.div = function(html,arr){return this.tag('div',arr,html);}
Acan.html.text = function(html,arr){return this.tag('text',arr,html);}
Acan.html.textarea = function(html,arr){return this.tag('textarea',arr,html);}
Acan.html.dl = function(arr,html){return this.tag('dl',arr,html);}
Acan.html.tag = function(type,arr,html){
	if(!arr){var arr={};}
	if(!html){ html = '';}
	var adds = '</'+type+'>';
	var adde = '';
	if(Acan.base.in_array(type,['input','br','hr'])){
		var adds = '';
		var adde = '/';
	}
	var str = this.base.unite(arr,type);
	var strs = '<'+type+' '+str+adde+'>'+html+adds;
	if(arr.type == 'text'){
		strs = html+'<'+type+' '+str+'>'+adds;
	}else if(type == 'textarea'){
		strs = '<'+type+' '+str+'>'+html+adds;
	}
	return strs;
}
Acan.html.radio = function(obj,data,val,label){
	var radios = '';
	var opobj = obj;
	opobj.type = "radio";
	for(var x in data){
		opobj.value = x;
		if(x == 'length'){continue;}
		if(x == val){opobj.checked = 'checked';}
		radios += this.tag('input',opobj,data[x]);
		delete opobj.checked;
	}
	if(!label){var label = ""}
	return label+radios;
}
Acan.html.checkbox = function(obj,data,val,label){
	var radios = '';
	var opobj = obj;
	opobj.type = "checkbox";
	opobj.name = opobj.name+"[]";
	for(var x in data){
		opobj.value = x;
		if(x == 'length'){continue;}
		if(x == val){opobj.checked = 'checked';}
		radios += this.tag('input',opobj,data[x]);
		delete opobj.checked;
	}
	if(!label){var label = ""}
	return label+radios;
}
Acan.html.select = function(obj,data,val,label){
	var option = '';
	for(var x in data){
		var opstr = Object();
		if(x == 'length'){continue;}
		opstr.value = x;
		if(x == val){opstr.selected = 'selected';}
		option += this.tag('option',opstr,data[x]);
	}
	if(!label){var label = ""}
	return label+this.tag('select',obj,option);
}
Acan.html.inputs = function(obj,data,val,label){
	var str = '';
	if(data.length == 0){return;}
	for(var i in data){
		if(i == 'length'){continue;}
		delete obj.checked;
		obj.value = i;
		if(typeof(val) == 'object'){
			if(Acan.base.in_array(i,val)){obj.checked = 'checked';}
		}else if(typeof(val) == 'string'){
			if(val == i){obj.checked = 'checked';}
		}
		str += this.tag('input',obj, this.tag('span','',data[i]));
	}
	if(!label){var label = ""}
	return label+str;
}
//--Acan.html.base
Acan.html.base = function(){}
Acan.html.base.unite = function(arr,type){//合并标签参数
	var str = "";
	if(arr.length = 0){return;}
	for(var i in arr){
		if(i == 'length'){continue;}
		if(type == 'textarea'){if(i == 'type' || i == 'value' || i == 'size'){continue;}}
		str += i+'="'+arr[i]+'" ';
	}
	return str;
}
var Ahtml = Acan.html();
//----Acan.html 类 end
Acan.form = function(obj){	return Acan.form.anew(obj);}
Acan.form.anew = function(obj){this.obj=obj;	return this;}
Acan.form.search = function(form_id){
	var aurl = Acan.url.aurl();
	delete aurl.apage;
	var data = jQuery("#"+form_id).serialize();
	drr = data.split('&');
	for(var i=0;i<drr.length;i++){
		var drrs = drr[i].split('=');
		if(drrs[0] && drrs[1])
			aurl[drrs[0]] = drrs[1];
	}
	var newurl = Acan.url.unite(aurl);
	window.location.href = newurl;
}
//----Acan.base
Acan.base = function(obj){	return Acan.base.anew(obj);}
Acan.base.anew = function(obj){this.obj=obj;	return this;}
//-- in_array 包含元素
Acan.base.is_numeric = function(str){
	return /^[\d]+$/.test(str);
}
Acan.base.in_array = function(str,arr){
	for(var i in arr){
		if(arr[i] == str){
			return true;
		}
	}
	return false;
}
//-- 字符串 -> 一维数组
Acan.base.str_int = function(str){
	if(typeof str == 'number'){return str;}
	if(str=="0"){
		return 0;
	}else{
		return parseInt(str);
	}
}
//-- 字符串 -> 一维数组
Acan.base.str_arr = function(str){
	var arrs = new Array();
	var arr = str.split(',');
	for(var i=0;i<arr.length;i=i+2){
		arrs[arr[i]] = arr[i+1];
	}
	return arrs;
}
//-- 字符串 -> 对象
Acan.base.str_obj = function(str){
	var arrs = new Object();
	var arr = str.split(',');
	for(var i=0;i<arr.length;i=i+2){
		arrs[arr[i]] = arr[i+1];
	}
	return arrs;
}
//-- 一维数组 -> 字符串
Acan.base.arr_str = function(arr){
	var str = "";
	for(var i in arr){
		if(i == 'length'){continue;}
		if(str){
			str += ','+i+','+arr[i];
		}else{
			str += i+','+arr[i];
		}
	}
	return str;
}
//-- 一维数组 -> json字符串
Acan.base.arr_json = function(arr){
	var str = "";
	for(var i in arr){
		if(i == 'length'){continue;}
		if(str){
			str += ',"'+arr[i]+'"';
		}else{
			str += '["'+arr[i]+'"';
		}
	}
	str += "]";
	return str;
}
//-- 一维数组 -> 字符串
Acan.base.arr_obj = function(arr){
	var obj = new Object();
	for(var i in arr){
		if(i == 'length'){continue;}
		obj[i] = arr[i];
	}
	return obj;
}
//-- 对象 -> 字符串
Acan.base.obj_str = function(arr,type){
	var str = "";
	if(!type){type=1;}
	for(var i in arr){
		if(i == 'length'){continue;}
		if(str){
			if(type==1){
				str += ','+i+','+arr[i];
			}else{
				str += ','+arr[i];
			}
		}else{
			if(type==1){
				str += i+','+arr[i];
			}else{
				str += arr[i];
			}
		}
	}
	return str;
}
//-- 对象 -> json字符串
Acan.base.obj_json = function(o){
	//try{if(JSON){return JSON.stringify(o);}}catch(e){}
	var r = [];
	if(o===null) return 'null';
	if(typeof o =="string") return "\""+o.replace(/([\'\"\\])/g,"\\$1").replace(/(\n)/g,"\\n").replace(/(\r)/g,"\\r").replace(/(\t)/g,"\\t")+"\"";
	if(typeof o =="undefined") return '""';//未知的变量返回空
	if(typeof o == "object"){
		if(Acan.count(o)==0){return '';}//空的对象返回空
		if(o===null) return 'null';
	//	else if(!o.sort){
			for(var i in o){
				if(i == 'length'){continue;}
				r.push('"'+i+'"'+":"+Acan.base.obj_json(o[i]))
			}
			r="{"+r.join()+"}"
	/*		}else{
			for(var i =0;i<o.length;i++)
				r.push(Acan.base.obj_json(o[i]))
			r="["+r.join()+"]"
		}*/
		return r;
	}
	if(typeof o == "number"){
		return o.toString();
	}
	return o.toString();
}
//-- json字符串 -> 对象
Acan.base.json_obj = function(str){
	if(typeof str == 'string' && Acan.base.in_array(str.substring(0,1),['{','[','"']))/*}*/
		return (new Function("return "+str ))();
	else
		return false;
}
//-- 创建一个窗口
Acan.base.win = function (obj,title,content){
	if(!obj){var obj=Object();}
	var css = Object();if(obj.css){css = obj.css;delete obj.css;}
	var pid = 'body';if(obj.pid){pid = obj.pid;delete obj.pid;}
	if(obj._close=='default'){obj._close = {"class":'-close',"onclick":'ajax_close()'};}
	var _close = obj._close;
	var close = '';
	delete obj._close;
	if(_close){close = Ahtml.tag('span',_close,'<p><a></a><b></b></p>');}
	if(!title){var title='消息框';}
	if(!content){var content='无内容';}
	var Acan_win = jQuery("#"+obj.id);
	if(!Acan_win.attr('id')){
		jQuery(pid).append(Ahtml.tag('div',obj));
		Acan_win = jQuery("#"+obj.id);
	}
	Acan_win.html(Ahtml.tag('div',{"class":'-nav'},close+Ahtml.tag('span',{"class":'_title'},title))+Ahtml.tag('div',{"class":'_content'},content));
	if(!css.width){css.width='300px';}
	if(!css.height){css.height='100px';}
	css.background = '#c8e1dc';
	css.border = '1px solid #178dee';
	css.position = 'absolute';
	if(!css['z-index']){css['z-index'] = '100';}
	Acan_win.toggleClass('dis_none');
	Acan_win.css(css);
	this.id = obj.id;
	Acan.base.win_position();
}
//-- 给窗口定位
Acan.base.win_position = function (obj){
	var Acan_win = jQuery("#"+this.id);
	var windows = jQuery(window);
	var css = {};
	css.top = (windows.height()-Acan_win.height())/2+windows.scrollTop();
	css.left = (windows.width()-Acan_win.width())/2;
	if(css.top<10){css.top = 10;}
	if(css.left<0){css.left = 0;}
	Acan_win.css(css);
}
//----Acan.css
Acan.css = function(obj){	return Acan.css.anew(obj);}
Acan.css.anew = function(obj){this.obj=obj;	return this;}

Acan.css.make = function(){
	Acan.css.auto.width();
	setTimeout('Acan.css.auto.center()',1000);
}
Acan.css.auto = function(){}
//修正子元素自动宽度
Acan.css.auto.width = function(){
	var makes = jQuery(".acan_css_auto_width");
	var obj;
	for(var i=0;i<makes.length;i++){
		obj = jQuery(makes.get(i));
		Acan.css.set.auto_width(obj);
	}
}
//修正子元素自动居中
Acan.css.auto.center = function(){
	var makes = jQuery(".acan_css_auto_center");
	var obj;
	for(var i=0;i<makes.length;i++){
		obj = jQuery(makes.get(i));
		Acan.css.set.auto_center(obj,i);
	}
}
Acan.css.size = function(val){
	return parseInt(this.obj.css(val).split('px')[0]);
}
Acan.css.set = function(){}
Acan.css.set.auto_center = function(obj,id){
	obj.addClass("acan_css_auto_center_"+id);//添加一个唯一值
	var child = jQuery(".acan_css_auto_center_"+id+" .acan_css_auto_center_s");
	var obj_css = Acan.css(obj);
	var top = (obj.height() + obj_css.size('padding-top')*2 - child.height())/2;
	var left = (obj.width() + obj_css.size('padding-left')*2 - child.width())/2;
	obj.css({position:'relative'});
	child.css({top:top,left:left,position:'absolute'});
}
Acan.css.set.auto_width = function(obj){
	var str = Acan.base.json_obj(obj.attr('acanval'));
	var zw = obj.width()-1;
	var child = jQuery("."+str.child);
	var child_width = zw/str.row - Acan.css.get_width_out(child);
	child.css({width:child_width});
}
Acan.css.get_width_out = function(obj){
	var padding = parseInt(obj.css('padding-left').split('px')[0]) + parseInt(obj.css('padding-right').split('px')[0]);
	var margin = parseInt(obj.css('margin-left').split('px')[0]) + parseInt(obj.css('margin-right').split('px')[0]);
	if(!margin){
		margin = 0;
	}
	return padding+margin;
}

//直接包含js文件。
Acan.include_all = function(path){
	var sobj = document.createElement('script');
	sobj.type = "text/javascript";
	sobj.src = path;
	var headobj = document.getElementsByTagName('head')[0];
	headobj.appendChild(sobj);
}

//根据已经包含的第一个js文件路径，包含新的js文件
Acan.include = function(path,name,call){
	var scripts = document.getElementsByTagName("script");
	var js_path = scripts[0].src;
//	js_path=js_path.substring(0,js_path.lastIndexOf('/')+1);
	var js_domain = 'http://';
	if(js_path.substring(0,7) == 'http://'){
		js_domain += js_path.split('/')[2];
	}else{
		js_domain += window.location.href.split('/')[2];
	}
	if(path.substring(0,7) != 'http://'){
		path = js_domain+'/js/'+path;
	}
	if(name==1){
		var sobj = document.createElement('script');
		sobj.type = "text/javascript";
		sobj.src = path;
		var headobj = document.getElementsByTagName('head')[0];
		headobj.appendChild(sobj);
	}else if(name==2){
		var Atabid = 'a_windows_iframe_'+Acan.get_Atab_id();
		var obj = parent.frames[Atabid].window;
		var sobj = obj.document.createElement('script');
		sobj.type = "text/javascript";
		sobj.src = path;
		var headobj = obj.document.getElementsByTagName('head')[0];
		headobj.appendChild(sobj);
	}else{
		jQuery.getScript(path,call);
	}
}
Acan.includes = function(path,type,mode){
	var sobj;
	if(!path) return false;
	if(!type) type = 'js';
	if(!mode) mode = 'acan';
	if(mode=="host"){
		path = "http://"+Acan.url.host()+'/'+path;
	}else if(mode=="acan"){
		path = "http://"+Acan.url.host()+'/'+type+'/'+path;
	}else if(mode=="all"){
	}
	if(type=='css'){
		sobj = document.createElement("link");
		sobj.rel = "stylesheet";
		sobj.type = "text/css";
		sobj.href = path;
	}else if(type=='js'){
		var sobj = document.createElement('script');
		sobj.type = "text/javascript";
		sobj.src = path;
	}
	document.getElementsByTagName("head")[0].appendChild(sobj);
}
//读取
Acan.load = function(){}
Acan.load.img = function(url,callback){
	var img=new Image();
	Acan.ajax.load();
	if(Acan.browser.msie){
		img.onreadystatechange =function(){  
			if(img.readyState=="complete"||img.readyState=="loaded"){
				Acan.ajax.load(2);
				callback(url);
			}
		}
	}else{
		img.onload=function(){
			if(img.complete==true){
				Acan.ajax.load(2);
				callback(url);
			}
		}
	}
	//如果因为网络或图片的原因发生异常，则显示该图片
	img.onerror=function(){url=''}
	img.src=url;
}
Acan.load.css = function(url,callback){
	
}
Acan.load.js = function(url,callback){
	
}
//app自动载入
Acan.include_auto = function(val){
	if(val=='1'){
		Acan.include('app/'+window.location.pathname.split(".php")[0]+'/'+Acan.url.aurl()[0]+".js");
	}else if(val){
		Acan.include('app/'+window.location.pathname.split(".php")[0]+'/'+val+".js");
	}else{
		return;
	}
}
Acan.get_Atab_id = function(){
	return jQuery('#a_this_id').val();
}
//ajax异步请求
Acan.ajax = function(obj){
	jQuery.ajax({
		type: obj.type,
		url: obj.url,
		data: obj.data,
		success: function(data){
			obj.callback(data);
		}
	})
}
//过度效果
Acan.ajax.load = function(type){
	if(!type) type=1;
	var Did = "Ajax_load";
	jQuery("body ."+Did).remove();
	if(type==2){return;}
	//var html = Ahtml.tag("div",{"id":Did,"class":"Ajax_load"},Ahtml.tag("img",{"class":"_img","src":"/images/button/20-0.gif"}));
	var html = Ahtml.tag("div",{"id":Did,"class":"Ajax_load"},Ahtml.tag("div",{"id":"Ajax_load_img"}));
	jQuery("body").append(html);
	Acan.ajax.position(Did);
}
//-- 给窗口定位
Acan.ajax.position = function (Did){
	var Acan_win = jQuery("#"+Did);
	var windows = jQuery(window);
	var css = {};
	css.top = (windows.height()-Acan_win.height())/2+windows.scrollTop();
	css.left = (windows.width()-Acan_win.width())/2;
	if(css.top<10){css.top = 10;}
	if(css.left<0){css.left = 0;}
	Acan_win.css(css);
}
Acan.time = function(type,t){
	if(!type) type='s';
	var now;
	if(!t){now=new Date();}
	else if(t>0 && t<9000000000){
		now=new Date(t*1000);
	}else if(t>9000000000){now=new Date(t);}
	if(type=='s') return Math.floor(now.getTime()/1000);
	else if(type=='ms') return now.getTime();
	else if(type.length>0){
		var day=[];
		day.Y = now.getFullYear();
		day.m = now.getMonth()+1;
		day.d = now.getDate();
		day.H = now.getHours();
		day.i = now.getMinutes();
		day.s = now.getSeconds();
		for (var key in day) {
			if(day[key]<10){day[key] = '0'+day[key];}
			type = type.replace(key,day[key]);
		};
		return type;
	}
}
Acan.random = function(min,max){
	var rand;
	if(!min && !max && min!=0 && max!=0){rand = Math.floor(Math.random()*100+1);}
	else if(min>0 && !max){rand = Math.floor(Math.random()*min);}
	else{rand = Math.floor(Math.random()*max+min);}
	return rand;
}
//消息提示框
Acan.alert = function(content,time,css){
	var obj=Object();
	obj.id='Acan_alert';
	if(css) obj.css = css;
	obj["class"]='acan_win dis_none';
	jQuery("#"+obj.id).remove();
	if(!content){return;}//无内容直接返回
	if(typeof content == 'object'){
		content = Acan.base.obj_json(content);
	}
	obj._close={"class":'-close',"onclick":'Acan.alert()'};//关闭按钮
	Acan.base.win(obj,'消息框',content);
	if(time>200){
		setTimeout("Acan.alert()",time);
	}
}
//背景遮罩
Acan.ajax_bg = function(str,time){
	if(!str && str != 0) str=1;
	if(!time && time != 0) time=600;
	var ajax_bg = jQuery("#ajax_bg");
	if(str == 0){
		ajax_bg.remove();//移除背景遮罩
		return;
	}
	if(!ajax_bg.attr('id')){
		jQuery("body").append('<div id="ajax_bg" class="ajax_bg">&nbsp;</div>');
		if(time>0) jQuery("#ajax_bg").fadeTo(time, 0.5);//渐渐显示背景,透明度0.5
		else{jQuery("#ajax_bg").css("opacity",'0.5');}
		jQuery("#ajax_bg").removeClass('dis_none');
	}
	return;
}
Acan.count = function(obj){
	var i = 0;
	if(typeof(obj)=='object' || typeof(obj)=='Array')
	for(var x in obj){
		i++;
	}
	return i;
}
Acan.checkall = function(classn,value){
	if(value=='1')
		jQuery("."+classn+" input").attr("checked","checked");
	else
		jQuery("."+classn+" input").removeAttr("checked","checked");
}
Acan.icon = function(){}
//关闭按钮
Acan.icon.close = function(fun){
	var obj = {"class":'-close'};
	if(fun){obj.onclick = fun;}
	return Ahtml.tag('span',obj,'<p><a></a><b></b></p>');
}
//箭头 l 向左 r 向右
Acan.icon.arrow = function(dir,fun){
	if(!dir){dir="l";}
	var obj = {"class":'-icon_a'+dir};
	if(fun){obj.onclick = fun;}
	return Ahtml.tag('span',obj,'<p><a></a><b></b></p>');
}
//勾 对号
Acan.icon.right = function(fun){
	var obj = {"class":'-icon_rt'};
	if(fun){obj.onclick = fun;}
	return Ahtml.tag('span',obj,'<p><a></a><b></b></p>');
}
//滑块开关 1为开 2为关
Acan.icon.onoff = function(on,off,val){
	var obj = {"class":'-icon_onoff'};
	var ss = "_off";
	if(val==1){
		ss = "_on";
	}
	obj.id = "icon_"+Math.round(Math.random() * 100000);
	obj.onclick = "Acan.icon.onoffss('"+obj.id+"');";
	if(on) obj.on = on;
	if(off) obj.off = off;
	return Ahtml.tag('span',obj,'<div class="'+ss+'"><p><span></span><a></a></p><b class="_ls"></b><b class="_rs"></b></div><h2></h2>');
}
Acan.icon.onoffss = function(id){
	var obj = jQuery("#"+id+" div");
	var ss = obj.attr("class");
	var fun,val=1;
	if(ss=="_on"){
		val=2;
		obj.attr("class","_off");
		fun = jQuery("#"+id).attr("on");
	}else{
		obj.attr("class","_on");
		fun = jQuery("#"+id).attr("off");
	}
	if(fun){
		fun = fun.replace("\val",val)
		setTimeout(fun,1);
	}
}


//ajax 页面关闭
Acan.close = function(id,mode){
	jQuery("#"+id).toggleClass('dis_none');
	if(mode==1){
		jQuery("#"+id).remove();
	}
	Acan.ajax_bg(0);
}
Acan.closes = function(mode){
	jQuery('.acan_win').toggleClass('dis_none');
	if(mode==1){
		jQuery('.acan_win').remove();
	}
	Acan.ajax_bg(0);
}
Acan.cloneAll = function(fromObj,toObj){
	if(!toObj) toObj = {};
	for(var i in fromObj){
		if(typeof fromObj[i] == "object"){
			toObj[i]={};
			Acan.cloneAll(fromObj[i],toObj[i]);
			continue;
		}
		toObj[i] = fromObj[i];
	}
	return toObj;
}
Acan.onkeydown = function(e){
	document.onkeydown = Acan.keyDown;
	//document.onkeyup = Acan.keyDown;
	return false;
}
Acan.oncontextmenu = function(){
	document.oncontextmenu = new Function("return false;")
}
Acan.keyDown = function(e){
	var keycode=0,realkey;
	e=e||event;
	keycode=e.keyCode||e.which||e.charCode;
	//try{keycode = e.which;}catch(ex){keycode = event.keyCode;}
	realkey = String.fromCharCode(keycode);
	//Acan.alert("按键码: " + keycode + " 字符: " + realkey+"Ctrl:"+e.ctrlKey+"Alt:"+e.altKey);
	//Alt
	if(e.ctrlKey){
		//->
		if(keycode==37){Atab.task_left();return false;}
		//<-
		if(keycode==39){Atab.task_right();return false;}
	}
	//Tab
	//if(keycode==9){return false;}
	//Esc
	if(keycode==27){Acan.closes(1);return false;}
	//Win
	if(keycode==219){return false;}
	//F5
	if(keycode==116){
		Acan.disBtn();
		try{Atab.reload();}catch(ex){}
		return false;
	}
}
Acan.disBtn = function(){
	//IE禁用刷新
	try{event.keyCode = 0;event.cancelBubble = true;}catch(ex){}
	return false;
}

Acan.storage = function(){}
Acan.storage.check = function(){
	if(!!window.localStorage){
		return true;
	}else{
		return false;
	}
}
Acan.storage.set = function(key,obj){
	if(Acan.storage.check){
		return localStorage.setItem(key, Acan.base.obj_json(obj));
	}else{
		return false;
	}
}
Acan.storage.get = function(key){
	if(Acan.storage.check){
		return Acan.base.json_obj(localStorage.getItem(key));
	}else{
		return false;
	}
}
//保存
Acan.storage.save = function(key,okey,obj){
	var data = Acan.storage.get(key);
	if(!data){data={};}
	data[okey] = obj;
	return Acan.storage.set(key,data);
}
Acan.storage.del = function(key){
	if(Acan.storage.check){
		return localStorage.removeItem(key);
	}else{
		return false;
	}
}
Acan.storage.delAll = function(){
	if(Acan.storage.check){
		return localStorage.clear();
	}else{
		return false;
	}
}


//---------------form
Acan.form = function(){}
Acan.form.readys = function(aid){
	if(!aid){aid='save_form';}
	var id = jQuery('#'+aid+'_id').val();
	if(id == ''){
		var btn_text = '添加';
	}else{
		var btn_text = '更新';
	}
	var html = Acan.html.tag('tr',{},
		Acan.html.tag('td',{colspan:'10',align:'center'},
			Acan.html.tag('input',{type:'button',onclick:'Acan.form.save('+id+',\''+aid+'\')',value:btn_text})
			+Acan.html.tag('input',{type:'button',onclick:'Acan.url.back()',value:'返回'})
		)//操作按钮
	)
	html = Acan.html.tag('table',{'class':'-table'},html);//操作按钮
	jQuery("#"+aid).append(html);
}
Acan.form.save = function(id,aid){
	if(!aid){aid='save_form';}
	var save = jQuery("#"+aid).serialize();
	if(typeof(id) == 'undefined'){id = '';}
	jQuery.ajax({type: "POST",url: Aurl.Amodr+"-save-"+id,data: save,
		beforeSend: function(){Acan.alert('开始请求');},
		ajaxSend: function(){Acan.alert('发送请求');},
		success: function(data){
			Acan.alert(data,1000);
		}
	})
}