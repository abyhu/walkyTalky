const express = require('express');
const app = express(); 
const path = require('path');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 5000;

const { Pool } = require('pg');
const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
	ssl: true
});

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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

app.get('/createAccount', async (req, res) => {
	try {
		
		const username = req.body.username;
		const password = req.body.password;

		const client = await pool.connect();
		const result = await client.query('INSERT INTO app_user (username, password) VALUES (' + username + ')');
		res.render('pages/index');
		client.release();
	} catch (err) {
		console.error(err);
		res.send("Error " + err);
	}
});

app.listen(PORT, () => console.log(`Listening on ${ PORT }`));

