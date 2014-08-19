
var host = window.location.hostname;
if(!host) host = '127.0.0.1';
var logindata = {
	"host":{"type":"text","title":"主机","value":host},
	"port":{"type":"number","title":"端口","value":"8900","size":8},
	"username":{"type":"text","title":"用户名","value":"root"},
	"password":{"type":"password","title":"密码","value":"root"}
};
var port;
var Adata = new Object();
Adata.username = "";
Adata.hash = "";//通信验证码
var messages = [];// Array(N);
var readyState=["连接尚未建立","连接正常","连接正在关闭","连接已经关闭"];
var conrr = {"nav":"程序","nginx":"nginx","php":"php","mysql":"mysql","memcache":"memcache","mongodb":"mongodb","all":"所有"};
var conbtn = {
	"nginx":{"start":"启动","stop":"停止","restart":"重启","reload":"平滑重载","test":"测试配置"},
	"php":{"start":"启动","stop":"停止","restart":"重启"},
	"memcache":{"start":"启动","stop":"停止","restart":"重启"},
	"mysql":{"start":"启动","stop":"停止","restart":"重启","install":"安装","remove":"卸载"},
	"mongodb":{"start":"启动","stop":"停止","restart":"重启","install":"安装","remove":"卸载"},
	"all":{"start":"一键启动","stop":"一键停止","restart":"一键重启"}
};
//--全局信号
var Asignal = {
	'4':{"color":"#00ff40","msg":"运行"},
	'3':{"color":"yellow","msg":"停止中"},
	'2':{"color":"yellow","msg":"启动中"},
	'1':{"color":"red","msg":"停止"},
	'106':{"color":"#c0c0c0","msg":"不存在"}
};
var Aopt_group = {"1":"管理员","2":"普通","3":"查询"};
var Aopt_OnOff = {"on":"打开","off":"关闭"};
var Aopt_charset = {"utf-8":"utf-8","gbk":"gbk","gb2312":"gb2312"};
var Asetoptlang = {"Anmp":"Anmp设置","mysql":"数据库设置","user":"用户管理","host":"主机管理","vip":"VIP","init":"初始化","about":"关于","help":"帮助",}
var Asetopt = {
	"Anmp":{
		"anmp":{
			"http":{name:"控制台端口",type:"number",remark:"(重启Anmp生效)"}
		},"nginx":{
			"log_cycle":{name:"日志分割周期",type:"radio",opt:{"1":"每天","2":"每周","3":"每月"}},
			"auto_del_log":{name:"自动删除日志",type:"number",remark:"周期前"}
		},"mysql":{
			"ini":		{name:"配置文件",type:"text"},
		"version":	{name:"版本",type:"select",opt:version.mysql}
		},"memcache":{
			"p":{name:"端口",type:"number"},
			"m":{name:"大小",type:"number"},
			"c":{name:"并发",type:"number"}
		},"autostart":{
			"nginx":	{name:"nginx",type:"radio",opt:{"4":"是","1":"否"}},
			"php":		{name:"php",type:"radio",opt:{"4":"是","1":"否"}},
			"mysql":	{name:"mysql",type:"radio",opt:{"4":"是","1":"否"}},
			"memcache":	{name:"memcache",type:"radio",opt:{"4":"是","1":"否"}}
		}
	},
/*	"user":{
		"user":{
			"username":{name:"用户名",type:"text"},
			"oldpassword":{name:"原密码",type:"password"},
			"newpassword":{name:"新密码",type:"password"}
		//	"group":{name:"用户组",type:"text"}
		}
	},
	"user":{
		"username":{type:"text"},
		"password":{type:"password"}
	},
	"php":{
		"PHP":{
			"allow_url_fopen":			{name:"允许打开远程文件",type:"radio",opt:Aopt_OnOff},
			"allow_url_include":		{name:"允许打开包含文件",type:"radio",opt:Aopt_OnOff},
			"default_charset":			{name:"默认编码",type:"select",opt:Aopt_charset},
			"default_socket_timeout":	{name:"socket通信超时",type:"number","remark":"秒"},
			"file_uploads":				{name:"上传功能",type:"radio",opt:Aopt_OnOff},
			"memory_limit":				{name:"最大执行内存",type:"text"},
			"post_max_size":			{name:"POST最大尺寸",type:"text"},
			"upload_max_filesize":		{name:"上传最大尺寸",type:"text"}
		},"Date":{
			"date.timezone":			{name:"默认时区",type:"text"}
		}
	},*/
	"mysql":{
		"mysqld":{
			"basedir":					{name:"程序目录",type:"text"},
			"datadir":					{name:"数据目录",type:"text"},
			"port":						{name:"端口",type:"number"},
			"key_buffer_size":			{name:"KEY缓存",type:"text"},
			"max_allowed_packet":		{name:"最大允许包",type:"text"},
			"table_open_cache":			{name:"表缓存数",type:"number"},
			"thread_cache":				{name:"线程缓存数",type:"number"},
			"join_buffer_size":			{name:"join缓存大小",type:"text"},
			"sort_buffer_size":			{name:"sort缓存",type:"text"},
			"read_buffer_size":			{name:"read缓存",type:"text"},
			"read_rnd_buffer_size":		{name:"read_rnd缓存",type:"text"},
			"max_connections":			{name:"最大连接数",type:"number"},
			"wait_timeout":				{name:"等待超时",type:"number","remark":"秒"},
			"interactive_timeout":		{name:"互动超时",type:"number","remark":"秒"},
			"max_connect_errors":		{name:"最大连接错误",type:"number"},
			"long_query_time":			{name:"long_query_time",type:"number"},
			"max_heap_table_size":		{name:"最大堆表的大小",type:"text"},
			"tmp_table_size":			{name:"临时表大小",type:"text"},
			"thread_concurrency":		{name:"线程并发",type:"number"},
			"myisam_sort_buffer_size":	{name:"myisam sort缓存",type:"text"}
		}
	},
	"host":{
		'listen':		{title:"监听端口",type:"number",size:8,value:80},
		'server_name':	{title:"绑定域名",type:"text","remark":"必填"},
		'root':			{title:"根目录",type:"text"},
		'index':		{title:"默认文件",type:"text",value:'index.html index.htm index.php default.php'},
		'error_log':	{title:"错误日志名称",type:"text","remark":"为空不产生日志"},
		'access_log':	{title:"访问日志名称",type:"text","remark":"为空不产生日志"},
		'autoindex':	{title:"目录索引",type:"radio",value:"off",opt:Aopt_OnOff},
		'ssi':			{title:"开启ssi",type:"radio",value:"off",opt:Aopt_OnOff},
		'other':		{title:"其它",type:"textarea",style:"width:100%;height:100px;"},
		'pool':			{title:"进程池",type:"select","remark":"需要php支持请选择"},
	},
	"hostex":{
		'path':{title:'目录',type:'text'},
		'rate':{title:'限速',type:'text'},
		'valid':{title:'防盗链',type:'text'},
		'alias':{title:'别名',type:'text'},
		'error':{title:'错误页',type:'text'},
		'other':{title:'其它',type:'text'}
	},
	"user":{
		"username":	{name:"用户",type:"text"},
		"password":	{name:"新密码",type:"password"},
		"group":	{name:"用户组",type:"select",opt:Aopt_group}
	},
	"vip":{
		"mail":	{name:"邮箱",type:"text"},
		"ip":	{name:"IP",type:"text",disabled:"disabled"},
		"end":	{name:"到期时间",type:"text",disabled:"disabled"},
	},
	"init":{},
	"about":{},
	"help":{}
};

var Alink = {
	'1':{"name":"phpmyadmin","url":":85","target":"_blank","type":1},
	'2':{"name":"Anmp官网","url":"www.nice9s.com","target":"_blank","type":2},
	'3':{"name":"捐赠Anmp","url":"me.alipay.com/abans","target":"_blank","type":2},
	'4':{"name":"版本订制","url":"mailto:abans@qq.com","target":"_blank","type":3}
	
};
var userdata;
var Asetdata;
var _in = 0, _out = 0;
var Anettime,Anettimeo;
var Asocket;
function socket(){
	var url = "http://"+host+":"+port+"/";
	Asocket = io.connect(url);
	Asocket.on('connect', function () {
		Asocket.on('auth', function (obj) {
			if(obj.status==1){
				Anmp.ready();
				jQuery("._hostinfo").html("当前主机:"+host+" 登入用户:"+userdata.username+" 开始运行:"+Acan.time("Y-m-d H:i:s",obj.time)+"<br><div id=\"asysinfo\"></div>"+Ahtml.tag("button",{onclick:"Anmp.logout()","class":"_logout"},"退出"));
				Anmp.status("连接正常");
				jQuery("#status_check").text("实时检测");
				delete obj.time;
				Acan.close('ajax_anmp');
				Anmp.check_status("all");
			}
			Acan.alert(obj.msg,1000);
			Anmp.config.view('about');
		});
		Asocket.on('sysinfo', function (obj) {
			Anmp.sysinfo(obj);
		});
		Asocket.on('status', function (obj) {
			Anmp.set_status(obj);
		});
		Asocket.on('config', function (name,obj) {
			if(name=='host'){
				Anmp.host.work(name,obj);
			}else {
				Anmp.config.call(name,obj);
			}
		});
		Asocket.on('log', function (msg) {
			Anmp.log(msg);
		});
		Asocket.on('message', function (msg) {
		});
		Asocket.on('error', function (msg) {
			Acan.alert("error:"+msg)
		});
		Asocket.on('disconnect', function (msg) {
			Anmp.status("连接关闭");
			jQuery("#status_check").text("暂停检测");
		});
	});
}

var Anmp=Object();
Anmp = function(obj){return Anmp.anew(obj);}
Anmp.anew = function(obj){this.obj=obj;	return this;}
Anmp.host = function(){
}
Anmp.host.send = function(obj){
	if(!obj) obj = {act:'list'};
	Asocket.emit('config','host',obj);
}
Anmp.host.work = function(name,obj){
	if(obj.act=='list'){
		Anmp.host.list(obj.list);
	}else if(obj.act=='info'){
		Anmp.host.edit(obj);
	}else if(obj.act=='rs'){
		Acan.alert(obj.msg,1000);
	}
	if(obj.call=='list'){
		Acan.close('host_list');
		Anmp.config.view('host');
	}
}
Anmp.host.list = function(obj){
	console.log(obj)
	var css = {width:"560px",height:"400px"};
	var tmp = Ahtml.tag("tr",{},Ahtml.tag("th",{},"配置名")+Ahtml.tag("th",{},"操作"+
		Ahtml.tag("input",{type:'button',onclick:"Anmp.host.add()",value:"添加"})
	));
	for(var i in obj){
		tmp += Ahtml.tag("tr",{id:'h_'+obj[i]},Ahtml.tag("td",{},obj[i])+Ahtml.tag("td",{},
			Ahtml.tag("input",{type:'button',onclick:"Anmp.host.info('"+obj[i]+"')",value:"编辑"})+
			Ahtml.tag("input",{type:'button',onclick:"Anmp.host.del('"+obj[i]+"')",value:"删除"})
		));
	}
	html = Ahtml.tag("div",{"class":"_hostlist"},Ahtml.tag("table",{"class":"-table"},tmp));
	Anmp.win_show("主机管理",html,css,'host_list');
}
Anmp.host.vip_list = function(pid){
	if(!pid && pid!=0) pid = 'a';
	var menu = Asetopt.hostex;
	var html = '';
	for (var i in menu) {
		if(pid=='a' && i=='alias'){continue;}
		if(pid!='a' && i=='path'){continue;}
		html += Ahtml.tag('li',{onclick:"Anmp.host.vip_add('"+i+"','"+pid+"')"},menu[i].title);
	};
	html = Ahtml.tag('div',{'class':'host_menu host_menu_'+pid},Ahtml.tag('div',{'class':'vip_btn',onclick:"Anmp.host.vip_show('"+pid+"')"},'VIP设置')+Ahtml.tag('ul',{'class':'dis_none'},html));
	return html;
}
Anmp.host.vip_show = function(id){
	jQuery('.host_menu_'+id+' ul').toggleClass('dis_none');
}
Anmp.host.vip_add = function(name,id){
	Anmp.host.vip_show(id);
	var oi = jQuery('.host_conf tr:last').attr('id');
	if(!oi) oi=-1;
	oi = parseInt(oi)+1;
	var fname = 'ex['+oi+']';
	var html = '',nid;
	obj = {};obj[name] = '';
	if(id!='a'){
		oi = jQuery('.host_conf #'+id+' tr:last').attr('id');
		if(!oi){
			nid = 0;
		}else{
			nid = parseInt(oi.split('_')[1])+1;
		}
		html = Anmp.host.ex(id,obj,nid);
	}else{
		html = Anmp.host.ex(oi,obj);
	}
	var Dbj = jQuery('.host_conf tbody');
	if(id!='a'){
		Dbj = jQuery('.host_conf tbody #c-'+id);
	}
	Dbj.append(html);
}
Anmp.host.vip_del = function(id){
	jQuery('.host_conf #'+id).remove();
}
Anmp.host.ex = function(oi,obj,ci){
	var html = '',val='';
	if(!ci && ci !=0){
		fname = 'ex['+oi+']';
	}else{
		fname = 'ex['+oi+']['+ci+']';
		oi = oi+'_'+ci;
	}
	if(obj.path || obj.path==''){
		fname = 'ex['+oi+']';
		val = obj.path;
		var child = '';
		html = Ahtml.tag('td',{},'目录')+Ahtml.tag('td',{id:'c-'+oi},Ahtml.tag('div',{'class':'child'},
			Ahtml.tag('input',{type:'text',name:fname+'[path]',value:val})+
			Anmp.host.vip_list(oi)+
			Ahtml.tag('input',{type:'button',value:'删除',onclick:"Anmp.host.vip_del("+oi+")"})
		));
		if(obj.path[0]){
			for (var i in obj) {
				if(i=='path') continue;
				child += Anmp.host.ex(oi,obj[i],i);
			};
		}
		setTimeout(function(){jQuery('.host_conf tbody #c-'+oi).append(child);}, 500);
	}else if(obj.rate || obj.rate==''){
		val = obj.rate;
		html = Ahtml.tag('td',{},'限速')+Ahtml.tag('td',{id:'c-'+oi},
			Ahtml.tag('input',{type:'number',size:6,value:val,name:fname+'[rate]'})+'kb/s '+
			Ahtml.tag('input',{type:'number',size:6,value:obj.rate_after,name:fname+'[rate_after]'})+'MB以后'+
			Ahtml.tag('input',{type:'button',value:'删除',onclick:"Anmp.host.vip_del('"+oi+"')"})
		);
	}else if(obj.valid || obj.valid==''){
		val = obj.valid;
		var v0obj = {type:'checkbox',name:fname+'[valid_type][0]',value:'1'};
		var v1obj = {type:'checkbox',name:fname+'[valid_type][1]',value:'2'};
		if(obj.valid_type){
			if(obj.valid_type[0]=='1'){v0obj.checked = 'checked';}
			if(obj.valid_type[1]=='2'){v1obj.checked = 'checked';}
		}
		html = Ahtml.tag('td',{},'防盗链')+Ahtml.tag('td',{id:'c-'+oi},'允许的请求来源:(多个域名空格分开)<br>'+
			Ahtml.tag('input',{type:'text',name:fname+'[valid]',value:val})+'<br>'+
			Ahtml.tag('input',v0obj)+'无请求来源 '+
			Ahtml.tag('input',v1obj)+'伪造的请求头'+
			Ahtml.tag('input',{type:'button',value:'删除',onclick:"Anmp.host.vip_del('"+oi+"')"})
		);
	}else if(obj.alias || obj.alias==''){
		val = obj.alias;
		html = Ahtml.tag('td',{},'目录别名')+Ahtml.tag('td',{id:'c-'+oi},
			Ahtml.tag('input',{type:'text',name:fname+'[alias]',value:val})+
			Ahtml.tag('input',{type:'button',value:'删除',onclick:"Anmp.host.vip_del('"+oi+"')"})
		);
	}else if(obj.error || obj.error==''){
		val = obj.error;
		if(!obj.error_code) obj.error_code = '';
		html = Ahtml.tag('td',{},'错误页面')+Ahtml.tag('td',{id:'c-'+oi},"错误码:"+
			Ahtml.tag('input',{type:'text',name:fname+'[error_code]',size:6,value:obj.error_code})+"文件路径:"+
			Ahtml.tag('input',{type:'text',name:fname+'[error]',value:val})+
			Ahtml.tag('input',{type:'button',value:'删除',onclick:"Anmp.host.vip_del('"+oi+"')"})
		);
	}else if(obj.other || obj.other==''){
		val = obj.other;
		html = Ahtml.tag('td',{},'其它')+Ahtml.tag('td',{id:'c-'+oi},
			Ahtml.textarea(val,{name:fname+'[other]',style:"width:100%;height:100px;"})+
			Ahtml.tag('input',{type:'button',value:'删除',onclick:"Anmp.host.vip_del('"+oi+"')"})
		);
	}
	return Ahtml.tag('tr',{id:oi},html);
}
Anmp.host.edit_ex = function(obj){
	var html = '';
	for (var i in obj) {
		html += Anmp.host.ex(i,obj[i]);
	};
	return html;
}
Anmp.host.edit = function(obj){
	var css = {width:"550px",height:"550px"};
	var hostname = obj.name;
	if(!hostname){
		obj.name = '';
		hostname = Ahtml.tag("input",{type:'text',name:'name'});
	}
	var tmp = Ahtml.tag("tr",{},Ahtml.tag("td",{colspan:2,'class':''},Anmp.host.vip_list()));
	tmp += Ahtml.tag("tr",{},Ahtml.tag("td",{width:'100px'},"配置名")+Ahtml.tag("td",{},hostname));
	var opt = Acan.cloneAll(Asetopt.host);
	opt.pool.opt = {0:'不启用'};
	for (var i=1; i <= obj.pool; i++) {
		opt.pool.opt[i]='p_'+i;
	};
	for(var y in opt){
		var remark = opt[y].remark;if(typeof(remark)=="undefined"){remark="";}
		var value='';
		if(obj['info'][y]) value = obj['info'][y];
		if(opt[y].value && value.length==0){value=opt[y].value;}
		opt[y].name = y;
		switch (opt[y].type){
			case "select":
				inputs = Ahtml.select(opt[y],opt[y].opt,value)+remark;
				break;
			case "radio":
				inputs = Ahtml.radio(opt[y],opt[y].opt,value)+remark;
				break;
			case "textarea":
				inputs = Ahtml.textarea(value,opt[y])+remark;
				break;
			default:
				opt[y].value = value;
				inputs = Ahtml.tag("input",opt[y])+remark;
				break;
		}
		tmp += Ahtml.tag("tr",{},Ahtml.tag("td",{},opt[y].title)+Ahtml.tag("td",{},inputs));
	}
	if(obj.info.ex){
		tmp += Anmp.host.edit_ex(obj.info.ex);
	}
	var html = Ahtml.tag("table",{"class":"-table host_conf"},tmp);
	html += Ahtml.tag("input",{type:"button",onclick:"Anmp.host.view()",value:"预览"})+
		Ahtml.tag("input",{type:"submit",value:"保存"})+
		Ahtml.tag("input",{type:"button",onclick:"Anmp.host.save('"+obj.name+"',3)",value:"保存并生效"});
	html = Ahtml.tag("form",{"class":"_host_edit",onsubmit:"Anmp.host.save('"+obj.name+"');return false;"},html);
	Anmp.win_show("主机编辑:"+obj.name,html,css,'host_edit');
}
Anmp.host.view = function(){
	var cobj = Anmp.host.save('',2);
	var conf = 'server {\n';
	var pt = ['listen','server_name','root','index','autoindex'];
	for(var i in cobj){
		var str = cobj[i];
		if(Acan.base.in_array(i,pt) && str.length>0){
			conf += '\t'+i+" "+str+';\n';
		}else if(i=='error_log'){
			if(str=='off' || str=='' || str=='nul') str='nul';
			conf += '\t'+i+" "+str+';\n';
		}else if(i=='access_log'){
			if(str=='off' || str=='' || str=='nul') str='off';
			conf += '\t'+i+" "+str+';\n';
		}else if(i=='ssi'){
			conf += '\t'+'include ssi.conf;\n';
		}else if(i=='pool' && str>0){
			conf += '\tlocation ~ .*\\.(php|php5)?$ {\n\t\tfastcgi_pass 127.0.0.1:'+(8900+parseInt(str))+';\n\t\tinclude afastcgi.conf;\n\t}\n';
		}else if(i=='other'){
			conf += str+'\n';
		}
	}
	conf += '}\n';
	var html = Ahtml.tag('pre',{},conf);
	Anmp.win_show("主机预览",html,{width:"480px",height:"400px"},'host_view');
}
Anmp.host.add = function(){
	Anmp.host.info();
}
Anmp.host.del = function(name){
	if(!confirm('确实要删除配置: '+name+' 吗?')){return false;}
	this.send({act:'del','name':name,call:'list'});
}
Anmp.host.save = function(name,type){
	if(!type) type=1;
	var srr = jQuery('._host_edit').serializeArray();
	var req = ['listen','server_name'];
	var conf = {};
	var ex = {};
	for(var i in srr){
		if(srr[i].name=='name'){
			if(!name || name.length==0){
				name = srr[i].value;
				continue;
			}
		}
		if(Acan.base.in_array(srr[i].name,req) && srr[i].value==''){
			jQuery('._host_edit input[name="'+srr[i].name+'"]').focus();return;
		}
		if(srr[i].name.substring(0,2)=='ex'){
			var nstr = srr[i].name;
			var nrr = nstr.replace(/]/g,'').split('[');
			var nlen = nrr.length;
			for (var n in nrr) {
				if(n==1 && !ex[nrr[1]]) ex[nrr[1]] = {};
				else if(n==2){
					if(nlen-1==n){
						ex[nrr[1]][nrr[2]] = srr[i].value;
					}else if(nlen-1>n){
						if(!ex[nrr[1]][nrr[2]]) ex[nrr[1]][nrr[2]] = {};
					}
				}else if(n==3){
					if(nlen-1==n){
						ex[nrr[1]][nrr[2]][nrr[3]] = srr[i].value;
					}else if(nlen-1>n){
						if(!ex[nrr[1]][nrr[2]][nrr[3]]) ex[nrr[1]][nrr[2]][nrr[3]] = {};
					}
				}else if(n==4){
					ex[nrr[1]][nrr[2]][nrr[3]][nrr[4]] = srr[i].value;
				}
			};
		}else{
			conf[srr[i].name] = srr[i].value;
		}
	}
	if(ex['0']) conf['ex'] = ex;
	if(type==2) return conf;
	else this.send({act:'save','name':name,'save':conf,'type':type,call:'list'});
}
Anmp.host.info = function(name){
	this.send({act:'info','name':name});
}
Anmp.config = function(){}
Anmp.config.send = function(name,obj){
	Asocket.emit('config',name,obj);
}
Anmp.config.view = function(name){
	if(name=='init'){
		if(!confirm('确实要初始化吗?')){return;}
	}
	this.send(name);
}
Anmp.config.html = function(name,obj){
	var css = {width:"400px",height:"360px"};
	var html = '';
	if(name=='user'){
		for (var x in obj) {
			tmp = Ahtml.tag("tr",{},Ahtml.tag("th",{'colspan':2},"用户["+(parseInt(x)+1)+"]"));
			var opt = Asetopt[name];
			tmp += Anmp.config.html2(x,opt,obj);
			html += Ahtml.tag("table",{"class":"-table setting setid_"+x},tmp);
		}
	}else if(name=='vip'){
		jQuery('#config_view').remove();
		tmp = Ahtml.tag("tr",{},Ahtml.tag("th",{'colspan':2},"VIP设置"));
		var opt = Asetopt[name],x = 'vip';
		for (var y in opt) {
			var remark = opt[y].remark;if(typeof(remark)=="undefined"){remark="";}
			var inputs = "";
			if(y=='end' && obj[y]>0){obj[y] = Acan.time("Y-m-d H:i:s",obj[y]);}
			var arr = {type:opt[y].type,"rel":x+"-"+y,"name":x+"-"+y,value:obj[y]};
			if(opt[y].disabled){
				arr.disabled=opt[y].disabled;
			}
			inputs = Ahtml.tag("input",arr)+remark;
			tmp += Ahtml.tag("tr",{},Ahtml.tag("td",{'class':'_t'},opt[y].name+":")+Ahtml.tag("td",{},inputs));
		};
		html += Ahtml.tag("table",{"class":"-table setting setid_"+x},tmp);
	}else{
		for (var x in Asetopt[name]) {
			tmp = Ahtml.tag("tr",{},Ahtml.tag("th",{'colspan':2},"["+x+"]设置"));
			var opt = Asetopt[name][x];
			tmp += Anmp.config.html2(x,opt,obj);
			html += Ahtml.tag("table",{"class":"-table setting setid_"+x},tmp);
		};
		if(name=='Anmp'){
			tmp = Ahtml.tag("tr",{},Ahtml.tag("th",{'colspan':2},"[进程池]设置"+
				Ahtml.tag('input',{'type':'button',onclick:"Anmp.config.pooladd()",value:'添加'})
			));
			for (var y in obj.pool) {
				tmp += Anmp.config.pooladd(y,obj.pool[y]);
			};
			html += Ahtml.tag("table",{"class":"-table setting setid_pool"},tmp);
		}
	}
	html = html+Ahtml.tag("input",{type:"submit",value:"保存"});
	html = Ahtml.tag("form",{"class":"_set_"+name,onsubmit:"Anmp.config.save('"+name+"');return false;"},html);
	Anmp.win_show("设置:"+Asetoptlang[name],html,css,'config_view');
}
Anmp.config.html2 = function(x,opt,obj){
	var html = '';
	for (var y in opt) {
		var remark = opt[y].remark;if(typeof(remark)=="undefined"){remark="";}
		var inputs = "";
		switch (opt[y].type){
			case "select":
				inputs = Ahtml.select({"rel":x+"-"+y,"name":x+"-"+y},opt[y].opt,obj[x][y])+remark;
				break;
			case "radio":
				inputs = Ahtml.radio({"rel":x+"-"+y,"name":x+"-"+y},opt[y].opt,obj[x][y])+remark;
				break;
			default:
				inputs = Ahtml.tag("input",{type:opt[y].type,"rel":x+"-"+y,"name":x+"-"+y,value:obj[x][y]})+remark;
				break;
		}
		html += Ahtml.tag("tr",{},Ahtml.tag("td",{'class':'_t'},opt[y].name+":")+Ahtml.tag("td",{},inputs));
	};
	return html;
}
Anmp.config.pooldel = function(name){
	jQuery('.setid_pool #'+name).remove();
}
Anmp.config.pooladd = function(y,val){
	var inputs = "",prr='4,';
if(!y){var id = jQuery('.setid_pool tr:last').attr('id');y = 'p_'+(parseInt(id.split('_')[1])+1);}
	if(val){prr = val.split(',');}
	inputs = Ahtml.tag("input",{type:'number',name:'pool-[][0]',value:prr[0],size:4});
	inputs += Ahtml.select({name:'pool-[][1]'},version.php,prr[1]);
	inputs += Ahtml.tag('input',{'type':'button',onclick:"Anmp.config.pooldel('"+y+"')",value:'删除'});
	var html = Ahtml.tag("tr",{'id':y},Ahtml.tag("td",{'class':'_t'},y+":")+Ahtml.tag("td",{},inputs));
	if(!val){
		jQuery('.setid_pool').append(html);
	}else{
		return html;
	}
}
Anmp.config.save = function(name){
	var arr = jQuery('._set_'+name).serializeArray();
	var obj = {},pi=1;
	for(var i in arr){
		var xrr = arr[i].name.split('-');
		if(xrr[0]=='pool'){
			if(xrr[1]=='[][0]'){xrr[1] = 'p_'+pi;}else if(xrr[1]=='[][1]'){xrr[1] = 'p_'+pi;pi++;}
		}
		if(!obj[xrr[0]]) obj[xrr[0]] = {};
		if(!obj[xrr[0]][xrr[1]]) obj[xrr[0]][xrr[1]] = arr[i].value;
		else obj[xrr[0]][xrr[1]] += ','+arr[i].value;
	}
	console.log(obj);
	Anmp.config.send(name,obj);
}
Anmp.config.call = function(name,obj){
	if(typeof(obj) == 'object'){
		if(name=='init'){
			Acan.alert(obj.msg,1000);
		}else{
			Anmp.config.html(name,obj);
		}
	}else{
		if(name=='about'){
			Anmp.win_show("关于Anmp",obj,{width:"300px",height:"300px"});
		}else{
			Acan.alert(obj,1000);
		}
	}
}
//--登入主机
Anmp.login = function(){
	var html="";
	for (var x in logindata) {
		logindata[x].name = x;
		html += Ahtml.tag("dt",{},logindata[x].title+":")+Ahtml.tag("dd",{},Ahtml.tag("input",logindata[x]));
	};
	html = Ahtml.tag("dl",{"class":"-dl login"},html);
	html += Ahtml.tag("input",{"type":"submit","value":"登入"});
//	html += "<p class='-left'>登入日志：</p>"+Ahtml.tag("div",{"id":"log","class":"_login_log"});
	html = Ahtml.tag("form",{onsubmit:"Anmp.login_on();return false;"},html);
	this.win_show("Anmp 控制台登入",html,{width:"240px",height:"200px"});
	Acan.ajax_bg();
}
Anmp.login_on = function(){
	userdata = Object();
	for (var x in logindata) {
		userdata[x] = jQuery('#ajax_anmp input[name="'+x+'"]').val();
	};
	host = userdata.host;
	port = userdata.port;
	socket();
	if(userdata.username==""){Acan.alert("请输入用户名",1000);jQuery("#ajax_anmp .username").focus();return;}
	if(userdata.password==""){Acan.alert("请输入密码",1000);jQuery("#ajax_anmp .password").focus();return;}
	//this.opensocket(userdata);
	Asocket.emit('auth',userdata);
}
Anmp.login_send = function(){
	this.log("开始登入...");
	Adata.app = "anmp";
	Adata.mod = "login";
	Adata.username = userdata.username;
	Adata.data = userdata.password;
	this.send(Adata);
}
Anmp.logout = function(){
	jQuery(".-body").html("");
	this.closesocket();
	this.login();
}
Anmp.ready = function(){
	var html='<h3 class="-center">Anmp 控制台</h3>'
			+'<p class="_hostinfo"></p>'
			+'<div id="setting" class="setting"></div>'
			+'<div id="control" class="control"></div>'
			+'<div class="_info">'
			+'<div id="log" class="log"></div>'
			+'<div class="system"><dl class="-dl">'
			+'<dt>CPU</dt><dd><div class="_cpu"><span></span><div class="_cpua"></div></div></dd>'
			+'<dt>内存</dt><dd><div class="_img"><span></span><div class="_avail"></div></div></dd><dt>总内存</dt><dd class="_memtotal"></dd><dt>可用内存</dt><dd class="_memfree"></dd><br>'
			+'<dt>网卡</dt><dd class="_card"></dd><dt>上传速度</dt><dd class="_up"></dd><dt>下载速度</dt><dd class="_dn"></dd><dt>上传总量</dt><dd class="_ups"></dd><dt>下载总量</dt><dd class="_dns"></dd>'
			+'<dt>连接状态</dt><dd id="status_conn"/></dd>'
			+'<dt>检测状态</dt><dd id="status_check"/></dd>'
			+'</dl></div>'
			+'<div id="link" class="link"></div>'
			+'<div class="copyright">Copyright ©2012 abans@qq.com  QQ群:49642170</div>'
			+'</div>'
	jQuery(".-body").html(html);
	//--设置
	var html="设置:";
	for(x in Asetopt){
		if(Asetoptlang[x])
			html += Ahtml.tag("button",{onclick:"Anmp.setting('"+x+"')"},Asetoptlang[x]);
	}
	jQuery("#setting").html(html);
	//--控制台
	var html="",tag;
	for(x in conrr){
		if(x=="nav") tag='th';
		else tag='td';
		html += Ahtml.tag("tr",{},Ahtml.tag(tag,{},conrr[x])+Ahtml.tag(tag,{},this.con_btn(x)));
	}
	jQuery("#control").html(Ahtml.tag('table',{'class':'-table'},html));
	//--快捷链接
	html="<b>链接</b>";
	var href;
	for (x in Alink) {
		if(Alink[x].type==1){
			href = "http://"+host+Alink[x].url;
		}else if(Alink[x].type==2){
			href = "http://"+Alink[x].url;
		}else if(Alink[x].type==3){
			href = Alink[x].url;
		}
		html += Ahtml.tag("p",{},Ahtml.tag("a",{"href":href,"target":Alink[x].target},Alink[x].name));
	};
	jQuery("#link").html(html);
}
Anmp.con_btn = function(act){
	var html="";
	var cons;
	if(act!="all" && act!="nav"){
		html += Ahtml.tag("span",{"class":"_"+act},"停止")+" ";
		html += Ahtml.tag("b",{"class":"_memw_"+act},"0")+" ";
		html += Ahtml.tag("b",{"class":"_memp_"+act},"0")+" ";
	}else if(act=="nav"){
		html += Ahtml.tag("b",{"class":"_"+act},"状态")+" ";
		html += Ahtml.tag("b",{"class":"_memw_"+act},"物理内存")+" ";
		html += Ahtml.tag("b",{"class":"_memp_"+act},"虚拟内存")+" ";
		html += Ahtml.tag("b",{"class":"_con_"+act},"控制")+" ";
		return html;
	}
	cons = conbtn[act];
	for(x in cons){
		html += Ahtml.tag("button",{onclick:"Anmp.control('"+x+"','"+act+"')"},cons[x])+" ";
	}
	return html;
}
Anmp.control = function(con,name){
	Asocket.emit('control',con,name);
	return;
	Adata.app = "anmp";//掉哪个应用
	Adata.mod = "control";//掉哪个模块
	Adata.act = act;//掉哪个动作
	Adata.data = con;//执行内容
	this.send(Adata);
}
Anmp.send = function(data){
	if(!this.checksocket()){return;}
	var jdata = Acan.base.obj_json(data);
	try{websocket.send(jdata);} catch(ex){this.log("发送错误"+ex);}
}
Anmp.log = function(str){
	var log = jQuery("#log");
	log.html(str+"<br>"+log.html());
}
Anmp.checksocket = function(){
	return;
	if(!websocket){
		Acan.alert("未连接到主机!请先连接",1000);
		return false;
	}
	return true;
}
Anmp.opensocket = function(obj){
	var i=0;
	this.log("开始连接");
	if(obj.host){
		host = obj.host;
		port = obj.port;
		whost = "ws://"+host+":"+port;
	}else{
		var whost = "ws://127.0.0.1:8900/";
	}
	try{
		this.log("初始化连接");
		websocket = new WebSocket(whost,'anmp');
		this.log("打开连接");
		websocket.onopen = function(evt) { Anmp.onOpen(evt) };
		websocket.onclose = function(evt) { Anmp.onClose(evt) };
		websocket.onmessage = function(evt) { Anmp.onMessage(evt) };
		websocket.onerror = function(evt) { Anmp.onError(evt) };
	}catch(ex){
		this.log("连接出错"+ex);
	}
	check_id = setInterval(function() {
		if(websocket.readyState==1){
			Anmp.check_status("all");
			jQuery("#status_check").text("实时检测中");
		}
		if(websocket.readyState==3){clearInterval(check_id);jQuery("#status_check").text("暂停检测");}
		i++;
	},1000);
	status_id = setInterval(function() {
		Anmp.status(readyState[websocket.readyState]+":"+i);
		if(websocket.readyState==3){clearInterval(status_id);Anmp.status("连接失败");}
		if(i>=8){i=0;}else{i++;}
	},100);
	jQuery("#msg").focus();
}
Anmp.closesocket = function(){
	Asocket.emit('logout');
	return;
}
Anmp.status = function(msg){
	jQuery("#status_conn").text(msg);
}
Anmp.check_status = function(act){
	Adata.app = "anmp";
	Adata.mod = "check";
	Adata.act = act;
	this.send(Adata);
}
var Cold = {};
Anmp.sysinfo = function(obj){
	if(obj.info){
		var info = obj.info;
		var html = '主机名称:'+info.hostname+' 操作系统:'+info.type+' '+info.release+' 构架:'+info.platform+' '+info.arch;
		jQuery('#asysinfo').html(html);
	}
	if(obj.cpus){
		var Cnow = obj.cpus;
		if(Cold){
			var cpus = {};
			var cnum = 0;
			var cload = 0;
			for(var i in Cold){
				cpus[i] = 100 - (Cnow[i].times.idle - Cold[i].times.idle)*100/(this.cpuadd(Cnow[i].times) - this.cpuadd(Cold[i].times));
				cload += cpus[i];cnum++;
			}
			Cold = obj.cpus;
			var load =  Math.round(cload*10/cnum)/10;
		}
		jQuery(".system ._cpua").css("width",load+"%");
		jQuery(".system ._cpu span").text(load+"%");
	}
	if(obj.memory){
		arr = obj.memory;
		var total = Math.round(arr.total/(1024*1024));
		var percent = Math.round((arr.total-arr.free)*100/arr.total);
		jQuery(".system ._memtotal").text(Math.round(arr.total/(1024*1024))+"MB");
		jQuery(".system ._memfree").text(Math.round(arr.free/(1024*1024))+"MB");
		jQuery(".system ._avail").css("width",percent+"%");
		jQuery(".system ._img span").text(percent+"%");
	}
	if(obj.plist){
		var memw = 0;
		for(var i in obj.plist['nginx.exe']){memw += obj.plist['nginx.exe'][i].mem;}
		jQuery("._memw_nginx").text(Math.round(memw/1024)+'MB');memw = 0;
		for(var i in obj.plist['php-cgi.exe']){memw += obj.plist['php-cgi.exe'][i].mem;}
		jQuery("._memw_php").text(Math.round(memw/1024)+'MB');memw = 0;
		for(var i in obj.plist['memcached.exe']){memw += obj.plist['memcached.exe'][i].mem;}
		jQuery("._memw_memcache").text(Math.round(memw/1024)+'MB');memw = 0;
		for(var i in obj.plist['mysqld.exe']){memw += obj.plist['mysqld.exe'][i].mem;}
		jQuery("._memw_mysql").text(Math.round(memw/1024)+'MB');
	}
	if(obj.netstat){
		net = obj.netstat
		Anetstat = Object();Anetcard = Object();
		i=0;
		for(var x in net){
			if(net[x][0]+net[x][1]+net[x][2]+net[x][3] == 0){continue;}
			Anetcard[i] = x;
			Anetstat[x] = {"sent":net[x][0],"recv":net[x][1]};
			i++;
		}
		card = jQuery(".system ._card select").val()
		if(typeof(card)=="undefined"){card=Anetcard[0];}else{card=Anetcard[card];}
		if(typeof(Anetstato)!="undefined"){
			var date = new Date()
			if(Anetstat[card].sent-Anetstato[card].sent > 0){
				Anettime = date.getTime()//记住新时间
				netup = Math.round((Anetstat[card].sent-Anetstato[card].sent)/0.1024/(Anettime-Anettimeo))/10
				netdn = Math.round((Anetstat[card].recv-Anetstato[card].recv)/0.1024/(Anettime-Anettimeo))/10
				Anettimeo = date.getTime()//记住旧时间
			}
			if(typeof(netup)!="undefined"){
				jQuery(".system ._up").text(netup+"kb/s");
				jQuery(".system ._dn").text(netdn+"kb/s");
			}
		}
		jQuery(".system ._ups").text(Math.round(Anetstat[card].sent/(1024*102.4))/10+"mb");
		jQuery(".system ._dns").text(Math.round(Anetstat[card].recv/(1024*102.4))/10+"mb");
		if(jQuery(".system ._card").html()==""){
			jQuery(".system ._card").html(Ahtml.select({"class":"_card"},Anetcard));
		}
		Anetstato = Anetstat
	}
}
Anmp.cpuadd = function(obj){
	return obj.user+obj.nice+obj.sys+obj.idle+obj.irq;
}
Anmp.set_status = function(obj,status){
	for(var i in obj){
		var jbj = jQuery(".control ._"+i);
		jbj.text(Asignal[obj[i]].msg);
		jbj.css("background",Asignal[obj[i]].color);
	}
	return;
}
Anmp.set_memory = function(act,arr){
	if(act=='deamon'){return}
	if(typeof(arr)!="object"){return}
	var msg;
	//if(status!=4){status=2;}
	var obj = jQuery(".control ._memw_"+act);
	msg = Math.round(arr.work/(1024*1024)*10)/10+"mb"
	obj.text(msg);
	var obj = jQuery(".control ._memp_"+act);
	msg = Math.round(arr.page/(1024*1024)*10)/10+"mb"
	obj.text(msg);
}
Anmp.setting = function(act){
	if(act=='help'){
		Acan.url.open('http://bbs.nice9s.com/forum-39-1.html','Anmp_v4');
		return;
	}
	Anmp.config.view(act);return;
	Adata.app = "anmp";
	Adata.mod = "setting";
	Adata.act = act;
	Adata.data = "getdata";
	this.send(Adata);
}
Anmp.setting_save = function(act){
	Adata.app = "anmp";
	Adata.mod = "setting";
	Adata.act = act;
	if(Acan.base.in_array(Adata.act,['user'])){
		for (var x in Asetdata) {
			var ai=0,strs="";
			for (var y in Asetdata[x]) {
				if(Asetopt[act][y].type == "radio"){
					var getval = jQuery('#ajax_anmp [name="'+x+'-'+y+'"]:checked').val();
				}else{
					var getval = jQuery('#ajax_anmp [rel="'+x+'-'+y+'"]').val();
				}
				if(typeof(getval)!="undefined"){//存在
					Asetdata[x][y] = getval;
				}
			}
		};
		Adata.data = Asetdata;
	}
	if(Acan.base.in_array(Adata.act,['Anmp','php','mysql'])){
		var str = "";
		for (var x in Asetdata) {
			var ai=0,strs="";
			for (var y in Asetdata[x]) {
				if(Asetopt[act][x][y].type == "radio"){
					var getval = jQuery('#ajax_anmp [name="'+x+'-'+y+'"]:checked').val();
				}else{
					var getval = jQuery('#ajax_anmp [rel="'+x+'-'+y+'"]').val();
				}
				if(typeof(getval)!="undefined"){//存在
					Asetdata[x][y] = getval;
				}
			};
		};
		Adata.data = Asetdata;
	}
	this.send(Adata);
	return;
}
Anmp.setting_add = function(act){
	addnew = Object()
	for (var x in Asetdata) {
		for (var y in Asetdata[x]) {
			addnew[y] = ""
		}
	};
	x = parseInt(x)+1
	Asetdata[x] = addnew
	switch (act){
		case "user":
			html = Ahtml.tag("p",{},"用户["+(x+1)+"]");
			for (var y in Asetopt[act]){
				//var remark = Asetopt[obj.act][y].remark;
				if(typeof(remark)=="undefined"){remark="";}
				var inputs = "";
				switch (Asetopt[act][y].type){
					case "select":
						inputs = Ahtml.select({"rel":x+"-"+y},Asetopt[act][y].opt)+remark;
						break;
					case "radio":
						inputs = Ahtml.radio({"rel":x+"-"+y,"name":x+"-"+y},Asetopt[act][y].opt)+remark;
						break;
					default:
						inputs = Ahtml.tag("input",{type:Asetopt[act][y].type,"rel":x+"-"+y})+remark;
						break;
				}
				html += Ahtml.tag("dt",{},Asetopt[act][y].name+":")+Ahtml.tag("dd",{},inputs);
			}
			html = Ahtml.tag("dl",{"class":"-dl setting setid_"+x},html);
			jQuery("._set_"+act+" .setid_"+(x-1)).after(html)
			break;
	}
}
Anmp.setting_call = function(obj){
	var AsetSesult = {"1":"保存成功","2":"保存失败"};
	var html="",tmp;
	if(obj.act == 'user'){
		if(obj.data=="result"){
			Acan.alert(AsetSesult[obj.status],1000);
			return;
		}
		if(typeof(obj.data)=="object"){
			Asetdata = obj.data;
		}else{return;}
		for (var x in Asetdata) {
			html += Ahtml.tag("p",{},"用户["+(parseInt(x)+1)+"]");
			tmp = "";
			for (var y in Asetdata[x]){
				//var remark = Asetopt[obj.act][y].remark;
				if(typeof(remark)=="undefined"){remark="";}
				var inputs = "";
				switch (Asetopt[obj.act][y].type){
					case "select":
						inputs = Ahtml.select({"rel":x+"-"+y},Asetopt[obj.act][y].opt,Asetdata[x][y])+remark;
						break;
					case "radio":
						inputs = Ahtml.radio({"rel":x+"-"+y,"name":x+"-"+y},Asetopt[obj.act][y].opt,Asetdata[x][y])+remark;
						break;
					default:
						inputs = Ahtml.tag("input",{type:Asetopt[obj.act][y].type,"rel":x+"-"+y,value:Asetdata[x][y]})+remark;
						break;
				}
				tmp += Ahtml.tag("dt",{},Asetopt[obj.act][y].name+":")+Ahtml.tag("dd",{},inputs);
			}
			html += Ahtml.tag("dl",{"class":"-dl setting setid_"+x},tmp);
		};
		html += Ahtml.tag("input",{type:"button",onclick:"Anmp.setting_add('"+obj.act+"')",value:"添加"});
	}else if(Acan.base.in_array(obj.act,['Anmp','php','mysql'])){
		if(obj.data=="result"){
			Acan.alert(AsetSesult[obj.status],1000);
			return;
		}
		if(typeof(obj.data)=="object"){
			Asetdata = obj.data;
		}else{
			Asetdata = Acan.base.json_obj(obj.data);
		}
		for (var x in Asetdata) {
			html += Ahtml.tag("p",{},"["+x+"]设置");
			tmp = "";
			for (var y in Asetdata[x]) {
				var remark = Asetopt[obj.act][x][y].remark;if(typeof(remark)=="undefined"){remark="";}
				var inputs = "";
				switch (Asetopt[obj.act][x][y].type){
					case "select":
						inputs = Ahtml.select({"rel":x+"-"+y},Asetopt[obj.act][x][y].opt,Asetdata[x][y])+remark;
						break;
					case "radio":
						inputs = Ahtml.radio({"rel":x+"-"+y,"name":x+"-"+y},Asetopt[obj.act][x][y].opt,Asetdata[x][y])+remark;
						break;
					default:
						inputs = Ahtml.tag("input",{type:Asetopt[obj.act][x][y].type,"rel":x+"-"+y,value:Asetdata[x][y]})+remark;
						break;
				}
				tmp += Ahtml.tag("dt",{},Asetopt[obj.act][x][y].name+":")+Ahtml.tag("dd",{},inputs);
			};
			html += Ahtml.tag("dl",{"class":"-dl setting setid_"+x},tmp);
		};
	}
		html += Ahtml.tag("input",{type:"submit",value:"保存"});
	html = Ahtml.tag("form",{"class":"_set_"+obj.act,onsubmit:"Anmp.setting_save('"+obj.act+"');return false;"},html);
	this.win_show("设置:"+Asetoptlang[obj.act],html,{width:"400px",height:"360px"});
}

Anmp.win_show = function(title,html,css,id){
	var obj=Object();
	if(!id) id = 'ajax_anmp';
	obj.id=id;
	obj["class"]='acan_win dis_none';
	if(css){
		if(!css.height) css.height='150px';
		obj.css=css;
	}else{
		obj.css={height:'150px'};
	}
	obj._close={onclick:'Acan.close(\''+obj.id+'\')','class':'-close'};//关闭按钮
	Acan.base.win(obj,title,html);
	//Acan.ajax_bg();
}

function send(){
	if(!checksocket()){return;}
	var txt,msg;
	txt = jQuery("#msg");
	msg = txt.val();
	if(!msg){ Acan.alert("内容不能为空",1000); return; }
	txt.value="";
	txt.focus();
	Adata.app = "anmp";//掉哪个应用
	Adata.mod = "control";//掉哪个模块
	Adata.act = "nginx";//掉哪个动作
	Adata.data = "start";//执行内容
	var jdata = Acan.base.obj_json(Adata);
	try{ this.log("发送消息:"+jdata);websocket.send(jdata); } catch(ex){ this.log("发送错误");this.log(ex); }
}

jQuery(document).ready(function(){
	Anmp.login();
});
window.onbeforeunload=function(){
	Anmp.closesocket();
};
