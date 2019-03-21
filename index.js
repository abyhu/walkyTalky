const express = require('express');
const app = express(); 
const path = require('path');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 5000;
const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({extended:false});



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
		//-------------------------SESSON END? SOMETHING NEEDS TO HAPPEN HERE TO LOGOUT THE USER
		res.render('pages/index'); 

	} catch (err) {
		console.error(err);
		res.send("Error " + err);
	}
});

app.post('/createAccount', urlencodedParser, signUpModel.createAccount);

app.post('/login', urlencodedParser, async (req, res) => {

	//----------------------------------------SHOULD VERIFY THERE IS NO SQL INJECTION
	const username = req.body.username;
	const password = req.body.password;

	const client = await pool.connect();
	var sql = 'SELECT id, username, password FROM app_user WHERE username=$1::text';
	var values = [username];
	client.query(sql, values, function (err, data) {
		if (err) {
			res.send("Error " + err);
			//-------------------------------SHOULD RETURN AN ERROR TO THE USER TO SEE
		} else {
			client.release();
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
});

app.listen(PORT, () => console.log(`Listening on ${ PORT }`));

