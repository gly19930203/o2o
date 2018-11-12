mui.init();
var pCourseId = Request("pCourseId");
var type = Request("type");
var payData;
var addressData = null;
var addressData2 = {};
//指定时间
var datetime = new Date();
datetime.setDate(datetime.getDate() + 3);
var dtpicker = new mui.DtPicker({
    type: "datetime",
    "customData": {
        "i": [
            { value: "00", text: "00" },
            { value: "30", text: "30" },
        ]
    },
    beginDate: datetime
})
//课程名称
var userPicker2 = new mui.PopPicker();


var coursedata;
//课次
var f_number = 0;
//拼课提交数据
var info = {
    "f_courseId": pCourseId,
    "f_type": 0,//拼课
    "f_paymentamount": null,
    "fightcourseclassaddressList": [],
    "f_content": null
};


mui.ready(function () {
    //补全资料
    document.getElementById("toPersonal").addEventListener("tap", function () {
        window.location.href = "../account/personaldata.html";
    });
    //显示课程名称、选择课程
    var course = document.getElementById("course");
    var coursePicker = document.getElementById("coursePicker");
    var changetype = document.getElementById("changetype");
    if (pCourseId) {
        if (type == "only") {
            document.getElementById("class").style.display = "none";
            document.getElementById("only").checked = "checked";
            info.f_type = 1;
        }
        CourseData();
        AreaList();
        course.style.display = "block";
        coursePicker.style.display = "none";
        changetype.style.display = "flex";
    } else {
        //课程列表
        CourseList();
        course.style.display = "none";
        coursePicker.style.display = "flex";
        changetype.style.display = "none";
        //选择课程
        var coursePicker = document.getElementById('coursePicker');
        var courseResult = document.getElementById('courseResult');
        coursePicker.addEventListener('tap', function (event) {
            userPicker2.show(function (items) {
                pCourseId = items[0].value;
                courseResult.innerText = items[0].text;
                document.getElementById("coursenumber").innerHTML = "";
                document.getElementById("content").value = "";
                info = {
                    "f_courseId": pCourseId,
                    "f_type": 0,//拼课
                    "f_paymentamount": null,
                    "fightcourseclassaddressList": [],
                    "f_content": null
                }
                CourseData();
                AreaList();
                changetype.style.display = "flex";
            });
        }, false);
    }

    //会员信息
    getAPIasync("/User/GetUserEntity", null, "get", function (data) {
        if (data) {
            document.getElementById("f_name").innerHTML = data.f_name;
            if (data.f_phone) {
                document.getElementById("f_phone").innerHTML = data.f_phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
            }
            if (data.f_head_portrait) {
                var currentImage = IMG_HOST + data.f_head_portrait;
                document.getElementById("f_head_portrait").style.backgroundImage = "url(" + currentImage + ")";
            }
        }
    });


    //支付
    var mask = document.getElementById("mask");
    var payalert = document.getElementById("payalert");
    //提交信息
    document.getElementById("prepay").addEventListener("tap", function () {
        info.f_content = document.getElementById("content").value;
        info.f_paymentamount = document.getElementById("price").innerHTML;
        if (!info.f_courseId) {
            mui.alert("请选择课程");
            return;
        }
        if (info.fightcourseclassaddressList.length < f_number) {
            mui.alert("请选择课程上课时间和上课地址");
            return;
        }
        for (var i = 0; i < info.fightcourseclassaddressList.length; i++) {
            if (!info.fightcourseclassaddressList[i].f_classaddressId) {
                mui.alert("请选择" + (i + 1) + "讲上课地址");
                return;
            }
            if (!info.fightcourseclassaddressList[i].f_classdate) {
                mui.alert("请选择" + (i + 1) + "讲上课时间");
                return;
            }
        }
        //调取拼课接口
        getAPIasync("/FightCourse/InsertFightCourseOrder", info, "post", function (data) {
            if (data) {
                window.location.href = "../account/orderdetail.html?pId=" + data;
            }
        });
    });
});

//课程信息
function CourseData() {
    getAPIasync("/Course/GetCoureseClass", "pId=" + pCourseId, "get", function (data) {
        if (data) {
            coursedata = data;
            if (pCourseId) {
                document.getElementById("course").innerHTML = data.f_name;
            }
            ChangePrice(info.f_type);
            f_number = data.f_number;
            //课次
            if (data.f_number > 0) {
                var coursenumber = document.getElementById("coursenumber");
                for (var i = 0; i < data.f_number; i++) {
                    var li = document.createElement("li");
                    li.className = "mui-table-view-cell colum";
                    var div1 = document.createElement("div");
                    div1.className = "courseorder";
                    div1.innerHTML = (i + 1) + "讲";
                    var div2 = document.createElement("div");
                    div2.className = "flexrow";


                    var divleft = document.createElement("div");
                    divleft.className = "left";
                    divleft.innerHTML = "上课时间";
                    var divright = document.createElement("div");
                    divright.className = "right coursetime";

                    var radio1 = document.createElement("div");
                    radio1.className = "mui-input-row mui-radio  mui-left";
                    var label1 = document.createElement("label");
                    label1.innerHTML = "任意时间";
                    var input1 = document.createElement("input");
                    input1.type = "radio";
                    input1.name = "radio" + i;

                    var radio2 = document.createElement("div");
                    radio2.className = "mui-input-row mui-radio  mui-left";
                    var label2 = document.createElement("label");
                    label2.innerHTML = "请选择时间";
                    label2.id = data.f_id + i;
                    label2.name = i;
                    label2.addEventListener("tap", function (e) {
                        var labelId = e.currentTarget.id;
                        var labelName = e.currentTarget.name;
                        dtpicker.show(function (event) {
                            document.getElementById(labelId).innerHTML = event.text;
                            if (info.fightcourseclassaddressList.length > 0) {
                                for (var j in info.fightcourseclassaddressList) {
                                    if (labelName == j) {
                                        info.fightcourseclassaddressList[j].f_classdate = event.text;
                                    } else if ((labelName + 1) > info.fightcourseclassaddressList.length) {
                                        info.fightcourseclassaddressList.push({
                                            "f_classdate": event.text,
                                            "f_classaddressId": null
                                        })
                                    }
                                }
                            } else {
                                info.fightcourseclassaddressList.push({
                                    "f_classdate": event.text,
                                    "f_classaddressId": null
                                })
                            }
                        })
                    });
                    var input2 = document.createElement("input");
                    input2.type = "radio";
                    input2.name = "radio" + i;
                    input2.checked = true;

                    div2.appendChild(divleft);
                    //					radio1.appendChild(label1);
                    //					radio1.appendChild(input1);
                    //					divright.appendChild(radio1);
                    radio2.appendChild(label2);
                    radio2.appendChild(input2);
                    divright.appendChild(radio2);
                    div2.appendChild(divright);

                    var div3 = document.createElement("div");
                    div3.className = "flexrow";
                    var left = document.createElement("div");
                    left.className = "left";
                    left.innerHTML = "上课区域";
                    var right = document.createElement("div");
                    right.className = "right ui-alert";
                    right.name = i;
                    right.addEventListener("tap", function (e) {
                        var addressName = e.currentTarget.name;
                        //地址
                        var addressPicker = new mui.PopPicker();
                        addressPicker.setData(addressData);
                        addressPicker.show(function (items) {
                            document.getElementById(addressName).innerHTML = items[0].text;
                            AreaList2(addressName, items[0].value);
                            addressPicker.dispose();
                            addressPicker = null;
                        });
                    });

                    var address = document.createElement("span");
                    address.innerHTML = "请选择区域";
                    address.id = i;
                    var icon = document.createElement("span");
                    icon.className = "mui-icon mui-icon-arrowdown";
                    div3.appendChild(left);
                    right.appendChild(address);
                    right.appendChild(icon);
                    div3.appendChild(right);



                    var div4 = document.createElement("div");
                    div4.className = "flexrow";
                    var left2 = document.createElement("div");
                    left2.className = "left";
                    left2.innerHTML = "上课地址";
                    var right2 = document.createElement("div");
                    right2.className = "right ui-alert";
                    right2.name = i;
                    right2.addEventListener("tap", function (e) {
                        var addressName2 = e.currentTarget.name;
                        if (!addressData2[addressName2]) {
                            mui.alert("请先选择上课区域!");
                            return;
                        }
                        //地址详细
                        var addressPicker2 = new mui.PopPicker();
                        addressPicker2.setData(addressData2[addressName2]);
                        addressPicker2.show(function (items) {
                            document.getElementById("address" + addressName2).innerHTML = items[0].text;
                            if (info.fightcourseclassaddressList.length > 0) {
                                for (var j in info.fightcourseclassaddressList) {
                                    if (addressName2 == j) {
                                        info.fightcourseclassaddressList[j].f_classaddressId = items[0].value;
                                    } else if ((addressName2 + 1) > info.fightcourseclassaddressList.length) {
                                        info.fightcourseclassaddressList.push({
                                            "f_classdate": null,
                                            "f_classaddressId": items[0].value
                                        })
                                    }
                                }
                            } else {
                                info.fightcourseclassaddressList.push({
                                    "f_classdate": null,
                                    "f_classaddressId": items[0].value
                                })
                            }
                            addressPicker2.dispose();
                            addressPicker2 = null;
                        });
                    });
                    var address2 = document.createElement("span");
                    address2.innerHTML = "请选择地址";
                    address2.id = "address" + i;
                    var icon2 = document.createElement("span");
                    icon2.className = "mui-icon mui-icon-arrowdown";
                    div4.appendChild(left2);
                    right2.appendChild(address2);
                    right2.appendChild(icon2);
                    div4.appendChild(right2);


                    li.appendChild(div1);
                    li.appendChild(div2);
                    li.appendChild(div3);
                    li.appendChild(div4);
                    coursenumber.appendChild(li);
                }
            }
        }
    });
}

//选择班课或1对1
function Change() {
    var radios = document.getElementsByName("radion");
    for (var i = 0; i < radios.length; i++) {
        if (radios[i].checked) {
            info.f_type = radios[i].value;
            ChangePrice(info.f_type);
        }
    }
}

//优惠
function ChangePrice(type) {
    var price = document.getElementById("price");
    var returns = document.getElementById("returns");
    var payamount = document.getElementById("payamount");
    if (type == 0) {
        price.innerHTML = parseInt(coursedata.highest * 100) / 100;
        returns.innerHTML = "(最高返还￥" + (parseInt(coursedata.highest * 100) - parseInt(coursedata.minimum * 100)) / 100 + ")";
        payamount.innerHTML = parseInt(coursedata.highest * 100) / 100;
    } else if (type == 1) {
        price.innerHTML = coursedata.f_price;
        returns.innerHTML = "";
        payamount.innerHTML = coursedata.f_price;
    }
}

//所有能上的课程
function CourseList() {
    getAPIasync("/Course/GetCourseListPhone", "domain=" + window.localStorage.Domain, "get", function (data) {
        if (data) {
            userPicker2.setData(data);
        }
    });
}

//获取地址区域
function AreaList() {
    //获取地址接口
    getAPIasync("/Course/GetClassAddressCourseAreaList", "pCourseId=" + pCourseId, "get", function (data) {
        if (data) {
            addressData = data;
        }
    });
}


//获取地址详细
function AreaList2(index, pAreaId) {
    //获取地址接口
    getAPIasync("/Course/GetClassAddressList", "pAreaId=" + pAreaId + "&domain=" + window.localStorage.Domain, "get", function (data) {
        if (data) {
            addressData2[index] = data;
        }
    });
}


