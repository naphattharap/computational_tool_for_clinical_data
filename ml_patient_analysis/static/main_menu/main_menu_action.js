/**
 * 
 * 
 */

$(document).ready(function() {
	$("navbar").find('li').click(function(e) {
//		alert("test2");
//		ele_active = $("#navbar").children(".active");
		$(".nav li").removeClass("active");
//		alert(ele_active.classList);
//		$(ele_active).removeClass("active");
//		alert($(e));
		$(e).addClass("active");
	});

	// $("#main_menu_data").click(function() {
	// ele_active = $("#group_menu_1").children(".active");
	// $(ele_active).removeClass("active");
	// $(this).parents('li').addClass("active");
	// });
});


//$(document).ready(function () {
//	  $(".nav li").removeClass("active");//this will remove the active class from  
//	                                     //previously active menu item 
//	  $('#home').addClass('active');
//	  //for demo
//	  //$('#demo').addClass('active');
//	  //for sale 
//	  //$('#sale').addClass('active');
//	});