//when a user clicks the link to select a friend to chat with
$('#selectConversation').click(function(event) {
	event.preventDefault();
	$('#addContactInfo').hide();
	$('#deleteFriend').hide();
	$('#deleteMessage').css("visibility", "hidden");
	$('#editMessage').css("visibility", "hidden");
	$('.error').html('');
	$('#messages').hide();
	$('#selectFriend').hide();
	$('#welcomeMessage').hide();
	$.post('/selectContactList')
			//because there is a response on success and failure setup two callbacks
		  .done(displayContactList)
		  .fail(getContactListFailed)
	return false;
});

//callback function for a successful response - notice the order of the parameters
function displayContactList(res, status, jqXHR) {
	$('#addContactInfo').hide();
	$('.contactListSelect').html('');
	$('#deleteFriend').hide();
	
	$('.error').html('');
	$('#contactName').html(res.contactusername); 
	$('#messages').hide(); 
	$('#selectFriend').show();
	$('#welcomeMessage').hide();

	var listInnerHTML = '';
	res.forEach(function(rows) {
		listInnerHTML += '<option value="' + rows.username + '">' + rows.username + '</option>'	
	});
	$('.contactListSelect').html(listInnerHTML);
}

//callback function for a failed response - notice the change in the parameter order
function getContactListFailed(jqXHR, status, res) {
	$('.error').html(jqXHR.responseText);
}

$('#selectFriendForm').submit(function(event) {
	//this prevents the POST default action
	event.preventDefault();

	//establish variables
	var contactusername = $('.contactListSelect').val(); 

	//call the POST action manually to connect with the nodeJS functions
	$.post('/selectConversation', { contactusername: contactusername }) 
			//because there is a response on success and failure setup two callbacks
		  .done(selectConversationComplete)
		  .fail(selectConversationFailed)		
});

//callback function for a successful response - notice the order of the parameters
function selectConversationComplete(res, status, jqXHR) {
	$('#addContactInfo').hide();
	$('#deleteFriend').hide();
	$('#deleteMessage').css("visibility", "visible");
	$('#editMessage').css("visibility", "visible");
	$('.error').html('');
	$('#messages').show(); 
	$('#selectFriend').hide();
	$('#welcomeMessage').hide();

	var listInnerHTML='';
	res['data'].forEach(function(rows) {
		if (rows.sender_id == parseInt(res['userid'])) {
			listInnerHTML += '<p class="user" id="' + rows.id + '">' + res['username'] + ':<br><span>' + rows.message + '</span></>';  
		} else { 
			listInnerHTML += '<p class="contact" id="' + rows.id + '">' + res['contactusername'] + ':<br><span>' + rows.message + '</span></>';
		}
	});
	$('#messageList').html(listInnerHTML);
}

//callback function for a failed response - notice the change in the parameter order
function selectConversationFailed(jqXHR, status, res) {
	$('.error').html(jqXHR.responseText);
}

$('#editMessage').click(function(event) {
	//populate the send message input with the value of the last message sent by the user
	var messages = document.getElementsByClassName('user').getElementByTagName('span');
	var message = messages[messages.length-1].innerHTML;
	console.log(message);
	$('#messageText').val(message); 	
});

////callback function for a successful response - notice the order of the parameters
//function sendMessageComplete(res, status, jqXHR) {
//	$('.error').html('');
//	console.log(rows);
//	var listInnerHTML = '';
//	res['data'].forEach(function(rows) {
//		if (rows.sender_id == parseInt(res['userid'])) {
//			listInnerHTML += '<p class="user" id="' + rows.id + '">' + res['username'] + ':<br>' + rows.message + '</>';  
//		} else { 
//			listInnerHTML += '<p class="contact" id="' + rows.id + '">' + res['contactusername'] + ':<br>' + rows.message + '</>';
//		}
//	});
//	$('#messageList').html(listInnerHTML);
//	$('#messageText').val('');
//}
//
////callback function for a failed response - notice the change in the parameter order
//function sendMessageFailed(jqXHR, status, res) {
//	$('.error').html(jqXHR.responseText);
//}
