//when a user clicks the link to sign up for an account
$('#addNewContact').click(function(event) {
	event.preventDefault();
	$('#welcomeMessage').hide();
	$('#addContactInfo').show();
	return false;
});

$('#addFriendForm').submit(function(event) {

	//this prevents the POST default action
	event.preventDefault();

	//establish variables
	var username = $('#usernameAddFriend').val(); 

	//call the POST action manually to connect with the nodeJS functions
	$.post('/addContact', { username: username }) 
			//because there is a response on success and failure setup two callbacks
		  .done(loginComplete)
		  .fail(loginFailed)		
});

//callback function for a successful response - notice the order of the parameters
function addContactComplete(res, status, jqXHR) {
	$('#addContactInfo').hide(); 
	$('#messages').show(); 
	$('.error').html('');
	$('#contactName').html(res.contactname);  
}

//callback function for a failed response - notice the change in the parameter order
function loginFailed(jqXHR, status, res) {
	$('.error').html(jqXHR.responseText);
}