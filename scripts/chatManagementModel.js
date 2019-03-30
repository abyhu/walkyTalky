const { Pool } = require('pg');
const db_url = process.env.DATABASE_URL; 

const pool = new Pool({
	connectionString: db_url,
	ssl: true
});


function selectConversation (req, res) {
	var contactusername = req.body.contactusername;
	sql = 'SELECT * FROM (SELECT message.id, sender_id, receiver_id, message, timestamp from message JOIN app_user ON app_user.id = message.receiver_id WHERE username = $1::text UNION SELECT message.id, sender_id, receiver_id, message, timestamp from message JOIN app_user ON app_user.id = message.sender_id WHERE username = $1::text AND receiver_id = $2::integer) tmp ORDER BY tmp.timestamp;'; 
	values = [contactusername, req.session.userid];
	pool.query(sql, values, function(err, data) {
		if (err) {
			console.log(err);
			res.status(500).send("Error: There was a problem connecting with that user.");
		} else {
			res.status(200).send({contactusername: contactusername, userid: req.session.userid, username: req.session.username, data: data.rows});
		}
	});
}


module.exports = {
	selectConversation: selectConversation,
};