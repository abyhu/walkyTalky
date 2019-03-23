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
			res.status(400).send("Error: That user is not a member of WalkyTalky.");
		} else {
			req.session.contactid = data.rows[0]['id'];
			req.session.contactusername = data.rows[0]['username'];
			sql = 'INSERT INTO friend (user1_id, user2_id) VALUES($1::integer, $2::integer) ON CONFLICT ON CONSTRAINT contact DO NOTHING';
			values = [req.session.userid, req.session.contactid];
			pool.query(sql, values, function(err, data) {
				if (err) {
					console.log(err);
					res.status(500).send("Error: There was a problem connecting with that user.");
				} else {
					res.status(200).send({ contactid: req.session.contactid, 
											contactusername: req.session.contactusername, 
										 	userid: req.session.userid,
										 	username: req.session.username });
				}
			});
		}
	});
}

module.exports = {
	addContact: addContact
};