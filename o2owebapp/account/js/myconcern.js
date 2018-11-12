mui.init({
	pullRefresh: {
		container: '#pullrefresh',
		down: {
			callback: pulldownRefresh
		},
		up: {
			contentrefresh: '正在加载...',
			callback: pullupRefresh
		}
	}
});

var info = {
	PageSize:10,
	PageIndex:1,
	Order:"f_create_time desc",
	ConditionJson:{
		f_userId:null
	}
}

mui.ready(function(){
	GetList();
});

//加载课程数据列表
function GetList(){
	getAPIasync("/User/GetUserFollowList",JSON.stringify(info),"post",function(data){
		if(data){
			var content = document.getElementById("content");
			content.innerHTML = "";
			for (var i = 0;i<data.length; i++) {
				if(data[i].type == "课程"){
					content.appendChild(LoadCourseData(data[i]));
				}else{
					content.appendChild(LoadTeacherData(data[i]));
				}
			}
		}
	});
}

/* 下拉刷新具体业务实现*/
function pulldownRefresh() {
	info.PageIndex = 1;
	setTimeout(function(){
		getAPIasync("/User/GetUserFollowList",JSON.stringify(info),"post",function(data){
			if(data){
				var content = document.getElementById("content");
				content.innerHTML = "";
				for (var i = 0;i<data.length; i++) {
					if(data[i].type == "课程"){
						content.appendChild(LoadCourseData(data[i]));
					}else{
						content.appendChild(LoadTeacherData(data[i]));
					}
				}
				mui('#pullrefresh').pullRefresh().endPulldownToRefresh(); //refresh completed
				mui('#pullrefresh').pullRefresh().refresh(true);
			}
		});
	},500);
}

/*上拉加载具体业务实现*/
function pullupRefresh() {
	info.PageIndex++;
	setTimeout(function(){
		getAPIasync("/User/GetUserFollowList",JSON.stringify(info),"post",function(data){
			if(data){
				mui('#pullrefresh').pullRefresh().endPullupToRefresh(data.length == 0);
				var content = document.getElementById("content");
				for (var i = 0;i<data.length; i++) {
					if(data[i].type == "课程"){
						content.appendChild(LoadCourseData(data[i]));
					}else{
						content.appendChild(LoadTeacherData(data[i]));
					}
				}
			}
		});
	},500);
}


function LoadCourseData(data){
	var li = document.createElement('li');
	li.className = 'bg-white imgcontent';
	li.addEventListener("tap",function(){
		window.location.href = "../course/course.html?pCourseId="+data.courseid;
	});
	var divimg = document.createElement("div");
	divimg.className = 'img';
	divimg.innerHTML = '<div class="label"><p><span>课程</p></div>'+
	'<img src='+IMG_HOST + data.courseinon+'>'
	
	var detail = document.createElement("div");
	detail.className = "detail";
	var div1 = document.createElement("div");
	div1.innerHTML = '<p class="title">'+data.coursename+'</p>'+
	'<p class="miaoshu ellipsis">'+data.courseoutline+'</p>';
	var div2 = document.createElement("div");
	var span1 = document.createElement("span");
	span1.className = "orange-circle";
	span1.setAttribute("align","center");
	span1.innerHTML = '<i class="iconfont icon-wodejiage"></i>';
	var span2 = document.createElement("span");
	span2.className = "brown number";
	span2.innerHTML = data.courseprice+'￥';
	var span3 = document.createElement("span");
	span3.className = "border";
	var span4 = document.createElement("span");
	span4.className = "orange-circle";
	span4.setAttribute("align","center");
	span4.innerHTML = '<i class="iconfont icon-icon"></i>';
	var span5 = document.createElement("span");
	span5.className = "brown number";
	span5.innerHTML = data.coursepopularity;
	
	var todetail = document.createElement("div");
	todetail.className = "todetail";
	todetail.setAttribute("align","center");
	todetail.innerHTML = '<span class="mui-icon-extra mui-icon-extra-arrowrightcricle"></span>';
	
	
	li.appendChild(divimg);
	detail.appendChild(div1);
	div2.appendChild(span1);
	div2.appendChild(span2);
	div2.appendChild(span3);
	div2.appendChild(span4);
	div2.appendChild(span5);
	detail.appendChild(div2);
	li.appendChild(detail);
	li.appendChild(todetail);
	
	return li;
}

function LoadTeacherData(data){
	var li = document.createElement('li');
	li.className = "teacher";
	li.addEventListener("tap",function(){
		window.location.href = "../teacher/teacher.html?teacherId="+data.teacherid;
	});
	var img = document.createElement("div");
	img.className = "img";
    img.style.backgroundImage = "url(" + IMG_HOST+ data.teachericon+")";
    img.innerHTML = '<div class="label"><p><span>老师</p>\</div>';
	var detail = document.createElement("div");
	detail.className = "detail";
	var p1 = document.createElement("p");
	var name = document.createElement("span");
	name.className = "name";
    name.innerHTML = data.teachername;
	var sex = document.createElement("span");
    if (data.teachersex){
		sex.className = "iconfont icon-nan";
		sex.style.color = "rgb(135,174,204)";
	}else{
		sex.className = "iconfont icon-nv";
		sex.style.color = "rgb(235,140,140)";
	}
	var p2 = document.createElement("p");
	p2.className = "autograph ellipsis";
    p2.innerHTML = data.teacherintroduce;
	var p3 = document.createElement("p");
	p3.className = "concern";
	if(data.follownumber == 0){
		p3.innerHTML = data.follownumber+'人关注';
	}else{
    	p3.innerHTML = '@' + data.f_name + ' 等' + data.follownumber+'人关注了';
	}
	
	p1.appendChild(name);
	p1.appendChild(sex);
	detail.appendChild(p1);
	detail.appendChild(p2);
	detail.appendChild(p3);
	
	var todetail = document.createElement("div");
	todetail.className = "todetail";
	todetail.innerHTML = '<span class="mui-icon-extra mui-icon-extra-arrowrightcricle"></span>';
	
	li.appendChild(img);
	li.appendChild(detail);
	li.appendChild(todetail);
	return li;
}
