mui.init();
var data;
var dates = new Date();
mui.ready(function(){//页面进来初始化当前日期、加载课程
	var w=window.screen.width;
	getAPIasync("/User/GetUserOrderFightCourseList",null,"get",function(reply){
		if(reply){
			data = reply;
			LoadData(dates);
			$('#ca').calendar({
				data:reply,
			    onSelected: function (view, date, data) {
			    	document.getElementById("contentlist").innerHTML = "";
			        LoadData(date);
			    }
			});
			
		}
	});
});

function LoadData(dates){
	var datetime = dates.pattern("yyyy-MM-dd");
	var contentlist = document.getElementById("contentlist");
	for(var i in data){
	//所选时间
		if(data[i].date == datetime) {
		var li = document.createElement("li");
			li.className = "list";
			var top = document.createElement("div");
			top.className = "top";
			var imgcontent = document.createElement("div");
			imgcontent.className = "imgcontent";
			var img = document.createElement("div");
			img.className = "img";
			img.innerHTML = '<img src='+IMG_HOST+ data[i].courseioce+'>';
			var detail = document.createElement("div");
			detail.className = "detail";
			var p1 = document.createElement("p");
			p1.className = "title";
			p1.innerHTML = data[i].coursename;
			var p2 = document.createElement("p");
			p2.className = "time";
			p2.innerHTML = data[i].date;
			var p3 = document.createElement("p");
			p3.className = "miaoshu ellipsis";
			p3.innerHTML = data[i].courseoutline;
			var p4 = document.createElement("p");
			p4.className = "school";
			p4.innerHTML = '<span class="iconfont icon-didian orange"></span>&nbsp<span>'+data[i].f_name+'</span>';
			
			detail.appendChild(p1);
			detail.appendChild(p2);
			detail.appendChild(p3);
			detail.appendChild(p4);
			imgcontent.appendChild(img);
			imgcontent.appendChild(detail);
			top.appendChild(imgcontent);
			
			var status = document.createElement("div");
			status.className = "payment";
			var p5 = document.createElement("p");
			var p6 = document.createElement("p");
			p6.className = "right";
			if(data[i].status){
				p5.innerHTML = "已结课";
				if(data[i].evaluatenum == 0){
					p6.innerHTML = '<span class="brown">评价</span>';
					p6.name = data[i].f_id;
					p6.id = data[i].f_teacherId;
					p6.addEventListener("tap",function(e){
						window.location.href = "evaluate.html?pCourseId="+e.currentTarget.name+"&pTeacherId="+e.currentTarget.id;
					});
				}else{
					p6.innerHTML = '<span class="brown">已评价</span>';
				}
			}else{
				p5.innerHTML = "未结课";
//				p6.innerHTML = '<span>评价详情</span>';
			}
			
			status.appendChild(p5);
			status.appendChild(p6);
			
			
			li.appendChild(top);
			li.appendChild(status);
			contentlist.appendChild(li);
		}
	}
}
