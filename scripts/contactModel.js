const { Pool } = require('pg');
const db_url = process.env.DATABASE_URL; 

const pool = new Pool({
	connectionString: db_url,
	ssl: true
});

function addContact (req, res){
	//----------------------------------------SHOULD VERIFY THERE IS NO SQL INJECTION
	const username = req.body.username;
	
	var sql = 'SELECT id, username FROM app_user WHERE username=$1::text';
	var values = [username];
	pool.query(sql, values, function (err, data) {
		if (err) {
			console.log(err);
			//there was a problem with authentication, send an error to the user
			res.status(400).send("An unknown error occurred.");
		} else {
			var contactid = data.rows[0]['id'];
			console.log(contactid);
			console.log(req.session.userid);
			sql = 'INSERT INTO friend (user1_id, user2_id) VALUES($1::integer, $2::integer)';
			values = [parseInt(req.session.id), contactid];
			pool.query(sql, values, function(err, data) {
				if (err) {
					console.log(err);
					res.status(401).send("Error: There was a problem connecting with that user.");
				} else {
					//start a session and return the data
					req.session.contactid = data.rows[0]['id'];
					req.session.contactusername = data.rows[0]['username'];
					console.log(req.session.username);
		   			res.status(200).send({ id: data.rows[0]['id'], 
										  username: data.rows[0]['username'] });				
				}
			}); 
		}	
	});
}

module.exports = {
	addContact: addContact
};