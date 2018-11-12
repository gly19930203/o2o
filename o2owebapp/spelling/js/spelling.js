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
		f_areaId:null,
		f_classdate:null,
		f_domain:window.localStorage.Domain
	}
}





mui.ready(function(){
	GetFightCourseList();
	//加载区域
	getAPIasync("/BaseData/GetCity","pProvinceId=310000","get",function(data){
		if(data){
			var content = document.getElementById("dizhia");
			for(var i in data){
				var li = document.createElement("li");
				li.innerHTML = data[i].f_name;
				li.id = data[i].f_id;
				li.addEventListener("tap",function(e){
					e.currentTarget.style.background = "#eee";
					document.getElementById("dizhib").style.left = "40%";
					GetAreaList(e.currentTarget.id);
				});
				content.appendChild(li)
			}
		}
	});
});

//加载课程数据列表
function GetFightCourseList(){
	getAPIasync("/FightCourse/GetFightCourseList",JSON.stringify(info),"post",function(data){
		if(data){
			var content = document.getElementById("content");
			for (var i = 0;i<data.length; i++) {
				content.appendChild(LoadData(data[i]));
				Canvas(data[i]);
			}
		}
	});
}

/* 下拉刷新具体业务实现*/
function pulldownRefresh() {
	info.PageIndex = 1;
	setTimeout(function(){
		getAPIasync("/FightCourse/GetFightCourseList",JSON.stringify(info),"post",function(data){
			if(data){
				var content = document.getElementById("content");
				content.innerHTML = "";
				for (var i = 0;i<data.length; i++) {
					content.appendChild(LoadData(data[i]));
					Canvas(data[i]);
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
		getAPIasync("/FightCourse/GetFightCourseList",JSON.stringify(info),"post",function(data){
			if(data){
				mui('#pullrefresh').pullRefresh().endPullupToRefresh(data.length == 0);
				var content = document.getElementById("content");
				for (var i = 0;i<data.length; i++) {
					content.appendChild(LoadData(data[i]));
					Canvas(data[i]);
				}
			}
		});
	},500);
}


function LoadData(data){
	var li = document.createElement('li');
	var topdiv = document.createElement("div");
	topdiv.addEventListener("tap",function(){
		window.location.href = "spelldetail.html?pId="+data.f_id;
	});
	var info = document.createElement("div");
	info.className = "info";
	var divinfo1 = document.createElement("div");
	divinfo1.className = "img";
	var currentImage = IMG_HOST +data.user.userhead ;
	if(data.user.userhead){
    	divinfo1.style.backgroundImage ="url("+currentImage+")";
	}else{
    	divinfo1.style.backgroundImage ="url(../image/head.png)";
	}
	var divinfo2 = document.createElement("div");
	divinfo2.className = "detail";
	divinfo2.innerHTML = '<span class="title">'+data.user.username+
	'</span><span class="time">'+data.f_create_time.substring(0,10)+
	'</span><span class="jianshu ellipsis">'+(data.user.usercontent==null?"":data.user.usercontent)+'</span>';
	var divinfo3 = document.createElement("div");
	divinfo3.className = "number";
	divinfo3.innerHTML = '<canvas id='+data.f_id+'></canvas>'+
	'<p><span>成拼'+data.f_minpeople+'人</span>'+
	'<span>最多'+data.f_maxpeople+'人</span></p>';
	
	var status = document.createElement("div");
	status.className = "status";
	var pstatus1 = document.createElement("p");
	pstatus1.className = "time";
	pstatus1.innerHTML = '<span class="iconfont icon-yanchurili orange"></span><span>'+data.f_classdate.substring(0,16)+'</span>';
	var pstatus2 = document.createElement("p");
	pstatus2.className = "school";
	pstatus2.innerHTML ='<span class="iconfont icon-didian orange"></span><span>'+data.classaddress.f_name+'</span>';
	var pstatus3 = document.createElement("p");
	pstatus3.className = "over";
	pstatus3.innerHTML = '<span>剩余<span class="orange">'+data.numday+'</span>天</span>';
	
	var imgcontent = document.createElement("div");
	imgcontent.className = "imgcontent";
	var imgdiv1 = document.createElement("div");
	imgdiv1.className = "img";
	imgdiv1.innerHTML = '<img src="'+IMG_HOST+data.courseioce+'"></div>';
	var imgdiv2 = document.createElement("div");
	imgdiv2.className = "detail";
	var div1 = document.createElement("div");
	div1.innerHTML = '<p class="title">'+data.coursename+'</p>'+
	'<p class="miaoshu">'+data.courseoutline+'</p>';
	var div2 = document.createElement("div");
	div2.innerHTML = '<span class="orange-circle" align="center"><i class="iconfont icon-wodejiage"></i></span>'+
	'<span class="brown number">'+data.price+'￥</span>'+
	'<span class="border"></span>'+
	'<span class="orange-circle" align="center"><i class="iconfont icon-icon"></i></span>'+
	'<span class="brown number">'+data.coursepopu+'</span>';
	
    
	info.appendChild(divinfo1);
	info.appendChild(divinfo2);
	info.appendChild(divinfo3);
	topdiv.appendChild(info);
	
	status.appendChild(pstatus1);
	status.appendChild(pstatus2);
	status.appendChild(pstatus3);
	topdiv.appendChild(status);
	
	imgcontent.appendChild(imgdiv1);
	imgdiv2.appendChild(div1);
	imgdiv2.appendChild(div2);
	imgcontent.appendChild(imgdiv2);
	topdiv.appendChild(imgcontent);
	li.appendChild(topdiv);
	
	
	var bottomdiv = document.createElement("div");
	bottomdiv.className = "bottom";
	var btn = document.createElement("button");
	btn.className = "bg-orange white";
	btn.innerHTML = '<span class="word">立即加入</span><span class="mui-icon mui-icon-arrowright"></span>';
	btn.id = data.f_id;
	btn.addEventListener("tap",function(e){
		var id = e.currentTarget.id;
		getAPIasync("/FightCourse/GetFightCourseTrueAndFalse","pFightcourseId="+id,"get",function(e){
			if(e){
                mui.alert("您已加入该拼课！");
				return;
			}else{
				getAPIasync("/User/GetUserEntity", null, "get", function (data) {
		            if(data){
		            	if(!data.f_name || !data.f_phone){
		            		mui.alert("请完善您的资料，姓名和手机号必填！")
		            		return;
		            	}
						window.location.href = "../spelling/spelljoin.html?pFightCourseId="+id;
		            }
		       });	
			}
		});
	})
	
	bottomdiv.appendChild(btn);
	li.appendChild(bottomdiv);
	
	
	return li;
}


//区域筛选
function GetAreaList(pCityId){
	getAPIasync("/BaseData/GetAreaList","pCityId="+pCityId,"get",function(data){
		if(data){
			var content = document.getElementById("dizhib");
			for(var i in data){
				var li = document.createElement("li");
				li.innerHTML = data[i].f_name;
				li.id = data[i].f_id;
				li.addEventListener("tap",function(e){
					document.getElementById("area").innerHTML = e.currentTarget.innerHTML;
				    HideArea();
				    HideMask();
				    info.ConditionJson.f_areaId = e.currentTarget.id;
				    info.PageIndex = 1;
				    document.getElementById("content").innerHTML = "";
					mui('#pullrefresh').pullRefresh().refresh(true);
					GetFightCourseList();
				});
				content.appendChild(li)
			}
		}
	});
}


//智能排序
function Sorts(sbj,name,order){
    document.getElementById("sort").innerHTML = sbj.innerHTML;
    HideSort();
    HideMask();
    info.Order = name+" "+order;
    info.PageIndex = 1;
    document.getElementById("content").innerHTML = "";
	mui('#pullrefresh').pullRefresh().refresh(true);
	GetFightCourseList();
}


//日期筛选
$('#ca').calendar({
    data: [],
    onSelected: function (view, date, data) {
    	var datetime = date.pattern("yyyy-MM-dd");
        document.getElementById("date").innerHTML = datetime;
	    HideDate();
	    HideMask();
	    info.ConditionJson.f_classdate = datetime;
	    info.PageIndex = 1;
	    document.getElementById("content").innerHTML = "";
		mui('#pullrefresh').pullRefresh().refresh(true);
		GetFightCourseList();
    }
});


function Canvas(data){//环形进度条
	var pro = data.f_fightpeople/data.f_minpeople*100;
	var p1 = new Progress({
	    el:data.f_id,//canvas元素id
	    deg:pro,//绘制角度
	    timer:1,//绘制时间
	//	lineWidth:5,//线宽
	    lineBgColor:'rgb(233,186,134)',//底圆颜色
	    lineColor:'rgb(255,30,82)',//动态圆颜色
	    textColor:'rgb(255,30,82)',//文本颜色
	//	    fontSize:16,//字体大小
	    circleRadius:50,//圆半径
	    numbers:data.f_fightpeople
	    
	});
}
	