//when a user clicks the link to sign up for an account
$('#addNewContact').click(function(event) {
	event.preventDefault();
	$('#addContactInfo').show();
	$('#deleteFriend').hide();
	$('.error').html('');
	$('#messages').hide();
	$('#selectFriend').hide(); 
	$('#usernameAddFriend').html('');
	$('#welcomeMessage').hide();
	return false;
});

//when a user submits the form to add a friend
$('#addFriendForm').submit(function(event) {
	//this prevents the POST default action
	event.preventDefault();

	//establish variables
	var username = $('#usernameAddFriend').val(); 

	//call the POST action manually to connect with the nodeJS functions
	$.post('/addContact', { username: username }) 
			//because there is a response on success and failure setup two callbacks
		  .done(addContactComplete)
		  .fail(addContactFailed)		
});

//callback function for a successful response - notice the order of the parameters
function addContactComplete(res, status, jqXHR) {
	$('#addContactInfo').hide();
	$('#deleteFriend').hide();
	$('.error').html('');
	$('#messages').hide(); 
	$('#selectFriend').hide();
	$('#welcomeMessage').show();
}

//callback function for a failed response - notice the change in the parameter order
function addContactFailed(jqXHR, status, res) {
	$('.error').html(jqXHR.responseText);
}

//when a user clicks the link to delete a contact
$('#deleteContact').click(function(event) {
	event.preventDefault();
	$('#addContactInfo').hide();
	$('.contactListSelect').html('');
	$('#deleteFriend').show();
	$('.error').html('');
	$('#messages').hide();
	$('#selectFriend').hide();
	$('#welcomeMessage').hide();
	$.post('/deleteContactList')
			//because there is a response on success and failure setup two callbacks
		  .done(deleteContactList)
		  .fail(getDeleteContactListFailed)
	return false;
});

//callback function for a successful response - notice the order of the parameters
function deleteContactList(res, status, jqXHR) {
	$('#addContactInfo').hide(); 
	$('#contactName').html(res.contactusername);
	$('#deleteFriend').show();
	$('.error').html('');
	$('#messages').hide(); 
	$('#selectFriend').hide();
	$('#welcomeMessage').hide();

	var listInnerHTML = '';
	res.forEach(function(rows) {
		listInnerHTML += '<option value="' + rows.username + '">' + rows.username + '</option>'	
	});
	$('.contactListSelect').html(listInnerHTML);
}

//callback function for a failed response - notice the change in the parameter order
function getDeleteContactListFailed(jqXHR, status, res) {
	$('.error').html(jqXHR.responseText);
}

$('#deleteFriendForm').submit(function(event) {
	//this prevents the POST default action
	event.preventDefault();

	//establish variables
	var contactusername = $('.contactListSelect:selected').val(); 

	//call the POST action manually to connect with the nodeJS functions
	$.post('/deleteContact', { contactusername: contactusername }) 
			//because there is a response on success and failure setup two callbacks
		  .done(deleteContactComplete)
		  .fail(deleteContactFailed)		
});

//callback function for a successful response - notice the order of the parameters
function deleteContactComplete(res, status, jqXHR) {
	$('#addContactInfo').hide(); 
	$('.contactListSelect').html('');
	$('#deleteFriend').hide();
	$('.error').html('');
	$('#messages').hide(); 
	$('#selectFriend').hide();
	$('#welcomeMessage').show();
}

//callback function for a failed response - notice the change in the parameter order
function deleteContactFailed(jqXHR, status, res) {
	$('.error').html(jqXHR.responseText);
}
