const { Pool } = require('pg');
const db_url = process.env.DATABASE_URL; 

const pool = new Pool({
	connectionString: db_url,
	ssl: true
});

function getContactList (req, res) {
	var sql = 'SELECT c.id id, c.username username FROM app_user c JOIN friend f ON c.id = f.user2_id WHERE f.user1_id = $1::integer INTERSECT SELECT c.id id, c.username username FROM app_user c JOIN friend f ON c.id = f.user1_id WHERE f.user2_id = $1::integer'; 
	values = [req.session.userid];
	pool.query(sql, values, function (err, data) {
		if (err) {
			console.log(err);
			res.status(500).send("Error: There was a problem creating your contact list.");
		} else {
			res.status(200).send(data.rows);
		}
	});
}

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

function updateMessage (req, res) {
	var message = req.body.message;
	var messageId = req.body.messageId;
	console.log(message);
	console.log(messageId);
	sql = 'UPDATE message SET message = $1::text WHERE id = $2::integer;';
	values = [message, messageId];
	pool.query(sql, values, function(err, data) {
		if (err) {
			console.log(err);
			res.status(500).send("Error: There was a problem updating your message.");
		} else {
			sql = 'SELECT message.id, sender_id, receiver_id, message, timestamp FROM message WHERE sender_id = $1::integer AND receiver_id = $2::integer UNION SELECT message.id, sender_id, receiver_id, message, timestamp FROM message WHERE sender_id = $2::integer AND receiver_id = $1::integer ORDER BY timestamp;'; 
			values = [req.session.userid, req.session.contactid];
			pool.query(sql, values, function(err, data) {
				if (err) {
					console.log(err);
					res.status(500).send("Error: There was a problem receiving new messages.");
				} else {
					console.log(data);
					res.status(200).send({contactusername: req.session.contactusername, userid: req.session.userid, username: req.session.username, data: data.rows});
				}
			});
		}
	});
}

function removeMessage (req, res) {
	var messageId = req.body.messageId;
	console.log(messageId);
	sql = 'DELETE FROM message WHERE id = $1::integer;';
	values = [messageId];
	pool.query(sql, values, function(err, data) {
		if (err) {
			console.log(err);
			res.status(500).send("Error: There was a problem deleting your message.");
		} else {
			sql = 'SELECT message.id, sender_id, receiver_id, message, timestamp FROM message WHERE sender_id = $1::integer AND receiver_id = $2::integer UNION SELECT message.id, sender_id, receiver_id, message, timestamp FROM message WHERE sender_id = $2::integer AND receiver_id = $1::integer ORDER BY timestamp;'; 
			values = [req.session.userid, req.session.contactid];
			pool.query(sql, values, function(err, data) {
				if (err) {
					console.log(err);
					res.status(500).send("Error: There was a problem receiving new messages.");
				} else {
					console.log(data);
					res.status(200).send({contactusername: req.session.contactusername, userid: req.session.userid, username: req.session.username, data: data.rows});
				}
			});
		}
	});
}

module.exports = {
	getContactList: getContactList,
	selectChat: selectChat,
	insertMessage: insertMessage, 
	updateMessage: updateMessage, 
	removeMessage: removeMessage
};
