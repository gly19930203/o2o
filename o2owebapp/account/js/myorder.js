mui.init();
mui.ready(function(){
	document.getElementById("mask").addEventListener('tap',function(){
		document.getElementById("mask").style.display = "none";
		document.getElementById("payalert").style.display = "none";
	});
	//列表
	getAPIasync("/User/GetUserOrderList",null,"get",function(data){
		if(data){
			console.log(data)
			var list = document.getElementById("list");
			for(var i in data){
				var li = document.createElement("li");
				var top = document.createElement("div");
				top.className = "title bg-brown white";
				top.innerHTML = data[i].type;
				li.appendChild(top);
				
				var bottom = document.createElement("div");
				bottom.className = "list bg-white";
				bottom.name = data[i].f_id;
				if(data[i].status != "待支付"){
					bottom.addEventListener("tap",function(e){
						window.location.href = "orderdetail.html?pId="+e.currentTarget.name;
					})
				}
				var imgcontent = document.createElement("div");
				imgcontent.className = "imgcontent";
				imgcontent.name = data[i].f_id;
				imgcontent.addEventListener("tap",function(e){
					window.location.href = "orderdetail.html?pId="+e.currentTarget.name;
				})
				var div1 = document.createElement("div");
				div1.className = "img";
				div1.innerHTML = '<img src="'+IMG_HOST+data[i].f_icon+'"></div>';
				var div2 = document.createElement("div");
				div2.className = "detail";
				var div3 = document.createElement("div");
				div3.className = "top";
				div3.innerHTML = '<p class="title">'+data[i].f_name+'</p>'+
				'<p class="ellipsis">'+data[i].f_outline+'</p>';
				var div4 = document.createElement("div");
				div4.className = "bottom";
				div4.innerHTML = '<p>共<span class="number">1</span>项课程</p>'+
				'<p>合计：<span class="number">￥'+data[i].f_paymentamount+'</span></p>';
				
				var payment = document.createElement("div");
				payment.className= "payment";
				var p1 = document.createElement("p");
				var p2 = document.createElement("p");
				p2.className = "right";
				
				if(data[i].status == "待支付"){
					p1.innerHTML = data[i].status;
					var span1 = document.createElement("span");
					span1.innerHTML = "取消订单";
					span1.name = data[i].f_id;
					span1.addEventListener("tap",function(e){
						getAPIasync("/FightCourse/CancelOrder",{"f_id":e.currentTarget.name},"post",function(data){
							if(data){
								mui.alert("取消订单成功",function(){
									window.location.reload();
								})
							}
						});
					});
					var span2 = document.createElement("span");
					span2.className = "orange";
					span2.innerHTML = "立即支付";
					span2.name = data[i].f_id;
					span2.addEventListener("tap",function(e){
						window.location.href = "orderdetail.html?pId="+e.currentTarget.name;
					})
					p2.appendChild(span1);
					p2.appendChild(span2);
					
				}else{
					p1.innerHTML = data[i].status;
					p2.innerHTML = "查看详情";
				}
				
				
				imgcontent.appendChild(div1);
				div2.appendChild(div3);
				div2.appendChild(div4);
				imgcontent.appendChild(div2);
				bottom.appendChild(imgcontent);
				payment.appendChild(p1);
				payment.appendChild(p2);
				bottom.appendChild(payment);
				li.appendChild(bottom);
				
				
				
				list.appendChild(li);
			}
		}
	});
});