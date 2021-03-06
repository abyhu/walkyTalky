const bcrypt = require('bcrypt-nodejs');
const { Pool } = require('pg');
const db_url = process.env.DATABASE_URL; 

const pool = new Pool({
	connectionString: db_url,
	ssl: true
});

function createAccount (req, res){ 
	//---------------------------------------SHOULD VERIFY THERE IS NO SQL INJECTION
	const username = req.body.username;
	const password = req.body.password;
	
	const hashedPassword = bcrypt.hashSync(password);
	var sql = 'INSERT INTO app_user (username, password) VALUES ($1::text, $2::text)';
	var values = [username, hashedPassword];
	pool.query(sql, values, function (err, data) {
		if (err) {
			res.status(400).send("Error: There was an error creating this account.");
		} else {
			res.status(204).send();
		}
	});
}

function login (req, res){
	//----------------------------------------SHOULD VERIFY THERE IS NO SQL INJECTION
	const username = req.body.username;
	const password = req.body.password;
	
	var sql = 'SELECT id, username, password FROM app_user WHERE username=$1::text';
	var values = [username];
	pool.query(sql, values, function (err, data) {
		if (err || data.rows < 1) {
			//there was a problem with authentication, send an error to the user
			console.log(err);
			res.status(400).send("An error occured, do you need to create an account?");
		} else {	
			bcrypt.compare(password, data.rows[0]['password'], function(err, result) {
				if (!result) {
					//login failed as password was not correct, send error message
					res.status(401).send("Error: The username or password is incorrect.");
				} else {
					//start a session and return the data
					req.session.userid = data.rows[0]['id'];
					req.session.username = data.rows[0]['username'];
		   			res.status(200).send({ id: data.rows[0]['id'], 
										  username: data.rows[0]['username'] });				
				}
			}); 
		}	
	});
}

function logout (req, res){
	try {
		//-------------------------SESSON END? SOMETHING NEEDS TO HAPPEN HERE TO LOGOUT THE USER
		req.session.destroy(); 
		res.render('pages/index'); 
	} catch (err) {
		console.log(err);
		res.send("Error " + err);
	}
}

module.exports = {
	createAccount: createAccount,
	login: login,
	logout: logout
};