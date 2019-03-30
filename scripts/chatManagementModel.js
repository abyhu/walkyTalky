const { Pool } = require('pg');
const db_url = process.env.DATABASE_URL; 

const pool = new Pool({
	connectionString: db_url,
	ssl: true
});


function selectChat (req, res) {
	req.session.contactusername = req.body.contactusername;
	sql = 'SELECT id FROM app_user WHERE username = $1::text';
	values = [req.session.contactusername];
	pool.query(sql, values, function(err, data) {
		if (err) {
			console.log(err);
			res.status(500).send("Error: There was a problem connecting with that user.");
		} else {
			req.session.contactid = data.rows[0]['id'];
			sql = 'SELECT message.id, sender_id, receiver_id, message, timestamp FROM message WHERE sender_id = $1::integer AND receiver_id = $2::integer UNION SELECT message.id, sender_id, receiver_id, message, timestamp FROM message WHERE sender_id = $2::integer AND receiver_id = $1::integer ORDER BY timestamp;'; 
			values = [req.session.userid, req.session.contactid];
			pool.query(sql, values, function(err, data) {
				if (err) {
					console.log(err);
					res.status(500).send("Error: There was a problem connecting with that user.");
				} else {
					res.status(200).send({contactusername: req.session.contactusername, userid: req.session.userid, username: req.session.username, data: data.rows});
				}
			});
		}
	});	
}

function insertMessage (req, res) {
	sql = 'INSERT INTO message (sender_id, receiver_id, message, timestamp) VALUES ($1::integer, $2::integer, $3::text, now());';
	values = [req.session.userid, req.session.contactid, req.body.message];
	pool.query(sql, values, function(err, data) {
		if (err) {
			console.log(err);
			res.status(500).send("Error: There was a problem sending your message.");
		} else {
			sql = 'SELECT message.id, sender_id, receiver_id, message, timestamp FROM message WHERE sender_id = $1::integer AND receiver_id = $2::integer UNION SELECT message.id, sender_id, receiver_id, message, timestamp FROM message WHERE sender_id = $2::integer AND receiver_id = $1::integer ORDER BY timestamp;'; 
			values = [req.session.userid, req.session.contactid];
			pool.query(sql, values, function(err, data) {
				if (err) {
					console.log(err);
					res.status(500).send("Error: There was a problem receiving new messages.");
				} else {
					res.status(200).send({contactusername: req.session.contactusername, userid: req.session.userid, username: req.session.username, data: data.rows});
				}
			});
		}
	});
}

module.exports = {
	selectChat: selectChat,
	insertMessage: insertMessage
};

//when a user clicks the link to sign up for an account
$('#selectConversation').click(function(event) {
	event.preventDefault();
	$('#addContactInfo').hide();
	$('#deleteFriend').hide();
	$('.error').html('');
	$('#messages').hide();
	$('#selectFriend').hide();
	$('#welcomeMessage').hide();
	$.post('/contactList')
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
