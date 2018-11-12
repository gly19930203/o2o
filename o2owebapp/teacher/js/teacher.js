mui.init();
var teacherId = window.localStorage.teacherId;
var concern = document.getElementById("concern");
var teacherdata;
mui.ready(function(){
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
	//跳转首页
	document.getElementById("toIndex").addEventListener("tap",function(){
		window.location.href = "../index/index.html";
	});
	getAPIasync("/Teacher/GetTeacher","id="+teacherId,"get",function(data){
        if (data) {
            teacherdata = data;
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
			
			var imgsrc = IMG_HOST+ data.f_head_portrait;
            document.getElementById("f_head_portrait").style.backgroundImage = "url("+imgsrc+")";
            document.getElementById("f_name").innerHTML = data.f_name;
            document.getElementById("f_popularity").innerHTML = data.f_popularity;
            var sex = document.getElementById("f_sex");
            if(data.f_sex){
            	sex.className = "iconfont icon-nan";
            }else{
            	sex.className = "iconfont icon-nv";
            }
            for(var i in data.evaluationtagName){
            	document.getElementById("evaluationtagName").innerHTML += data.evaluationtagName[i]+"&nbsp;"
            }
            
            //相册
            var imglist = document.getElementById("imglist");
            for(var i in data.teacherPhotos){
            	var img = document.createElement("img");
            	img.src = IMG_HOST + data.teacherPhotos[i].url;
            	img.setAttribute("data-preview-src","");
            	img.setAttribute("data-preview-group",2);
            	imglist.appendChild(img);
            }
            //详细信息
            document.getElementById("teacherdetail").innerHTML = data.f_detailed;

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
	
});

function completeInit(){
	//是否关注老师
	getAPIasync("/Teacher/GetFollow","pTeacherId="+teacherId,"get",function(data){
		if(data == 0){
			concern.innerHTML = "关注";
		}else{
			concern.innerHTML = "取消关注";
		}
	});
	
	
	//关注、取消关注
	concern.addEventListener("tap",function(){
		if(concern.innerHTML == "关注"){
			getAPIasync("/Teacher/InsertFollow",{"f_teacherId":teacherId},"post",function(data){
				if(data){
					concern.innerHTML = "取消关注";
				}
			});
		}else{
			getAPIasync("/Teacher/DeleteFollow",{"f_teacherId":teacherId},"post",function(data){
				if(data){
					concern.innerHTML = "关注";
				}
			});
		}
	});
	
}

wx.ready(function () {
    wx.onMenuShareTimeline({
        title: teacherdata.f_name, // 分享标题
        link: "http://" + document.location.host + "/teacher/teacher.html?teacherId=" + teacherId, // 分享链接
        desc: teacherdata.f_introduce, // 分享描述
        imgUrl: IMG_HOST + teacherdata.f_head_portrait, // 分享图标
        success: function () {
            alert('分享成功啦！');
        },
        cancel: function () {
            alert('分享失败');
        }
    });
    wx.onMenuShareAppMessage({
        title: teacherdata.f_name, // 分享标题
        link: "http://" + document.location.host + "/teacher/teacher.html?teacherId=" + teacherId, // 分享链接
        desc: teacherdata.f_introduce, // 分享描述
        imgUrl: IMG_HOST + teacherdata.f_head_portrait, // 分享图标
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