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
	var sql = 'INSERT INTO app_user (username, password) VALUES ($1::text, $2::text)';
	var values = [username, hashedPassword];
	pool.query(sql, values, function (err, data) {
		if (err) {
			console.error(err);
			res.send("Error " + err);
			//-------------------------------SHOULD RETURN AN ERROR TO THE USER TO SEE
		} else {
			res.render('pages/index');
			pool.release();
		}
	});
}

login (req, res) {
	//----------------------------------------SHOULD VERIFY THERE IS NO SQL INJECTION
	const username = req.body.username;
	const password = req.body.password;

	const client = await pool.connect();
	var sql = 'SELECT id, username, password FROM app_user WHERE username=$1::text';
	var values = [username];
	pool.query(sql, values, function (err, data) {
		if (err) {
			res.send("Error " + err);
			//-------------------------------SHOULD RETURN AN ERROR TO THE USER TO SEE
		} else {
			pool.release();
			console.log(data);
			
			bcrypt.compare(password, data.rows[0]['password'], function(err, result) {
				if (!result) {
					//-------------------------------SHOULD RETURN AN ERROR TO THE USER TO SEE
					res.send("Error: The passwords do not match.");
				} else {
					var param = data.rows[0]['id']; 
					//--------------------------------SHOULD START A SESSION WITH ID
		   			res.render('pages/walkyTalky');	 
				}
			}); 
		}	
	});
}

function logout (req, res){
	try {
		//-------------------------SESSON END? SOMETHING NEEDS TO HAPPEN HERE TO LOGOUT THE USER
		res.render('pages/index'); 

	} catch (err) {
		console.error(err);
		res.send("Error " + err);
	}
}

module.exports = {
	createAccount: createAccount,
	login: login,
	logout: logout
};