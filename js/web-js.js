/*網站區js*/
$(document).ready(function() {


	/*03*/
	/*小視口導覽列開合*/
	$(".jsNavSml-bt").on('click',function(){
		// console.log("我有觸發click事件");
		$(".jsNavSmall").animate({
		  left: '0',
		});
		$(".jsNavSml-openbg").show();
	});
	$(".jsNavSml-bt--close").on('click',function(){
		// console.log("我有觸發關閉事件");
		$(".jsNavSmall").animate({
			left: '-320',
		});
		$(".jsNavSml-openbg").fadeOut(500);
	});
	$(".jsNavSml-openbg").on('click',function(){
		// console.log("我有觸發關閉事件");
		$(".jsNavSmall").animate({
			left: '-320',
		});
		// $(".jspatSmlNavNote").animate({
		// 	left: '-320',
		// });
		$(".jsNavSml-openbg").fadeOut(500);
	});

	/*小視口導覽列以及大視口導覽列第二層開合特效*/
	$(".jsfirst-level-area").stop(true).click(function(){
		//alert("123");
		// if($(this).children(".second_level_area").css("display") == "none" && $(".nav_link").width() > 960){
		// 	$(".first_level_area > .second_level_area").slideUp(200);
  //           $(this).children(".second_level_area").slideDown(200);
		// }
		if($(this).children(".jssecond-level-area").css("display") == "none" ){
			$(".jsfirst-level-area > .jsecond-level-area").slideUp(200);
            $(this).children(".jssecond-level-area").slideDown(200);
            //$(this).removeClass("ori_style");
            //$(this).addClass("open_style");

		}else if($(this).children(".jssecond-level-area").css("display") == "block"){
			$(this).children(".jssecond-level-area").slideUp(200);
			//$(this).removeClass("open_style");
			//$(this).addClass("ori_style");
		};

	});

	//小視口通知按鈕
	// $(".jsNoteBt").on('click',function(){
	// 	// console.log("我有觸發click事件");
	// 	$(".jsNavSmall").animate({
	// 	  left: '-320',
	// 	});
	// 	$(".jspatSmlNavNote").animate({
	// 		left: '0',
	// 	});
	// 	$(".jsNavSml-openbg").show();
	// });
	// $(".jsNavSmlNote-bt--close").on('click',function(){
	// 	// console.log("我有觸發關閉事件");
	// 	$(".jspatSmlNavNote").animate({
	// 		left: '-320',
	// 	});
	// 	$(".jsNavSml-openbg").fadeOut(500);
	// });


	//user欄位按鈕
	$(".jsUserInfoBt").unbind('click').on('click', function () {
		if ($(".jsUserInfo").css("display") == "none") {
			$(".jsUserInfo").slideDown(500);
			$(".jsUserInfoBt-arrow").css({
				transform: 'rotate(180deg)',
			});
		} else {
			$(".jsUserInfo").slideUp(500);
			$(".jsUserInfoBt-arrow").css({
				transform: 'rotate(0deg)',
			});
		};
	});

	/*del icon bt關閉*/
	// $(".jsOrgViewCard-bt").on('click',function(){
	// 	$(".jsOrgViewCard").fadeToggle(500);
	// });

	// $(".jsOrgEditCard-bt").on('click',function(){
	// 	$(".jsOrgEditCard").fadeToggle(500);
	// });


	/*js dropdown arrow 特效*/
	// $(".jsClick-dropdown").click(function(){
	// 	alert("123");
	// 	$(".jsClick-dropdown--effect").css('-webkit-transform','rotate('+180+'deg)'); 
	
	// });

	

	/*按鈕according 特效*/
	$( document ).stop(true).on( "click", ".js-AccordingBt", function(){
		var get_class = $(this).prop("id");
		var get_class_number = get_class.split("-");
		var class_number = get_class_number[2];
		var get_id = "#" + "js-AccordingSection-" + class_number;
		var get_bt_id = "#" + "js-According-" + class_number;
		

		if($(get_id).css("display") == "block"){
			$(get_bt_id).removeClass("jsRotate");
			$(get_id).slideUp(300);
		}else if ($(get_id).css("display") == "none"){
			$(get_bt_id).addClass("jsRotate");
			$(get_id).slideDown(300);
		}
	});


	/* tab 切換特效*/
	$( document ).on( "click", ".jsTabBt", function(){
		var get_class = $(this).prop("id");
		var get_class_number = get_class.split("-");
		var class_number = get_class_number[1];
		var get_bt_id = "#" + "jsTabBtId-" + class_number;
		var get_id = "#" + "jsTabId-" + class_number;
	
		$(".jsTabBt").removeClass("eleTab--in");
		$(".jsTabContent").hide();
		$(get_bt_id).addClass("eleTab--in");
		$(get_id).show();

	});
	$( "#jsTabManBt" ).on( "click", function(){
		$(".jsTabBt").removeClass("eleTab--in");
		$(".jsTabContent").hide();
		$("#jsTabBtId-04").addClass("eleTab--in");
		$("#jsTabId-04").show();

	});

	/* 案件列表開合特效*/
	// $( document ).on( "click", ".js-openBt", function(){
		
	// 	if($(".js-openInfo").css("display") == "block"){
	// 		$(".js-openInfo").slideUp();
	// 	}else{
	// 		$(".js-openInfo").slideDown();
	// 	}

	// });

	/**/
	// patLogoutCountArea
	// let windowTopY = 0 ;
	// $(window).scroll(function(){
		//     let nowScrollY = window.scrollTop ;
		//     // console.log("現在y:" + nowY);
		//     if (nowScrollY > windowTopY){
			//         $(".patLogoutCountArea").hide();
			//     }else if(nowScrollY < windowTopY){
				//         $(".patLogoutCountArea").show();
				//     }
				//     windowTopY = nowScrollY;
				//     // console.log("儲存y:" + windowY);
				// });
	/*往上捲出現time區塊,往下隱藏*/
	// var position = $(window).scrollTop();
	// var windowW = $(window).width();
	// $(window).scroll(function() {
	// 	var scroll = $(window).scrollTop();
	// 	if(windowW < 1280 && scroll > position) {
	// 		// console.log('scrollDown');
    //     	$(".patLogoutCountArea").hide();
	// 	} else {
	// 		// console.log('scrollUp');
    //     	$(".patLogoutCountArea").show();
	// 	}
	// 	position = scroll;
	// });


	
  	
});

