const { Pool } = require('pg');
const db_url = process.env.DATABASE_URL; 

const pool = new Pool({
	connectionString: db_url,
	ssl: true
});

function addContact (req, res){
	//----------------------------------------SHOULD VERIFY THERE IS NO SQL INJECTION
	const contactusername = req.body.username;
	
	var sql = 'SELECT id, username FROM app_user WHERE username=$1::text';
	var values = [contactusername];
	pool.query(sql, values, function (err, data) {
		if (err) {
			console.log(err);
			res.status(400).send("Error: There was a problem connecting with that user.");
		} else {
			try {
				var contactid = data.rows[0]['id'];
				var contactusername = data.rows[0]['username'];
				sql = 'INSERT INTO friend (user1_id, user2_id) VALUES($1::integer, $2::integer) ON CONFLICT ON CONSTRAINT contact DO NOTHING';
				values = [req.session.userid, contactid];
				pool.query(sql, values, function(err, data) {
					if (err) {
						console.log(err);
						res.status(500).send("Error: There was a problem connecting with that user.");
					} else {
						res.status(204).send();
					}
				});
			} catch {
				res.status(400).send("Error: That user is not a member of WalkyTalky.");	   
			}
		}
	});
}

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

function selectConversation (req, res) {
	var contactusername = req.body.contactusername;
	sql = 'SELECT m.id, m.sender_id, m.receiver_id, m.message, timestamp FROM app_user a JOIN message m ON m.receiver_id = a.id JOIN message m2 ON m2.receiver_id = $1::integer WHERE username = $2::text ORDER BY m.timestamp'; 
	values = [req.session.userid, contactusername];
	pool.query(sql, values, function(err, data) {
		if (err) {
			console.log(err);
			res.status(500).send("Error: There was a problem connecting with that user.");
		} else {
			res.status(200).send({contactusername: contactusername, userid: req.session.userid, username: req.session.username, data: data.rows});
		}
	});
}

/*function deleteContact (req, res) {
	const contactuserid = req.body.contactuserid;
	var sql = 'DELETE FROM friend WHERE user1_id=$1::integer AND user2_id=$2::integer'; 
	values = [req.session.userid, contactuserid];
	pool.query(sql, values, function (err, data) {
		if (err) {
			console.log(err);
			res.status(500).send("Error: There was a problem deleting that contact.");
		} else {
			res.status(200).send("DELETED now need to adjust the page.");
		}
	});
}*/

module.exports = {
	addContact: addContact, 
	getContactList: getContactList, 
	selectConversation: selectConversation,
	/*deleteContact: deleteContact*/
};