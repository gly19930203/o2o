mui.init();
var pId = Request("pId");

mui.ready(function(){
	getAPIasync("/FightCourse/GetFightCourseEntity","pId="+pId,"get",function(data){
		if(data){
			//课程
			document.getElementById("spelling").src = IMG_HOST+ data.courseioce;
			document.getElementById("f_number").innerHTML = data.classaddress.length;
			document.getElementById("coursename").innerHTML = data.coursename;
			document.getElementById("courseoutline").innerHTML = data.courseoutline;
			document.getElementById("price").innerHTML = data.price;
			document.getElementById("coursepopu").innerHTML = data.coursepopu;
			
			//会员
			var currentImage = IMG_HOST +data.user.userhead ;
			if(data.user.userhead){
		    	document.getElementById("userhead").style.backgroundImage ="url("+currentImage+")";
			}else{
		    	document.getElementById("userhead").backgroundImage ="url(../image/head.png)";
			}
			document.getElementById("username").innerHTML = data.user.username;
			document.getElementById("f_create_time").innerHTML = data.f_create_time.substring(0,10);
			document.getElementById("usercontent").innerHTML = data.user.usercontent;
			document.getElementById("f_minpeople").innerHTML = data.f_minpeople;
			document.getElementById("f_maxpeople").innerHTML = data.f_maxpeople;
			
			//环形进度条
			var pro = data.f_fightpeople/data.f_minpeople*100;
			var p1 = new Progress({
			    el:'mycanvas',//canvas元素id
			    deg:pro,//绘制角度
			    timer:1,//绘制时间
			//	    lineWidth:5,//线宽
			    lineBgColor:'rgb(233,186,134)',//底圆颜色
			    lineColor:'rgb(255,30,82)',//动态圆颜色
			    textColor:'rgb(255,30,82)',//文本颜色
			//	    fontSize:16,//字体大小
			    circleRadius:50,//圆半径
			    numbers:data.f_fightpeople
			});
			
			if(data.classaddress){
				var courseinfolist = document.getElementById("courseinfolist");
				for(var i=0;i<data.classaddress.length;i++){
					var status = document.createElement("div");
					status.className = "status";
					var div1 = document.createElement("div");
					div1.className = "courseorder";
					div1.innerHTML = (i+1)+"讲";
					var div2 = document.createElement("div");
					div2.className = "coursedetail";
					var p1 = document.createElement("p");
					p1.className = "time";
					p1.innerHTML = '<span class="iconfont icon-yanchurili orange"></span><span>'+
					data.classaddress[i].f_classdate.substring(0,16)+'</span>';
					var p2 = document.createElement("p");
					p2.className = "school";
					p2.innerHTML = '<span class="iconfont icon-didian orange"></span><span>'+
					data.classaddress[i].classaddressname+'</span>';;
					
					
					status.appendChild(div1);
					div2.appendChild(p1);
					div2.appendChild(p2);
					status.appendChild(div2);
					courseinfolist.appendChild(status);
				}
			}
			if(data.users){
				var userlist = document.getElementById("userlist");
				for(var i=0;i<data.users.length;i++){
					var div = document.createElement("div");
					div.className = "headimg";
					//会员
					var currentImage2 = IMG_HOST +data.users[i].userhead ;
					if(data.users[i].userhead){
				    	div.style.backgroundImage ="url("+currentImage2+")";
					}else{
				    	div.style.backgroundImage ="url(../image/head.png)";
					}
					userlist.appendChild(div);
				}
			}
			document.getElementById("f_lessonnotes").innerHTML = data.f_lessonnotes;
			if(data.status > 0){
				document.getElementById("invitation").style.display = "block";
			}else{
				document.getElementById("more").style.display = "flex";
			}
		}
	});
	
	//更多课程
	document.getElementById("morecourse").addEventListener("tap",function(){
		window.location.href = "../index/index.html";
	});
	//加入
	document.getElementById("join").addEventListener("tap",function(){
		window.location.href = "../spelling/spelljoin.html?pFightCourseId="+pId;
	});
	
});