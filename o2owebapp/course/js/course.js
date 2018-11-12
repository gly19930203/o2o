mui.init();
var pCourseId = window.localStorage.pCourseId;
var concern = document.getElementById("concern");
var coursedata;
mui.ready(function(e) {	
	t = $('.mui-segmented-control').offset().top;
	$(window).scroll(function(e){
		s = $(document).scrollTop();	
		if(s >t){
			$('.mui-segmented-control').css('position','fixed');
			$('.mui-segmented-control').css('top','0px');
			$('.contents').css('margin-top','1.6rem');
		}else{
			$('.mui-segmented-control').css('position','');
			$('.contents').css('margin-top','0');
		}
	});
	
	var h = document.documentElement.clientHeight;
	var w = document.documentElement.clientWidth;
	document.getElementById("consultate").style.height = (h-17.5/20*w)+'px';
	
	//跳转首页
	document.getElementById("toIndex").addEventListener("tap",function(){
		window.location.href = "../index/index.html";
	});
	
	getAPIasync("/Course/GetCourseEntity","pId="+pCourseId,"get",function(data){
		if(data){
			coursedata = data;
			//写入登录人信息
			if(code){
				getAPIasync("/Login/GetUsersToken", "code=" + code + "&domain=" + data.f_domain, "get", e=> {
					window.localStorage.Auth = e;
					window.localStorage.Domain = data.f_domain;
					completeInit();
				});
			}else if(window.localStorage.Domain && window.localStorage.Domain != data.f_domain){
                window.localStorage.setItem("Auth","")
                window.localStorage.setItem("Domain","")
                window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx076bffe390fc5406&redirect_uri=" + url + "&response_type=code&scope=snsapi_base&state=1#wechat_redirect";
			}else{
				completeInit();
			}
			document.getElementById("f_name").innerHTML = data.f_name;
			document.getElementById("f_price").innerHTML = data.f_price+"￥";
			document.getElementById("f_popularity").innerHTML = data.f_popularity;
			document.getElementById("f_follownumber").innerHTML = data.follownumber;
			document.getElementById("headerimg").src = IMG_HOST+ data.f_detailicon;
            document.getElementById("f_lessonnotes").innerHTML = data.f_lessonnotes;

            //分享功能
            getAPIasync("/Login/GetJSSDK", "url=" + location.href, "get", function (e) {
                if (e) {
                    let data = JSON.parse(e);
                    wx.config({
                        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                        appId: data.appId, // 必填，公众号的唯一标识
                        timestamp: data.timestamp, // 必填，生成签名的时间戳
                        nonceStr: data.nonceStr, // 必填，生成签名的随机串
                        signature: data.signature, // 必填，签名
                        jsApiList: ['onMenuShareAppMessage', 'onMenuShareTimeline'] // 必填，需要使用的JS接口列表
                    });
                }
            });
		}
	});
	
	
	//跳转图文详情
	document.getElementById("tocoursedetail").addEventListener("tap",function(){
		window.location.href = "coursedetail.html?pCourseId="+pCourseId;
	});
	
});

function completeInit(){
	//是否关注
	getAPIasync("/Course/GetFollow","pCourseId="+pCourseId,"get",function(data){
		if(data == 0){
			concern.innerHTML = "关注";
		}else{
			concern.innerHTML = "取消关注";
		}
	});
	
	
	//关注、取消关注
	concern.addEventListener("tap",function(){
		if(concern.innerHTML == "关注"){
			getAPIasync("/Course/InsertFollow",{"f_courseId":pCourseId},"post",function(data){
				if(data){
					concern.innerHTML = "取消关注";
				}
			});
		}else{
			getAPIasync("/Course/UpdateFollow",{"f_courseId":pCourseId},"post",function(data){
				if(data){
					concern.innerHTML = "关注";
				}
			});
		}
	});
	//发起拼课
	document.getElementById("tospelling").addEventListener("tap",function(){
		getAPIasync("/User/GetUserEntity", null, "get", function (e) {
            if(e){
            	if(!e.f_name || !e.f_phone){
            		mui.alert("请完善您的资料，姓名和手机号必填！")
            		return;
            	}
				window.location.href = "../spelling/spelladd.html?pCourseId="+pCourseId;
            }
        });
	});
	//一对一
	document.getElementById("onlyspelling").addEventListener("tap",function(){
		getAPIasync("/User/GetUserEntity", null, "get", function (e) {
            if(e){
            	if(!e.f_name || !e.f_phone){
            		mui.alert("请完善您的资料，姓名和手机号必填！")
            		return;
            	}
				window.location.href = "../spelling/spelladd.html?pCourseId="+pCourseId+"&type=only";
            }
        });
	});
	
}

wx.ready(function () {
	 wx.onMenuShareTimeline({
         title: coursedata.f_name, // 分享标题
         link: "http://" + document.location.host + "/course/course.html?pCourseId=" + pCourseId, // 分享链接
         desc: coursedata.f_introduce, // 分享描述
        imgUrl: IMG_HOST+ coursedata.f_detailicon, // 分享图标
        success: function () {
            alert('分享成功啦！');
        },
        cancel: function(){
            alert('分享失败');
        }
    });
	wx.onMenuShareAppMessage({
        title: coursedata.f_name, // 分享标题
        link: "http://" + document.location.host + "/course/course.html?pCourseId=" + pCourseId, // 分享链接
        desc: coursedata.f_introduce, // 分享描述
	    imgUrl: IMG_HOST+ coursedata.f_detailicon, // 分享图标
	    type: 'link', // 分享类型,music、video或link，不填默认为link
	    dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
	    success: function () {
	           alert('分享成功啦');
	    },
	    cancel: function () {
	        alert('分享失败');
	    }
	});
});