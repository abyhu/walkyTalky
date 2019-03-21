//include libraries and setup express and port
const express = require('express');
const app = express(); 
const path = require('path');
const PORT = process.env.PORT || 5000;

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
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//setup routing for each of the functions and page redirects
app.get('/', (req, res) => res.render('pages/index'));
app.get('/signup', (req, res) => res.render('pages/signup'));
app.get('/instructions', (req, res) => res.render('pages/instructions'));
app.get('/references', (req, res) => res.render('pages/references'));
app.post('/createAccount', urlencodedParser, loginModel.createAccount);
app.post('/login', urlencodedParser, loginModel.login);
app.get('/logout', loginModel.logout);

app.listen(PORT, () => console.log(`Listening on ${ PORT }`));

