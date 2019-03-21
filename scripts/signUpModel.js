const bcrypt = require('bcrypt-nodejs');
const { Pool } = require('pg');
const db_url = process.env.DATABASE_URL; 

const pool = new Pool({
	connectionString: db_url,
	ssl: true
});

function createAccount (req, res){ 
	//---------------------------------------IF POSSIBLE, VERIFY THERE IS NO SQL INJECTION
	const username = req.body.username;
	const password = req.body.password;
	
	const hashedPassword = bcrypt.hashSync(password);
	const client = pool.connect();
	var sql = 'INSERT INTO app_user (username, password) VALUES ($1::text, $2::text)';
	var values = [username, hashedPassword];
	client.query(sql, values, function (err, data) {
		if (err) {
			console.error(err);
			res.send("Error " + err);
			//-------------------------------SHOULD RETURN AN ERROR TO THE USER TO SEE
		} else {
			res.render('pages/index');
			client.release();
		}
	});
}

module.exports = {
	createAccount: createAccount
};