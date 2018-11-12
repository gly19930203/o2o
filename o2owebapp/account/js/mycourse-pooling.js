mui.init();

mui.ready(function(){
	getAPIasync("/User/GetUserFightCourseList",null,"get",function(data){
		if(data){
			var list = document.getElementById("list");
			for(var i in data){
				var li = document.createElement("li");
				li.className = "list";
				var top = document.createElement("div");
				top.className = "top";
				top.name = data[i].f_id;
				top.addEventListener("tap",function(e){
					window.location.href = "../spelling/spelldetail.html?pId="+e.currentTarget.name;
				});
				var imgcontent = document.createElement("div");
				imgcontent.className = "imgcontent";
				var div1 = document.createElement("div");
				div1.className = "img";
				div1.innerHTML = '<img src="'+IMG_HOST+data[i].courseioce+'"></div>';
				var div2 = document.createElement("div");
				div2.className = "detail";
				div2.innerHTML = '<p class="title">'+data[i].coursename+'</p>'+
				'<p class="time">'+data[i].f_create_time.substring(0,10)+'</p>'+
				'<p class="miaoshu">'+data[i].courseoutline+'</p>';
				var div3 = document.createElement("div");
				div3.className = "number";
				var canvas = document.createElement("canvas");
				canvas.id = "canvas"+data[i].f_id;
				var pp = document.createElement("p");
				pp.innerHTML = '<span>成拼'+data[i].f_minpeople+'人</span><span>最多'+data[i].f_maxpeople+'人</span>';
				
				imgcontent.appendChild(div1);
				imgcontent.appendChild(div2);
				div3.appendChild(canvas);
				div3.appendChild(pp);
				imgcontent.appendChild(div3);
				top.appendChild(imgcontent);
				
				var bottom = document.createElement("div");
				bottom.className = "bottom";
				var p1 = document.createElement("p");
				p1.className = "time";
				p1.innerHTML = '<span class="iconfont icon-yanchurili orange"></span>'+
				'<span>'+data[i].f_classdate.substring(0,16)+'</span>';
				var p2 = document.createElement("p");
				p2.className = "school";
				p2.innerHTML = '<span class="iconfont icon-didian orange"></span>'+
				'<span>'+data[i].classaddress.f_name+'</span>';
				var p3 = document.createElement("p");
				p3.className = "over";
				p3.innerHTML = '<span>还剩<span class="orange">'+data[i].numday+'</span>天</span>';
				
				bottom.appendChild(p1);
				bottom.appendChild(p2);
				bottom.appendChild(p3);
				
				var invitation = document.createElement("div");
				invitation.className = "invitation brown";
				invitation.innerHTML = '<span class="iconfont icon-smile"></span><span>邀请朋友</span>';
				
				li.appendChild(top);
				li.appendChild(bottom);
				li.appendChild(invitation);
				list.appendChild(li);
				
				
				
				//环形进度条
				var pro = data[i].f_fightpeople/data[i].f_minpeople*100;
				var p1 = new Progress({
				    el:"canvas"+data[i].f_id,//canvas元素id
				    deg:pro,//绘制角度
				    timer:1,//绘制时间
				//	    lineWidth:5,//线宽
				    lineBgColor:'rgb(233,186,134)',//底圆颜色
				    lineColor:'rgb(255,30,82)',//动态圆颜色
				    textColor:'rgb(255,30,82)',//文本颜色
				//	    fontSize:16,//字体大小
				    circleRadius:50,//圆半径
	    			numbers:data[i].f_fightpeople
				});
			}
		}
	});
});