$(document).ready(function(){
	//区域
    $(".area").click(function(){
        if ($('.area-content').hasClass('grade-w-roll')) {
            HideArea();
            HideMask();
        } else if($('.date-content').hasClass('grade-w-roll')){
        	HideDate();
        	ShowArea();
        }else if($('.sort-content').hasClass('grade-w-roll')){
        	HideSort();
        	ShowArea();
        }else {
        	ShowArea();
        	ShowMask();
        }
    });
	//智能排序
    $(".sort").click(function(){
        if ($('.sort-content').hasClass('grade-w-roll')) {
            HideSort();
            HideMask();
        }else if($('.area-content').hasClass('grade-w-roll')){
        	HideArea();
        	ShowSort();
        }else if($('.date-content').hasClass('grade-w-roll')){
        	HideDate();
        	ShowSort();
        } else {
        	ShowSort();
        	ShowMask();
        }
    });
    //日期
    $(".date").click(function(){
        if ($('.date-content').hasClass('grade-w-roll')) {
            HideDate();
            HideMask();
        }else if($('.area-content').hasClass('grade-w-roll')){
        	HideArea();
        	ShowDate();
        }else if($('.sort-content').hasClass('grade-w-roll')){
        	HideSort();
        	ShowDate();
        }else {
        	ShowDate();
        	ShowMask();
        }
    });
	$(".mask").click(function(){
		HideArea();
		HideDate();
        HideSort();
        HideMask();
    });
});





//类别出现消失
function ShowArea(){
    $('.area-content').addClass('grade-w-roll');
    $('#area-icon').addClass('mui-icon-arrowup');
    $('#area-icon').removeClass('mui-icon-arrowdown');
}
function HideArea(){
    $('.area-content').removeClass('grade-w-roll');
    $('#area-icon').removeClass('mui-icon-arrowup');
    $('#area-icon').addClass('mui-icon-arrowdown');
}
//智能排序出现消失
function ShowSort(){
    $('.sort-content').addClass('grade-w-roll');
    $('#sort-icon').addClass('mui-icon-arrowup');
    $('#sort-icon').removeClass('mui-icon-arrowdown');
}
function HideSort(){
    $('.sort-content').removeClass('grade-w-roll');
    $('#sort-icon').removeClass('mui-icon-arrowup');
    $('#sort-icon').addClass('mui-icon-arrowdown');
}
//日期出现消失
function ShowDate(){
    $('.date-content').addClass('grade-w-roll');
    $('#date-icon').addClass('mui-icon-arrowup');
    $('#date-icon').removeClass('mui-icon-arrowdown');
}
function HideDate(){
    $('.date-content').removeClass('grade-w-roll');
    $('#date-icon').removeClass('mui-icon-arrowup');
    $('#date-icon').addClass('mui-icon-arrowdown');
}

function HideMask(){
    $('.mask').css('display','none');
}
function ShowMask(){
    $('.mask').css('display','block');
}




