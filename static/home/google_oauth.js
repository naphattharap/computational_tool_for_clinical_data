//$(document).ready(function() {
//
//	
//});

/**
	 * Handle Sign In button for Google OAuth 
	 * and send request to sign-in in backend side.
	 */
	function onSignIn(googleUser) {
		  console.log('Success');
		  let profile = googleUser.getBasicProfile();
		  let fullName = profile.getName();
		  let email = profile.getEmail();
		  let imageUrl = profile.getImageUrl();
		  
		  var id_token = googleUser.getAuthResponse().id_token;
		  console.log('id_token: ' +id_token);
		  console.log('fullName: ' +fullName);
		  console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
		  console.log('Name: ' + profile.getName());
		  console.log('Image URL: ' + profile.getImageUrl());
		  console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present. */
	}

	/**
	 * Show notification box when sign-in error.
	 * @returns
	 */
	function onSignInFailure() {
		 console.log('Fail ');
		  // Handle sign-in errors
		}

	/**
	 * Clear information when user sign-out
	 * @returns
	 */
	function signOut() {
		    var auth2 = gapi.auth2.getAuthInstance();
		    auth2.signOut().then(function () {
		      console.log('User signed out.');
		    });
	}

	/**
	 * Switch the display and hide when user sign-in/out.
	 * After signing-in, shows Sign Out button.
	 * After signing-out, shows Sign In button. 
	 * @returns
	 */
	function switchSignInOut(){
		
	}
