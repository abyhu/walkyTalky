const express = require('express');
const app = express(); 
const path = require('path');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const PORT = process.env.PORT || 5000;
const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({extended:false});

const { Pool } = require('pg');
const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
	ssl: true
});

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => res.render('pages/index'));
app.get('/signup', (req, res) => res.render('pages/signup'));
app.get('/instructions', (req, res) => res.render('pages/instructions'));
app.get('/references', (req, res) => res.render('pages/references'));
app.get('/logout', async (req, res) => {
	try {
		//SOMETHING NEEDS TO HAPPEN HERE TO LOGOUT THE USER
		res.render('pages/index'); 

	} catch (err) {
		console.error(err);
		res.send("Error " + err);
	}
});

app.get('/db', async (req, res) => {
	try {
		const client = await pool.connect();
		const result = await client.query('SELECT * FROM test_table');
		const results = { 'results': (result) ? result.rows : null};
		res.render('pages/db', results);
		client.release();
	} catch (err) {
		console.error(err);
		res.send("Error " + err);
	}
});

app.post('/createAccount', urlencodedParser, async (req, res) => {

	//SHOULD VERIFY THERE IS NO SQL INJECTION
	const username = req.body.username;
	const password = req.body.password;
	
	const hashedPassword = bcrypt.hashSync(password);
	const client = await pool.connect();
	var sql = 'INSERT INTO app_user (username, password) VALUES ($1::text, $2::text)';
	var values = [username, hashedPassword];
	client.query(sql, values, function (err, data) {
		if (err) {
			console.error(err);
			res.send("Error " + err);
		} else {
			res.render('pages/index');
			client.release();
		}
	});
});

app.post('/login', urlencodedParser, async (req, res) => {

	//SHOULD VERIFY THERE IS NO SQL INJECTION
	const username = req.body.username;
	const password = req.body.password;
	
	const hashedPassword = bcrypt.hashSync(password);
	const client = await pool.connect();
	var sql = 'SELECT id, username, password FROM app_user WHERE username=$1::text';
	var values = [username];
	client.query(sql, values, function (err, data) {
		if (err) {
			console.error(err);
			res.send("Error " + err);
			//SHOULD RETURN AN ERROR TO THE USER TO SEE
		} else {
			client.release();
			console.log(data);
			
			if(hashedPassword == data['password']) {
				var param = data['id']; 
			   	res.render('pages/walkyTalky');
			} else {
				res.send("Error: The passwords do not match." + data + " " + hashedPassword + " " + data['password']);
			}
		}
	});
	
	
});


app.listen(PORT, () => console.log(`Listening on ${ PORT }`));

