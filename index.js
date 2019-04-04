//include libraries and setup express and port
const express = require('express');
const app = express();
const server = require('http').createServer();
const io = require('socket.io')(server);
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
const contactManagementModel = require("./scripts/contactManagementModel.js");
const chatManagementModel = require("./scripts/chatManagementModel.js");

//establish file directories, parsers and view engines
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

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
	console.log("username: " + req.session.username);
	console.log("userid: " + req.session.userid);
	console.log("contactusername: " + req.session.contactusername);
	console.log("contactid: " + req.session.contactid);
	if(req.session.username != null && req.session.userid != null) {
		return next();
	} else {
		res.redirect('/');
	}
}

//setup routing for each of the functions and page redirects
app.get('/', (req, res) => res.render('pages/index'));
app.get('/instructions', (req, res) => res.render('pages/instructions'));
app.get('/references', (req, res) => res.render('pages/references'));
app.post('/createAccount', urlencodedParser, loginModel.createAccount);
app.post('/login', urlencodedParser, loginModel.login);
app.post('/addContact', isAuthenticated, urlencodedParser, contactManagementModel.addContact);
app.post('/deleteContactList', isAuthenticated, urlencodedParser, contactManagementModel.getContactList);
app.post('/deleteContact', isAuthenticated, urlencodedParser, contactManagementModel.removeContact);
app.post('/selectContactList', isAuthenticated, urlencodedParser, chatManagementModel.getContactList);
app.post('/selectConversation', isAuthenticated, urlencodedParser, chatManagementModel.selectChat);
app.post('/sendMessage', isAuthenticated, urlencodedParser, chatManagementModel.insertMessage);
app.post('/editMessage', isAuthenticated, urlencodedParser, chatManagementModel.updateMessage);
app.post('/deleteMessage', isAuthenticated, urlencodedParser, chatManagementModel.removeMessage);

app.get('/logout', loginModel.logout);


io.on('connection', function (client) {
  client.on('connect');
});

app.listen(PORT, () => console.log(`Listening on ${ PORT }`));

