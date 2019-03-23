//include libraries and setup express and port
const express = require('express');
const app = express(); 
const path = require('path');
const PORT = process.env.PORT || 5000;
var session = require('express-session');
var FileStore = require('session-file-store')(session); 

//establish different parsers to use with the data received from the client
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({extended:false});

//include all the different files with scripts to be included in the project
const loginModel = require("./scripts/loginModel.js");

//establish file directories, parsers and view engines
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

//start a session when someone is using the app
app.use(session({
	name: 'server-session-cookie-id', 
	secret: 'walkyTalkySecretKey', 
	saveUninitialized: true, 
	resave: true,
	store: new FileStore()
}));

//middleware to check to see if user is authenticated
function isAuthenticated(req, res, next) {
	if(req.session.username != null && req.session.id != null) {
		return next();
	} else {
		res.redirect('/');
	}
}

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//setup routing for each of the functions and page redirects
app.get('/', (req, res) => res.render('pages/index'));
app.get('/instructions', (req, res) => res.render('pages/instructions'));
app.get('/references', (req, res) => res.render('pages/references'));
app.post('/createAccount', urlencodedParser, loginModel.createAccount);
app.post('/login', isAuthenticated, urlencodedParser, loginModel.login);
app.get('/logout', loginModel.logout);

app.listen(PORT, () => console.log(`Listening on ${ PORT }`));

