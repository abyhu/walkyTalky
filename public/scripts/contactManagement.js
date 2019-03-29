//when a user clicks the link to sign up for an account
$('#addNewContact').click(function(event) {
	event.preventDefault();
	$('#addContactInfo').show();
	$('.error').html('');
	$('#messages').hide();
	$('#selectFriend').hide();
	$('#welcomeMessage').hide();
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
		  .done(addContactComplete)
		  .fail(addContactFailed)		
});

//callback function for a successful response - notice the order of the parameters
function addContactComplete(res, status, jqXHR) {
	$('#addContactInfo').hide(); 
	$('.error').html('');
	$('#messages').hide(); 
	$('#selectFriend').hide();
	$('#welcomeMessage').show();
}

//callback function for a failed response - notice the change in the parameter order
function addContactFailed(jqXHR, status, res) {
	$('.error').html(jqXHR.responseText);
}

//when a user clicks the link to sign up for an account
$('#selectConversation').click(function(event) {
	event.preventDefault();
	$('#addContactInfo').hide();
	$('.error').html('');
	$('#messages').hide();
	$('#selectFriend').hide();
	$('#welcomeMessage').hide();
	$.post('/contactList')
			//because there is a response on success and failure setup two callbacks
		  .done(displayContactList)
		  .fail(getContactListFailed)
});

//callback function for a successful response - notice the order of the parameters
function displayContactList(res, status, jqXHR) {
	$('#addContactInfo').hide(); 
	$('.error').html('');
	$('#contactName').html(res.contactusername); 
	$('#messages').show(); 
	$('#selectFriend').show();
	$('#welcomeMessage').hide();
	
	var listInnerHTML = '';
	res.forEach(function(rows) {
		listInnerHTML += '<option value="' + rows.username + '">' + rows.username + '</option>'	
	});
}

//callback function for a failed response - notice the change in the parameter order
function getContactListFailed(jqXHR, status, res) {
	$('.error').html(jqXHR.responseText);
}

$('#selectFriendForm').submit(function(event) {
	//this prevents the POST default action
	event.preventDefault();

	//establish variables
	var contactusername = $('#contactListSelect').val(); 

	//call the POST action manually to connect with the nodeJS functions
	$.post('/selectConversation', { contactusername: contactusername }) 
			//because there is a response on success and failure setup two callbacks
		  .done(selectConversationComplete)
		  .fail(selectConversationFailed)		
});

//callback function for a successful response - notice the order of the parameters
function selectConversationComplete(res, status, jqXHR) {
	$('#addContactInfo').hide(); 
	$('.error').html('');
	$('#contactName').html(res.contactusername); 
	$('#messages').show(); 
	$('#selectFriend').hide();
	$('#welcomeMessage').hide();
}

//callback function for a failed response - notice the change in the parameter order
function selectConversationFailed(jqXHR, status, res) {
	$('.error').html(jqXHR.responseText);
}