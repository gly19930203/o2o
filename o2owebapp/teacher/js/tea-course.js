mui.ready(function(){
	getAPIasync("/Teacher/GetTeacherCourseList","id="+teacherId,"get",function(data){
		var content = document.getElementById("content");
		if(data && data.length>0){
			for (var i = 0;i<data.length; i++) {
				var li = document.createElement('li');
				li.className = 'bg-white';
				li.id = data[i].f_id;
				li.addEventListener("tap",function(e){
					window.location.href = "../course/course.html?pCourseId="+e.currentTarget.id;
				});
				var divimg = document.createElement("div");
				divimg.className = 'img';
				divimg.innerHTML = '<img src='+IMG_HOST + data[i].f_icon+'>'
				
				var detail = document.createElement("div");
				detail.className = "detail";
				var div1 = document.createElement("div");
				div1.innerHTML = '<p class="title">'+data[i].f_name+'</p>'+
				'<p class="miaoshu ellipsis">'+data[i].f_outline+'</p>';
				var div2 = document.createElement("div");
				var span1 = document.createElement("span");
				span1.className = "orange-circle";
				span1.setAttribute("align","center");
				span1.innerHTML = '<i class="iconfont icon-wodejiage"></i>';
				var span2 = document.createElement("span");
				span2.className = "brown number";
				span2.innerHTML = data[i].f_price+'￥';
				var span3 = document.createElement("span");
				span3.className = "border";
				var span4 = document.createElement("span");
				span4.className = "orange-circle";
				span4.setAttribute("align","center");
				span4.innerHTML = '<i class="iconfont icon-icon"></i>';
				var span5 = document.createElement("span");
				span5.className = "brown number";
				span5.innerHTML = data[i].f_follownumber;
				
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
				content.appendChild(li);
			}
		}
	});	
});

