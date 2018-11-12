//var API_HOST = 'http://o2o.edutage.com.cn/fore';
//IMG_HOST = 'http://o2o.edutage.com.cn';
var API_HOST = 'http://120.132.68.197:8001/fore';
IMG_HOST = 'http://120.132.68.197:8001';
//获取页面URL传值
var Request = function (query) {
    var search = window.location.search + '';
    if (search.charAt(0) != '?') {
        return undefined;
    } else {
        search = search.replace('?', '').split('&');
        for (var i = 0; i < search.length; i++) {
            if (search[i].split('=')[0] == query) {
                return decodeURI(search[i].split('=')[1]);
            }
        }
        return undefined;
    }
};


function placeholderPic(){
	var w = document.documentElement.offsetWidth;
	document.documentElement.style.fontSize=w/20+'px';
}
   placeholderPic();
window.onresize=function(){
    placeholderPic();
}



function getAPIasync(url, data, type, success) {
    var defaultData = {};
    var defaultType = "post";
    if (data) {
        defaultData = data;
    }
    if (type) {
        defaultType = type;
    }
    mui.ajax(API_HOST + url, {
        data: defaultData,
        dataType: 'json', //服务器返回json格式数据
        type: defaultType, //HTTP请求类型
        //timeout: 10000, //超时时间设置为10秒；
        async: true,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': window.localStorage.getItem("Auth") 
        },
        success: success,
        error: function (xhr, type, errorThrown) {
        	if(xhr.status == 401) {
                window.localStorage.setItem("Auth","")
                window.localStorage.setItem("Domain","")
				window.location.href = "../index/index.html";
			} else{
	            if (xhr.responseText) {
                    mui.alert(xhr.responseText);
	            } else {
	            }
			}
        }
    });
}

function getAPI(url, data, type) {
	var resultData = null;
    var defaultData = {};
    var defaultType = "post";
    if (data) {
        defaultData = data;
    }
    if (type) {
        defaultType = type;
    }
    mui.ajax(API_HOST + url, {
        data: defaultData,
        dataType: 'json', //服务器返回json格式数据
        type: defaultType, //HTTP请求类型
        //timeout: 10000, //超时时间设置为10秒；
        async: false,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': window.localStorage.getItem("Auth") 
        },
        success: function(data){
        	resultData = data;
        },
        error: function (xhr, type, errorThrown) {
        	if(xhr.status == 401) {
                window.localStorage.setItem("Auth","")
                window.localStorage.setItem("Domain","")
				window.location.href = "../index/index.html";
			} else{
	            if (xhr.responseText) {
                    mui.alert(xhr.responseText);
	            } else {
	                mui.alert("错误");
	            }
			}
        }
    });
    return resultData;
}



Date.prototype.pattern = function(fmt) {
	var o = {
		"M+": this.getMonth() + 1, //月份         
		"d+": this.getDate(), //日         
		"h+": this.getHours() % 12 == 0 ? 12 : this.getHours() % 12, //小时         
		"H+": this.getHours(), //小时         
		"m+": this.getMinutes(), //分         
		"s+": this.getSeconds(), //秒         
		"q+": Math.floor((this.getMonth() + 3) / 3), //季度         
		"S": this.getMilliseconds() //毫秒         
	};
	var week = {
		"0": "日",
		"1": "一",
		"2": "二",
		"3": "三",
		"4": "四",
		"5": "五",
		"6": "六"
	};
	if(/(y+)/.test(fmt)) {
		fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	}
	if(/(E+)/.test(fmt)) {
		fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "/u661f/u671f" : "/u5468") : "") + week[this.getDay() + ""]);
	}
	for(var k in o) {
		if(new RegExp("(" + k + ")").test(fmt)) {
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
		}
	}
	return fmt;
}