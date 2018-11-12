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
	PageSize: 10,
	PageIndex: 1,
	Order: "f_create_time desc",
	ConditionJson: {
		f_coursetypeId: null,
		f_coursesystem: null,
		f_domain:domain
	}
}

mui.ready(function() {
	if(code) {
		getAPIasync("/Login/GetUsersToken", "code=" + code + "&domain=" + domain, "get", e=> {
			window.localStorage.Auth = e;
			window.localStorage.Domain = domain;
		});
	}
	//正在拼
	document.getElementById("tospelling").addEventListener('tap', function() {
		window.location.href = "../spelling/spelling.html"
	});
	//我的
	document.getElementById("toaccount").addEventListener('tap', function() {
		window.location.href = "../account/account.html"
	});

	//发起拼课
	document.getElementById("tospelladd").addEventListener('tap', function() {
		getAPIasync("/User/GetUserEntity", null, "get", function(e) {
			if(e) {
				if(!e.f_name || !e.f_phone) {
					mui.alert("请完善您的资料，姓名和手机号必填！")
					return;
				}
				window.location.href = "../spelling/spelladd.html"
			}
		});
	});

	GetCourseList();

	//加载类别
	getAPIasync("/BaseData/GetCourseTypeList", "domain="+domain, "get", function(data) {
		if(data) {
			var categorylist = document.getElementById("category-list");
			var liall = document.createElement("li");
			liall.innerHTML = "全部";
			liall.addEventListener("tap", function() {
				document.getElementById("category").innerHTML = "全部";
				HideCategory();
				HideMask();
				info.ConditionJson.f_coursetypeId = null;
				info.PageIndex = 1;
				document.getElementById("content").innerHTML = "";
				mui('#pullrefresh').pullRefresh().refresh(true);
				GetCourseList();
			})
			categorylist.appendChild(liall);
			for(var i = 0; i < data.length; i++) {
				var li = document.createElement("li");
				li.innerHTML = data[i].f_name + "(" + data[i].count + ")";
				li.id = data[i].f_id;
				li.addEventListener("tap", function(e) {
					document.getElementById("category").innerHTML = e.currentTarget.innerHTML;
					HideCategory();
					HideMask();
					info.ConditionJson.f_coursetypeId = e.currentTarget.id;
					info.PageIndex = 1;
					document.getElementById("content").innerHTML = "";
					mui('#pullrefresh').pullRefresh().refresh(true);
					GetCourseList();
				});
				categorylist.appendChild(li);
			}
		}
	});

	//加载课制
	getAPIasync("/BaseData/GetCourseSystemList", "domain="+domain, "get", function(data) {
		if(data) {
			var coursesyslist = document.getElementById("coursesys-list");
			var liall = document.createElement("li");
			liall.innerHTML = "全部";
			liall.addEventListener("tap", function() {
				document.getElementById("coursesys").innerHTML = "全部";
				HideCoursesys();
				HideMask();
				info.ConditionJson.f_coursesystem = null;
				info.PageIndex = 1;
				document.getElementById("content").innerHTML = "";
				mui('#pullrefresh').pullRefresh().refresh(true);
				GetCourseList();
			})
			coursesyslist.appendChild(liall);
			for(var i = 0; i < data.length; i++) {
				var li = document.createElement("li");
				li.innerHTML = data[i].f_name + "(" + data[i].count + ")";
				li.id = data[i].f_id;
				li.addEventListener("tap", function(e) {
					document.getElementById("coursesys").innerHTML = e.currentTarget.innerHTML;
					HideCoursesys();
					HideMask();
					info.ConditionJson.f_coursesystem = e.currentTarget.id;
					info.PageIndex = 1;
					document.getElementById("content").innerHTML = "";
					mui('#pullrefresh').pullRefresh().refresh(true);
					GetCourseList();
				});
				coursesyslist.appendChild(li);
			}
		}
	});
});

//加载课程数据列表
function GetCourseList() {
	getAPIasync("/Course/GetCourseList", JSON.stringify(info), "post", function(data) {
		if(data) {
			var content = document.getElementById("content");
			for(var i = 0; i < data.length; i++) {
				content.appendChild(LoadData(data[i]));
			}
		}
	});
}

/* 下拉刷新具体业务实现*/
function pulldownRefresh() {
	info.PageIndex = 1;
	setTimeout(function() {
		getAPIasync("/Course/GetCourseList", JSON.stringify(info), "post", function(data) {
			if(data) {
				var content = document.getElementById("content");
				content.innerHTML = "";
				for(var i = 0; i < data.length; i++) {
					content.appendChild(LoadData(data[i]));
				}
				mui('#pullrefresh').pullRefresh().endPulldownToRefresh(); //refresh completed
				mui('#pullrefresh').pullRefresh().refresh(true);
			}
		});
	}, 500);
}

/*上拉加载具体业务实现*/
function pullupRefresh() {
	info.PageIndex++;
	setTimeout(function() {
		getAPIasync("/Course/GetCourseList", JSON.stringify(info), "post", function(data) {
			if(data) {
				mui('#pullrefresh').pullRefresh().endPullupToRefresh(data.length == 0);
				var content = document.getElementById("content");
				for(var i = 0; i < data.length; i++) {
					content.appendChild(LoadData(data[i]));
				}
			}
		});
	}, 500);
}

function LoadData(data) {
	var li = document.createElement('li');
	li.className = 'bg-white';
	li.addEventListener("tap", function() {
		window.location.href = "../course/course.html?pCourseId=" + data.f_id;
	});
	var divimg = document.createElement("div");
	divimg.className = 'img';
	divimg.innerHTML = '<img src=' + IMG_HOST + data.f_icon + '>'

	var detail = document.createElement("div");
	detail.className = "detail";
	var div1 = document.createElement("div");
	div1.innerHTML = '<p class="title">' + data.f_name + '</p>' +
		'<p class="miaoshu ellipsis">' + data.f_outline + '</p>';
	var div2 = document.createElement("div");
	var span1 = document.createElement("span");
	span1.className = "orange-circle";
	span1.setAttribute("align", "center");
	span1.innerHTML = '<i class="iconfont icon-wodejiage"></i>';
	var span2 = document.createElement("span");
	span2.className = "brown number";
	span2.innerHTML = data.f_price + '￥';
	var span3 = document.createElement("span");
	span3.className = "border";
	var span4 = document.createElement("span");
	span4.className = "orange-circle";
	span4.setAttribute("align", "center");
	span4.innerHTML = '<i class="iconfont icon-icon"></i>';
	var span5 = document.createElement("span");
	span5.className = "brown number";
	span5.innerHTML = data.f_popularity;

	var todetail = document.createElement("div");
	todetail.className = "todetail";
	todetail.setAttribute("align", "center");
	todetail.innerHTML = '<span class="mui-icon-extra mui-icon-extra-arrowrightcricle"></span>';

	li.appendChild(divimg);
	detail.appendChild(div1);
	div2.appendChild(span1);
	div2.appendChild(span2);
	div2.appendChild(span3);
	div2.appendChild(span4);
	div2.appendChild(span5);
	detail.appendChild(div2);
	li.appendChild(detail);
	li.appendChild(todetail);

	return li;
}

//js点击事件监听开始

//智能排序
function Sorts(sbj, name, order) {
	document.getElementById("sort").innerHTML = sbj.innerHTML;
	HideSort();
	HideMask();
	info.Order = name + " " + order;
	info.PageIndex = 1;
	document.getElementById("content").innerHTML = "";
	mui('#pullrefresh').pullRefresh().refresh(true);
	GetCourseList();
}