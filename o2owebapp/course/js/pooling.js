var info = {
	size:3,
	PageSize:3,
	PageIndex:1,
	Order:"f_create_time desc",
	ConditionJson:{
		f_courseId:pCourseId
	}
}
require(['h5/pullrefresh'], function (pullrefresh) {
    pullrefresh.doRefresh({
        debug: false,		 // 模拟真实请求数据，否则会出现ajax跨域，正式使用中请去h5.js中删除debug代码
        url: API_HOST + '/Course/GetFightCourseNowList',  // 必填，ajax加载数据请求的地址
        data: info,   // 非必填，ajax请求数据的参数，如果启用了缓存，将影响浏览器的缓存数据
        dataType: "json",   // 非必填，ajax请求返回的数据类型
        container: '#pooling', // 非必填，用于计算document.body.scrollTop等于多少时自动加载更多数据，如果填写尽量请使用数据盛放容器
        cache: false,	    // 非必填，如果不想让浏览器缓存请写false，否则请写唯一的标记，具体请观察sessionStorage
        success: function (list, page, size) { // ajax请求成功后服务端返回来的数据
            if (info.PageIndex != page) {
                return true;
            }
            if (list) {
                var pooling = document.getElementById("pooling");
                for (var i = 0; i < list.data.length; i++) {
                    pooling.appendChild(LoadData(list.data[i]));
                    Canvas(list.data[i]);
                }
                info.PageIndex++;
            }
            return list.data.length >= info.PageSize;
            // 处理服务器返回的数据，绑定到页面

        }
    });
});


function LoadData(data){
	var li = document.createElement('li');
	var top = document.createElement("div");
	top.className = "top";
	var info = document.createElement("div");
	info.className = "info";
	info.id = data.f_id;
	info.addEventListener("tap",function(e){
		window.location.href = "../spelling/spelldetail.html?pId="+e.currentTarget.id;
	});
	var img = document.createElement("div");
	img.className = "img";
	var currentImage = IMG_HOST +data.user.userhead ;
	if(data.user.userhead){
    	img.style.backgroundImage ="url("+currentImage+")";
	}else{
    	img.style.backgroundImage ="url(../image/head.png)";
	}
	var detail = document.createElement("div");
	detail.className = "detail";
	detail.innerHTML = '<span class="title">'+data.user.username+'</span>'+
	'<span>'+data.f_create_time.substring(0,10)+'</span>'+
	'<span class="jianshu ellipsis">'+(data.user.usercontent==null?"":data.user.usercontent)+'</span>';
	var numbers = document.createElement("div");
	numbers.className = "number";
	var canvas = document.createElement("canvas");
	canvas.id = "canvas"+ data.f_id;
	var p = document.createElement("p");
	p.innerHTML = '<span>成拼'+data.f_minpeople+'人</span>'+
	'<span>最多'+data.f_maxpeople+'人</span>';
	 
	info.appendChild(img);
	info.appendChild(detail);
	numbers.appendChild(canvas);
	numbers.appendChild(p);
	info.appendChild(numbers);
	top.appendChild(info);
	
	var join = document.createElement("div");
	join.className = "join";
	var joinbtn = document.createElement("div");
	joinbtn.className = "joinbtn";
	var btn = document.createElement("button");
	btn.className = "btn bg-orange white";
	btn.innerHTML = '<span>加入</span><span class="mui-icon mui-icon-arrowright"></span>';
	btn.name = data.f_id;
	btn.addEventListener("tap",function(e){
		var name = e.currentTarget.name;
		getAPIasync("/FightCourse/GetFightCourseTrueAndFalse","pFightcourseId="+name,"get",function(e){
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
						window.location.href = "../spelling/spelljoin.html?pFightCourseId="+name;
		            }
		       });
			}
		});
	})
	
	joinbtn.appendChild(btn);
	join.appendChild(joinbtn);
	top.appendChild(join);
	
	var bottom = document.createElement("div");
	bottom.className = "bottom";
	var ptime = document.createElement("p");
	ptime.className = "time";
	ptime.innerHTML = '<span class="iconfont icon-yanchurili orange"></span>'+
	'<span>'+data.f_classdate.substring(0,16)+'</span>';
	var pschool = document.createElement("p");
	pschool.className = "school";
	pschool.innerHTML = '<span class="iconfont icon-didian orange"></span>'+
	'<span>'+data.classaddress.f_name+'</span>';
	var pover = document.createElement("p");
	pover.className = "over";
	pover.innerHTML = '<span>剩余<span class="orange">'+data.numday+'</span>天</span>';
	
	bottom.appendChild(ptime);
	bottom.appendChild(pschool);
	bottom.appendChild(pover);
	
	li.appendChild(top);
	li.appendChild(bottom);
	return li;
}

function Canvas(data){
	//环形进度条
	var pro = data.f_fightpeople/data.f_minpeople*100;
	var p1 = new Progress({
	    el:"canvas"+data.f_id,//canvas元素id
	    deg:pro,//绘制角度
	    timer:1,//绘制时间
	    lineBgColor:'rgb(233,186,134)',//底圆颜色
	    lineColor:'rgb(255,30,82)',//动态圆颜色
	    textColor:'rgb(255,30,82)',//文本颜色
	    circleRadius:50,//圆半径
	    numbers:data.f_fightpeople
	});
}

