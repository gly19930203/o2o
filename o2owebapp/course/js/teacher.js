function LoadData2(data){
	var li = document.createElement('li');
	li.addEventListener("tap",function(){
		window.location.href = "../teacher/teacher.html?teacherId="+data.f_id;
	});
	var img = document.createElement("div");
	img.className = "img";
    img.style.backgroundImage = "url(" + IMG_HOST+ data.f_head_portrait+")";
	var detail = document.createElement("div");
	detail.className = "detail";
	var p1 = document.createElement("p");
	var name = document.createElement("span");
	name.className = "name";
    name.innerHTML = data.f_name;
	var sex = document.createElement("span");
    if (data.f_sex){
		sex.className = "iconfont icon-nan";
		sex.style.color = "rgb(135,174,204)";
	}else{
		sex.className = "iconfont icon-nv";
		sex.style.color = "rgb(235,140,140)";
	}
	var p2 = document.createElement("p");
	p2.className = "autograph ellipsis";
    p2.innerHTML = data.f_introduce;
	var p3 = document.createElement("p");
	p3.className = "concern";
	if(data.f_popularity == 0){
		p3.innerHTML = data.f_popularity+'人关注';
	}else{
    	p3.innerHTML = '@' + data.username + ' 等' + data.f_popularity+'人关注了';
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

	getAPIasync("/Course/GetCourseTeacher","pCourseId="+pCourseId,"get",function(event){
		var teacher = document.getElementById("teacher");
		if(event && event.length>0){
            for (var i = 0; i < event.length; i++) {
				teacher.appendChild(LoadData2(event[i]));
			}
		}
	});
			