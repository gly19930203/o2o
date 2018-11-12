mui.init();
var pFightCourseId = Request("pFightCourseId");
//拼课提交数据
var info={
	"pFightCourseId":pFightCourseId,
	"pContent":null
};


mui.ready(function(){	
	//补全资料
	document.getElementById("toPersonal").addEventListener("tap",function(){
		window.location.href = "../account/personaldata.html";
	});
	//会员信息
	getAPIasync("/User/GetUserEntity",null,"get",function(data){
		if(data){
			document.getElementById("f_name").innerHTML = data.f_name;
			if(data.f_phone){
				document.getElementById("f_phone").innerHTML =  data.f_phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');  
			}
			if(data.f_head_portrait){
				var currentImage = IMG_HOST +data.f_head_portrait ;
			    document.getElementById("f_head_portrait").style.backgroundImage ="url("+currentImage+")";
			}
		}
	});
	
	CourseData();
	//提交信息
	document.getElementById("prepay").addEventListener("tap",function(){
		info.pContent = document.getElementById("content").value;
		//调取拼课接口
		getAPIasync("/FightCourse/JoinFightCourseAndOrder",info,"post",function(data){
            if (data) {
         		window.location.href = "../account/orderdetail.html?pId="+data;
			}
		});
	});
});

//课程信息
function CourseData(){
	getAPIasync("/Fightcourse/GetZZPFightCourseOne","pFightcourseId="+pFightCourseId,"get",function(data){
		if(data){
			document.getElementById("course").innerHTML = data.f_name;
			document.getElementById("price").innerHTML = parseInt(data.highest*100)/100;
			document.getElementById("returns").innerHTML = "(最高返还￥"+(parseInt(data.highest*100)-parseInt(data.minimum*100))/100+")";
			document.getElementById("payamount").innerHTML = parseInt(data.highest*100)/100;
			//课次
			if(data.classaddress){
				var coursenumber = document.getElementById("coursenumber");
				for(var i=0;i<data.classaddress.length;i++){
					var li = document.createElement("li");
					li.className = "mui-table-view-cell colum";
					var div1 = document.createElement("div");
					div1.className = "courseorder";
					div1.innerHTML = (i+1)+"讲";
					var div2 = document.createElement("div");
					div2.className = "flexrow";
					
					
					var divleft = document.createElement("div");
					divleft.className = "left";
					divleft.innerHTML = "上课时间";
					var divright = document.createElement("div");
					divright.className = "right";
					divright.innerHTML = data.classaddress[i].f_classdate.substring(0,16);
					
					div2.appendChild(divleft);
					div2.appendChild(divright);
					
					var div3 = document.createElement("div");
					div3.className = "flexrow";
					var left = document.createElement("div");
					left.className = "left";
					left.innerHTML = "上课地址";
					var right = document.createElement("div");
					right.className = "right ui-alert";
					right.innerHTML = data.classaddress[i].f_address;
					
					div3.appendChild(left);
					div3.appendChild(right);
					
					li.appendChild(div1);
					li.appendChild(div2);
					li.appendChild(div3);
					coursenumber.appendChild(li);
				}
			}
		}
	});
}




