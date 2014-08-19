var Asocket;
var Aglm = {speed:2,status:0};
Afpm = function(){}
Afpm.socket = function(){
	var url = "http://"+window.location.hostname+":8930/";
	Asocket = io.connect(url);
	Asocket.on('connect', function () {
		Asocket.on('status', function (obj,now) {
			Afpm.status.set(obj,now);
		});
		Asocket.on('message', function (msg) {
		});
		Asocket.on('error', function (msg) {
		});
		Asocket.on('disconnect', function (msg) {
		});
	});
}
//状态监控
Afpm.status = function(){
	Afpm.status.html();
	if(Aglm.status == 2){Aglm.status =0;}
	if(Aglm.status == 0) Afpm.status.poll();
}
Afpm.status.poll = function(){
	if(Aglm.status == 2){return;}
	Aglm.status = 1;
	Asocket.emit('status','1');
	setTimeout(function() {Afpm.status.poll();}, Aglm.speed*500);
}
Afpm.status.stop = function(){
	Asocket.emit('status','2');
	Aglm.status = 2;
}
Afpm.status.speed = function(obj){
	Aglm.speed = obj.value;
	jQuery('.Afpm_status ._bar .speed').text(Aglm.speed*0.5);
}
Afpm.status.set = function(obj,now){
	var jbj = jQuery(".Afpm_status ._list");
	var html = Ahtml.tag('tr',{},
		Ahtml.tag('td',{},'序号')+
		Ahtml.tag('td',{},'请求的地址')+
		Ahtml.tag('td',{},'php')+
		Ahtml.tag('td',{},'持续时间')+
		Ahtml.tag('td',{},'IP')
	);
	var port='/';
	var oi=1;
	if(Acan.count(obj)>0){
		for(var i in obj){
			if(!obj[i].host){continue;}
			if(obj[i].end==0){
				obj[i].end = now-obj[i].time;
			}
			if(obj[i].port!='80'){
				port = '/:'+obj[i].port;
			}
			html += Ahtml.tag('tr',{},
				Ahtml.tag('td',{},oi)+
				Ahtml.tag('td',{},obj[i].host+port+obj[i].req)+
				Ahtml.tag('td',{},obj[i].doc)+
				Ahtml.tag('td',{},obj[i].end+'ms')+
				Ahtml.tag('td',{},obj[i].addr+":"+obj[i].cport)
			)
			oi++;
		}
	}
	html = Ahtml.tag('table',{"class":"-table"},html);
	jbj.html(html);
}
Afpm.status.html = function(){
	var html = '';
	html = Ahtml.tag('div',{"class":"_bar"},'更新速度:'+Ahtml.tag('input',{'type':"range","onchange":"Afpm.status.speed(this)","max":10,"min":1,"value":Aglm.speed})+' '+Ahtml.tag('span',{"class":"speed"},Aglm.speed*0.5)+'秒')
		+Ahtml.tag('div',{"class":"_list"});
	html = Ahtml.tag('div',{"class":"Afpm_status"},html);
	Afpm.win_show("监控",html,{width:"600px",height:"360px"},'Afpm.status.stop()');
}

Afpm.win_show = function(title,html,css,closecall){
	var obj=Object();
	obj.id='Afpm';
	obj["class"]='acan_win dis_none';
	if(css){
		if(!css.height) css.height='150px';
		obj.css=css;
	}else{
		obj.css={height:'150px'};
	}
	obj._close={onclick:closecall+';Acan.close(\''+obj.id+'\')','class':'-close'};//关闭按钮
	Acan.base.win(obj,title,html);
}