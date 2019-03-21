//use AJAX instead of an action to keep the data on the same page. 
$('#loginForm').submit(function(event) {
		
	//this prevents the POST default action
	event.preventDefault();
				
	//establish variables
	var username = $('#username').val(); 
	var password = $('#password').val(); 
	
	//call the POST action manually to connect with the nodeJS functions
	$.post('/login', { username: username, password: password }) 
			//because there is a response on success and failure setup two callbacks
		  .done(loginComplete)
		  .fail(loginFailed)		
});
			
//callback function for a successful response - notice the order of the parameters
function loginComplete(res, status, jqXHR) {
	$('#loginForm').hide(); 
	$('#walkyTalky').show(); 
	$('#error').html('');
	//------------------------------------------------SHOULD START A SESSION WITH ID
	$('#welcomeUser').html(res.userName);
}
			
//callback function for a failed response - notice the change in the parameter order
function loginFailed(jqXHR, status, res) {
	$('#error').html(jqXHR.responseText);
}		