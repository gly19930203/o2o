mui.init();
var evaluateinfo = {
	size:3,
	PageSize:3,
	PageIndex:1,
	Order:"f_create_time desc",
	ConditionJson:{
		f_teacherId:teacherId,
		f_evaluationtagId:[]
	}
}
mui.ready(function(){
	mui.previewImage();
	Pullrefresh();
	//标签下拉更多
	$(".arrowdown").click(function(){
	    if ($('.labels').hasClass('grade-w-roll')) {
	        $('.labels').removeClass('grade-w-roll');
	        $('.mui-icon-arrowup').addClass('mui-icon-arrowdown');
	        $('.mui-icon-arrowup').removeClass('mui-icon-arrowup');
	    }else {
	        $('.labels').addClass('grade-w-roll');
	        $('.mui-icon-arrowdown').addClass('mui-icon-arrowup');
	        $('.mui-icon-arrowdown').removeClass('mui-icon-arrowdown');
	    }
	});
	//获取平均分
	getAPIasync("/Teacher/GetEvaluationTagScoreTeacher","pTeacherId="+teacherId,"get",function(e){
		if(e){
			document.getElementById("score").innerHTML = parseInt(e*10)/10;
			var icons = document.getElementById("icons");
			for(var i=0;i<parseInt(e);i++){
				var icon = document.createElement("i");
				icon.setAttribute("data-index",i);
				icon.className = "iconfont icon-five-star orange";
				icons.appendChild(icon);
			}
			var left = e-parseInt(e);
			var j;
			if(left>0){
				var icon = document.createElement("i");
				icon.setAttribute("data-index",i);
				icon.className = "iconfont icon-bankexing orange";
				icons.appendChild(icon);
				j=i+1;
			}else{
				j=i
			}
			for(var j;j<5;j++){
				var icon = document.createElement("i");
				icon.setAttribute("data-index",j);
				icon.className = "iconfont icon-star orange";
				icons.appendChild(icon);
			}
			
		}
	});
	//获取标签
	getAPIasync("/Teacher/GetEvaluationTagEvaluateTeacher","pTeacherId="+teacherId,"get",function(e){
		if(e){
			var labels = document.getElementById("labels");
			for(var i=0;i<e.length;i++){
				var label = document.createElement("p");
				label.innerHTML = e[i].f_name + '<span>'+e[i].count+'</span>';
				label.id = e[i].f_id;
				label.addEventListener("tap",function(e){
					evaluateinfo.PageIndex = 1;
					evaluateinfo.ConditionJson.f_evaluationtagId = [];
					document.getElementById("comments").innerHTML = "";
					if(e.currentTarget.className == "label active"){
						e.currentTarget.className = "label";
					}else{
						e.currentTarget.className = "label active"
					}
					var tags = document.getElementsByClassName("label");
					for(var j=0;j<tags.length;j++){
						if(tags[j].className == "label active"){
							evaluateinfo.ConditionJson.f_evaluationtagId.push(tags[j].id);
						}
					}
					Pullrefresh();
				});
				labels.appendChild(label);
			}
		}
	});
});

function Pullrefresh(){
	require(['h5/pullrefresh3'], function(pullrefresh){
		pullrefresh.doRefresh({
			debug: false,		 // 模拟真实请求数据，否则会出现ajax跨域，正式使用中请去h5.js中删除debug代码
			url: API_HOST+'/Teacher/GetTeacherEvaluateList',  // 必填，ajax加载数据请求的地址
			data: evaluateinfo,   // 非必填，ajax请求数据的参数，如果启用了缓存，将影响浏览器的缓存数据
			dataType: "json",   // 非必填，ajax请求返回的数据类型
			container: '#comments', // 非必填，用于计算document.body.scrollTop等于多少时自动加载更多数据，如果填写尽量请使用数据盛放容器
			cache: false,	    // 非必填，如果不想让浏览器缓存请写false，否则请写唯一的标记，具体请观察sessionStorage
			success: function(list, page, size){ // ajax请求成功后服务端返回来的数据
				if(evaluateinfo.PageIndex != page ){
					return true;
				}
				if(list){
					var comments = document.getElementById("comments");
					for (var i = 0;i<list.length; i++) {
						comments.appendChild(LoadEvaluateData(list[i]));
					}
					evaluateinfo.PageIndex++;
				}
				return list.length >= evaluateinfo.PageSize;
				// 处理服务器返回的数据，绑定到页面
				
			}
		});
	});
}



function LoadEvaluateData(data){
	var li = document.createElement('li');
	var commentimg = document.createElement("div");
	commentimg.className = "commentimg";
	var currentImage = IMG_HOST +data.usericon ;
	if(data.usericon){
    	commentimg.style.backgroundImage ="url("+currentImage+")";
	}else{
    	commentimg.style.backgroundImage ="url(../image/head.png)";
	}
	var comments = document.createElement("div");
	comments.className = "comments";
	var customer = document.createElement("div");
	customer.className = "customer";
	var name = document.createElement("div");
	name.className = "name";
	if(data.f_anonymous == "匿名"){
		name.innerHTML = data.f_anonymous;
	}else{
		name.innerHTML = data.username;
	}
	var star = document.createElement("div");
	star.className = "star";
	var icons = document.createElement("p");
	icons.className = "icons mui-inline";
	for(var j=0;j<data.f_score;j++){
		var icon = document.createElement("i");
		icon.setAttribute("data-index",j);
		icon.className = "iconfont icon-five-star orange";
		icons.appendChild(icon);
	}
	for(var k=j;k<5;k++){
		var icon = document.createElement("i");
		icon.setAttribute("data-index",k);
		icon.className = "iconfont icon-star orange";
		icons.appendChild(icon);
	}
	var time = document.createElement("p");
	time.className = "time";
	time.innerHTML = data.f_create_time;
	
	
	customer.appendChild(name);
	star.appendChild(icons);
	star.appendChild(time);
	customer.appendChild(star);
	
	var words = document.createElement("div");
	words.className = "words";
	words.innerHTML = data.f_content;
	var imgs = document.createElement("div");
	imgs.className = "imgs";
	for(var j=0;j<data.photos.length;j++){
		var img = document.createElement("img");
		img.setAttribute("data-preview-src","");
		img.setAttribute("data-preview-group","1");
		img.src = IMG_HOST + data.photos[j].f_url;
		imgs.appendChild(img);
	}
	
	li.appendChild(commentimg);
	comments.appendChild(customer);
	comments.appendChild(words);
	comments.appendChild(imgs);
	li.appendChild(comments);
	return li;
}