mui.init();
mui.ready(function(){
	getAPIasync("/User/GetUserEntity",null,"get",function(data){
		if(data){
			if(data.f_head_portrait){
				var currentImage = IMG_HOST +data.f_head_portrait;
				document.getElementById("headimg").style.backgroundImage ="url("+currentImage+")";
			}
			document.getElementById("f_name").innerHTML = data.f_name;
			if(data.f_phone){
				document.getElementById("f_phone").innerHTML = data.f_phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
			}
			document.getElementById("orderscount").innerHTML = data.orderscount;
			document.getElementById("coursecount").innerHTML = data.coursecount;
			document.getElementById("follownum").innerHTML = data.follownum;
		}
	});
	document.getElementById("toMyCourse").addEventListener("tap",function(){
		window.location.href = "mycourse.html";
	});
	document.getElementById("toMyOrder").addEventListener("tap",function(){
		window.location.href = "myorder.html";
	});
	document.getElementById("toDetail").addEventListener("tap",function(){
		window.location.href = "personaldata.html";
	});
	document.getElementById("toMyConcern").addEventListener("tap",function(){
		window.location.href = "myconcern.html";
	});
});
