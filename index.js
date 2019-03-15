const express = require('express');
const app = express(); 
const path = require('path');
const PORT = process.env.PORT || 5000;

const { Pool } = require('pg');
const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
	ssl: true
});

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

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

app.post('/createAccount', async (req, res) => {
	
		//SHOULD VERIFY THE TWO PASSWORDS ARE THE SAME
		//SHOULD VERIFY THERE IS A USERNAME AND PASSWORD 
		//SHOULD VERIFY THERE IS NO SQL INJECTION
		const username = req.body.username;
		const password = req.body.password;

		const client = await pool.connect();
		var sql = 'INSERT INTO app_user (username, password) VALUES (?, ?)';
		client.query(sql, [username, password], function (err, data) {
			if (err) {
				console.error(err);
				res.send("Error " + err);
			} else {
				res.render('pages/index');
			}
		});
		client.release();
});

app.listen(PORT, () => console.log(`Listening on ${ PORT }`));

