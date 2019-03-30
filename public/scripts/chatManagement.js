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
	$('#messages').show(); 
	$('#selectFriend').hide();
	$('#welcomeMessage').hide();

	var listInnerHTML='';
	res['data'].forEach(function(rows) {
		if (rows.sender_id == parseInt(res['userid'])) {
			listInnerHTML += '<p class="user">' + res['username'] + ':<br>' + rows.message + '</>';
		} else { 
			listInnerHTML += '<p class="contact">' + res['contactusername'] + ':<br>' + rows.message + '</>';
		}
	});
	$('#messageList').html(listInnerHTML);
}

//callback function for a failed response - notice the change in the parameter order
function selectConversationFailed(jqXHR, status, res) {
	$('.error').html(jqXHR.responseText);
}

$('#sendMessage').submit(function(event) {
	//this prevents the POST default action
	event.preventDefault();

	//establish variables
	var message = $('#messageText').val(); 

	//call the POST action manually to connect with the nodeJS functions
	$.post('/sendMessage', { message: message }) 
			//because there is a response on success and failure setup two callbacks
		  .done(sendMessageComplete)
		  .fail(sendMessageFailed)		
});

//callback function for a successful response - notice the order of the parameters
function sendMessageComplete(res, status, jqXHR) {
	$('.error').html('');

	var listInnerHTML = '';
	res['data'].forEach(function(rows) {
		if (rows.sender_id == parseInt(res['userid'])) {
			listInnerHTML += '<p class="user">' + res['username'] + ':<br>' + rows.message + '</>';
		} else { 
			listInnerHTML += '<p class="contact">' + res['contactusername'] + ':<br>' + rows.message + '</>';
		}
	});
	$('#messageList').html(listInnerHTML);
}

//callback function for a failed response - notice the change in the parameter order
function selectConversationFailed(jqXHR, status, res) {
	$('.error').html(jqXHR.responseText);
}