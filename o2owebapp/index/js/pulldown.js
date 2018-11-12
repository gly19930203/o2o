$(document).ready(function(){
	//类别
    $(".category").click(function(){
        if ($('.category-content').hasClass('grade-w-roll')) {
            HideCategory();
            HideMask();
        } else if($('.coursesys-content').hasClass('grade-w-roll')){
        	HideCoursesys();
        	ShowCategory();
        }else if($('.sort-content').hasClass('grade-w-roll')){
        	HideSort();
        	ShowCategory();
        }else {
        	ShowCategory();
        	ShowMask();
        }
    });
    //课制
    $(".coursesys").click(function(){
        if ($('.coursesys-content').hasClass('grade-w-roll')) {
            HideCoursesys();
            HideMask();
        }else if($('.category-content').hasClass('grade-w-roll')){
        	HideCategory();
        	ShowCoursesys();
        }else if($('.sort-content').hasClass('grade-w-roll')){
        	HideSort();
        	ShowCoursesys();
        }else {
        	ShowCoursesys();
        	ShowMask();
        }
    });
	//智能排序
    $(".sort").click(function(){
        if ($('.sort-content').hasClass('grade-w-roll')) {
            HideSort();
            HideMask();
        }else if($('.category-content').hasClass('grade-w-roll')){
        	HideCategory();
        	ShowSort();
        }else if($('.coursesys-content').hasClass('grade-w-roll')){
        	HideCoursesys();
        	ShowSort();
        } else {
        	ShowSort();
        	ShowMask();
        }
    });
	$(".mask").click(function(){
		HideCategory();
		HideCoursesys();
        HideSort();
        HideMask();
    });
});





//类别出现消失
function ShowCategory(){
    $('.category-content').addClass('grade-w-roll');
    $('#category-icon').addClass('mui-icon-arrowup');
    $('#category-icon').removeClass('mui-icon-arrowdown');
}
function HideCategory(){
    $('.category-content').removeClass('grade-w-roll');
    $('#category-icon').removeClass('mui-icon-arrowup');
    $('#category-icon').addClass('mui-icon-arrowdown');
}
//课制出现消失
function ShowCoursesys(){
    $('.coursesys-content').addClass('grade-w-roll');
    $('#coursesys-icon').addClass('mui-icon-arrowup');
    $('#coursesys-icon').removeClass('mui-icon-arrowdown');
}
function HideCoursesys(){
    $('.coursesys-content').removeClass('grade-w-roll');
    $('#coursesys-icon').removeClass('mui-icon-arrowup');
    $('#coursesys-icon').addClass('mui-icon-arrowdown');
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

function HideMask(){
    $('.mask').css('display','none');
}
function ShowMask(){
    $('.mask').css('display','block');
}