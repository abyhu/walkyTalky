const express = require('express');
const app = express(); 
const path = require('path');
const PORT = process.env.PORT || 5000;

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({extended:false});

const loginModel = require("./scripts/loginModel.js");

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => res.render('pages/index'));
app.get('/signup', (req, res) => res.render('pages/signup'));
app.get('/instructions', (req, res) => res.render('pages/instructions'));
app.get('/references', (req, res) => res.render('pages/references'));
app.post('/createAccount', urlencodedParser, loginModel.createAccount);
app.post('/login', urlencodedParser, loginModel.login);
app.get('/logout', loginModel.logout);

app.listen(PORT, () => console.log(`Listening on ${ PORT }`));

