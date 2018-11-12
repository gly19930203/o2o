mui.init();
var pId = Request("pId");
var type = Request("type");
var payData;
var info = {
	"f_id":pId,
	"f_payment":null
}
mui.ready(function(){
	var mask = document.getElementById("mask");
	var payalert = document.getElementById("payalert");
	document.getElementById("prepay").addEventListener("tap",function(){
		mask.style.display = "block";
		payalert.style.display = "block";
	});
	mask.addEventListener('tap',function(){
		mask.style.display = "none";
		payalert.style.display = "none";
	});
	var data = getAPI("/Order/GetOrderOne","pId="+pId,"get");
	if(data){
		document.getElementById("f_icon").src = IMG_HOST + data.f_icon;
		document.getElementById("f_name").innerHTML = data.f_name;
		document.getElementById("f_outline").innerHTML = data.f_outline;
		document.getElementById("f_price").innerHTML = data.f_price;
		document.getElementById("f_popularity").innerHTML = data.f_popularity;
		document.getElementById("f_follownumber").innerHTML = data.f_follownumber;
		document.getElementById("f_ordernumber").innerHTML = "订单编号：&nbsp;"+data.f_ordernumber;
		document.getElementById("f_orderdate").innerHTML = "支付状态：&nbsp;"+data.f_orderdate.substring(0,16);
		if(data.pay == "未支付"){
			document.getElementById("paystate").innerHTML = "支付状态：&nbsp"+data.pay;
		}else{
			if(data.status == "已支付"){
				document.getElementById("paystate").innerHTML = "支付状态：&nbsp"+data.status+"&nbsp("+data.pay+")";
			}else{
				document.getElementById("paystate").innerHTML = "支付状态：&nbsp"+data.status;
			}
			document.getElementById("footer").style.display = "none";
        }
        if (data.type == "一对一") {
            document.getElementById("highest").innerHTML = "￥" + data.f_price;
            document.getElementById("price").innerHTML = "￥" + data.f_price;
            document.getElementById("maxreturn").innerHTML = "￥0";
            document.getElementById("nowreturn").innerHTML = "￥0";
        } else {
            document.getElementById("highest").innerHTML = "￥" + parseInt(data.highest * 100) / 100;
            document.getElementById("price").innerHTML = "￥" + parseInt(data.highest * 100) / 100;
            document.getElementById("maxreturn").innerHTML = "￥" + (parseInt(data.highest * 100) - parseInt(data.minimum * 100)) / 100;
            getAPIasync("/Order/GetBackNow", "pFightcourseId=" + data.f_fightcourseId + "&pMinpeople=" + data.f_minpeople + "&pPrice=" + data.f_price + "&pPaymentamount=" + data.f_paymentamount, "get", function (e) {

                document.getElementById("nowreturn").innerHTML = "￥" + e;
            });
        }
	}
});

	
//支付跳转
document.getElementById("pay").addEventListener("tap",function(){
	if(document.getElementById("wechat").className == "mui-table-view-cell mui-selected"){
		info.f_payment = 1;
		getAPIasync("/Order/UpdateOrder",info,"post",function(data){
            if (data) {
                payData = JSON.parse(data);
				callpay();
			}
		});
	}else if(document.getElementById("zhifubao").className == "mui-table-view-cell mui-selected"){
		info.f_payment = 0;
		getAPIasync("/Order/UpdateOrder",info,"post",function(data){
            if (data) {
                document.getElementById("alipay").innerHTML = data;
                var queryParam = '';
                Array.prototype.slice.call(document.querySelectorAll("#alipaysubmit input")).forEach(function (ele) {
                    if (ele.name && ele.name != 'charset') {
                        queryParam += '&' + ele.name + "=" + encodeURIComponent(ele.value);
                    }
                });
                var gotoUrl = document.querySelector("#alipaysubmit").getAttribute('action') + queryParam;
                _AP.pay(gotoUrl);
//              payData = JSON.parse(data);
//				callpay();
//				window.location.href = "../account/myorder.html";
			}
		});
	}
});
//取消订单
document.getElementById("cancel").addEventListener("tap",function(){
	getAPIasync("/FightCourse/CancelOrder",{"f_id":pId},"post",function(data){
		if(data){
			mui.alert("取消订单成功",function(){
				window.location.href = "../account/myorder.html";
			})
		}
	});
});


//调用微信JS api 支付
function jsApiCall() {
    WeixinJSBridge.invoke('getBrandWCPayRequest',
        payData,//josn串
        function (res) {
            if (res.err_msg == "get_brand_wcpay_request:ok") {
                window.location.href = "../account/myorder.html";
            } else if (res.err_msg == "get_brand_wcpay_request:cancel") {
                mui.alert("支付已取消");
            } else if (res.err_msg == "get_brand_wcpay_request:fail") {
                mui.alert("支付失败");
            }
        }
    );
}

function callpay() {
    if (typeof WeixinJSBridge == "undefined") {
        if (document.addEventListener) {
            document.addEventListener('WeixinJSBridgeReady', jsApiCall, false);
        }
        else if (document.attachEvent) {
            document.attachEvent('WeixinJSBridgeReady', jsApiCall);
            document.attachEvent('onWeixinJSBridgeReady', jsApiCall);
        }
    }
    else {
        jsApiCall();
    }
}