const { Pool } = require('pg');
const db_url = process.env.DATABASE_URL; 

const pool = new Pool({
	connectionString: db_url,
	ssl: true
});


function selectConversation (req, res) {
	req.session.contactusername = req.body.contactusername;
	sql = 'SELECT id FROM app_user WHERE username = $1::text';
	values = [req.session.contactusername];
	pool.query(sql, values, function(err, data) {
		if (err) {
			console.log(err);
			res.status(500).send("Error: There was a problem connecting with that user.");
		} else {
			req.session.contactid = data.rows[0]['id'];
			sql = 'SELECT * FROM (SELECT message.id, sender_id, receiver_id, message, timestamp) FROM message WHERE sender_id = $1::integer AND receiver_id = 2::integer UNION SELECT (message.id, sender_id, receiver_id, message, timestamp) FROM message WHERE sender_id = $2::integer AND receiver_id = $1::integer) tmp ORDER BY tmp.timestamp;'; 
			values = [req.session.contactid, req.session.userid];
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
			sql = 'SELECT * FROM (SELECT message.id, sender_id, receiver_id, message, timestamp)  FROM message WHERE sender_id = $1::integer AND receiver_id = 2::integer UNION SELECT (message.id, sender_id, receiver_id, message, timestamp) FROM message WHERE sender_id = $2::integer AND receiver_id = $1::integer) tmp ORDER BY tmp.timestamp;'; 
			values = [req.session.contactid, req.session.userid];
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
	selectConversation: selectConversation,
	insertMessage: insertMessage
};