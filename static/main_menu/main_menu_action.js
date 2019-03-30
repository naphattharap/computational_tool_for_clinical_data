/**
 * 
 * 
 */

$(document).ready(function() {
	$("#group_menu_1").find('li').click(function(e) {
		ele_active = $("#group_menu_1").children(".active");
		$(ele_active).removeClass("active");
		alert($(e));
		$(e).addClass("active");
	});

	// $("#main_menu_data").click(function() {
	// ele_active = $("#group_menu_1").children(".active");
	// $(ele_active).removeClass("active");
	// $(this).parents('li').addClass("active");
	// });
});