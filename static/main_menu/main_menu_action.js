/**
 * 
 * 
 */

$(document).ready(function() {
	// Set parent to active status when clicking on sub-menus.
	$('a[href="' + this.location.pathname + '"]').parents('li,ul').addClass('active');
});
