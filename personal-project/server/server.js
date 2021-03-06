const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const axios = require('axios');
const massive = require('massive');
const controllers = require('./controllers');
const session = require('express-session');
const bcrypt = require('bcrypt-nodejs');



const app = express();

app.use( express.static( `${__dirname}/../build` ) );

let {
    SERVER_PORT,
    CONNECTION_STRING,
    SESSION_SECRET
} = process.env;

//Sets up database
massive(CONNECTION_STRING).then(db => {
    app.set('db', db);
})

//Sets up your session capability
app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}))

app.use(bodyParser.json());

//Uncomment this code when you're ready to merge your ports so that the server port also hosts the REact stuff
//You'll need to run in the terminal: npm run build
//Make sure the path from this file to the /build folder is accurate
//Then you should be able to start the server running and then manually go to localhost:4000 in your browser to see the React site
//app.use( express.static( `${__dirname}/../build` ) );

// app.get('/user_posts/:user_id', controllers.get_user_posts);

//Auth routes
app.post('/auth/new_user', controllers.create_user);

app.post('/auth/login', controllers.login);

app.get('/auth/logout', controllers.logout);

app.get('/api/current_user', controllers.current_user);

app.get('/api/all_usernames', controllers.all_usernames);

//Unicorn CRUD
//New Unicorn
app.post('/api/new_unicorn', controllers.create_unicorn)
//Get user's unicorn list
app.get('/api/user_unicorns', controllers.get_user_unicorns);
//Get individual unicorn
app.get('/api/select_unicorn/:id' , controllers.get_unicorn)
//Edit unicorn
app.put('/api/edit_unicorn', controllers.edit_unicorn);
//Delete unicorn
app.delete('/api/delete_unicorn/:id', controllers.delete_unicorn);

//Update current game info
app.put('/api/edit_user_current_unicorn/:id', controllers.edit_user_current_unicorn);






app.listen(SERVER_PORT, () => {
    console.log(`Server listening on port ${SERVER_PORT}`)
});